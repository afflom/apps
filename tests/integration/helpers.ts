/**
 * Helper functions for integration tests
 */

/**
 * Captures and returns all console logs of specified types
 * @param types Array of console types to capture ('log', 'info', 'warn', 'error')
 * @returns Promise resolving to array of console entries
 */
export async function captureConsoleLogs(types: string[] = ['error', 'warn']) {
  // Get the logs from the browser
  const logs = await browser.getLogs('browser');

  // Filter by specified types
  return logs.filter((log: any) => {
    const level = log.level || log.type || '';
    return types.includes(level as string);
  });
}

/**
 * Waits for the page to be fully loaded
 */
export async function waitForPageLoad() {
  await browser.waitUntil(
    async () => {
      const state = await browser.execute(() => document.readyState);
      return state === 'complete';
    },
    {
      timeout: 10000,
      timeoutMsg: 'Page did not finish loading',
    }
  );
}

/**
 * Checks if the PWA is registered
 */
export async function isPwaRegistered() {
  return browser.execute(() => {
    return navigator.serviceWorker.getRegistration().then((registration) => !!registration);
  });
}

/**
 * Adds a custom assertion to check for absence of console errors and warnings
 */
export function expectNoConsoleErrors() {
  const errors = browser.execute(() => {
    // @ts-ignore - custom property we're storing logs in
    return window.__console_errors || [];
  });

  expect(errors).toHaveLength(0);
}
