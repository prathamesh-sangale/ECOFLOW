import { Request, Response } from 'express';
import { RolesService } from './roles.service';
import { CreateRoleSchema, UpdateRoleSchema } from '@ecoflow/shared-validations';
import { z } from 'zod';

export class RolesController {
  static async getAllRoles(req: Request, res: Response) {
    try {
      const roles = await RolesService.getAllRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch roles' });
    }
  }

  static async getRoleById(req: Request, res: Response) {
    try {
      const role = await RolesService.getRoleById(req.params.id);
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }
      res.json(role);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch role' });
    }
  }

  static async createRole(req: Request, res: Response) {
    try {
      const parsedData = CreateRoleSchema.parse(req.body);
      const performedBy = (req as any).user.id;
      const role = await RolesService.createRole(parsedData, performedBy);
      res.status(201).json(role);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create role' });
    }
  }

  static async updateRole(req: Request, res: Response) {
    try {
      const parsedData = UpdateRoleSchema.parse(req.body);
      const performedBy = (req as any).user.id;
      const role = await RolesService.updateRole(req.params.id, parsedData, performedBy);
      res.json(role);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to update role' });
    }
  }

  static async deleteRole(req: Request, res: Response) {
    try {
      const performedBy = (req as any).user.id;
      await RolesService.deleteRole(req.params.id, performedBy);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete role' });
    }
  }
}
