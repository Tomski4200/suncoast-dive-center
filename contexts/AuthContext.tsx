'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  joinedDate?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo (in production, this would connect to a real backend)
const MOCK_USERS: { [key: string]: { password: string; user: User } } = {
  'admin@suncoastdive.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@suncoastdive.com',
      name: 'Admin User',
      role: 'admin',
      joinedDate: '2023-01-01',
      lastLogin: new Date().toISOString()
    }
  },
  'user@example.com': {
    password: 'user123',
    user: {
      id: '2',
      email: 'user@example.com',
      name: 'John Diver',
      role: 'user',
      joinedDate: '2024-06-15',
      lastLogin: new Date().toISOString()
    }
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('suncoast-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUser = MOCK_USERS[email.toLowerCase()];
    
    if (!mockUser) {
      return { success: false, message: 'User not found' };
    }
    
    if (mockUser.password !== password) {
      return { success: false, message: 'Invalid password' };
    }
    
    const loggedInUser = {
      ...mockUser.user,
      lastLogin: new Date().toISOString()
    };
    
    setUser(loggedInUser);
    localStorage.setItem('suncoast-user', JSON.stringify(loggedInUser));
    
    return { success: true, message: 'Login successful!' };
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (MOCK_USERS[email.toLowerCase()]) {
      return { success: false, message: 'User already exists' };
    }
    
    // In a real app, this would save to a database
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user',
      joinedDate: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    MOCK_USERS[email.toLowerCase()] = {
      password,
      user: newUser
    };
    
    setUser(newUser);
    localStorage.setItem('suncoast-user', JSON.stringify(newUser));
    
    return { success: true, message: 'Registration successful!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('suncoast-user');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}