import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginSchema, AccessRequestSchema } from '@ecoflow/shared-validations';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from './auth.middleware';

const prisma = new PrismaClient();

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const data = LoginSchema.parse(req.body);
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      const deviceName = req.headers['user-agent'] || 'unknown';

      const result = await AuthService.login(data, ipAddress, deviceName);
      
      // Set HTTP-only cookie for refresh token on web
      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({ accessToken: result.accessToken, user: result.user, refreshToken: result.refreshToken });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const token = req.cookies?.refresh_token || req.body.refreshToken;
      if (!token) return res.status(401).json({ error: 'No refresh token' });

      const result = await AuthService.refresh(token);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const token = req.cookies?.refresh_token || req.body.refreshToken;
      if (token) {
        await AuthService.logout(token);
      }
      res.clearCookie('refresh_token');
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Logout failed' });
    }
  }

  static async me(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { role: true }
    });
    res.json({ user });
  }

  static async requestAccess(req: Request, res: Response) {
    try {
      const data = AccessRequestSchema.parse(req.body);
      const request = await prisma.accessRequest.create({
        data: {
          full_name: data.full_name,
          email: data.email,
          requested_role: data.requested_role,
          department: data.department,
          reason: data.reason
        }
      });
      res.status(201).json({ success: true, request });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getSessions(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const sessions = await prisma.session.findMany({
      where: { user_id: req.user.id },
      orderBy: { created_at: 'desc' }
    });
    res.json({ sessions });
  }

  static async logoutAll(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    await AuthService.logoutAll(req.user.id);
    res.clearCookie('refresh_token');
    res.json({ success: true });
  }
}
