import { Router } from 'express';
import { ecosController } from './ecos.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';

const router = Router();

router.use(authenticate);

// ECO endpoints
router.get('/', ecosController.getAll);
router.get('/:id', ecosController.getById);

// Only Admin and Engineer can modify ECOs
router.post('/', requireRole(['Admin', 'Engineer']), ecosController.create);
router.put('/:id', requireRole(['Admin', 'Engineer']), ecosController.update);
router.patch('/:id/status', requireRole(['Admin', 'Engineer']), ecosController.updateStatus);
router.delete('/:id', requireRole(['Admin', 'Engineer']), ecosController.delete);

// Change endpoints
router.post('/:id/changes', requireRole(['Admin', 'Engineer']), ecosController.addChange);
router.delete('/changes/:id', requireRole(['Admin', 'Engineer']), ecosController.removeChange);

// Comment endpoints (anyone authenticated can comment)
router.post('/:id/comments', ecosController.addComment);
router.delete('/comments/:id', ecosController.removeComment);

export { router as ecosRouter };
