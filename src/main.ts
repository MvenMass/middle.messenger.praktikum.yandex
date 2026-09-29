import Handlebars from 'handlebars';

import './styles/main.scss';
import { registerComponents } from './components';
import { pagesByPath, notFoundPage } from './pages';

registerComponents();

const appRoot = document.querySelector<HTMLElement>('#app');

if (!appRoot) {
  throw new Error('Не найден корневой элемент #app');
}

const currentPage = pagesByPath[window.location.pathname] ?? notFoundPage;

appRoot.innerHTML = Handlebars.compile(currentPage.template)(currentPage.context ?? {});

