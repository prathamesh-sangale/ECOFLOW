import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserSchema, UpdateUserSchema } from '@ecoflow/shared-validations';
import { z } from 'zod';

export class UsersController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UsersService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const user = await UsersService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const parsedData = CreateUserSchema.parse(req.body);
      const performedBy = (req as any).user.id;
      const user = await UsersService.createUser(parsedData, performedBy);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create user' });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const parsedData = UpdateUserSchema.parse(req.body);
      const performedBy = (req as any).user.id;
      const user = await UsersService.updateUser(req.params.id, parsedData, performedBy);
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to update user' });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      if (!['PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      const performedBy = (req as any).user.id;
      const user = await UsersService.updateUserStatus(req.params.id, status, performedBy);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user status' });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const performedBy = (req as any).user.id;
      await UsersService.deleteUser(req.params.id, performedBy);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
}
