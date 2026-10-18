import './styles/main.scss';
import { registerIcons } from './components';
import type { Block } from './core/block';
import { ErrorPage, LoginPage, MessengerPage, SettingsPage, SignUpPage } from './pages';

type PageFactory = () => Block;

const pagesByPath: Record<string, PageFactory> = {
  '/': () => new LoginPage(),
  '/sign-up': () => new SignUpPage(),
  '/messenger': () => new MessengerPage(),
  '/settings': () => new SettingsPage(),
  '/500': () => new ErrorPage({ code: '500', text: 'Что-то сломалось на сервере. Мы уже чиним' }),
};

const createNotFoundPage: PageFactory = () => new ErrorPage({ code: '404', text: 'Такой страницы нет' });

registerIcons();

const appRoot = document.querySelector<HTMLElement>('#app');

if (!appRoot) {
  throw new Error('Не найден корневой элемент #app');
}

const createPage = pagesByPath[window.location.pathname] ?? createNotFoundPage;
const page = createPage();

appRoot.replaceChildren(page.getContent());
page.dispatchComponentDidMount();
