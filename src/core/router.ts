import { Route, type PageClass } from './route';

export type RouterMiddleware = (pathname: string) => string | null;

export class Router {
  private readonly routes: Route[] = [];

  private readonly rootQuery: string;

  private readonly notFoundPath: string;

  private currentRoute: Route | null = null;

  private middleware: RouterMiddleware | null = null;

  constructor(rootQuery: string, notFoundPath: string) {
    this.rootQuery = rootQuery;
    this.notFoundPath = notFoundPath;
  }

  use(pathname: string, pageClass: PageClass): this {
    this.routes.push(new Route(pathname, pageClass, this.rootQuery));

    return this;
  }

  useMiddleware(middleware: RouterMiddleware): this {
    this.middleware = middleware;

    return this;
  }

  start(): void {
    window.addEventListener('popstate', () => this.handleRoute(window.location.pathname));
    document.addEventListener('click', (event) => this.handleLinkClick(event));

    this.handleRoute(window.location.pathname);
  }

  go(pathname: string): void {
    window.history.pushState({}, '', pathname);
    this.handleRoute(pathname);
  }

  private handleRoute(pathname: string): void {
    const route = this.getRoute(pathname);
    const redirectPath = this.middleware?.(route.pathname) ?? null;

    if (redirectPath !== null) {
      window.history.replaceState({}, '', redirectPath);
      this.handleRoute(redirectPath);
      return;
    }

    this.currentRoute?.leave();
    this.currentRoute = route;
    route.render();
  }

  private getRoute(pathname: string): Route {
    const route = this.routes.find((item) => item.match(pathname))
      ?? this.routes.find((item) => item.match(this.notFoundPath));

    if (!route) {
      throw new Error(`Не зарегистрирована страница ${this.notFoundPath}`);
    }

    return route;
  }

  private handleLinkClick(event: MouseEvent): void {
    const link = event.target instanceof Element ? event.target.closest('a') : null;
    const href = link?.getAttribute('href') ?? '';

    if (href.startsWith('/')) {
      event.preventDefault();
      this.go(href);
    }
  }
}
