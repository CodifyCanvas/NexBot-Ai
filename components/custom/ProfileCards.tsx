"use client";

import React, { useState } from "react";
import { Card } from "../ui/card";
import { Lock, LockKeyhole, Trash2, UserRound } from "lucide-react";
import {
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import ProfileNameField from "./ProfileForm/ProfileNameField";
import ProfilePasswordField from "./ProfileForm/ProfilePasswordField";
import DeleteAllChats from "./ProfileForm/DeleteAllChats";
import DeleteAccountField from "./ProfileForm/DeleteAccount";
import { User } from "@/lib/definations";

interface ProfileCardsProps {
  user: User | null;
}

const ProfileCards: React.FC<ProfileCardsProps> = ({ user }) => {
    
  const [modalType, setModalType] = useState<
    "name" | "password" | "delete-all-chats" | "delete-account" | null
  >(null);

  const closeModal = () => setModalType(null);

  return (
    <>
      <Dialog open={modalType !== null} onOpenChange={closeModal}>
        <DialogContent className="isolate bg-white/50 dark:bg-white/10 backdrop-blur-xl shadow-lg md:outline-1 outline-white/20 border dark:border-none border-black/10">
          {modalType === "name" && <ProfileNameField onClose={closeModal} />}
          {modalType === "password" && <ProfilePasswordField onClose={closeModal} />}
          {modalType === "delete-all-chats" && <DeleteAllChats onClose={closeModal} />}
          {modalType === "delete-account" && <DeleteAccountField user={user} onClose={closeModal} />}
        </DialogContent>
      </Dialog>

      {/* Main UI */}
      <div className="flex flex-col gap-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row">
          <div className="flex flex-col gap-1 w-full">
            <h3 className="text-xl font-normal">Name</h3>
            <Card
              onClick={() => setModalType("name")}
              className="bg-white/10 font-thin isolate px-5 py-3 cursor-pointer rounded-full flex flex-row justify-between items-center"
            >
              <p className="font-thin">{user?.name}</p>
              <UserRound size={20} className="text-gray-400" />
            </Card>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <h3 className="text-xl font-normal">Email</h3>
            <Card className="bg-white/10 isolate px-5 py-3 rounded-full flex cursor-not-allowed flex-row justify-between items-center">
              <p className="font-thin">{user?.email}</p>
              <Lock size={20} className="text-gray-400" />
            </Card>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-5">
          <div className="flex flex-col gap-2 w-full">
            <Card
              onClick={() => setModalType("password")}
              className="bg-white/10 isolate px-5 py-5 rounded-3xl cursor-pointer flex flex-col"
            >
              <Card className="w-fit p-2 rounded-full bg-gradient-to-br from-blue-500 to-blue-900 outline-1">
                <LockKeyhole size={20} className="text-white" />
              </Card>
              <h3 className="text-xl font-normal mt-3">Change Password</h3>
            </Card>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Card
              onClick={() => setModalType("delete-all-chats")}
              className="bg-white/10 isolate px-5 py-5 rounded-3xl cursor-pointer flex flex-col"
            >
              <Card className="w-fit p-2 rounded-full bg-gradient-to-br from-blue-500 to-blue-900 outline-1">
                <Trash2 size={20} className="text-white" />
              </Card>
              <h3 className="text-xl font-normal mt-3">Delete All Chats</h3>
            </Card>
          </div>
        </div>

        <div>
          <div className="flex flex-col w-full">
            <Card
              onClick={() => setModalType("delete-account")}
              className="bg-white/10 isolate px-5 py-9 sm:py-6 cursor-pointer rounded-3xl flex flex-col"
            >
              <h3 className="text-xl font-normal">Delete account</h3>
              <p className="font-thin text-sm -mt-4">This action is not undoable</p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileCards;
