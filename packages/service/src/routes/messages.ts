import { Router } from 'express';

import * as controllers from '../controllers/messages';
import { authMiddleware } from '../middlewares/auth';
import * as validate from '../validation/messages';
import checkValidation from '../middlewares/check-validation';

const router = Router();

router.use(authMiddleware);

router.get('/:roomId', validate.getMessages, checkValidation, controllers.getMessages);
router.post('/', validate.sendMessage, checkValidation, controllers.sendMessage);
router.patch('/:messageId', validate.editMessage, checkValidation, controllers.editMessage);
router.delete('/:messageId', validate.deleteMessage, checkValidation, controllers.deleteMessage);
router.post('/:roomId/read', validate.markAsRead, checkValidation, controllers.markAsRead);

export default router;

