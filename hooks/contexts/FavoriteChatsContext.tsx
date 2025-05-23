'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Chat {
  chatId: number;
  [key: string]: any;
}

interface FavoriteChatsContextType {
  favorites: Chat[];
  setFavorites: React.Dispatch<React.SetStateAction<Chat[]>>;
  fetchFavorites: () => Promise<void>;
}

const FavoriteChatsContext = createContext<FavoriteChatsContextType | null>(null);

export const useFavoriteChats = () => {
  const context = useContext(FavoriteChatsContext);
  if (!context) {
    throw new Error('useFavoriteChats must be used within a FavoriteChatsProvider');
  }
  return context;
};

export const FavoriteChatsProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<Chat[]>([]);

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/chats/favorites');
      const data = await res.json();
      setFavorites(data.chats || []);
    } catch (err) {
      console.error('Failed to fetch favorites', err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <FavoriteChatsContext.Provider value={{ favorites, setFavorites, fetchFavorites }}>
      {children}
    </FavoriteChatsContext.Provider>
  );
};
