'use client'; // Mark as client-side component

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner'; // ✅ Toast for user-friendly error messages

// UI Components
import ChatCard from '@/components/custom/ChatCard';
import ChatFallback from '@/components/Skeletons/ChatFallback';
import ChatInput from '@/components/custom/ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';

// Message type definition
interface Message {
  message: string;
  sender: 'user' | 'bot';
}

export default function ChatClient() {
  const { chatId } = useParams<{ chatId: string }>(); // Get chatId from route
  const [chatData, setChatData] = useState<Message[]>([]); // Chat messages
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter(); // For redirecting if error occurs

  // Fetch chat messages on component mount
  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/${chatId}/messages`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();

        // ✅ Successful fetch
        if (res.ok && data) {
          setChatData(data);
        } else {
          // 🔔 Handle different response status codes with toast
          switch (res.status) {
            case 404:
              toast.warning('📭 Conversation not found.', { richColors: true });
              break;
            case 403:
              toast.warning('🔒 This conversation is private.', { richColors: true });
              break;
            case 500:
            default:
              toast.error('❌ Something went wrong. Please try again later.', { richColors: true });
              break;
          }

          console.warn(`Fetch error [${res.status}]:`, data?.error || 'Unknown error');
          router.push('/chat'); // Redirect to chat list on failure
        }
      } catch (err) {
        // 🛑 Fallback on unexpected fetch errors
        toast.error('❌ Failed to load messages.');
        console.error('Message load error:', err);
      }
    };

    fetchMessages();
  }, [chatId]);

  // Add new message to chat state
  const updateChatData = (newMessage: Message) => {
    setChatData((prev) => [...prev, newMessage]);
  };

  // Update loading state from child component
  const setLoadingFunc = (state: boolean) => {
    setLoading(state);
  };

  return (
    <div className="w-full relative h-full flex flex-col justify-start gap-2">
      {/* Scrollable area for chat messages */}
      <ScrollArea className="w-full" style={{ height: 'calc(100vh - 125px)' }}>
        <div className="max-w-3xl mx-auto mb-20 px-0 sm:px-2">
          <ChatCard messages={chatData} />
          {loading && <ChatFallback />} {/* Show typing indicator if loading */}
        </div>
      </ScrollArea>

      {/* Chat input bar fixed at bottom */}
      <div className="absolute bottom-1 flex w-full justify-center px-3">
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
