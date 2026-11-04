import { Block, type BlockEvents, type BlockProps } from '../../core/block';
import type { Form } from '../form';
import template from './modal.hbs?raw';
import './modal.scss';

interface ModalProps extends BlockProps {
  title: string;
  form: Form;
}

export class Modal extends Block<ModalProps> {
  open(): void {
    this.props.form.reset();
    this.getDialog().showModal();
  }

  close(): void {
    this.getDialog().close();
  }

  protected getEvents(): BlockEvents {
    return {
      click: (event) => this.handleClick(event),
    };
  }

  protected render(): string {
    return template;
  }

  private handleClick(event: Event): void {
    const isBackdropClick = event.target === this.getDialog();
    const isCloseButtonClick = event.target instanceof Element && event.target.closest('.modal__close') !== null;

    if (isBackdropClick || isCloseButtonClick) {
      this.close();
    }
  }

  private getDialog(): HTMLDialogElement {
    const element = this.getContent();

    if (!(element instanceof HTMLDialogElement)) {
      throw new Error('Корневой элемент модального окна должен быть тегом dialog');
    }

    return element;
  }
}
