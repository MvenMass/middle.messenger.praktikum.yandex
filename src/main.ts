import './styles/main.scss';
import { registerAvatar, registerIcons } from './components';
import { authController } from './controllers/auth-controller';
import {
  LoginPage,
  MessengerPage,
  NotFoundPage,
  ServerErrorPage,
  SettingsPage,
  SignUpPage,
} from './pages';
import { router, Routes } from './routes';
import { store } from './store/store';

const guestPaths: string[] = [Routes.Login, Routes.SignUp];
const publicPaths: string[] = [Routes.NotFound, Routes.ServerError];

function checkAccess(pathname: string): string | null {
  const isAuthorized = store.getState().user !== null;
  const isGuestPath = guestPaths.includes(pathname);

  if (publicPaths.includes(pathname)) {
    return null;
  }

  if (!isAuthorized && !isGuestPath) {
    return Routes.Login;
  }

  if (isAuthorized && isGuestPath) {
    return Routes.Messenger;
  }

  return null;
}

registerIcons();
registerAvatar();

router
  .use(Routes.Login, LoginPage)
  .use(Routes.SignUp, SignUpPage)
  .use(Routes.Messenger, MessengerPage)
  .use(Routes.Settings, SettingsPage)
  .use(Routes.NotFound, NotFoundPage)
  .use(Routes.ServerError, ServerErrorPage)
  .useMiddleware(checkAccess);

authController
  .fetchUser()
  .catch(() => window.history.replaceState({}, '', Routes.ServerError))
  .finally(() => router.start());
