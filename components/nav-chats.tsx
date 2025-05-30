"use client"

import {
  ArrowUpRight,
  CircleCheck,
  CircleX,
  Link2,
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import Link from "next/link"
import { toast } from "sonner"
import { refreshChats } from "@/lib/chat-refresh"
import ShareChat from "./custom/ShareChat"
import ConfirmationDialog from "./custom/AlertDialog"
import { Chat } from "@/lib/definations"
import { cn, getBgColorClass } from "@/lib/utils"
import { Separator } from "./ui/separator"
import { usePathname } from "next/navigation"

interface NavChatProps {
  chats: Chat[]
  label: string
  favoriteList?: Chat[]
  showActive?: boolean
}

export function NavChat({ chats, label, favoriteList = [], showActive }: NavChatProps) {
  const { isMobile } = useSidebar()
  const path = usePathname()

  const isInFavorites = (chatId: string) =>
    favoriteList.some(chat => chat.chatId === chatId)


  const handleFavoriteToggle = async (chatId: string, add: boolean) => {
    try {
      const res = await fetch(`/api/chat/${chatId}/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: add }),
      })

      const result = await res.json()

      if (res.ok) {
        toast.custom(
        (id) => (
          <div
            className="isolate p-4 w-80 bg-green-300/50 dark:bg-green-300/20 backdrop-blur-2xl shadow-lg md:outline-1 outline-white/20 border dark:border-none border-black/10 md:rounded-md flex items-center gap-2"
          >
            <Star size={17} className='text-green-800 dark:text-green-300'/> {/* Icon */}
            <span className="font-semibold text-sm whitespace-nowrap overflow-hidden text-green-800 dark:text-green-300 text-ellipsis">
              {result.message}
            </span>
          </div>
        ),
        {
          position: 'top-center',
        }
      );
        refreshChats()
      } else {
        toast.error(result.error || "Could not update favorites", {
          richColors: true,
          icon: <Star size={17} />,
        })
      }
    } catch (error) {
      console.error("Favorite update failed:", error)
      toast.error("Something went wrong", {
        richColors: true,
        icon: <Star size={17} />,
      })
    }
  }

  const handleDelete = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chat/${chatId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      const result = await res.json()

      if (res.ok) {
        toast.custom(
        (id) => (
          <div
            className="isolate p-4 w-80 bg-green-300/50 dark:bg-green-300/20 backdrop-blur-2xl shadow-lg md:outline-1 outline-white/20 border dark:border-none border-black/10 md:rounded-md flex items-center gap-2"
          >
            <CircleCheck size={17} className='text-green-800 dark:text-green-300'/> {/* Icon */}
            <span className="font-semibold text-sm whitespace-nowrap overflow-hidden text-green-800 dark:text-green-300 text-ellipsis">
              Chat deleted
            </span>
          </div>
        ),
        {
          position: 'top-center',
        }
      );
        refreshChats()
      } else {
        toast.error(result.message || "Failed to delete chat", {
          richColors: true,
        })
      }
    } catch (error) {
      console.error("Chat delete failed:", error)
      toast.error("Something went wrong", { richColors: true })
    }
  }

  const handleCopyLink = async (chatId: string) => {
    const url = `${window.location.origin}/chat/${chatId}`
    try {
      await navigator.clipboard.writeText(url)
      toast.custom(
        (id) => (
          <div
            className="isolate p-4 w-80 bg-green-300/50 dark:bg-green-300/20 backdrop-blur-2xl shadow-lg md:outline-1 outline-white/20 border dark:border-none border-black/10 md:rounded-md flex items-center gap-2"
          >
            <Link2 size={17} className='text-green-800 dark:text-green-300'/> {/* Icon */}
            <span className="font-semibold text-sm whitespace-nowrap overflow-hidden text-green-800 dark:text-green-300 text-ellipsis">
              Link copied!
            </span>
          </div>
        ),
        {
          position: 'top-center',
        }
      );
    } catch (error) {
      console.error("Copy failed:", error)
      toast.error("Failed to copy link", {
        richColors: true,
        position: "top-center",
        icon: <Link2 size={20} />,
      })
    }
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex justify-between">
        <span>{label}</span>
        <span>{chats.length > 99 ? "99+" : chats.length}</span>
      </SidebarGroupLabel>

      <SidebarMenu>
        {chats.length > 0 ? (
          chats.map((chat, idx) => {
            const isFavorite = isInFavorites(chat.chatId)

            return (
              <SidebarMenuItem key={idx} >
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "bg-transparent hover:bg-blue-300 dark:bg-transparent active:bg-blue-400 dark:hover:bg-blue-200/20 dark:active:bg-blue-200/30",
                    showActive && path === `/chat/${chat.chatId}` && "dark:bg-blue-200/15 bg-blue-300/70"
                  )}
                >

                  <Link href={`/chat/${chat.chatId}`}>
                    {/* <div className={cn(`w-1 min-h-full rounded-4xl ${getBgColorClass(chat?.color ? chat.color : 0)}`)} /> */}
                    <Separator
                      orientation="vertical"
                      className={`data-[orientation=vertical]:h-full min-w-1 rounded-4xl ${getBgColorClass(chat?.color ? chat.color : 0)}`}
                    />
                    <span className="pl-2">{chat.title}</span>
                  </Link>
                </SidebarMenuButton>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More options</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-56 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    {/* Favorites logic */}
                    {label === "Favorites" ? (
                      <>
                        <DropdownMenuItem onClick={() => handleFavoriteToggle(chat.chatId, false)}>
                          <StarOff className="text-muted-foreground" />
                          <span>Remove from Favorites</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    ) : (
                      // Only show "Add to Favorites" if not already favorited
                      !isFavorite && (
                        <>
                          <DropdownMenuItem onClick={() => handleFavoriteToggle(chat.chatId, true)}>
                            <Star className="text-muted-foreground" />
                            <span>Add to Favorites</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )
                    )}

                    {/* Share Chat */}
                    <DropdownMenuItem onSelect={e => e.preventDefault()}>
                      <ShareChat chatId={chat.chatId} isShareable={chat.isShareable} />
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Copy link */}
                    <DropdownMenuItem onClick={() => handleCopyLink(chat.chatId)}>
                      <LinkIcon className="text-muted-foreground" />
                      <span>Copy Link</span>
                    </DropdownMenuItem>

                    {/* Open in new tab */}
                    <Link href={`/chat/${chat.chatId}`} target="_blank" className="w-full">
                      <DropdownMenuItem>
                        <ArrowUpRight className="text-muted-foreground" />
                        <span>Open in New Tab</span>
                      </DropdownMenuItem>
                    </Link>

                    <DropdownMenuSeparator />

                    {/* Delete */}
                    <DropdownMenuItem onSelect={e => e.preventDefault()} className="w-full" variant="destructive">
                      <ConfirmationDialog
                        onConfirm={() => handleDelete(chat.chatId)}
                        title="Delete Chat"
                        description="This action is permanent. Are you sure?"
                        confirmButtonLabel="Yes, Delete"
                        confirmButtonClassName="danger_button"
                      >
                        <div className="flex items-center gap-2">
                          <Trash2 className="text-destructive" size={17} />
                          <span>Delete</span>
                        </div>
                      </ConfirmationDialog>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center text-muted-foreground">
            <CircleX size={48} className="text-gray-400" />
            <p className="mt-2 text-sm font-medium">No chats found</p>
            <span className="text-xs text-gray-500">
              Start a new conversation to see it here.
            </span>
          </div>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
