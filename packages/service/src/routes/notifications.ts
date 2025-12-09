import { Router } from 'express';

import * as controllers from '../controllers/notifications';
import { authMiddleware } from '../middlewares/auth';
import * as validate from '../validation/notifications';
import checkValidation from '../middlewares/check-validation';

const router = Router();

router.use(authMiddleware);

router.get('/', validate.getNotifications, checkValidation, controllers.getNotifications);
router.patch('/:notificationId/read', validate.markAsRead, checkValidation, controllers.markAsRead);
router.post('/mark-all-read', controllers.markAllAsRead);
router.delete('/:notificationId', validate.deleteNotification, checkValidation, controllers.deleteNotification);

// TODO: Add batch operations route
// router.post('/batch-delete', validate.batchDelete, checkValidation, controllers.deleteMultiple);

export default router;

