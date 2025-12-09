import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { CategoriesActions } from './categories/action.interface';
import { GameActions } from './game/action.interface';
import { UserActions } from './user/action.interface';
import { AppActions } from './app/action.interface';
import { PagesActions } from './pages/action.interface';
import { CategoriesStateInterface } from './categories/initialState.interface';
import { GameStateInterface } from './game/initialState.interface';
import { UserStateInterface } from './user/initialState.interface';
import { AppStateInterface } from './app/initialState.interface';
import { PagesStateInterface } from './pages/initialState.interface';
import { WaitingRoomInterface } from './waitingRoom/initialState.interface';
import { WaitingRoomActions } from './waitingRoom/action.interface';
import { PaymentsStateInterface } from './payments/initialState.interface';
import { PaymentsActions } from './payments/action.interface';
import { LeaderboardStateInterface } from './leaderboard/initialState.interface';
import { LeaderboardActions } from './leaderboard/action.interface';
import { ChatStateInterface } from './chat/initialState.interface';
import { ChatActions } from './chat/action.interface';
import { NotificationsStateInterface } from './notifications/initialState.interface';
import { NotificationsActions } from './notifications/action.interface';

export interface RootState {
  categories: CategoriesStateInterface;
  game: GameStateInterface;
  user: UserStateInterface;
  app: AppStateInterface;
  pages: PagesStateInterface;
  waitingRoom: WaitingRoomInterface;
  payments: PaymentsStateInterface;
  leaderboard: LeaderboardStateInterface;
  chat: ChatStateInterface;
  notifications: NotificationsStateInterface;
}

export type Actions =
  | CategoriesActions
  | GameActions
  | UserActions
  | AppActions
  | PagesActions
  | WaitingRoomActions
  | PaymentsActions
  | LeaderboardActions
  | ChatActions
  | NotificationsActions;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, null, Action<string>>;

export type ReturnAppThunk<ReturnType> = ThunkAction<
  Promise<ReturnType>,
  RootState,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  Action<string>
>;
