import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/prisma';
import { PrismaClient } from '@prisma/client';



export interface AuthRequest extends Request {
  user?: {
    id: string;
    role_id: string | null;
    status: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secret) as any;
    
    // Verify user still exists and is active
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    
    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({ error: 'Unauthorized: Invalid or inactive user' });
    }

    req.user = {
      id: user.id,
      role_id: user.role_id,
      status: user.status
    };
    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token', details: error.message });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.user.role_id) {
      return res.status(403).json({ error: 'Forbidden: No role assigned' });
    }

    const role = await prisma.role.findUnique({ where: { id: req.user.role_id } });

    if (!role || !allowedRoles.includes(role.role_name)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient role permissions' });
    }

    next();
  };
};
