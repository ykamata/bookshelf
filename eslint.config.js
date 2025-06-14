import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt({
  // Provide the project root to ensure all files are linted correctly
  cwd: new URL('.', import.meta.url).pathname,
  // Reintroduce Prettier formatting similar to the previous setup
  features: {
    formatters: true,
  },
})
