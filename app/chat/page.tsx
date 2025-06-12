// app/chat/page.tsx
import ChatInput from "@/components/custom/ChatInput";
import WelcomeChatScreen from "@/components/custom/WelcomeChatScreen";
import { Metadata } from "next";

// Metadata for SEO and browser tab title
export const metadata: Metadata = {
  title: "New Chat — Start Smarter AI Conversations — NexBot",
  description:
    "Welcome to NexBot chat! Begin your AI-powered conversation, get instant responses, and unlock smarter, natural text-based interactions to boost your creativity and productivity.",
};

export default function ChatPage() {
  return (
    <div className="relative flex flex-col w-full h-full bg-transparent transition-all duration-300">
      {/* Main content area: user welcome screen */}
      <main className="flex-1">
        <WelcomeChatScreen />
      </main>

      {/* Chat input fixed at the bottom center */}
      <footer className="absolute bottom-1 left-0 right-0 flex justify-center">
        <div className="w-full max-w-3xl px-1 pb-3 sm:px-3">
          <ChatInput />
        </div>
      </footer>
    </div>
  );
}
