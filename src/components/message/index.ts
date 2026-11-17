import Handlebars from 'handlebars';

import template from './message.hbs?raw';
import './message.scss';

export function registerMessage(): void {
  Handlebars.registerPartial('Message', template);
}
