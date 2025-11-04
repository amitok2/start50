import { createContext, useContext } from 'react';

export const UserContext = createContext({
  currentUser: null,
  isSubscribed: false,
  isLoadingUser: true,
  checkUserStatus: async () => {},
});

// A list of all official admin emails - Bloria confirmed marblodia@gmail.com is the primary.
const ADMIN_EMAILS = ['marblodia@gmail.com', 'restartbestie50@gmail.com'];

// Helper function to check if user is admin
export const isUserAdmin = (user) => {
  if (!user) return false;
  // Check if user's role is admin OR if their email is in the admin list
  return user.role === 'admin' || ADMIN_EMAILS.includes(user.email);
};

// Helper function to check if user has valid subscription
export const hasValidSubscription = (user) => {
  if (!user) return false;
  
  // Admins always have access
  if (isUserAdmin(user)) return true;
  
  // Check if subscription is active
  if (user.subscription_status !== 'active') return false;
  
  // Check if subscription end date has passed
  if (user.subscription_end_date) {
    const endDate = new Date(user.subscription_end_date);
    const now = new Date();
    if (endDate < now) {
      return false;
    }
  }
  
  return true;
};

export const useUser = () => useContext(UserContext);