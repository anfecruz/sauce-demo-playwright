const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 15000
  },
  use: {
    actionTimeout: 15000,
    navigationTimeout: 15000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          args: ['--disable-dev-shm-usage']
        }
      },
    },
    // Comment out Firefox configuration until installation is fixed
    /*
    {
      name: 'firefox',
      use: { 
        browserName: 'firefox',
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          firefoxUserPrefs: {
            'browser.cache.disk.enable': false,
            'browser.cache.memory.enable': false,
            'browser.sessionstore.resume_from_crash': false
          }
        }
      },
    }
    */
  ],
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
  workers: 1,
  retries: 1,
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
});