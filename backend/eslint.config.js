// eslint.config.js (ESLint v9 - flat config)
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import pluginPromise from 'eslint-plugin-promise';
import globals from 'globals';

export default [
  // Archivos/dirs a ignorar (reemplaza .eslintignore)
  {
    ignores: ['node_modules/', 'dist/', 'coverage/'],
  },

  // Base recomendada de ESLint
  js.configs.recommended,

  // Tu configuración
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      import: pluginImport,
      promise: pluginPromise,
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'import/order': [
        'warn',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],
      // Cualquier otra regla personal aquí...
    },
  },

  // Desactiva reglas que chocan con Prettier
  prettier,
];
