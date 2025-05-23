"use client"

import {
  ArrowUpRight,
  Link as LinkIcon,
  MoreHorizontal,
  Star,
  StarOff,
  Trash2,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import Link from "next/link"
import { toast } from "sonner"
import { refreshChats } from "@/lib/chat-refresh"

interface NavChatProps {
  chats: {
    title: string
    chatId: string
  }[]
  label: string
  favorites?: {
    title: string
    chatId: string
  }[] // ✅ fixed: should be an array
}

export function NavChat({ chats, label, favorites = [] }: NavChatProps) {
  const { isMobile } = useSidebar()

  const isChatFavorited = (chatId: string) =>
    favorites?.some(fav => fav.chatId === chatId)

  async function toggleFavorite(chatId: string, value: boolean) {
    try {
      const res = await fetch(`/api/chat/${chatId}/favorite`, {
        method: "POST",
        body: JSON.stringify({ value }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await res.json()

      if (res.ok) {
        toast.success(result.message, { richColors: true })
        refreshChats()
      } else {
        toast.error(result.error || "Failed to update favorites", {
          richColors: true,
        })
      }
    } catch (error) {
      console.error("Favorite toggle failed", error)
      toast.error("Something went wrong", { richColors: true })
    }
  }

  async function onDelete(chatId: string) {
  try {
    const res = await fetch(`/api/chat/${chatId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Chat removed", { richColors: true });
      refreshChats();
    } else {
      toast.error(data.message || "Couldn't delete chat", { richColors: true });
    }
  } catch (err) {
    console.error("Delete Chat failed:", err);
    toast.error("Something broke", { richColors: true });
  }
}




  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex flex-row justify-between">
        <span>{label}</span>
        <span>{chats.length > 99 ? "99+" : chats.length}</span>
      </SidebarGroupLabel>
      <SidebarMenu>
        {chats.map((item, index) => {
          const isFavorite = isChatFavorited(item.chatId)

          return (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild>
                <Link href={`/chat/${item.chatId}`}>
                  <span className="pl-2">{item.title}</span>
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  {/* Only show remove if it's in Favorites list */}
                  {label === "Favorites" ? (
                    <>
                      <DropdownMenuItem onClick={() => toggleFavorite(item.chatId, false)}>
                        <StarOff className="text-muted-foreground" />
                        <span>Remove from Favorites</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  ) : (
                    // Only show "Add to Favorites" if not already favorited
                    !isFavorite && (
                      <>
                        <DropdownMenuItem onClick={() => toggleFavorite(item.chatId, true)}>
                          <Star className="text-muted-foreground" />
                          <span>Add to Favorites</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )
                  )}

                  <DropdownMenuItem
                    onClick={() => {
                      const chatUrl = `${window.location.origin}/chat/${item.chatId}`
                      navigator.clipboard
                        .writeText(chatUrl)
                        .then(() => {
                          toast.success("Link copied!", { richColors: true })
                        })
                        .catch((err) => {
                          console.error("Failed to copy link:", err)
                          toast.error("Couldn't copy link. Try again!", { richColors: true })
                        })
                    }}
                  >
                    <LinkIcon className="text-muted-foreground" />
                    <span>Copy Link</span>
                  </DropdownMenuItem>

                  <Link
                    href={`/chat/${item.chatId}`}
                    target="_blank"
                    className="w-full flex-1 align-middle gap-2"
                  >
                    <DropdownMenuItem>
                      <ArrowUpRight className="text-muted-foreground" />
                      <span>Open in New Tab</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => onDelete(item.chatId)}>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
