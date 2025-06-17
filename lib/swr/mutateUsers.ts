'use client';

import { mutate } from 'swr';

// Call this function anywhere to revalidate the user table data
export function refetchUsers() {
  mutate('/api/user/all');
}

export function refetchContactMessages() {
  mutate('/api/contact');
}

export function fetchFavoriteStatus() {
  mutate('/api/chats/favorites');
}
