"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { NavChat } from "../nav-chats"
import { onChatsRefresh } from "@/lib/chat-refresh"

export default function Chats() {
  const [chats, setChats] = useState([])
  const [favorites, setFavorites] = useState([])
  const pathname = usePathname()

  const fetchChats = async () => {
    const [chatsRes, favoritesRes] = await Promise.all([
      fetch("/api/chats", { cache: "no-store" }),
      fetch("/api/chats/favorites", { cache: "no-store" }),
    ])
    setChats(await chatsRes.json())
    setFavorites(await favoritesRes.json())
  }

  useEffect(() => {
    fetchChats()
  }, [pathname])

  useEffect(() => {
    const unsubscribe = onChatsRefresh(() => {
      fetchChats()
    })
    return unsubscribe
  }, [])

  return (
    <>
      <NavChat label="Favorites" chats={favorites} />
      <NavChat label="All Chats" chats={chats} favorites={favorites} />
    </>
  )
}
