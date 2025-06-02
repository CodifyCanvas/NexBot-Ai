'use client';

import { UserProvider } from '@/hooks/context/userContext';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';

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
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/admin');
        if (!res.ok) {
          setIsAdmin(false);
          return;
        }
        const data = await res.json();
        setIsAdmin(data.admin === true);
      } catch {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  if (!mounted || isAdmin === null) {
    return (
      <div className="w-screen h-screen flex justify-center items-center radial-center-gradient-bg-dark">
        <div className="scale-200">
          <Spinner variant="blue-gradient" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <NotFound />;
  }

  return (
    <SidebarProvider className="relative min-h-screen">
      {/* Gradient Background */}
      {!mounted && <div className="fixed inset-0 -z-10 bg-slate-950" />}
      {mounted && (
        <div
          className={cn(
            'fixed inset-0 -z-10',
            theme === 'dark'
              ? 'radial-center-gradient-bg-dark'
              : 'radial-center-gradient-bg-light'
          )}
        />
      )}
      <UserProvider>
        <SidebarInset className="bg-transparent">
          <header className="flex h-14 items-center gap-2 border-b dark:border-white/25 border-black/15 px-3">
            <Separator orientation="vertical" className="mr-2 h-4" />
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

          <div className="flex-1 flex flex-col">{children}</div>
        </SidebarInset>
      </UserProvider>
    </SidebarProvider>
  );
}
