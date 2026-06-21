import prisma from '../../utils/prisma';
import { PrismaClient } from '@prisma/client';
import { CreateRoleInput, UpdateRoleInput } from '@ecoflow/shared-validations';
import { auditService } from '../audit/audit.service';



export class RolesService {
  static async getAllRoles() {
    return prisma.role.findMany({
      include: {
        role_permissions: {
          include: { permission: true }
        },
        _count: { select: { users: true } }
      }
    });
  }

  static async getRoleById(id: string) {
    return prisma.role.findUnique({
      where: { id },
      include: {
        role_permissions: {
          include: { permission: true }
        }
      }
    });
  }

  static async createRole(data: CreateRoleInput, performedBy: string) {
    const role = await prisma.role.create({
      data: {
        role_name: data.role_name,
        description: data.description,
      }
    });

    await auditService.log({
      entity_type: 'Role',
      entity_id: role.id,
      action: 'CREATED',
      new_value: role,
      performed_by: performedBy
    });

    return role;
  }

  static async updateRole(id: string, data: UpdateRoleInput, performedBy: string) {
    const oldRole = await prisma.role.findUnique({ where: { id } });
    if (!oldRole) throw new Error('Role not found');

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        role_name: data.role_name,
        description: data.description,
      }
    });

    await auditService.log({
      entity_type: 'Role',
      entity_id: id,
      action: 'UPDATED',
      old_value: oldRole,
      new_value: updatedRole,
      performed_by: performedBy
    });

    return updatedRole;
  }

  static async deleteRole(id: string, performedBy: string) {
    const oldRole = await prisma.role.findUnique({ where: { id } });
    if (!oldRole) throw new Error('Role not found');

    await prisma.role.delete({
      where: { id }
    });

    await auditService.log({
      entity_type: 'Role',
      entity_id: id,
      action: 'DELETED',
      old_value: oldRole,
      performed_by: performedBy
    });

    return true;
  }
}
