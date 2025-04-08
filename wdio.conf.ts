import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
  runner: 'local',
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: './tsconfig.wdio.json',
      transpileOnly: true,
    },
  },
  specs: ['./tests/integration/**/*.ts'],
  exclude: [],
  maxInstances: 1,
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
      },
    },
  ],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost:4177',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ['chromedriver'],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  beforeSession: function () {
    // Setup any global configuration here
  },
  before: function () {
    // Console errors/warnings are captured in the tests using our custom mechanism
    // This is just for additional debugging during test runs
    try {
      // @ts-expect-error - Browser event is available but not in type definitions
      browser.on('window.console' as any, (type: string, args: any) => {
        if (type === 'error' || type === 'warning') {
          // eslint-disable-next-line no-console
          console.log(`Browser console ${type}:`, args);
        }
      });
    } catch (e) {
      // Ignore if not supported
    }
  },
  beforeTest: function () {
    // Clear before each test
    browser.execute(() => {
      console.clear();
    });
  },
  afterTest: function () {
    // Any cleanup after each test
  },
};
