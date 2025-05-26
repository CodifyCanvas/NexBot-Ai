"use client";

import Image from "next/image";
import ChatInput from "@/components/custom/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import useUser from "@/hooks/useUser";
import Spinner from "@/components/custom/Spinner";

export default function Page() {
  const { user, loading, error } = useUser(true);

  return (
    <div className="w-full relative h-full flex flex-col justify-start gap-2">
      <Image
        src="/assets/images/chat_background.png"
        alt="background"
        fill
        className="absolute inset-0 z-0 object-cover opacity-30"
      />

      <ScrollArea className="w-full relative" style={{ height: "calc(100vh - 125px)" }}>
        <div className="h-full max-w-3xl mx-auto mb-20 px-2">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <p className="bg-gradient-to-r from-[var(--color-peach)] to-[var(--color-purple)] bg-clip-text text-transparent font-semibold text-2xl text-center sm:text-3xl">
              {loading ? (
                <Spinner variant="gradient" />
              ) : error ? (
                <span>Error: {error.message}</span>
              ) : user ? (
                `Hello, ${user.name}`
              ) : (
                "Hello, Guest"
              )}
            </p>
          </div>
        </div>
      </ScrollArea>

      <div className="absolute bottom-1 flex w-full justify-center">
        <div className="w-full max-w-3xl pb-3">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
