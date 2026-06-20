import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(requireRole(['Admin']));

router.get('/', UsersController.getAllUsers);
router.get('/:id', UsersController.getUserById);
router.post('/', UsersController.createUser);
router.put('/:id', UsersController.updateUser);
router.patch('/:id/status', UsersController.updateStatus);
router.delete('/:id', UsersController.deleteUser);

export { router as usersRoutes };
