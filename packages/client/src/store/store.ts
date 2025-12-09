import { AnyAction, applyMiddleware, compose, createStore } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';

import { categoriesInitialState } from './categories/initialState';
import { gameInitialState } from './game/initialState';
import { userInitialState } from './user/initialState';
import { appInitialState } from './app/initialState';
import { pagesInitialState } from './pages/initialState';
import { paymentsInitialState } from './payments/initialState';
import { waitingRoomInitialState } from './waitingRoom/initialState';
import { leaderboardInitialState } from './leaderboard/initialState';
import { chatInitialState } from './chat/initialState';
import { notificationsInitialState } from './notifications/initialState';
import reducers from './reducers';
import { Actions, RootState } from './store.interface';

export const initialRootState: RootState = {
  categories: categoriesInitialState,
  game: gameInitialState,
  user: userInitialState,
  app: appInitialState,
  pages: pagesInitialState,
  waitingRoom: waitingRoomInitialState,
  payments: paymentsInitialState,
  leaderboard: leaderboardInitialState,
  chat: chatInitialState,
  notifications: notificationsInitialState,
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore<RootState, Actions, null, AnyAction>(
  reducers,
  initialRootState,
  composeEnhancers(applyMiddleware(thunk as ThunkMiddleware<RootState, Actions>)),
);
