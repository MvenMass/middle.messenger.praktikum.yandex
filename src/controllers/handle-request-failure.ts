import { UnauthorizedError } from '../core/http-errors';
import { router, Routes } from '../routes';
import { store } from '../store/store';

export function handleRequestFailure(error: unknown): void {
  if (error instanceof UnauthorizedError) {
    store.reset();
    router.go(Routes.Login);
    return;
  }

  router.go(Routes.ServerError);
}
