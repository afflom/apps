// Test stub file to check Claude pre-commit hook

export const formatCurrency = (amount: number): string => {
  // TODO: Implement proper formatting
  return '$' + amount; // Incomplete implementation
};

// Mock implementation for testing purposes
export const validateEmail = (email: string): boolean => {
  // FIXME: This is a simplistic check that isn't robust
  return email.includes('@');
};

export interface UserData {
  id: string;
  name: string;
  email: string;
}

export const fetchUserData = async (userId: string): Promise<UserData> => {
  // Stub implementation - returns hardcoded mock data
  // Fetch from API
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Return mock data instead of actually fetching
  return {
    id: userId,
    name: 'Test User',
    email: 'test@example.com',
  };
};

export const calculateTax = (subtotal: number): number => {
  /* This function should calculate tax based on:
   * - State tax rates
   * - Federal tax rates
   * - Special product categories
   * But for now we just use a flat rate
   */
  return subtotal * 0.0875; // Hardcoded tax rate
};
