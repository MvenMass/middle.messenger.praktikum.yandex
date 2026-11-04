import { Block, type BlockEvents, type BlockProps } from '../../core/block';
import { getValidationError } from '../../services/validation';
import { Input } from '../input';
import template from './form-field.hbs?raw';
import './form-field.scss';

interface FormFieldOptions {
  label: string;
  name: string;
  type: string;
  value?: string;
}

interface FormFieldProps extends BlockProps {
  label: string;
  error: string;
  input: Input;
}

export class FormField extends Block<FormFieldProps> {
  constructor({ label, name, type, value = '' }: FormFieldOptions) {
    const input = new Input({
      name,
      type,
      value,
      className: 'form-field__input',
      placeholder: ' ',
    });

    super({ label, input, error: '' });
  }

  validate(): boolean {
    const { input } = this.props;
    const error = getValidationError(input.name, input.getValue());

    this.setProps({ error });

    return error === '';
  }

  protected getEvents(): BlockEvents {
    return {
      focusout: () => this.validate(),
    };
  }

  protected render(): string {
    return template;
  }
}
