'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { NavChat } from '../nav-chats'
import { onChatsRefresh } from '@/lib/chat-refresh'
import { Chat } from '@/lib/definations'
import Spinner from './Spinner'

export default function Chats() {
  const [chats, setChats] = useState<Chat[]>([])
  const [favorites, setFavorites] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const firstLoad = useRef(true)

  const loadChats = async (showSpinner = false) => {
    if (showSpinner) setIsLoading(true)

    try {
      const [chatsRes, favoritesRes] = await Promise.all([
        fetch('/api/chats', { cache: 'no-store' }),
        fetch('/api/chats/favorites', { cache: 'no-store' }),
      ])

      const [chatsData, favoritesData] = await Promise.all([
        chatsRes.json(),
        favoritesRes.json(),
      ])

      setChats(chatsData)
      setFavorites(favoritesData)
    } catch (error) {
      console.error('Failed to load chats:', error)
    } finally {
      if (showSpinner) setIsLoading(false)
    }
  }

  // On mount: load with spinner
  useEffect(() => {
    loadChats(true)
    firstLoad.current = false
  }, [])

  // On pathname change: reload silently without spinner
  useEffect(() => {
    if (!firstLoad.current) {
      loadChats(false)
    }
  }, [pathname])

  // On custom refresh: reload silently without spinner
  useEffect(() => {
    const unsubscribe = onChatsRefresh(() => loadChats(false))
    return unsubscribe
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-1 items-start mt-10 justify-center">
        <div className="scale-125">
          <Spinner variant="gradient" />
        </div>
      </div>
    )
  }

  return (
    <>
      {favorites.length > 0 && (
        <NavChat label="Favorites" chats={favorites} />
      )}
      <NavChat label="All Chats" chats={chats} favorites={favorites} />
    </>
  )
}
