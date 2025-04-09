import type { Options } from '@wdio/types';
import path from 'path';
import fs from 'fs';

// Get the Chrome version that matches the installed Chrome
const chromeVersion = process.env.CHROME_VERSION || '135';
console.log(`Using ChromeDriver for Chrome version: ${chromeVersion}`);

// Get the test port from environment or use a default
const testPort = process.env.TEST_PORT;

// Log port configuration
if (testPort) {
  console.log(`Using TEST_PORT environment variable: ${testPort}`);
} else {
  console.log('No TEST_PORT specified, will use port discovery in tests');
}

// Create logs directory if it doesn't exist
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs', { recursive: true });
}

// Configure WebdriverIO
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
        args: [
          '--headless',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--window-size=1440,900',
        ],
      },
    },
  ],
  logLevel: 'info',
  bail: 0,
  baseUrl: `http://localhost:${testPort || 4173}`,
  waitforTimeout: 10000,
  connectionRetryTimeout: 60000, // Reduced from 120000 to fail faster
  connectionRetryCount: 3,
  services: [
    [
      'chromedriver',
      {
        logFileName: 'wdio-chromedriver.log',
        outputDir: 'logs',
        chromedriverCustomPath: path.resolve('./node_modules/chromedriver/bin/chromedriver'),
      },
    ],
  ],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  beforeSession: function () {
    // Write test configuration to log for debugging
    fs.writeFileSync(
      'logs/test-config.log',
      JSON.stringify(
        {
          baseUrl: config.baseUrl,
          testPort: testPort || 'not set',
          chromeVersion: chromeVersion,
          timestamp: new Date().toISOString(),
          env: Object.keys(process.env)
            .filter((key) => key.startsWith('TEST_') || key.startsWith('CHROME') || key === 'PATH')
            .reduce(
              (obj, key) => {
                obj[key] = process.env[key];
                return obj;
              },
              {} as Record<string, string | undefined>
            ),
        },
        null,
        2
      )
    );
  },
  before: function () {
    // Console errors/warnings are captured in the tests using our custom mechanism
    // This is just for additional debugging during test runs
    try {
      // Log starting base URL
      console.log(`Initial baseUrl: ${browser.options.baseUrl}`);

      // @ts-expect-error - Browser event is available but not in type definitions
      browser.on('window.console' as any, (type: string, args: any) => {
        if (type === 'error' || type === 'warning') {
          // eslint-disable-next-line no-console
          console.log(`Browser console ${type}:`, args);
        }
      });
    } catch (e) {
      // Ignore if not supported
      console.warn('Failed to set up browser console listener:', e);
    }
  },
  beforeTest: function () {
    // Clear before each test
    browser.execute(() => {
      console.clear();
    });
  },
  afterTest: function (test) {
    // Save test info for debugging if needed
    fs.appendFileSync(
      'logs/test-results.log',
      `${new Date().toISOString()} - ${test.parent} - ${test.title}: ${test.passed ? 'PASSED' : 'FAILED'}\n`
    );
  },
};
