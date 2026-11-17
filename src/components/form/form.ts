import { Block, type BlockEvents, type BlockProps } from '../../core/block';
import { getErrorMessage } from '../../services/error-message';
import { getFormValues, type FormValues } from '../../services/form-values';
import type { Button } from '../button';
import type { FormField } from '../form-field';
import template from './form.hbs?raw';
import './form.scss';

interface FormOptions {
  fields: FormField[];
  submitButton: Button;
  onSubmit: (values: FormValues) => Promise<void>;
  className?: string;
  successMessage?: string;
  resetOnSuccess?: boolean;
}

interface FormProps extends BlockProps, FormOptions {
  message: string;
  isError: boolean;
}

export class Form extends Block<FormProps> {
  constructor(options: FormOptions) {
    super({ ...options, message: '', isError: false });
  }

  reset(): void {
    this.props.fields.forEach((field) => field.setProps({ error: '' }));
    this.setProps({ message: '' });
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

    const validationResults = this.props.fields.map((field) => field.validate());
    const isFormValid = validationResults.every(Boolean);

    if (!isFormValid) {
      return;
    }

    try {
      await this.props.onSubmit(getFormValues(this.getFormElement()));
      this.showSuccess();
    } catch (error) {
      this.setProps({ message: getErrorMessage(error), isError: true });
    }
  }

  private showSuccess(): void {
    this.setProps({ message: this.props.successMessage ?? '', isError: false });

    if (this.props.resetOnSuccess) {
      this.getFormElement().reset();
    }
  }

  private getFormElement(): HTMLFormElement {
    const element = this.getContent();

    if (!(element instanceof HTMLFormElement)) {
      throw new Error('Корневой элемент формы должен быть тегом form');
    }

    return element;
  }
}
