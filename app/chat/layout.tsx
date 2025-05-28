// app/chat/layout.tsx
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { NavActions } from '@/components/nav-actions';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@radix-ui/react-dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>

        <header className="flex h-14 shrink-0 items-center gap-2 border-white/25 border-b-1">
          <div className="flex flex-1 items-center gap-2 px-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarTrigger />
              </TooltipTrigger>
              <TooltipContent>Toggle Sidebar</TooltipContent>
            </Tooltip>

            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="flex justify-center gap-2 md:justify-start z-10">
              
                  <Link href="/chat" className="flex items-center gap-2 font-medium">
                    <div className="bg-none text-primary-foreground flex size-6 items-center justify-center rounded-md">
                      <Image
                        src="/assets/images/main_logo_transparent.png"
                        alt="main Logo"
                        width={20}
                        height={20}
                      />
                    </div>
                    NexBot
                  </Link>

            </div>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>

        {/* Main content area */}
        <div className="flex flex-1 flex-col gap-4 relative">
          <div className="mx-auto h-full w-full rounded-lg">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
