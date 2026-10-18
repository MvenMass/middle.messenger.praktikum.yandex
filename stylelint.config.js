export default {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'scss/dollar-variable-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment', 'after-dollar-variable'],
      },
    ],
    'selector-class-pattern': [
      '^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(_[a-z0-9]+(-[a-z0-9]+)*){0,2}$',
      {
        message: 'Используйте именование классов по БЭМ',
      },
    ],
  },
};
