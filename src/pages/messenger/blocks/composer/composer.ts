import { Input } from '../../../../components/input';
import { messageController } from '../../../../controllers/message-controller';
import { Block, type BlockEvents, type BlockProps } from '../../../../core/block';
import { SocketClosedError } from '../../../../core/socket-errors';
import { getValidationError } from '../../../../services/validation';
import template from './composer.hbs?raw';
import './composer.scss';

interface ComposerProps extends BlockProps {
  input: Input;
  error: string;
}

export class Composer extends Block<ComposerProps> {
  constructor() {
    super({
      error: '',
      input: new Input({
        name: 'message',
        type: 'text',
        className: 'composer__input',
        placeholder: 'Сообщение',
        autocomplete: 'off',
      }),
    });
  }

  validate(): boolean {
    const { input } = this.props;
    const error = getValidationError(input.name, input.getValue());

    this.setProps({ error });

    return error === '';
  }

  protected getEvents(): BlockEvents {
    return {
      focusout: (event) => this.handleFocusOut(event),
      input: () => this.clearError(),
      submit: (event) => this.handleSubmit(event),
    };
  }

  protected render(): string {
    return template;
  }

  private handleFocusOut(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.validate();
    }
  }

  private clearError(): void {
    if (this.props.error === '') {
      return;
    }

    this.setProps({ error: '' });
    this.props.input.getContent().focus();
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();

    const isMessageValid = this.validate();
    const form = this.getContent();

    if (!isMessageValid || !(form instanceof HTMLFormElement)) {
      return;
    }

    try {
      messageController.sendMessage(this.props.input.getValue().trim());
      form.reset();
    } catch (error) {
      if (!(error instanceof SocketClosedError)) {
        throw error;
      }

      this.setProps({ error: error.message });
    }
  }
}
