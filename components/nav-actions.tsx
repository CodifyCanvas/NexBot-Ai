'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import {
  Link,
  Link2,
  LogOut,
  Star,
  Trash,
  UserRound,
} from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import ConfirmationDialog from './custom/AlertDialog';
import { handleSignOut } from '@/app/login/authActions';
import { cn, getColorByLetter } from '@/lib/utils';
import { refreshChats } from '@/lib/chat-refresh';
import { Chat } from '@/lib/definations';
import { toast } from 'sonner';
import useUser from '@/hooks/useUser';

export function NavActions() {
  const { chatId } = useParams() as { chatId?: string };

  const { user, loading, error } = useUser();

  const [isFav, setIsFav] = React.useState(false);
  const [chatDate, setChatDate] = React.useState('');
  const [menuOpen, setMenuOpen] = React.useState(false);

  const loadFavStatus = async () => {
    const res = await fetch('/api/chats/favorites');
    const data = await res.json();
    const favIds = (data || []).map((c: Chat) => c.chatId.toString());
    setIsFav(chatId ? favIds.includes(chatId) : false);
  };

  const loadChatDate = async () => {
    const res = await fetch(`/api/chat/${chatId}`);
    const data = await res.json();
    setChatDate(data.createdAt || '');
  };

  const toggleFav = async () => {
  if (!chatId) return;

  const newState = !isFav;
  setIsFav(newState);

  try {
    const res = await fetch(`/api/chat/${chatId}/favorite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: newState }),
    });

    const result = await res.json();

    if (res.ok) {
      toast.success(result.message || 'Updated favorites', {
        richColors: true,
        position: 'top-center',
        icon: <Star size={17} />,
      });
    } else {
      toast.error(result.error || 'Could not update favorites', {
        richColors: true,
        icon: <Star size={17} />,
      });
    }

    await loadFavStatus();
    refreshChats();
  } catch (error) {
    console.error('Favorite update failed:', error);
    toast.error('Something went wrong', {
      richColors: true,
      icon: <Star size={17} />,
    });
  }
};

  React.useEffect(() => {
    if (chatId) {
      loadFavStatus();
      loadChatDate();
    }
  }, [chatId]);

  if (loading || !user) return null; // optional: add spinner
  if (error) {
    console.error(error);
    return (
      <div className="text-red-500 font-semibold animate-pulse">
        Failed to load user info. Try again later.
      </div>
    );
  }

  const handleCopyLink = async (chatId: string) => {
    const url = `${window.location.origin}/chat/${chatId}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied!", {
        richColors: true,
        position: "top-center",
        icon: <Link2 size={20} />,
      })
    } catch (error) {
      console.error("Copy failed:", error)
      toast.error("Failed to copy link", {
        richColors: true,
        position: "top-center",
        icon: <Link2 size={20} />,
      })
    }
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {chatId && (
        <>
          {chatDate && (
            <div className="text-muted-foreground hidden md:inline-block mr-1">
              <Tooltip>
                <TooltipTrigger>
                  {new Date(chatDate)
                    .toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                    .replace(/ /g, '-')}
                </TooltipTrigger>
                <TooltipContent>Chat creation date</TooltipContent>
              </Tooltip>
            </div>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <div
                role="button"
                onClick={toggleFav}
                className="h-7 w-7 mr-2 flex items-center justify-center cursor-pointer hover:scale-125"
              >
                <Star
                  className={cn(
                    'text-yellow-500',
                    isFav
                      ? 'h-5 w-5 fill-yellow-300 animate-pulse'
                      : 'h-4 w-4 fill-none'
                  )}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>{isFav ? 'Unfavorite' : 'Favorite'}</TooltipContent>
          </Tooltip>
        </>
      )}

      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            className='h-8 w-8 rounded-full flex items-center justify-center cursor-pointer'
          >
            <Avatar>
              <AvatarImage src={user.profileImg} />
              <AvatarFallback className={getColorByLetter(user.name)}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </AvatarFallback>
            </Avatar>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-56 p-0" align="end">
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              <SidebarGroup className="border-b">
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <UserRound /> <span>Profile</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              {chatId && 
              <SidebarGroup className="-mt-2 border-b">
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton onClick={() => handleCopyLink(chatId)}>
                        <Link /> <span>Copy Link</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup> }
              <SidebarGroup className="-mt-2"> 
  <SidebarGroupContent>
    <SidebarMenu>
      <SidebarMenuItem>
        <ConfirmationDialog
          title="Sign out?"
          description="You will be signed out of your NexBot account."
          confirmButtonLabel="Yes, Sign out"
          onConfirm={handleSignOut}
          confirmButtonClassName="danger_button"
        >
          <div className="w-full text-destructive flex items-center gap-1 cursor-pointer px-3 py-2 hover:bg-muted rounded-md text-sm">
            <LogOut size={17}/> <span>Log out</span>
          </div>
        </ConfirmationDialog>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroupContent>
</SidebarGroup>

            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  );
}
