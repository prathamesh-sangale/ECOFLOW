import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from './auth.middleware';

const router = Router();

router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);
router.post('/request-access', AuthController.requestAccess);

router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// Protected routes
router.use(authenticate);
router.get('/me', AuthController.me);
router.get('/sessions', AuthController.getSessions);
router.delete('/sessions', AuthController.logoutAll);
router.post('/change-password', AuthController.changePassword);

export { router as authRoutes };
