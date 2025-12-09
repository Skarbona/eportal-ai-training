import { Router } from 'express';

import * as controllers from '../controllers/chat-rooms';
import { authMiddleware } from '../middlewares/auth';
import * as validate from '../validation/chat-rooms';
import checkValidation from '../middlewares/check-validation';

const router = Router();

router.use(authMiddleware);

router.post('/', validate.createRoom, checkValidation, controllers.createRoom);
router.get('/', controllers.getRooms);
router.get('/search-users', controllers.searchUsers);
router.get('/:roomId', validate.getRoom, checkValidation, controllers.getRoom);
router.post('/:roomId/participants', validate.addParticipant, checkValidation, controllers.addParticipant);
router.delete('/:roomId/leave', validate.leaveRoom, checkValidation, controllers.leaveRoom);

export default router;

