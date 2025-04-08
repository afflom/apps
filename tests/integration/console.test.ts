import { expect } from '@wdio/globals';
import { waitForPageLoad, checkWebComponentsRenderingErrors } from './helpers.ts';

describe('Console Error/Warning Tests', () => {
  beforeEach(async () => {
    // Set up error capturing BEFORE navigating to the page
    await browser.execute(() => {
      // Store original console methods
      const originalError = console.error;
      const originalWarn = console.warn;
      const originalWindowOnerror = window.onerror;

      // @ts-ignore - custom property to store logs
      window.__console_errors = [];
      // @ts-ignore - custom property to store logs
      window.__console_warnings = [];
      // @ts-ignore - custom property to store unhandled errors
      window.__unhandledErrors = [];
      // @ts-ignore - custom property to store custom element errors
      window.__customElementErrors = [];

      // Override console.error
      console.error = function () {
        // Call original method
        originalError.apply(console, arguments);
        // Store for testing
        // @ts-ignore - custom property
        window.__console_errors.push(Array.from(arguments).join(' '));
      };

      // Override console.warn
      console.warn = function () {
        // Call original method
        originalWarn.apply(console, arguments);
        // Store for testing
        // @ts-ignore - custom property
        window.__console_warnings.push(Array.from(arguments).join(' '));
      };

      // Capture unhandled errors
      window.onerror = function (message, source, lineno, colno, error) {
        // @ts-ignore - custom property
        window.__unhandledErrors.push({
          message: message,
          source: source,
          lineno: lineno,
          colno: colno,
          error: error ? error.toString() : null,
          stack: error && error.stack ? error.stack : null,
        });

        // Call original handler if exists
        if (originalWindowOnerror) {
          return originalWindowOnerror.apply(this, arguments);
        }
        return false;
      };

      // Also capture unhandled promise rejections
      window.addEventListener('unhandledrejection', function (event) {
        // @ts-ignore - custom property
        window.__unhandledErrors.push({
          type: 'unhandledrejection',
          reason: event.reason ? event.reason.toString() : 'Unknown promise rejection',
          stack: event.reason && event.reason.stack ? event.reason.stack : null,
        });
      });
    });

    // Navigate to the app
    await browser.url('/');
    await waitForPageLoad();

    // Clear any previous errors/warnings
    await browser.execute(() => {
      // @ts-ignore - custom property
      window.__console_errors = [];
      // @ts-ignore - custom property
      window.__console_warnings = [];
      // @ts-ignore - custom property
      window.__unhandledErrors = [];
      // @ts-ignore - custom property
      window.__customElementErrors = [];
    });
  });

  it('should detect and report console errors', async () => {
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

  it('should capture unhandled errors', async () => {
    // Inject an unhandled error
    await browser.execute(() => {
      setTimeout(() => {
        throw new Error('Test unhandled error');
      }, 0);
    });

    // Wait a moment for the error to be processed
    await browser.pause(100);

    // Retrieve unhandled errors
    const errors = await browser.execute(() => {
      // @ts-ignore - custom property
      return window.__unhandledErrors || [];
    });

    // Verify error was captured
    expect(errors.length).toBe(1);
    expect(errors[0].message).toContain('Test unhandled error');
  });

  it('should capture web component rendering errors', async () => {
    // Create a test component that will error when rendered
    await browser.execute(() => {
      // Define a broken component
      class BrokenComponent extends HTMLElement {
        connectedCallback() {
          throw new Error('Test component rendering error');
        }
      }

      // Register it
      if (!customElements.get('test-broken-element')) {
        customElements.define('test-broken-element', BrokenComponent);
      }

      // Create a container for it
      const container = document.createElement('div');
      container.id = 'broken-component-test';
      document.body.appendChild(container);

      // Add the broken component (will throw in connectedCallback)
      try {
        const element = document.createElement('test-broken-element');
        container.appendChild(element);
      } catch (e) {
        // Expected error
      }
    });

    // Wait a moment for errors to be processed
    await browser.pause(100);

    // Check if custom element errors were captured
    const customElementErrors = await browser.execute(() => {
      // @ts-ignore - custom property
      return window.__customElementErrors || [];
    });

    // Verify error was captured
    expect(customElementErrors.length).toBe(1);
    expect(customElementErrors[0].element).toBe('test-broken-element');
    expect(customElementErrors[0].method).toBe('connectedCallback');
    expect(customElementErrors[0].error).toContain('Test component rendering error');
  });

  it('should not report errors when none occur', async () => {
    // Don't inject any errors

    // Verify no errors were captured
    const diagnostics = await browser.execute(() => {
      // @ts-ignore - custom property
      return {
        consoleErrors: window.__console_errors || [],
        consoleWarnings: window.__console_warnings || [],
        unhandledErrors: window.__unhandledErrors || [],
        customElementErrors: window.__customElementErrors || [],
      };
    });

    // Check web component rendering errors
    const webComponentStatus = await checkWebComponentsRenderingErrors();

    // Verify no errors were captured
    expect(diagnostics.consoleErrors.length).toBe(0);
    expect(diagnostics.unhandledErrors.length).toBe(0);
    expect(diagnostics.customElementErrors.length).toBe(0);
    expect(webComponentStatus.hasErrors).toBe(false);
  });
});
