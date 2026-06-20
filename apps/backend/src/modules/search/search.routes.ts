import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware';
import * as searchController from './search.controller';

const router = Router();

router.use(authenticate);
router.get('/', searchController.globalSearch);

export { router as searchRouter };
