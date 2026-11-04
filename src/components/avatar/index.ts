import Handlebars from 'handlebars';

import template from './avatar.hbs?raw';
import './avatar.scss';

export function registerAvatar(): void {
  Handlebars.registerPartial('Avatar', template);
}
