import { expect } from '@wdio/globals';
import {
  waitForPageLoad,
  waitForWebComponentsReady,
  isPwaRegistered,
  checkWebComponentsRenderingErrors,
} from './helpers.ts';

describe('App Integration Tests', () => {
  // Array to collect console errors/warnings
  let consoleErrors: any[] = [];
  let consoleWarnings: any[] = [];
  let unhandledErrors: any[] = [];

  // Setup before first test - no additional setup needed here as all is handled in beforeEach

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
      // @ts-ignore - custom property for tracking app errors
      window.__app_errors = [];

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

      // Monitor custom element connection errors
      const originalDefine = customElements.define;
      customElements.define = function (name, constructor) {
        // Add error monitoring to the connectedCallback
        const originalConnectedCallback = constructor.prototype.connectedCallback;

        if (originalConnectedCallback) {
          constructor.prototype.connectedCallback = function () {
            try {
              return originalConnectedCallback.apply(this);
            } catch (error) {
              // @ts-ignore - custom property
              window.__customElementErrors.push({
                element: name,
                method: 'connectedCallback',
                error: error.toString(),
                stack: error.stack,
              });
              console.error(`Error in ${name} connectedCallback:`, error);
              throw error;
            }
          };
        }

        // Monitor attributeChangedCallback too
        const originalAttributeChangedCallback = constructor.prototype.attributeChangedCallback;

        if (originalAttributeChangedCallback) {
          constructor.prototype.attributeChangedCallback = function (name, oldValue, newValue) {
            try {
              return originalAttributeChangedCallback.apply(this, [name, oldValue, newValue]);
            } catch (error) {
              // @ts-ignore - custom property
              window.__customElementErrors.push({
                element: this.tagName.toLowerCase(),
                method: 'attributeChangedCallback',
                attribute: name,
                error: error.toString(),
                stack: error.stack,
              });
              console.error(
                `Error in ${this.tagName.toLowerCase()} attributeChangedCallback:`,
                error
              );
              throw error;
            }
          };
        }

        // Call the original define method
        return originalDefine.call(customElements, name, constructor);
      };
    });

    // Now navigate to the app
    await browser.url('/');
    await waitForPageLoad({ timeout: 10000, waitForComponents: true });
  });

  afterEach(async () => {
    // Check for console errors/warnings after each test
    const errors = await browser.execute(() => {
      // @ts-ignore - custom property
      return {
        consoleErrors: window.__console_errors || [],
        consoleWarnings: window.__console_warnings || [],
        unhandledErrors: window.__unhandledErrors || [],
        customElementErrors: window.__customElementErrors || [],
        appErrors: window.__app_errors || [],
      };
    });

    consoleErrors = errors.consoleErrors;
    consoleWarnings = errors.consoleWarnings;
    unhandledErrors = errors.unhandledErrors;

    // Get web component rendering status
    const webComponentStatus = await checkWebComponentsRenderingErrors();

    // Log any errors/warnings for debugging (use detailed logging for any issues)
    if (consoleErrors.length > 0) {
      console.error('CONSOLE ERRORS DETECTED:', JSON.stringify(consoleErrors, null, 2));
      await browser.saveScreenshot(`./console-error-${Date.now()}.png`);
    }

    if (consoleWarnings.length > 0) {
      console.warn('Console warnings detected:', JSON.stringify(consoleWarnings, null, 2));
    }

    if (errors.unhandledErrors.length > 0) {
      console.error('UNHANDLED ERRORS DETECTED:', JSON.stringify(errors.unhandledErrors, null, 2));
      await browser.saveScreenshot(`./unhandled-error-${Date.now()}.png`);
    }

    if (errors.customElementErrors.length > 0) {
      console.error(
        'CUSTOM ELEMENT ERRORS DETECTED:',
        JSON.stringify(errors.customElementErrors, null, 2)
      );
      await browser.saveScreenshot(`./custom-element-error-${Date.now()}.png`);
    }

    if (errors.appErrors && errors.appErrors.length > 0) {
      console.error('APPLICATION ERRORS DETECTED:', JSON.stringify(errors.appErrors, null, 2));
      await browser.saveScreenshot(`./app-error-${Date.now()}.png`);
    }

    if (webComponentStatus.hasErrors) {
      console.error(
        'WEB COMPONENT RENDERING ERRORS DETECTED:',
        JSON.stringify(webComponentStatus, null, 2)
      );
      await browser.saveScreenshot(`./web-component-error-${Date.now()}.png`);
    }

    // Don't apply this to the "capture initial page load errors" test which is diagnostic
    const currentTest = await browser.execute(() => {
      return document.title;
    });

    if (!currentTest.includes('capture initial page load errors')) {
      // Assert no errors occurred
      expect(consoleErrors.length).toBe(0);
      expect(errors.unhandledErrors.length).toBe(0);
      expect(errors.customElementErrors.length).toBe(0);
      expect(errors.appErrors.length).toBe(0);
      expect(webComponentStatus.hasErrors).toBe(false);
    }
  });

  it('should load the application successfully', async () => {
    // Check title
    const title = await browser.getTitle();
    expect(title).toBeTruthy();

    // Check body content
    const bodyText = await $('body').getText();
    expect(bodyText).toBeTruthy();

    // Verify web components are defined
    const customElementsStatus = await browser.execute(() => {
      return {
        appRootDefined: customElements.get('app-root') !== undefined,
        counterDefined: customElements.get('app-counter') !== undefined,
      };
    });

    expect(customElementsStatus.appRootDefined).toBe(true);
    expect(customElementsStatus.counterDefined).toBe(true);

    // Verify app-root element is in the DOM
    const appRoot = await $('app-root');
    await expect(appRoot).toExist();
  });

  it('should have counter component working', async () => {
    // Verify app container exists
    const appDiv = await $('#app');
    await expect(appDiv).toExist();

    // Test app-counter shadow content
    const buttonExists = await browser.execute(() => {
      const counter = document.querySelector('app-counter');
      if (!counter || !counter.shadowRoot) return false;

      const button = counter.shadowRoot.querySelector('button');
      return !!button;
    });

    if (buttonExists) {
      // Get initial button text
      const initialText = await browser.execute(() => {
        const counter = document.querySelector('app-counter');
        return counter?.shadowRoot?.querySelector('button')?.textContent || '';
      });

      // Click the counter button using pierce selector
      const counterButton = await $('pierce/app-counter button');
      await counterButton.click();

      // Wait for UI update
      await browser.pause(100);

      // Get updated text
      const updatedText = await browser.execute(() => {
        const counter = document.querySelector('app-counter');
        return counter?.shadowRoot?.querySelector('button')?.textContent || '';
      });

      // Text should be different after the click
      expect(updatedText).not.toBe(initialText);
    } else {
      // If no counter button, at least verify the content
      const bodyText = await $('body').getText();
      expect(bodyText).toContain('TypeScript');
    }
  });

  it('should verify PWA capabilities and properly handle errors', async () => {
    // Check that manifest is linked
    const manifestLink = await $('link[rel="manifest"]');
    await expect(manifestLink).toExist();

    // Verify service worker registration
    const manifestLoads = await browser.execute(() => {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (!manifestLink) return false;

      // @ts-ignore - href property exists on HTMLLinkElement
      return fetch(manifestLink.href)
        .then((response) => response.ok)
        .catch(() => false);
    });

    expect(manifestLoads).toBe(true);

    // Check if service worker API is available
    const swAvailable = await browser.execute(() => 'serviceWorker' in navigator);

    if (swAvailable) {
      // In development, the service worker may not be registered, which is normal
      const isRegistered = await isPwaRegistered();
      console.log(
        `PWA service worker registration status: ${isRegistered ? 'registered' : 'not registered'}`
      );

      // Check if errors were properly handled - we shouldn't see any app crashes from PWA failures
      const appState = await browser.execute(() => {
        // Check if there are any errors related to service workers
        // @ts-ignore - custom properties
        const swErrors = (window.__app_errors || []).filter(
          (err) =>
            err.message &&
            (err.message.includes('service worker') || err.message.includes('ServiceWorker'))
        );

        // Check if app still rendered despite service worker errors
        const appRendered = !!document.querySelector('app-root')?.shadowRoot?.childNodes.length;

        return {
          serviceWorkerErrors: swErrors,
          appRendered: appRendered,
          // Check for error UI that might have been shown
          hasErrorUI: document.body.innerHTML.includes('Application Error'),
        };
      });

      // App should still be rendered even if service worker fails
      expect(appState.appRendered).toBe(true);

      // In a development environment, we expect service worker errors but the app should
      // still function and not show a fatal error UI
      if (appState.serviceWorkerErrors.length > 0) {
        console.log(
          'Service worker errors detected but handled properly:',
          JSON.stringify(appState.serviceWorkerErrors, null, 2)
        );

        // App should still be functional despite service worker errors
        expect(appState.hasErrorUI).toBe(false);
      }
    }
  });

  it('should handle web component rendering errors correctly', async () => {
    // This test injects errors to ensure the error handling is working

    // 1. Test error in connectedCallback
    const survivesConnectedCallbackError = await browser.execute(() => {
      try {
        // Create a test div
        const testDiv = document.createElement('div');
        testDiv.id = 'error-test-container';
        document.body.appendChild(testDiv);

        // Create a broken component that will throw in connectedCallback
        const BrokenComponent = class extends HTMLElement {
          connectedCallback() {
            throw new Error('Test error in connectedCallback');
          }
        };

        // Register it without disturbing existing components
        if (!customElements.get('test-broken-element')) {
          customElements.define('test-broken-element', BrokenComponent);
        }

        // Try to add it to DOM - this should error in connectedCallback
        try {
          const broken = document.createElement('test-broken-element');
          testDiv.appendChild(broken);
        } catch (e) {
          // Expected error
        }

        // Check if the container still exists (recovery worked)
        return document.getElementById('error-test-container') !== null;
      } catch (e) {
        console.error('Unexpected error in test:', e);
        return false;
      }
    });

    // The page should survive an error in a component
    expect(survivesConnectedCallbackError).toBe(true);

    // Verify the error was caught
    const errorsCaptured = await browser.execute(() => {
      // @ts-ignore - custom property
      return (window.__customElementErrors || []).some(
        (e) => e.element === 'test-broken-element' && e.method === 'connectedCallback'
      );
    });

    expect(errorsCaptured).toBe(true);

    // 2. Verify we can continue interacting with the app after error
    // Check that other components still work
    const appStillInteractive = await browser.execute(() => {
      const counter = document.querySelector('app-counter');
      if (!counter || !counter.shadowRoot) return false;

      const button = counter.shadowRoot.querySelector('button');
      if (!button) return false;

      // The button should still be interactive
      return true;
    });

    expect(appStillInteractive).toBe(true);
  });

  it('should capture initial page load errors', async () => {
    // Specifically test for errors that might occur on page load
    const initialErrors = await browser.execute(() => {
      // Return any errors detected
      // @ts-ignore - custom property
      return {
        consoleErrors: window.__console_errors || [],
        consoleWarnings: window.__console_warnings || [],
        unhandledErrors: window.__unhandledErrors || [],
        customElementErrors: window.__customElementErrors || [],
      };
    });

    // Log everything for debugging
    console.log('\n\n===== INITIAL PAGE LOAD DIAGNOSTICS =====');
    console.log('Console errors:', initialErrors.consoleErrors);
    console.log('Console warnings:', initialErrors.consoleWarnings);
    console.log('Unhandled errors:', initialErrors.unhandledErrors);
    console.log('Custom element errors:', initialErrors.customElementErrors);
    console.log('=========================================\n\n');

    // Take a screenshot for visual debugging
    await browser.saveScreenshot('./page-load-state.png');

    // Check if any ServiceWorker issues
    const swStatus = await browser.execute(() => {
      // Check service worker registration
      if (!('serviceWorker' in navigator)) {
        return 'ServiceWorker API not available';
      }

      // Get registration state
      return navigator.serviceWorker
        .getRegistration()
        .then((registration) => {
          if (!registration) {
            return 'No ServiceWorker registered';
          }
          return `ServiceWorker registered: ${registration.scope}, state: ${registration.active ? registration.active.state : 'no active worker'}`;
        })
        .catch((err) => {
          console.error('Service worker registration error:', err);
          return `ServiceWorker error: ${err}`;
        });
    });

    console.log('ServiceWorker status:', swStatus);

    // Run a diagnostic on the PWA manifest
    const manifestDiagnostic = await browser.execute(() => {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (!manifestLink) {
        return 'No manifest link found';
      }

      // @ts-ignore - href property exists on HTMLLinkElement
      return fetch(manifestLink.href)
        .then((response) => {
          if (!response.ok) {
            return `Manifest fetch failed: ${response.status} ${response.statusText}`;
          }
          return response.json();
        })
        .then((manifest) => {
          return `Manifest loaded: ${JSON.stringify(manifest)}`;
        })
        .catch((err) => {
          return `Manifest error: ${err}`;
        });
    });

    console.log('Manifest diagnostic:', manifestDiagnostic);

    // Get web component diagnostics
    const webComponentDiagnostic = await browser.execute(() => {
      // Test app-root rendering
      let appRootStatus = 'Not checked';
      try {
        const appRoot = document.querySelector('app-root');
        if (!appRoot) {
          appRootStatus = 'app-root element not found';
        } else {
          const shadowRoot = appRoot.shadowRoot;
          if (!shadowRoot) {
            appRootStatus = 'app-root shadowRoot not attached';
          } else {
            const hasContent = shadowRoot.childNodes.length > 0;
            appRootStatus = hasContent ? 'Rendered correctly' : 'Empty shadow DOM';
          }
        }
      } catch (error) {
        appRootStatus = `Error checking app-root: ${error}`;
      }

      // Test app-counter rendering
      let counterStatus = 'Not checked';
      try {
        const counters = document.querySelectorAll('app-counter');
        if (counters.length === 0) {
          counterStatus = 'No app-counter elements found';
        } else {
          const failures = [];
          counters.forEach((counter, index) => {
            const shadowRoot = counter.shadowRoot;
            if (!shadowRoot) {
              failures.push(`Counter ${index}: shadowRoot not attached`);
            } else {
              const button = shadowRoot.querySelector('button');
              if (!button) {
                failures.push(`Counter ${index}: button not found in shadowRoot`);
              }
            }
          });

          counterStatus =
            failures.length === 0 ? 'All counters rendered correctly' : failures.join('; ');
        }
      } catch (error) {
        counterStatus = `Error checking app-counter: ${error}`;
      }

      // Test for custom element definition errors
      let definitionStatus = 'Not checked';
      try {
        // Check if our custom elements are properly defined
        const appRootDefined = customElements.get('app-root') !== undefined;
        const counterDefined = customElements.get('app-counter') !== undefined;

        definitionStatus = `Custom elements defined - app-root: ${appRootDefined}, app-counter: ${counterDefined}`;
      } catch (error) {
        definitionStatus = `Error checking custom element definitions: ${error}`;
      }

      // Check for lifecycle errors in web components
      let lifecycleStatus = 'Not checked';
      try {
        // Create a new component to test lifecycle methods
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);

        const tempComponent = document.createElement('app-counter');
        tempComponent.setAttribute('count', '0');
        tempComponent.setAttribute('label', 'Test');

        let error = null;
        try {
          tempDiv.appendChild(tempComponent);
          // Check if it rendered
          const shadowRoot = tempComponent.shadowRoot;
          if (!shadowRoot || !shadowRoot.querySelector('button')) {
            error = 'Component failed to render properly';
          }

          // Try updating an attribute
          tempComponent.setAttribute('count', '1');
        } catch (e) {
          error = e;
        } finally {
          // Clean up
          tempDiv.remove();
        }

        lifecycleStatus = error
          ? `Lifecycle error: ${error}`
          : 'Lifecycle methods working correctly';
      } catch (error) {
        lifecycleStatus = `Error in lifecycle test: ${error}`;
      }

      return {
        appRootStatus,
        counterStatus,
        definitionStatus,
        lifecycleStatus,
      };
    });

    console.log('Web Component Diagnostics:', webComponentDiagnostic);

    // Test actual interaction to see if there are any runtime errors
    try {
      const counterButton = await $('pierce/app-counter button');
      if (await counterButton.isExisting()) {
        console.log('Found counter button, trying to click it...');
        await counterButton.click();
        console.log('Button clicked successfully');

        // Check if any errors were generated by the click
        const errorsAfterClick = await browser.execute(() => {
          // @ts-ignore - custom property
          return {
            consoleErrors: window.__console_errors || [],
            consoleWarnings: window.__console_warnings || [],
            unhandledErrors: window.__unhandledErrors || [],
            customElementErrors: window.__customElementErrors || [],
          };
        });

        console.log('Errors after clicking:', errorsAfterClick.consoleErrors);
        console.log('Warnings after clicking:', errorsAfterClick.consoleWarnings);
        console.log('Unhandled errors after clicking:', errorsAfterClick.unhandledErrors);
        console.log('Custom element errors after clicking:', errorsAfterClick.customElementErrors);
      } else {
        console.log('Counter button not found, cannot test interaction');
      }
    } catch (error) {
      console.error('Error during interaction test:', error);
    }
  });
});
