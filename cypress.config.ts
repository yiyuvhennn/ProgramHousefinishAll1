import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // 我的前端
    baseUrl: 'http://localhost:5173',

    // 我的後端 API base（之後 cy.request 會用到）
    env: {
      apiUrl: 'http://localhost:3001',
    },

    setupNodeEvents(on, config) {
      return config
    },
  },
})
