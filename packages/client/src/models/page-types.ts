import { LANGUAGE } from '../constants/envs';

const PageParamsPL = {
  Auth: 'autentykacja',
  Register: '/autentykacja/rejestracja',
  Login: '/autentykacja/logowanie',
  Game: '/gra',
  Profile: '/profil',
  Posts: '/zadania',
  Rules: '/zasady',
  PrivacyPolice: '/polityka-prywatnosci',
  WaitingRoom: '/poczekalnia',
  ResetPassword: '/reset',
  PremiumPayment: '/premium',
  PaymentSuccess: '/sukces-platnosci',
  PaymentFailed: '/brak-platnosci',
  Page404: '/404',
  Home: '/',
  Leaderboard: '/ranking',
  Chat: '/czat',
};

const PageParamsEN = {
  Auth: 'auth',
  Register: '/auth/register',
  Login: '/auth/login',
  Game: '/game',
  Profile: '/profile',
  Posts: '/tasks',
  Rules: '/rules',
  PrivacyPolice: '/policy',
  WaitingRoom: '/waiting-room',
  ResetPassword: '/reset',
  PremiumPayment: '/premium',
  PaymentSuccess: '/payment-success',
  PaymentFailed: '/no-payment',
  Page404: '/404',
  Home: '/',
  Leaderboard: '/leaderboard',
  Chat: '/chat',
};

export const PageParams = LANGUAGE === 'en' ? PageParamsEN : PageParamsPL;
