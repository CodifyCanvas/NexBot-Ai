// app/component/app-sidebar.tsx
"use client";

import * as React from "react";
import { Search, SquarePen, MessageCircleQuestion, UserLock } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import Chats from "./custom/Chats";
import useUser from "@/hooks/useUser";
import { navMain } from "@/constants/constants";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  const navSecondary = [
    ...(user?.admin
      ? [{ title: "Admin Dashboard", url: "/admin/dashboard", icon: UserLock }]
      : []),
    { title: "Help", url: "#", icon: MessageCircleQuestion },
  ];

  return (
    <Sidebar className="flex flex-col gap-2" variant="floating" {...props}>
      <SidebarHeader className="isolate bg-white/10 backdrop-blur-xl shadow-lg md:outline-1 outline-white/20 border dark:border-none border-black/10 md:rounded-md md:mb-2">
        <NavMain items={navMain} />
      </SidebarHeader>
      <SidebarContent className="isolate bg-white/10 backdrop-blur-xl shadow-lg md:outline-1 outline-white/20 border dark:border-none border-black/10 md:rounded-md md:mb-2 custom-scrollbar">
        <Chats />
      </SidebarContent>
      <NavSecondary items={navSecondary} className="isolate bg-white/10 backdrop-blur-xl shadow-lg md:outline-1 outline-white/20 border dark:border-none border-black/10 md:rounded-md mt-auto" />
      <SidebarRail />
    </Sidebar>
  );
}
