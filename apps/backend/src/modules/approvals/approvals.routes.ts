import { Router } from 'express';
import { approvalsController } from './approvals.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';

const router = Router();

router.use(authenticate);

// Approver/Admin endpoints
router.get('/metrics', requireRole(['Approver', 'Admin', 'Production Manager']), approvalsController.getDashboardMetrics);
router.get('/', requireRole(['Approver', 'Admin', 'Production Manager', 'Engineer']), approvalsController.getQueue);

// Approval actions are strictly for Approvers and Admins
router.post('/:ecoId/approve', requireRole(['Approver', 'Admin']), approvalsController.approve);
router.post('/:ecoId/reject', requireRole(['Approver', 'Admin']), approvalsController.reject);
router.post('/:ecoId/request-changes', requireRole(['Approver', 'Admin']), approvalsController.requestChanges);

export { router as approvalsRouter };
