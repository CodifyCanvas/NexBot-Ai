"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Link,
  LogOut,
  Star,
  Trash,
  UserRound,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import ConfirmationDialog from "./custom/AlertDialog";
import { handleSignOut } from "@/app/login/authActions";
import { cn, getColorByLetter } from "@/lib/utils";
import { refreshChats } from "@/lib/chat-refresh";

export function NavActions() {
  const { chatId } = useParams() as { chatId?: string };

  const [user, setUser] = React.useState({ name: "", profileImg: "", admin: false });
  const [isFav, setIsFav] = React.useState(false);
  const [chatDate, setChatDate] = React.useState("");
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Load user
  const loadUser = async () => {
    const res = await fetch("/api/user");
    const data = await res.json();
    setUser(data.user);
  };

  // Load favorite status
  const loadFavStatus = async () => {
    const res = await fetch("/api/chats/favorites", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
    const data = await res.json();
    const favIds = (data || []).map((c: any) => c.chatId.toString());
    setIsFav(chatId ? favIds.includes(chatId) : false);
  };

  // Load chat metadata
  const loadChatDate = async () => {
    const res = await fetch(`/api/chat/${chatId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
    const data = await res.json();
    setChatDate(data.createdAt || "");
  };

  // Toggle favorite
  const toggleFav = async () => {
    const newState = !isFav;
    setIsFav(newState);

    await fetch(`/api/chat/${chatId}/favorite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: newState }),
    });

    loadFavStatus(); // keep state fresh
    refreshChats();
  };

  // Load data on first render & chat change
  React.useEffect(() => {
    loadUser();
  }, []);

  React.useEffect(() => {
    if (chatId) {
      loadFavStatus();
      loadChatDate();
    }
  }, [chatId]);

  return (
    <div className="flex items-center gap-2 text-sm">
      {chatId && (
        <>
          {chatDate && (
            <div className="text-muted-foreground hidden md:inline-block mr-1">
              <Tooltip>
                <TooltipTrigger>
                  {new Date(chatDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).replace(/ /g, "-")}
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
                    "text-yellow-500",
                    isFav ? "h-5 w-5 fill-yellow-300 animate-pulse" : "h-4 w-4 fill-none"
                  )}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>{isFav ? "Unfavorite" : "Favorite"}</TooltipContent>
          </Tooltip>
        </>
      )}

      {/* User Avatar and Popover Menu */}
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <div
            role="button"
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center cursor-pointer",
              user.admin && "ring-3 ring-pink-700 ring-offset-1 p-2"
            )}
          >
            <Avatar>
              <AvatarImage src={user.profileImg} />
              <AvatarFallback className={getColorByLetter(user.name)}>
                {user.name?.charAt(0).toUpperCase() || "S"}
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

              <SidebarGroup className="-mt-2 border-b">
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <Link /> <span>Copy Link</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <Trash /> <span>Delete Chat</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <ConfirmationDialog
                title="Sign out?"
                description="You will be signed out of your NexBot account."
                confirmButtonLabel="Yes, Sign out"
                onConfirm={handleSignOut}
                confirmButtonClassName="danger_button"
              >
                <SidebarGroup className="-mt-2">
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton className="text-destructive">
                          <LogOut /> <span>Log out</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </ConfirmationDialog>
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  );
}
