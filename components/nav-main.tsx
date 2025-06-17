"use client";

import { Command, type LucideIcon } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  url: string;
  shortcutKey: string;
  icon: LucideIcon;
};

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map(({ title, url, shortcutKey, icon: Icon }) => {

        return (
          <SidebarMenuItem key={title} >
            <Link href={url}>
            <SidebarMenuButton asChild className={cn("bg-transparent hover:bg-blue-300 dark:bg-transparent active:bg-blue-400 dark:hover:bg-blue-200/20 dark:active:bg-blue-200/30", pathname === url && "dark:bg-blue-200/15 bg-blue-300/70")}>
              <button className="flex flex-row justify-between items-center">
                <div className="flex flex-row justify-start items-center gap-2">
                <Icon size={16} />
                <span>{title}</span>
                </div>
                <p className="text-slate-400 dark:text-slate-500 flex flex-row gap-1 items-center justify-end"><Command size={15} /><span>{shortcutKey}</span></p>
              </button>
            </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
