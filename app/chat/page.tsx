// app/chat/page.tsx
"use client";

import ChatInput from "@/components/custom/ChatInput";
import WelcomeChatScreen from "@/components/custom/WelcomeChatScreen";

export default function Page() {

  return (
    <div className="flex flex-col w-full h-full bg-transparent relative transition-all duration-300">

      <div className="flex-1">
        <WelcomeChatScreen />
      </div>

      <div className="absolute bottom-1 flex w-full justify-center">
        <div className="w-full max-w-3xl pb-3 px-1 sm:px-3">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}


