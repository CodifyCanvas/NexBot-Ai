'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

// UI Components
import ChatCard from '@/components/custom/ChatCard';
import ChatFallback from '@/components/Skeletons/ChatFallback';
import ChatInput from '@/components/custom/ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import Spinner from './Spinner';

interface Message {
  message: string;
  sender: 'user' | 'bot';
  profileImg?: boolean; // optional if it might not always be included
}

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);      // For bot typing indicator
  const [isFetching, setIsFetching] = useState(true);     // For initial message fetch

  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      try {
        setIsFetching(true);

        const res = await fetch(`/api/chat/${chatId}/messages`);
        const data = await res.json();

        if (res.ok && data) {
          setMessages(data);
        } else {
          handleFetchError(res.status, data?.error);
          router.push('/chat');
        }

      } catch (error) {
        toast.error('❌ Unable to fetch messages.');
        console.error('Fetch error:', error);
      } finally {
        setIsFetching(false);
      }
    };

    loadMessages();
  }, [chatId, router]);

  const handleFetchError = (status: number, errorMsg?: string) => {
    const errors: Record<number, string> = {
      404: '📭 Chat not found.',
      403: '🔒 You don’t have access to this chat.',
      500: '❌ Server error. Please try again.',
    };

    toast.error(errors[status] || '❌ Something went wrong.', { richColors: true });
    console.warn(`Error [${status}]:`, errorMsg || 'Unknown error');
  };

  const addMessage = (newMsg: Message) => {
    setMessages(prev => [...prev, newMsg]);
  };

  return (
    <div className="w-full h-full relative flex flex-col gap-2">
      {isFetching ? (
        <div className="flex items-center justify-center h-full w-full">
          <div className="scale-200">
            <Spinner variant="blue-gradient" />
          </div>
        </div>
      ) : (
        <>
          <ScrollArea className="w-full" style={{ height: 'calc(100vh - 125px)' }}>
            <div className="max-w-3xl mx-auto mb-20 px-0 sm:px-2">
              <ChatCard messages={messages} />
              {isLoading && <ChatFallback />}
            </div>
          </ScrollArea>

          <div className="absolute bottom-1 flex w-full justify-center px-3">
            <div className="w-full max-w-3xl pb-3">
              <ChatInput
                focus={false}
                chatId={chatId}
                updateChatData={addMessage}
                loading={setIsLoading}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
