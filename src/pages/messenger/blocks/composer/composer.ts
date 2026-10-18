import { Input } from '../../../../components';
import { chatController } from '../../../../controllers/chat-controller';
import { Block, type BlockEvents, type BlockProps } from '../../../../core/block';
import { getFormValues } from '../../../../services/form-values';
import { getValidationError } from '../../../../services/validation';
import template from './composer.hbs?raw';
import './composer.scss';

interface ComposerProps extends BlockProps {
  input: Input;
  hasError: boolean;
}

export class Composer extends Block<ComposerProps> {
  constructor() {
    super({
      hasError: false,
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
    const hasError = getValidationError(input.name, input.getValue()) !== '';

    this.setProps({ hasError });

    return !hasError;
  }

  protected getEvents(): BlockEvents {
    return {
      focusout: (event) => this.handleFocusOut(event),
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

  private handleSubmit(event: Event): void {
    event.preventDefault();

    const isMessageValid = this.validate();
    const form = this.getContent();

    if (isMessageValid && form instanceof HTMLFormElement) {
      chatController.sendMessage(getFormValues(form));
      form.reset();
    }
  }
}
