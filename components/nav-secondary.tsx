// components/nav-secondary.tsx
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import type { LucideIcon } from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: React.ReactNode;
}

interface NavSecondaryProps extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  items: NavItem[];
}

export function NavSecondary({ items, ...props }: NavSecondaryProps) {
  const path = usePathname();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(({ title, url, icon: Icon, badge }) => (
            <SidebarMenuItem key={title}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "bg-transparent hover:bg-blue-300 dark:bg-transparent active:bg-blue-400 dark:hover:bg-blue-200/20 dark:active:bg-blue-200/30",
                  path === url && "dark:bg-blue-200/15 bg-blue-300/70"
                )}
              >
                <Link href={url}>
                  <Icon />
                  <span>{title}</span>
                </Link>
              </SidebarMenuButton>
              {badge && <SidebarMenuBadge>{badge}</SidebarMenuBadge>}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
