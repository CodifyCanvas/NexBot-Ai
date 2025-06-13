'use client';

import { ReactNode, useEffect, useState, useCallback } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

import { UserProvider } from '@/hooks/context/userContext';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';
import { Images, Names } from '@/constants/constants';
import { NavActions } from '@/components/nav-actions';
import NotFound from '../not-found';
import Spinner from '@/components/custom/Spinner';

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const { theme } = useTheme();

  const [isMounted, setIsMounted] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState<boolean | null>(null);

  // Flag to prevent rendering theme-dependent elements before mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Admin check using API call
  const fetchAdminStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/admin');

      if (!response.ok) {
        setIsUserAdmin(false);
        return;
      }

      const result = await response.json();
      setIsUserAdmin(result.admin === true);
    } catch {
      setIsUserAdmin(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminStatus();
  }, [fetchAdminStatus]);

  // Show loading spinner until mounted and admin check completes
  if (!isMounted || isUserAdmin === null) {
    return (
      <div className="w-screen h-screen flex justify-center items-center radial-center-gradient-bg-dark">
        <div className="scale-200">
          <Spinner variant="blue-gradient" />
        </div>
      </div>
    );
  }

  // Show 404 if user is not admin
  if (!isUserAdmin) {
    return <NotFound />;
  }

  return (
    <SidebarProvider className="relative min-h-screen">
      {/* Dynamic background gradient based on theme */}
      <div
        className={cn(
          'fixed inset-0 -z-10',
          isMounted
            ? theme === 'dark'
              ? 'radial-center-gradient-bg-dark'
              : 'radial-center-gradient-bg-light'
            : 'bg-slate-950'
        )}
      />

      <UserProvider>
        <SidebarInset className="bg-transparent">
          {/* Header Section */}
          <header className="flex h-14 items-center gap-2 border-b dark:border-white/25 border-black/15 px-3">
            <Separator orientation="vertical" className="mr-2 h-4" />

            {/* Logo and App Name */}
            <div className="flex items-center gap-2 z-10">
              <Link href="/chat" className="flex items-center gap-2 font-medium">
                <div className="flex size-6 items-center justify-center rounded-md">
                  <Image
                    src={Images.main_logo_transparent}
                    alt="Main Logo"
                    width={20}
                    height={20}
                  />
                </div>
                {Names.app_name}
              </Link>
            </div>

            {/* Navigation Actions (e.g., profile, theme toggle, etc.) */}
            <div className="ml-auto">
              <NavActions />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </SidebarInset>
      </UserProvider>
    </SidebarProvider>
  );
}
