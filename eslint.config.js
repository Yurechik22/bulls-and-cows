import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist', 'public', 'node_modules', 'coverage'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-restricted-syntax': [
        'error',
        { selector: 'ClassDeclaration', message: 'Classes are not allowed: use functions.' },
        {
          selector: "AssignmentExpression[left.property.name='innerHTML']",
          message: 'innerHTML is not allowed: build DOM nodes instead.',
        },
        {
          selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
          message: 'insertAdjacentHTML is not allowed: build DOM nodes instead.',
        },
      ],
    },
  },
  prettier,
);
