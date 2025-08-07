import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tseslintParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import prettierPlugin from 'eslint-plugin-prettier'
import nextPlugin from '@next/eslint-plugin-next'
import _globals from 'globals'

// Combine globals from the 'globals' package:
const combinedGlobals = {
  ..._globals.browser,
  ..._globals.es2021,
  ..._globals.node,
}

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],

    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
      '@next/next': nextPlugin,
    },

    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
      globals: combinedGlobals,
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      // Core ESLint rules
      'no-unused-vars': 'off', // Turn off base rule in favor of TypeScript rule
      'no-undef': 'warn',
      'no-empty': 'warn',
      'no-unreachable': 'error',
      'no-unreachable-loop': 'error',
      'no-fallthrough': 'error',

      // TypeScript rules (non-type-aware)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      // TypeScript rules (type-aware) - these catch implicit any and unsafe usage
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',

      // React rules
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'warn',
      'react/no-unescaped-entities': 'warn',

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // Prettier
      'prettier/prettier': 'warn',

      // Misc
      'no-case-declarations': 'warn',
      'no-useless-catch': 'warn',
    },
  },
]
