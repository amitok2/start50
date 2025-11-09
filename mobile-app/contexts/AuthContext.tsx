import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  full_name: string;
  password?: string; // Not exposed in context, only for storage
  role: 'user' | 'admin';
  user_type: 'member' | 'mentor' | 'instructor';
  is_approved_mentor: boolean;
  subscription_status: 'active' | 'inactive';
  subscription_type: 'trial' | 'paid' | null;
  subscription_plan: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  birth_date: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  image_url: string | null;
  created_date: string;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isSubscribed: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, full_name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  isUserAdmin: (user: User | null) => boolean;
  hasValidSubscription: (user: User | null) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@restart50_user';
const USERS_STORAGE_KEY = '@restart50_all_users';

// Admin emails
const ADMIN_EMAILS = ['marblodia@gmail.com', 'restartbestie50@gmail.com', 'admin@restart50.com'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Initialize - check if user is already logged in and create demo user if needed
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    // Create demo user if no users exist
    const users = await getAllUsers();
    if (users.length === 0) {
      await createDemoUser();
    }
    
    // Load current user
    await loadUser();
  };

  const createDemoUser = async () => {
    const demoUser: User = {
      id: 'demo-user-123',
      email: 'demo@restart50.com',
      full_name: 'שרה כהן - דמו',
      password: 'demo123',
      role: 'user',
      user_type: 'member',
      is_approved_mentor: false,
      subscription_status: 'active',
      subscription_type: 'trial',
      subscription_plan: 'trial',
      subscription_start_date: new Date().toISOString(),
      subscription_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      birth_date: null,
      phone: '050-1234567',
      location: 'תל אביב',
      bio: 'אישה יזמית בגיל 52, אוהבת אתגרים חדשים ולמידה מתמדת',
      image_url: null,
      created_date: new Date().toISOString(),
    };

    await saveAllUsers([demoUser]);
  };

  // Update subscription status when user changes
  useEffect(() => {
    if (currentUser) {
      setIsSubscribed(hasValidSubscription(currentUser));
    } else {
      setIsSubscribed(false);
    }
  }, [currentUser]);

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (userJson) {
        const user = JSON.parse(userJson);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllUsers = async (): Promise<User[]> => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Failed to load users:', error);
      return [];
    }
  };

  const saveAllUsers = async (users: User[]) => {
    try {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save users:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const users = await getAllUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      throw new Error('אימייל או סיסמה שגויים');
    }

    // Remove password from the stored user object
    const { password: _, ...userWithoutPassword } = user;
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
    setCurrentUser(userWithoutPassword);
  };

  const signup = async (email: string, password: string, full_name: string) => {
    const users = await getAllUsers();
    
    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      throw new Error('משתמש עם אימייל זה כבר קיים');
    }

    // Create new user with trial subscription
    const newUser: User = {
      id: Date.now().toString(),
      email,
      full_name,
      password, // Store password in users array for login
      role: 'user',
      user_type: 'member',
      is_approved_mentor: false,
      subscription_status: 'active',
      subscription_type: 'trial',
      subscription_plan: 'trial',
      subscription_start_date: new Date().toISOString(),
      subscription_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days trial
      birth_date: null,
      phone: null,
      location: null,
      bio: null,
      image_url: null,
      created_date: new Date().toISOString(),
    };

    users.push(newUser);
    await saveAllUsers(users);

    // Login the new user
    const { password: _, ...userWithoutPassword } = newUser;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
    setCurrentUser(userWithoutPassword);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setCurrentUser(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    
    // Update in current session
    setCurrentUser(updatedUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

    // Update in all users array
    const users = await getAllUsers();
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      await saveAllUsers(users);
    }
  };

  const isUserAdmin = (user: User | null): boolean => {
    if (!user) return false;
    return user.role === 'admin' || ADMIN_EMAILS.includes(user.email);
  };

  const hasValidSubscription = (user: User | null): boolean => {
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

  const value = {
    currentUser,
    isLoading,
    isSubscribed,
    login,
    signup,
    logout,
    updateUser,
    isUserAdmin,
    hasValidSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

