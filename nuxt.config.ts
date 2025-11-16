import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  modules: ['@nuxt/eslint'],
  devtools: { enabled: true },
  typescript: {
    strict: true,
  },
  eslint: {
    config: {
      // Ref: https://github.com/eslint-stylistic/eslint-stylistic/blob/main/packages/eslint-plugin/configs/customize.ts
      stylistic: {
        semi: true,
      },
    },
  },
});
