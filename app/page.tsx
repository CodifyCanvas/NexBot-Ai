import { ModeToggle } from "@/components/ui/Mode-Toggle";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NexBot",
  description: "AI-Powered Chatbot",
};

export default function Home() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <ModeToggle />
    </div>
  );
}
