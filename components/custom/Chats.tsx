'use client'

// Import SWR for data fetching and React hooks
import useSWR from 'swr'
import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { NavChat } from '../nav-chats'
import { onChatsRefresh } from '@/lib/chat-refresh'
import { Chat } from '@/lib/definations'
import Spinner from './Spinner'

// Memoized fetcher function to be used by SWR to fetch data from given URL

export default function Chats() {
  const pathname = usePathname()
  
  const fetcher = useCallback((url: string) => fetch(url).then(res => res.json()), [])
  
  // SWR hook to fetch all chats; refreshes automatically
  const { data: chats, mutate: mutateChats, isLoading: isLoadingChats } = useSWR<Chat[]>('/api/chats', fetcher)

  // SWR hook to fetch favorite chats
  const { data: favorites, mutate: mutateFavorites, isLoading: isLoadingFavorites } = useSWR<Chat[]>('/api/chats/favorites', fetcher)

  // SWR provides a loading state
  const isLoading = isLoadingChats || isLoadingFavorites

  // On pathname change, revalidate data silently without spinner
  useEffect(() => {
    mutateChats()
    mutateFavorites()
  }, [pathname, mutateChats, mutateFavorites])

  // Subscribe to custom chat refresh events, trigger data reload silently
  useEffect(() => {
    const unsubscribe = onChatsRefresh(() => {
      mutateChats()
      mutateFavorites()
    })
    return unsubscribe
  }, [mutateChats, mutateFavorites])

  // Show loading spinner while fetching
  if (isLoading) {
    return (
      <div className="flex flex-1 items-start mt-10 justify-center">
        <div className="scale-125">
          <Spinner variant="blue-gradient" />
        </div>
      </div>
    )
  }

  // Render favorite chats if available, then all chats
  return (
    <>
      {favorites?.length > 0 && <NavChat label="Favorites" chats={favorites} />}
      <NavChat label="All Chats" chats={chats || []} favoriteList={favorites || []} showActive={true} />
    </>
  )
}
