"use client";

import { type LucideIcon } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
          <SidebarMenuItem key={title}>
            <Link href={url}>
            <SidebarMenuButton asChild isActive={pathname === url}>
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
