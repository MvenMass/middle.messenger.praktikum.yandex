import Handlebars from 'handlebars';

import './icon.scss';

const iconTemplates = import.meta.glob<string>('./*.hbs', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function getPartialName(filePath: string): string {
  const fileName = filePath.split('/').pop() ?? '';

  return fileName
    .replace('.hbs', '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

export function registerIcons(): void {
  Object.entries(iconTemplates).forEach(([filePath, template]) => {
    Handlebars.registerPartial(getPartialName(filePath), template);
  });
}
