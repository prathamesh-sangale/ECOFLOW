import { Router } from 'express';
import { categoriesController } from './categories.controller';
import { authenticate, requireRole } from '../auth/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', categoriesController.getAll);
router.get('/:id', categoriesController.getById);

// Only Admin and Engineer can modify categories
router.post('/', requireRole(['Admin', 'Engineer']), categoriesController.create);
router.put('/:id', requireRole(['Admin', 'Engineer']), categoriesController.update);
router.delete('/:id', requireRole(['Admin', 'Engineer']), categoriesController.delete);

export { router as categoriesRouter };
