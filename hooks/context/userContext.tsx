'use client';

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import useSWR from 'swr';
import { User } from '@/lib/definations';

// Define the shape of our context
interface UserContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  reset: () => void;
}

// Create the UserContext
const UserContext = createContext<UserContextType | undefined>(undefined);

// Props for the provider
interface UserProviderProps {
  children: ReactNode;
}

// Fetcher function used by SWR
const fetchUser = async (): Promise<User> => {
  const res = await fetch('/api/user', {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }

  return res.json();
};

// Context Provider Component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { data: user, error, isLoading, mutate } = useSWR<User>('/api/user', fetchUser);

  // Reset context state without refetching
  const reset = useCallback(() => {
    mutate(null, false);
  }, [mutate]);

  // Trigger a manual revalidation
  const refetch = useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <UserContext.Provider
      value={{
        user: user ?? null,
        loading: isLoading,
        error: error ?? null,
        refetch,
        reset,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook to consume UserContext
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }

  return context;
};
