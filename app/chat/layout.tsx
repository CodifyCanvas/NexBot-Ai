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
import { Images, Names } from '@/constants/constants';
import { UserProvider } from '@/hooks/context/userContext';
import { useShortcuts } from '@/hooks/useShortcuts';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {

  const { theme } = useTheme()

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useShortcuts();

  return (
    <SidebarProvider className="relative min-h-screen">
      {/* 🌈 Gradient Background */}
      {!mounted && (
        <div className="fixed inset-0 -z-10 bg-slate-950" />
      )}
      {mounted && (
        <div className={cn(
          "fixed inset-0 -z-10",
          theme === 'dark' ? 'radial-center-gradient-bg-dark' : 'radial-center-gradient-bg-light'
        )} />
      )}
      <UserProvider>

      {/* <div className="fixed inset-0 -z-10 bg-gradient-to-br from-yellow-300 via-green-400 to-blue-500" /> */}

      {/* Sidebar + Content */}
      <AppSidebar />
      <SidebarInset className='bg-transparent'>
        <header className="flex h-14 items-center gap-2 border-b dark:border-white/25 border-black/15 px-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger />
            </TooltipTrigger>
            <TooltipContent>Toggle Sidebar</TooltipContent>
          </Tooltip>
          <Separator  className="mr-2 h-4" />
          <div className="flex items-center gap-2 z-10">
            <Link href="/chat" className="flex items-center gap-2 font-medium">
              <div className="flex size-6 items-center justify-center rounded-md">
                <Image
                  src={Images.main_logo_transparent}
                  alt="main Logo"
                  width={20}
                  height={20}
                />
              </div>
              {Names.app_name}
            </Link>
          </div>

          <div className="ml-auto">
            <NavActions />
          </div>
        </header>

        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </SidebarInset>
      </UserProvider>
    </SidebarProvider>
  );
}


