import { Router } from 'express';
import { versionsController } from './versions.controller';
import { authenticate } from '../auth/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/releases', versionsController.getReleases);
router.get('/product/:productId', versionsController.getVersionsByProduct);
router.get('/bom/:bomId', versionsController.getVersionsByBOM);

export { router as versionsRouter };
