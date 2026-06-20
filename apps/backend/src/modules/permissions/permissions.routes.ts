import { Router } from 'express';
import { PermissionsController } from './permissions.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(requireRole(['Admin']));

router.get('/', PermissionsController.getAllPermissions);
router.post('/roles/:roleId/permissions', PermissionsController.assignPermission);
router.delete('/roles/:roleId/permissions/:permissionId', PermissionsController.revokePermission);

export { router as permissionsRoutes };
