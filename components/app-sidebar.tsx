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
    <Sidebar className="flex flex-col gap-2" variant="floating" {...props} >
      <SidebarHeader className="bg-neutral-900 md:bg-neutral-800/70 md:rounded-md md:mb-2">
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent className="bg-neutral-900 md:bg-neutral-800/70 md:rounded-md md:mb-2 custom-scrollbar">
        <Chats />
      </SidebarContent>
      <NavSecondary items={data.navSecondary} className="bg-neutral-900 md:bg-neutral-800/70 md:rounded-md mt-auto" />
      <SidebarRail />
    </Sidebar>
  )
}
