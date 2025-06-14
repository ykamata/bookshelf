import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import nuxt from 'eslint-plugin-nuxt'
import prettier from 'eslint-config-prettier'

export default [
  {
    files: ['**/*.{ts,vue}'],
    ignores: ['node_modules', '.output', '.nuxt'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    },
    plugins: {
      vue,
      nuxt,
      '@typescript-eslint': tseslint
    },
    rules: {
      ...vue.configs['vue3-recommended'].rules,
      ...nuxt.configs['flat/recommended'].rules,
      ...tseslint.configs.recommended.rules
    }
  },
  ...prettier
]
