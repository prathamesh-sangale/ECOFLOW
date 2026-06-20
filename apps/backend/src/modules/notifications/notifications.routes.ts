import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware';
import * as notificationsController from './notifications.controller';

const router = Router();

router.use(authenticate);

router.get('/', notificationsController.getNotifications);
router.put('/read-all', notificationsController.markAllAsRead);
router.put('/:id/read', notificationsController.markAsRead);
router.delete('/:id', notificationsController.deleteNotification);

export { router as notificationsRouter };
