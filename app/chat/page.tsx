'use client';

import Image from 'next/image';
import ChatCard from '@/components/custom/ChatCard';
import ChatInput from '@/components/custom/ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';

const chatData = [
  { id: 1, message: 'Hello from Bot', sender: 'bot' },
  { id: 2, message: 'Hello from User', sender: 'user' },
  { id: 3, message: 'How can I assist you today?', sender: 'bot' },
  { id: 4, message: "I'm looking for help with a project.", sender: 'user' },
  {
    id: 5,
    message:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic nostrum ullam...',
    sender: 'bot',
  },
  { id: 6, message: 'It’s a web development project, focusing on JavaScript.', sender: 'user' },
  { id: 7, message: 'Sounds exciting! Do you need help with coding or concepts?', sender: 'bot' },
  { id: 8, message: "I'm having trouble with understanding closures.", sender: 'user' },
  { id: 9, message: 'Ah, closures! Let me explain...', sender: 'bot' },
  { id: 10, message: 'Thanks for the explanation! That makes more sense now.', sender: 'user' },
];

export default function Page() {
  return (
    <div className="w-full relative h-full flex flex-col justify-start gap-2">
      <Image
        src="/assets/images/chat_background.png"
        alt="background"
        fill
        className="absolute inset-0 z-0 object-cover opacity-30"
      />

      <ScrollArea className="w-full relative" style={{ height: 'calc(100vh - 125px)' }}>
        <div className="h-full max-w-3xl mx-auto mb-20 px-2">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <p className="bg-gradient-to-r from-[var(--color-peach)] to-[var(--color-purple)] bg-clip-text text-transparent font-semibold text-2xl text-center sm:text-3xl">
              Hello, Shahzaib Awan
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
