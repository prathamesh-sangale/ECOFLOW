import { Router } from 'express';
import { RolesController } from './roles.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';

const router = Router();

// Only Admins can manage roles
router.use(authenticate);
router.use(requireRole(['Admin']));

router.get('/', RolesController.getAllRoles);
router.get('/:id', RolesController.getRoleById);
router.post('/', RolesController.createRole);
router.put('/:id', RolesController.updateRole);
router.delete('/:id', RolesController.deleteRole);

export { router as rolesRoutes };
