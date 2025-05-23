'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner'; // ✅ Add toast

import ChatCard from '@/components/custom/ChatCard';
import ChatFallback from '@/components/custom/ChatFallback';
import ChatInput from '@/components/custom/ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  message: string;
  sender: 'user' | 'bot';
}

export default function ChatRoutePage() {
  const { chatId } = useParams<{ chatId: string }>();
  const [chatData, setChatData] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/${chatId}/messages`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await res.json();

        if (res.ok && data) {
          setChatData(data);
        } else {
          // 🔔 Toast Warnings Based on Status
          switch (res.status) {
            case 404:
              toast.warning('Unable to load conversation', {
                richColors: true
              });
              break;
            case 403:
              toast.warning('🔒 This conversation is private', {
                richColors: true
              });
              break;
            case 500:
            default:
              toast.error('❌ Something went wrong', {
                richColors: true
              });
              break;
          }
          console.error('Message fetch error:', data.error);
          router.push('/chat')

        }
      } catch (err) {
        toast.error('❌ Something went wrong');
        console.error('Failed to load messages:', err);
      }
    };

    fetchMessages();
  }, [chatId]);

  const updateChatData = (newMessage: Message) => {
    setChatData((prev) => [...prev, newMessage]);
  };

  const setLoadingFunc = (state: boolean) => {
    setLoading(state);
  };

  return (
    <div className="w-full relative h-full flex flex-col justify-start gap-2">
      <Image
        src="/assets/images/chat_background.png"
        alt="background"
        fill
        className="absolute inset-0 z-0 object-cover opacity-30"
      />

      <ScrollArea className="w-full" style={{ height: 'calc(100vh - 125px)' }}>
        <div className="max-w-3xl mx-auto mb-20 px-2">
          <ChatCard chat={chatData} />
          {loading && <ChatFallback />}
        </div>
      </ScrollArea>

      <div className="absolute bottom-1 flex w-full justify-center">
        <div className="w-full max-w-3xl pb-3">
          <ChatInput
            focus={false}
            chatId={chatId}
            updateChatData={updateChatData}
            loading={setLoadingFunc}
          />
        </div>
      </div>
    </div>
  );
}
