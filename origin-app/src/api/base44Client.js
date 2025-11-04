import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "685fd9b880a026fd49791736", 
  requiresAuth: true // Ensure authentication is required for all operations
});
