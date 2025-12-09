import express from 'express';
import helmet from 'helmet';

import postsRoutes from './routes/posts';
import userRoutes from './routes/users';
import categoriesRoutes from './routes/categories';
import tokenRoutes from './routes/token';
import pagesRoutes from './routes/pages';
import emailsRoutes from './routes/emails';
import paymentsRoutes from './routes/payments';
import webhookRoutes from './routes/webhook';
import leaderboardRoutes from './routes/leaderboard';
import gameSessionsRoutes from './routes/game-sessions';
import messagesRoutes from './routes/messages';
import chatRoomsRoutes from './routes/chat-rooms';
import notificationsRoutes from './routes/notifications';

import errorHandler from './middlewares/error-handler';
import unHandledRoutes from './middlewares/un-handled-routes';
import corsHeaders from './middlewares/cors';
import appStartUp from './startup/app';
import envsCheck from './startup/envs';

envsCheck();
const app = express();

app.use('/api/webhook', webhookRoutes);
app.use(express.json({ limit: '5mb' }));
app.use(corsHeaders);
app.use(helmet());
app.use('/api/posts', postsRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/token', tokenRoutes);
app.use('/api/emails', emailsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/game-sessions', gameSessionsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/chat-rooms', chatRoomsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use(unHandledRoutes);
app.use(errorHandler);

export default appStartUp(app);
