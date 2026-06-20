import { PrismaClient } from '@prisma/client';
import { CreateUserInput, UpdateUserInput } from '@ecoflow/shared-validations';
import bcrypt from 'bcryptjs';
import { auditService } from '../audit/audit.service';

const prisma = new PrismaClient();

export class UsersService {
  static async getAllUsers() {
    return prisma.user.findMany({
      include: {
        role: true
      }
    });
  }

  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        role: true
      }
    });
  }

  static async createUser(data: CreateUserInput, performedBy: string) {
    const password_hash = await bcrypt.hash(data.password, 10);
    const newUser = await prisma.user.create({
      data: {
        full_name: data.full_name,
        email: data.email,
        password_hash,
        phone: data.phone,
        role_id: data.role_id,
        status: 'ACTIVE'
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        status: true,
        created_at: true
      }
    });

    await auditService.log({
      entity_type: 'User',
      entity_id: newUser.id,
      action: 'CREATED',
      new_value: newUser,
      performed_by: performedBy
    });

    return newUser;
  }

  static async updateUser(id: string, data: UpdateUserInput, performedBy: string) {
    const oldUser = await prisma.user.findUnique({ where: { id } });
    if (!oldUser) throw new Error('User not found');

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        role_id: data.role_id,
        status: data.status,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        status: true,
        role_id: true,
        updated_at: true
      }
    });

    await auditService.log({
      entity_type: 'User',
      entity_id: id,
      action: 'UPDATED',
      old_value: oldUser,
      new_value: updatedUser,
      performed_by: performedBy
    });

    return updatedUser;
  }

  static async updateUserStatus(id: string, status: string, performedBy: string) {
    const oldUser = await prisma.user.findUnique({ where: { id } });
    if (!oldUser) throw new Error('User not found');

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, status: true, updated_at: true }
    });

    await auditService.log({
      entity_type: 'User',
      entity_id: id,
      action: 'STATUS_CHANGED',
      old_value: { status: oldUser.status },
      new_value: { status },
      performed_by: performedBy
    });

    return updatedUser;
  }

  static async deleteUser(id: string, performedBy: string) {
    const oldUser = await prisma.user.findUnique({ where: { id } });
    if (!oldUser) throw new Error('User not found');

    await prisma.user.delete({
      where: { id }
    });

    await auditService.log({
      entity_type: 'User',
      entity_id: id,
      action: 'DELETED',
      old_value: oldUser,
      performed_by: performedBy
    });

    return true;
  }
}
