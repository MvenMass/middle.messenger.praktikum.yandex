export type FormValues = Record<string, string>;

export function getFormValues(form: HTMLFormElement): FormValues {
  const values: FormValues = {};

  new FormData(form).forEach((value, name) => {
    if (typeof value === 'string') {
      values[name] = value;
    }
  });

  return values;
}
