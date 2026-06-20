import { Router } from 'express';
import { auditController } from './audit.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';

const router = Router();

router.use(authenticate);

// Everyone authenticated can export (or you could limit to Admin/Approver)
router.get('/export', requireRole(['Admin', 'Approver', 'Production Manager', 'Engineer']), auditController.exportLogsCSV);

// Viewing logs requires permissions
router.get('/', requireRole(['Admin', 'Approver', 'Production Manager', 'Engineer']), auditController.getLogs);

export { router as auditRouter };
