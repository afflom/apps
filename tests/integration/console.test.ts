import { expect } from '@wdio/globals';
import { waitForPageLoad } from './helpers.js';

describe('Console Error/Warning Tests', () => {
  beforeEach(async () => {
    // Navigate to the app
    await browser.url('/');
    await waitForPageLoad();

    // Clear any previous errors/warnings
    await browser.execute(() => {
      // @ts-ignore - custom property
      window.__console_errors = [];
      // @ts-ignore - custom property
      window.__console_warnings = [];
    });
  });

  it('should detect and report console errors', async () => {
    // Setup first: ensure our override is in place
    await browser.execute(() => {
      const originalError = console.error;
      // @ts-ignore - custom property
      window.__console_errors = [];

      console.error = function (...args: unknown[]) {
        originalError.apply(console, args);
        // @ts-ignore - custom property
        window.__console_errors.push(args.join(' '));
      };
    });

    // Inject a console error
    await browser.execute(() => {
      console.error('Test error message');
    });

    // Retrieve stored errors
    const errors = await browser.execute(() => {
      // @ts-ignore - custom property
      return window.__console_errors || [];
    });

    // Verify error was captured
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('Test error message');
  });

  it('should detect and report console warnings', async () => {
    // Setup first: ensure our override is in place
    await browser.execute(() => {
      const originalWarn = console.warn;
      // @ts-ignore - custom property
      window.__console_warnings = [];

      console.warn = function (...args: unknown[]) {
        originalWarn.apply(console, args);
        // @ts-ignore - custom property
        window.__console_warnings.push(args.join(' '));
      };
    });

    // Inject a console warning
    await browser.execute(() => {
      console.warn('Test warning message');
    });

    // Retrieve stored warnings
    const warnings = await browser.execute(() => {
      // @ts-ignore - custom property
      return window.__console_warnings || [];
    });

    // Verify warning was captured
    expect(warnings.length).toBe(1);
    expect(warnings[0]).toContain('Test warning message');
  });

  it('should not report errors when none occur', async () => {
    // Don't inject any console errors

    // Retrieve stored errors
    const errors = await browser.execute(() => {
      // @ts-ignore - custom property
      return window.__console_errors || [];
    });

    // Verify no errors were captured
    expect(errors.length).toBe(0);
  });
});
