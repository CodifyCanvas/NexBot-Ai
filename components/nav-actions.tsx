'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Link,
  Link2,
  LogOut,
  Star,
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
import { ModeToggle } from './ui/Mode-Toggle';
import { useUserContext } from '@/hooks/context/userContext';
import {
  ChatDateSkeleton,
  ProfileSkeleton,
  ToggleFavoriteSkeleton,
} from './Skeletons/NavActionFallbacks';

export function NavActions() {
  const { chatId } = useParams() as { chatId?: string };
  const router = useRouter();
  const { user, loading: isUserLoading, error: userError } = useUserContext();

  const [isFavorite, setIsFavorite] = useState(false);
  const [chatDetails, setChatDetails] = useState<Chat | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch list of favorite chats and check current chat
  const fetchFavoriteStatus = async () => {
    try {
      const res = await fetch('/api/chats/favorites');
      const data = await res.json();
      const favoriteIds = (data || []).map((c: Chat) => c.chatId.toString());
      setIsFavorite(chatId ? favoriteIds.includes(chatId) : false);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  // Fetch chat details including creator (owner) ID
  const fetchChatDetails = async () => {
    try {
      setIsChatLoading(true);
      const res = await fetch(`/api/chat/${chatId}`);
      const data = await res.json();
      setChatDetails(data);
    } catch (error) {
      console.error('Failed to load chat details:', error);
      setChatDetails(null);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Toggle favorite state
  const handleToggleFavorite = async () => {
    if (!chatId) return;

    const newState = !isFavorite;
    setIsFavorite(newState);

    try {
      const res = await fetch(`/api/chat/${chatId}/favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: newState }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.custom(() => (
          <div className="isolate p-4 w-80 bg-green-300/50 dark:bg-green-300/20 backdrop-blur-2xl shadow-lg md:outline-1 outline-white/20 border dark:border-none border-black/10 md:rounded-md flex items-center gap-2">
            <Star size={17} className="text-green-800 dark:text-green-300" />
            <span className="font-semibold text-sm text-green-800 dark:text-green-300">
              {result.message || 'Updated favorites'}
            </span>
          </div>
        ), { position: 'top-center' });
      } else {
        toast.error(result.error || 'Could not update favorites', {
          richColors: true,
          icon: <Star size={17} />,
        });
      }

      await fetchFavoriteStatus();
      refreshChats();
    } catch (err) {
      console.error('Favorite update failed:', err);
      toast.error('Something went wrong', {
        richColors: true,
        icon: <Star size={17} />,
      });
    }
  };

  // On load, fetch chat and favorite state
  useEffect(() => {
    if (chatId && user) {
      fetchFavoriteStatus();
      fetchChatDetails();
    }
  }, [chatId, user]);

  if (userError) return null;

  const handleCopyLink = async (chatId: string) => {
    const url = `${window.location.origin}/chat/${chatId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.custom(() => (
        <div className="isolate p-4 w-80 bg-green-300/50 dark:bg-green-300/20 backdrop-blur-2xl shadow-lg border dark:border-none border-black/10 md:rounded-md flex items-center gap-2">
          <Link2 size={17} className="text-green-800 dark:text-green-300" />
          <span className="font-semibold text-sm text-green-800 dark:text-green-300">Link copied!</span>
        </div>
      ), { position: 'top-center' });
    } catch (err) {
      console.error('Copy failed:', err);
      toast.error('Failed to copy link', {
        richColors: true,
        position: 'top-center',
        icon: <Link2 size={20} />,
      });
    }
  };

  const isOwner = user && chatDetails && user.id?.toString() === chatDetails.userId?.toString();

  return (
    <div className="flex items-center gap-2 text-sm">
      {chatId && (
        <>
          {isChatLoading ? (
            <ChatDateSkeleton />
          ) : chatDetails?.createdAt && (
            <div className="text-muted-foreground hidden md:inline-block mr-1">
              <Tooltip>
                <TooltipTrigger>
                  {new Date(chatDetails.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  }).replace(/ /g, '-')}
                </TooltipTrigger>
                <TooltipContent>Chat creation date</TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Favorite icon (only for owner) */}
          {isChatLoading ? (
            <ToggleFavoriteSkeleton />
          ) : isOwner ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  role="button"
                  onClick={handleToggleFavorite}
                  className="h-7 w-7 mr-2 flex items-center justify-center cursor-pointer hover:scale-125"
                >
                  <Star
                    className={cn(
                      'text-yellow-500',
                      isFavorite
                        ? 'h-5 w-5 fill-yellow-300 animate-pulse'
                        : 'h-4 w-4 fill-none'
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>{isFavorite ? 'Unfavorite' : 'Favorite'}</TooltipContent>
            </Tooltip>
          ) : null}
        </>
      )}

      <ModeToggle />

      {/* User menu */}
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          {isUserLoading || !user ? (
            <button className="h-8 w-8 rounded-full flex items-center justify-center">
              <ProfileSkeleton />
            </button>
          ) : (
            <button className="h-8 w-8 rounded-full flex items-center justify-center cursor-pointer">
              <Avatar>
                <AvatarImage src={user.profileImg} />
                <AvatarFallback className={getColorByLetter(user.name)}>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
          )}
        </PopoverTrigger>

        <PopoverContent className="w-56 p-0 isolate bg-white/10 backdrop-blur-xl shadow-lg outline-1 outline-white/20" align="end">
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              {user && (
                <SidebarGroup className="border-b">
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => router.push('/chat/profile')} className="hover:bg-blue-300 dark:hover:bg-blue-200/20">
                          <UserRound /> <span>Profile</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}

              {chatId && (
                <SidebarGroup className="-mt-2 border-b">
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => handleCopyLink(chatId)} className="hover:bg-blue-300 dark:hover:bg-blue-200/20">
                          <Link /> <span>Copy Link</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}

              {/* Logout */}
              <SidebarGroup>
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
                        <div className="w-full text-destructive flex items-center gap-1 cursor-pointer px-3 py-2 hover:bg-red-300/40 dark:hover:bg-red-400/25 dark:hover:text-red-500 rounded-md text-sm">
                          <LogOut size={17} /> <span>Log out</span>
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
