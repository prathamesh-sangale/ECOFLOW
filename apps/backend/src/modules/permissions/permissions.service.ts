import prisma from '../../utils/prisma';
import { PrismaClient } from '@prisma/client';
import { AssignPermissionInput } from '@ecoflow/shared-validations';
import { auditService } from '../audit/audit.service';



export class PermissionsService {
  static async getAllPermissions() {
    return prisma.permission.findMany();
  }

  static async assignPermissionToRole(roleId: string, data: AssignPermissionInput, performedBy: string) {
    const rolePermission = await prisma.rolePermission.create({
      data: {
        role_id: roleId,
        permission_id: data.permission_id
      }
    });

    await auditService.log({
      entity_type: 'Permission',
      entity_id: `${roleId}_${data.permission_id}`,
      action: 'ASSIGNED',
      new_value: rolePermission,
      performed_by: performedBy
    });

    return rolePermission;
  }

  static async revokePermissionFromRole(roleId: string, permissionId: string, performedBy: string) {
    const deleted = await prisma.rolePermission.delete({
      where: {
        role_id_permission_id: {
          role_id: roleId,
          permission_id: permissionId
        }
      }
    });

    await auditService.log({
      entity_type: 'Permission',
      entity_id: `${roleId}_${permissionId}`,
      action: 'REVOKED',
      old_value: deleted,
      performed_by: performedBy
    });

    return deleted;
  }
}
