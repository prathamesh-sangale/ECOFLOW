import { Router } from 'express';
import multer from 'multer';
import { attachmentsController } from './attachments.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';

const router = Router({ mergeParams: true });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

router.use(authenticate);

router.post('/', requireRole(['Admin', 'Engineer']), upload.single('file'), attachmentsController.upload);
router.delete('/:attachmentId', requireRole(['Admin', 'Engineer']), attachmentsController.delete);

export { router as attachmentsRouter };
