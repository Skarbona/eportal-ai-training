import React, { FC, memo } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Game from './Game/Game';
import AuthPage from './AuthPage/AuthPage';
import Page from './Page/Page';
import Main from './Main/Main';
import Profile from './Profile/Profile';
import NotFound from './404/404';
import InitResetPassword from './ResetPassword/Init';
import SetNewPassword from './ResetPassword/SetNewPassword';
import WaitingRoom from './WaitingRoom/WaitingRoom';
import Leaderboard from './Leaderboard/Leaderboard';
import Chat from './Chat/Chat';
import { PageNames } from '../../store/pages/initialState.interface';
import { PageParams } from '../../models/page-types';
import { Payment } from './Premium/Premium';
import { Success } from './Premium/Success';
import { Failed } from './Premium/Failed';

interface Props {
  accessToken: string;
}
// TODO: Add lazy loading for pages
export const PagesComponent: FC<Props> = ({ accessToken }) => {
  return (
    <Switch>
      <Route path={PageParams.Home} exact>
        <Main isLoggedIn={!!accessToken?.length} />
      </Route>
      {accessToken && (
        <Route key="waiting-room" path={`${PageParams.WaitingRoom}/:page`} exact>
          <WaitingRoom />
        </Route>
      )}
      {accessToken && (
        <Route key="posts" path={`${PageParams.Posts}/:page`} exact>
          <WaitingRoom />
        </Route>
      )}
      {accessToken && (
        <Route path={PageParams.Profile} exact>
          <Profile />
        </Route>
      )}
      {accessToken && (
        <Route path={PageParams.Game} exact>
          <Game />
        </Route>
      )}
      {accessToken && (
        <Route path={PageParams.Leaderboard} exact>
          <Leaderboard />
        </Route>
      )}
      {accessToken && (
        <Route path={PageParams.Chat} exact>
          <Chat />
        </Route>
      )}
      {accessToken && (
        <Route path={PageParams.PremiumPayment} exact>
          <Payment />
        </Route>
      )}
      {!accessToken && (
        <Route path={`/${PageParams.Auth}/:mode`} exact>
          <AuthPage />
        </Route>
      )}
      {!accessToken && (
        <Route path={PageParams.ResetPassword} exact>
          <InitResetPassword />
        </Route>
      )}
      {!accessToken && (
        <Route path={`${PageParams.ResetPassword}/:token`} exact>
          <SetNewPassword />
        </Route>
      )}
      <Route path={PageParams.PaymentSuccess} exact>
        <Success />
      </Route>
      <Route path={PageParams.PaymentFailed} exact>
        <Failed />
      </Route>
      <Route key="privacy-policy" path={PageParams.PrivacyPolice} exact>
        <Page slug={PageNames.PrivacyPolicy} />
      </Route>
      <Route key="rules" path={PageParams.Rules} exact>
        <Page slug={PageNames.Rules} />
      </Route>
      <Route path={PageParams.Page404} exact>
        <NotFound />
      </Route>
      {!accessToken ? <Redirect to={PageParams.Login} /> : <Redirect to={PageParams.Page404} />}
    </Switch>
  );
};

export const arePropsEqual = (prevProps: Props, nextProps: Props): boolean =>
  prevProps?.accessToken?.length > 0 && nextProps?.accessToken?.length > 0;

export default memo(PagesComponent, arePropsEqual);
