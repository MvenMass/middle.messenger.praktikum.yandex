import { Router } from './core/router';

export const Routes = {
  Login: '/',
  SignUp: '/sign-up',
  Messenger: '/messenger',
  Settings: '/settings',
  NotFound: '/404',
  ServerError: '/500',
} as const;

export const router = new Router('#app', Routes.NotFound);
