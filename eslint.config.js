import { defineConfig } from '@soybeanjs/eslint-config';

export default defineConfig(
  { vue: true },
  {
    files: ['*.vue'],
    parser: 'vue-eslint-parser',
    rules: {
      'vue/no-parsing-error': 'off',
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index', 'App', '[id]']
        }
      ],
      'vue/component-name-in-template-casing': [
        'warn',
        'PascalCase',
        {
          ignores: ['/^icon-/']
        }
      ]
    }
  }
);
