import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  { ignores: ['node_modules', 'web'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierRecommended,
  {
    languageOptions: {
      globals: globals.node
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
      '@typescript-eslint/no-unused-expressions': ['warn', { allowTernary: true }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-constant-condition': ['error', { checkLoops: false }]
    }
  }
);
