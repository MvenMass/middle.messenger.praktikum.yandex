import { Block, type BlockEvents, type BlockProps } from '../../core/block';
import { getFormValues, type FormValues } from '../../services/form-values';
import type { Button } from '../button';
import type { FormField } from '../form-field';
import template from './form.hbs?raw';
import './form.scss';

interface FormProps extends BlockProps {
  fields: FormField[];
  submitButton: Button;
  onSubmit: (values: FormValues) => void;
  className?: string;
}

export class Form extends Block<FormProps> {
  protected getEvents(): BlockEvents {
    return {
      submit: (event) => this.handleSubmit(event),
    };
  }

  protected render(): string {
    return template;
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();

    const validationResults = this.props.fields.map((field) => field.validate());
    const isFormValid = validationResults.every(Boolean);
    const form = event.currentTarget;

    if (isFormValid && form instanceof HTMLFormElement) {
      this.props.onSubmit(getFormValues(form));
    }
  }
}
