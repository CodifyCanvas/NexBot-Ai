"use client";

import { type LucideIcon } from "lucide-react";
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
  icon: LucideIcon;
};

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map(({ title, url, icon: Icon }) => {

        return (
          <SidebarMenuItem key={title} >
            <Link href={url}>
            <SidebarMenuButton asChild className={cn("bg-transparent hover:bg-blue-300 dark:bg-transparent active:bg-blue-400 dark:hover:bg-blue-200/20 dark:active:bg-blue-200/30", pathname === url && "dark:bg-blue-200/15 bg-blue-300/70")}>
              <button>
                <Icon />
                <span>{title}</span>
              </button>
            </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
