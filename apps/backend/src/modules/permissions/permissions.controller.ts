import { Request, Response } from 'express';
import { PermissionsService } from './permissions.service';
import { AssignPermissionSchema } from '@ecoflow/shared-validations';
import { z } from 'zod';

export class PermissionsController {
  static async getAllPermissions(req: Request, res: Response) {
    try {
      const permissions = await PermissionsService.getAllPermissions();
      res.json(permissions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch permissions' });
    }
  }

  static async assignPermission(req: Request, res: Response) {
    try {
      const parsedData = AssignPermissionSchema.parse(req.body);
      const performedBy = (req as any).user.id;
      const rolePermission = await PermissionsService.assignPermissionToRole(req.params.roleId, parsedData, performedBy);
      res.status(201).json(rolePermission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to assign permission' });
    }
  }

  static async revokePermission(req: Request, res: Response) {
    try {
      const performedBy = (req as any).user.id;
      await PermissionsService.revokePermissionFromRole(req.params.roleId, req.params.permissionId, performedBy);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to revoke permission' });
    }
  }
}
