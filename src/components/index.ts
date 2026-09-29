import Handlebars from 'handlebars';

const componentTemplates = import.meta.glob<string>('./**/*.hbs', {
  query: '?raw',
  import: 'default',
  eager: true,
});

import.meta.glob('./**/*.scss', { eager: true });

// имя компонента беру из названия файла, icon-send.hbs станет IconSend
function getPartialName(filePath: string): string {
  const fileName = filePath.split('/').pop() ?? '';
  const baseName = fileName.replace('.hbs', '');

  return baseName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

export function registerComponents(): void {
  Object.entries(componentTemplates).forEach(([filePath, template]) => {
    Handlebars.registerPartial(getPartialName(filePath), template);
  });
}
