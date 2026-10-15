const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  reporter: 'html',
  use: { baseURL: 'http://localhost:3000' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: 'npx http-server public -p 3000 -s',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});