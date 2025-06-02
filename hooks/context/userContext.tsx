"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/lib/definations";

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  reset: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
  autoFetch?: boolean;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children, autoFetch = true }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/user", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const data: User = await response.json();
      setUser(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error(
            "🚧 Uh-oh! We ran into a glitch while loading your info. Please contact the developer if this keeps happening."
          )
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setUser(null);
    setLoading(false);
    setError(null);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchUser();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, refetch: fetchUser, reset }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using user context easily
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
