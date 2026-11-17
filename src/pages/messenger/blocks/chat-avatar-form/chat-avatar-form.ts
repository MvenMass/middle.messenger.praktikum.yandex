import { Button } from '../../../../components';
import { Block, type BlockEvents, type BlockProps } from '../../../../core/block';
import { getErrorMessage } from '../../../../services/error-message';
import template from './chat-avatar-form.hbs?raw';
import './chat-avatar-form.scss';

interface ChatAvatarFormProps extends BlockProps {
  onSubmit: (file: File) => Promise<void>;
  submitButton: Button;
  error: string;
}

export class ChatAvatarForm extends Block<ChatAvatarFormProps> {
  constructor(onSubmit: (file: File) => Promise<void>) {
    super({
      onSubmit,
      submitButton: new Button({ text: 'Сохранить', type: 'submit' }),
      error: '',
    });
  }

  reset(): void {
    this.setProps({ error: '' });
    this.getFormElement().reset();
  }

  protected getEvents(): BlockEvents {
    return {
      submit: (event) => this.handleSubmit(event),
    };
  }

  protected render(): string {
    return template;
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const file = new FormData(this.getFormElement()).get('avatar');
    const isFileSelected = file instanceof File && file.size > 0;

    if (!isFileSelected) {
      this.setProps({ error: 'Выберите картинку' });
      return;
    }

    try {
      await this.props.onSubmit(file);
    } catch (error) {
      this.setProps({ error: getErrorMessage(error) });
    }
  }

  private getFormElement(): HTMLFormElement {
    const element = this.getContent();

    if (!(element instanceof HTMLFormElement)) {
      throw new Error('Корневой элемент формы аватара должен быть тегом form');
    }

    return element;
  }
}
