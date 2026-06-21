import { Router } from 'express';
import { auditController } from './audit.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';

const router = Router();

router.use(authenticate);

// Everyone authenticated can export (or you could limit to Admin/Approver)
router.get('/export', requireRole(['Admin', 'Approver', 'Production Manager', 'Production']), auditController.exportLogsCSV);

// Viewing logs requires permissions
router.get('/', requireRole(['Admin', 'Approver', 'Production Manager', 'Production']), auditController.getLogs);

export { router as auditRouter };
