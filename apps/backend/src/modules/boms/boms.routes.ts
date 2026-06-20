import { Router } from 'express';
import { bomsController } from './boms.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';

const router = Router();

router.use(authenticate);

// BOM endpoints
router.get('/', bomsController.getAll);
router.get('/:id', bomsController.getById);

// Only Admin and Engineer can modify BOMs
router.post('/', requireRole(['Admin', 'Engineer']), bomsController.create);
router.put('/:id', requireRole(['Admin', 'Engineer']), bomsController.update);
router.patch('/:id/status', requireRole(['Admin', 'Engineer']), bomsController.updateStatus);
router.delete('/:id', requireRole(['Admin', 'Engineer']), bomsController.delete);

// Component endpoints
router.post('/:id/components', requireRole(['Admin', 'Engineer']), bomsController.addComponent);
// Note: PUT and DELETE for components accept the component ID, not the BOM ID.
router.put('/components/:id', requireRole(['Admin', 'Engineer']), bomsController.updateComponent);
router.delete('/components/:id', requireRole(['Admin', 'Engineer']), bomsController.removeComponent);

export { router as bomsRouter };
