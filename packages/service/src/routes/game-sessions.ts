import { Router } from 'express';

import * as controllers from '../controllers/game-sessions';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', controllers.createGameSession);
router.patch('/:sessionId/complete', controllers.completeGameSession);
router.patch('/:sessionId', controllers.updateGameSession);
router.get('/user/:userId', controllers.getUserSessions);
router.get('/user/:userId/stats', controllers.getSessionStats);
router.delete('/:sessionId', controllers.deleteGameSession);

export default router;

