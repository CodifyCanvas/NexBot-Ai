// app/components/custom/ProfileForm.tsx
"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import ProfileCards from "./ProfileCards";
import { Button } from "../ui/button";
import { Pen } from "lucide-react";
import { useUserContext } from "@/hooks/context/userContext";
import { cn, getColorByLetter } from "@/lib/utils";

const ProfileForm = () => {
    const { user } = useUserContext();
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row transition-all duration-300 items-center space-y-4">
        <div className="relative w-fit">
          {/* Avatar */}
          <Avatar className="w-36 h-36 sm:h-40 sm:w-40">
            <AvatarImage
              src={user?.profileImg || ""}
              alt="Profile Image"
            />
            <AvatarFallback className={cn(`text-9xl text-white font-normal`, getColorByLetter(user?.name || "A"))}>
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>

          {/* Change Image Button - outside bottom-right */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-0 right-0 z-10 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-blue-800  shadow"
            title="Change Image"
          >
            <Pen className="text-white" size={12} />
          </Button>
        </div>

        <div className="text-center transition-all duration-300 flex flex-col items-center sm:items-start gap-4 sm:pl-10 sm:-mt-4 mb-4 sm:mb-0">
          <p className="text-white/70 w-fit py-1 px-3 sm:py-2 text-sm sm:px-5 outline-1 outline-white/20 rounded-full">{user?.admin ? 'Admin' : 'Owner'}</p>
          <h2 className="text-3xl font-normal">{user?.name}</h2>
        </div>
      </div>

      <div>
        <ProfileCards  user={user} />
      </div>
    </div>
  );
};

export default ProfileForm;
