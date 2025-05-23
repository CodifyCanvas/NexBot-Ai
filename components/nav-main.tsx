"use client";

import { type LucideIcon } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = useCallback(
    (url: string) => {
      if (url !== pathname) {
        router.push(url);
      }
    },
    [pathname, router]
  );

  return (
    <SidebarMenu>
      {items.map(({ title, url, icon: Icon }) => {

        return (
          <SidebarMenuItem key={title}>
            <SidebarMenuButton asChild isActive={pathname === url}>
              <button onClick={() => handleNavigation(url)}>
                <Icon />
                <span>{title}</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
