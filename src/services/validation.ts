interface ValidationRule {
  pattern: RegExp;
  message: string;
}

const nameRule: ValidationRule = {
  pattern: /^[A-ZА-ЯЁ][a-zA-Zа-яёА-ЯЁ-]*$/,
  message: 'Латиница или кириллица с заглавной буквы, без пробелов и цифр',
};

const loginRule: ValidationRule = {
  pattern: /^(?!\d+$)[\w-]{3,20}$/,
  message: 'От 3 до 20 символов: латиница, цифры, дефис или подчёркивание',
};

const emailRule: ValidationRule = {
  pattern: /^[\w.-]+@[a-z\d-]*[a-z][a-z\d-]*(\.[a-z\d-]+)*\.[a-z]{2,}$/i,
  message: 'Введите почту в формате name@example.com',
};

const passwordRule: ValidationRule = {
  pattern: /^(?=.*[A-ZА-ЯЁ])(?=.*\d).{8,40}$/,
  message: 'От 8 до 40 символов, хотя бы одна заглавная буква и цифра',
};

const phoneRule: ValidationRule = {
  pattern: /^\+?\d{10,15}$/,
  message: 'От 10 до 15 цифр, можно начать с плюса',
};

const requiredRule: ValidationRule = {
  pattern: /\S/,
  message: 'Поле не должно быть пустым',
};

const rulesByFieldName: Record<string, ValidationRule> = {
  first_name: nameRule,
  second_name: nameRule,
  display_name: requiredRule,
  login: loginRule,
  email: emailRule,
  phone: phoneRule,
  password: passwordRule,
  old_password: passwordRule,
  new_password: passwordRule,
  message: requiredRule,
};

export function getValidationError(fieldName: string, value: string): string {
  const rule = rulesByFieldName[fieldName];

  if (!rule) {
    return '';
  }

  if (value.trim() === '') {
    return requiredRule.message;
  }

  return rule.pattern.test(value) ? '' : rule.message;
}
