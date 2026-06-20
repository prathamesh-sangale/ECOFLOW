import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const AccessRequestSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  requested_role: z.string().min(1, 'Requested role is required'),
  department: z.string().optional(),
  reason: z.string().optional(),
});

export type AccessRequestInput = z.infer<typeof AccessRequestSchema>;

export const ChangePasswordSchema = z.object({
  old_password: z.string().min(6, 'Current password is required'),
  new_password: z.string().min(8, 'New password must be at least 8 characters'),
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
