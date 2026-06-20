import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginInput } from '@ecoflow/shared-validations';

const prisma = new PrismaClient();

export class AuthService {
  static async login(data: LoginInput, ipAddress: string, deviceName: string) {
    const user = await prisma.user.findUnique({ where: { email: data.email }, include: { role: true } });
    
    if (!user || user.status !== 'ACTIVE') {
      throw new Error('Invalid credentials or inactive account');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const accessToken = jwt.sign(
      { id: user.id, role_id: user.role_id }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id }, 
      process.env.JWT_REFRESH_SECRET || 'refresh_secret', 
      { expiresIn: '7d' }
    );

    // Store session
    await prisma.session.create({
      data: {
        user_id: user.id,
        refresh_token: refreshToken,
        ip_address: ipAddress,
        device_name: deviceName,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    };
  }

  static async refresh(refreshToken: string) {
    const secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
    try {
      const decoded = jwt.verify(refreshToken, secret) as any;
      const session = await prisma.session.findUnique({ where: { refresh_token: refreshToken } });

      if (!session || session.expires_at < new Date()) {
        throw new Error('Invalid or expired refresh token');
      }

      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user || user.status !== 'ACTIVE') {
        throw new Error('User inactive or not found');
      }

      const newAccessToken = jwt.sign(
        { id: user.id, role_id: user.role_id }, 
        process.env.JWT_SECRET || 'secret', 
        { expiresIn: '15m' }
      );

      return { accessToken: newAccessToken };
    } catch (e) {
      throw new Error('Invalid refresh token');
    }
  }

  static async logout(refreshToken: string) {
    await prisma.session.deleteMany({
      where: { refresh_token: refreshToken }
    });
  }

  static async logoutAll(userId: string) {
    await prisma.session.deleteMany({
      where: { user_id: userId }
    });
  }
}
