import { Router } from 'express';

import * as controllers from '../controllers/leaderboard';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.get('/global', controllers.getGlobalLeaderboard);
router.get('/category/:categoryId', controllers.getCategoryLeaderboard);
router.get('/user/:userId/rank', authMiddleware, controllers.getUserRank);

// TODO: Should this be admin only?
router.delete('/reset', authMiddleware, controllers.resetLeaderboard);

export default router;

