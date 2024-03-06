import { defineConfig } from '@soybeanjs/eslint-config';

console.log('4324324');
export default defineConfig(
  { vue: true, unocss: true },
  {
    rules: {
      'import/order': [
        'error',
        {
          'newlines-between': 'never',
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: 'vue',
              group: 'external',
              position: 'before'
            },
            {
              pattern: 'vue-router',
              group: 'external',
              position: 'before'
            },
            {
              pattern: 'pinia',
              group: 'external',
              position: 'before'
            },
            {
              pattern: 'naive-ui',
              group: 'external',
              position: 'before'
            },
            {
              pattern: '@/constants',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@/config',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@/settings',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@/plugins',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@/layouts',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@/views',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@/components',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@/router',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@/service',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@/store',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@/context',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@/composables',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@/hooks',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@/utils',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@/assets',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before'
            }
          ],
          pathGroupsExcludedImportTypes: ['vue', 'vue-router', 'pinia', 'naive-ui']
        }
      ],
      'vue/prefer-true-attribute-shorthand': 'off',
      'no-console': 'off',
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
    },

    settings: {
      'import/core-modules': ['uno.css', '~icons/*', 'virtual:svg-icons-register']
    }
  }
);
console.log('4324324');
