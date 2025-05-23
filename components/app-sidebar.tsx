// app/component/app-sidebar.tsx
"use client"

import * as React from "react"
import {
  MessageCircleQuestion,
  Search,
  SquarePen,
} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Chats from "./custom/Chats"
import { refreshChats } from "@/lib/chat-refresh"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Search",
      url: "/chat/search",
      icon: Search,
    },
    {
      title: "New Chat",
      url: "/chat",
      icon: SquarePen,
    },
  ],
  navSecondary: [
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-1 border-white/25" {...props}>
      <SidebarHeader>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <Chats />
      </SidebarContent>
      <NavSecondary items={data.navSecondary} className="mt-auto" />
      <SidebarRail />
    </Sidebar>
  )
}
