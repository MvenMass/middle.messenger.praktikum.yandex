import { describe, expect, it, jest } from '@jest/globals';

import { Block, type BlockProps } from './block';

interface TitleProps extends BlockProps {
  text: string;
}

class Title extends Block<TitleProps> {
  protected render(): string {
    return '<h1 class="title">{{text}}</h1>';
  }
}

interface CardProps extends BlockProps {
  heading: Title;
  items: Title[];
}

class Card extends Block<CardProps> {
  protected render(): string {
    return '<section class="card">{{{heading}}}<div class="card__items">{{{items}}}</div></section>';
  }
}

class EmptyBlock extends Block {
  protected render(): string {
    return 'просто текст';
  }
}

class LifecycleBlock extends Block<TitleProps> {
  readonly onMount = jest.fn();

  readonly onUnmount = jest.fn();

  protected render(): string {
    return '<p>{{text}}</p>';
  }

  protected componentDidMount(): void {
    this.onMount();
  }

  protected componentWillUnmount(): void {
    this.onUnmount();
  }
}

function createTitle(text = 'Заголовок'): Title {
  return new Title({ text });
}

describe('Block', () => {
  describe('отрисовка', () => {
    it('создаёт элемент по шаблону с данными из props', () => {
      const title = createTitle('Привет');

      expect(title.getContent().tagName).toBe('H1');
      expect(title.getContent().textContent).toBe('Привет');
    });

    it('экранирует html в props', () => {
      const title = createTitle('<img src="x" onerror="alert(1)">');

      expect(title.getContent().querySelector('img')).toBeNull();
      expect(title.getContent().textContent).toBe('<img src="x" onerror="alert(1)">');
    });

    it('выбрасывает ошибку, если у шаблона нет корневого элемента', () => {
      expect(() => new EmptyBlock({})).toThrow('должен содержать один корневой элемент');
    });
  });

  describe('setProps', () => {
    it('перерисовывает элемент при изменении props', () => {
      const title = createTitle('Старый');

      title.setProps({ text: 'Новый' });

      expect(title.getContent().textContent).toBe('Новый');
    });

    it('не перерисовывает элемент, если props не изменились', () => {
      const title = createTitle('Тот же');
      const elementBeforeUpdate = title.getContent();

      title.setProps({ text: 'Тот же' });

      expect(title.getContent()).toBe(elementBeforeUpdate);
    });

    it('заменяет элемент прямо в DOM-дереве', () => {
      const title = createTitle('Старый');
      document.body.replaceChildren(title.getContent());

      title.setProps({ text: 'Новый' });

      expect(document.body.textContent).toBe('Новый');
    });
  });

  describe('вложенные компоненты', () => {
    it('вставляет дочерний компонент и список компонентов', () => {
      const card = new Card({
        heading: createTitle('Шапка'),
        items: [createTitle('Первый'), createTitle('Второй')],
      });

      const titles = card.getContent().querySelectorAll('.title');

      expect(titles).toHaveLength(3);
      expect(card.getContent().querySelector('.card__items')?.textContent).toBe('ПервыйВторой');
    });

    it('сохраняет элемент дочернего компонента при перерисовке родителя', () => {
      const heading = createTitle('Шапка');
      const card = new Card({ heading, items: [] });
      const headingElement = heading.getContent();

      card.setProps({ items: [createTitle('Новый пункт')] });

      expect(card.getContent().querySelector('.title')).toBe(headingElement);
    });
  });

  describe('события', () => {
    it('вешает обработчики из props.events на корневой элемент', () => {
      const handleClick = jest.fn();
      const title = new Title({ text: 'Кнопка', events: { click: handleClick } });

      title.getContent().click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('сохраняет обработчики после перерисовки', () => {
      const handleClick = jest.fn();
      const title = new Title({ text: 'Кнопка', events: { click: handleClick } });

      title.setProps({ text: 'Другая кнопка' });
      title.getContent().click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('жизненный цикл', () => {
    it('вызывает componentDidMount', () => {
      const block = new LifecycleBlock({ text: 'Текст' });

      block.dispatchComponentDidMount();

      expect(block.onMount).toHaveBeenCalledTimes(1);
    });

    it('вызывает componentWillUnmount', () => {
      const block = new LifecycleBlock({ text: 'Текст' });

      block.dispatchComponentWillUnmount();

      expect(block.onUnmount).toHaveBeenCalledTimes(1);
    });
  });
});
