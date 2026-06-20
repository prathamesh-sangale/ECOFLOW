import { Router } from 'express';
import { productsController } from './products.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', productsController.getAll);
router.get('/:id', productsController.getById);

// Only Admin and Engineer can modify products
router.post('/', requireRole(['Admin', 'Engineer']), productsController.create);
router.put('/:id', requireRole(['Admin', 'Engineer']), productsController.update);
router.patch('/:id/status', requireRole(['Admin', 'Engineer']), productsController.updateStatus);
router.delete('/:id', requireRole(['Admin', 'Engineer']), productsController.delete);

export { router as productsRouter };
