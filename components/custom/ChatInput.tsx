'use client';

import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TextareaAutosize from 'react-textarea-autosize';
import { Send } from 'lucide-react';

import Spinner from './Spinner';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  chatId?: string;
  updateChatData?: (msg: { message: string; sender: 'user' | 'bot' }) => void;
  focus?: boolean;
  loading?: (state: boolean) => void;
}

export default function ChatInput({
  chatId: existingChatId,
  updateChatData,
  focus = true,
  loading,
}: ChatInputProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [chatHistory, setChatHistory] = useState<
    { message: string; sender: 'user' | 'bot' }[]
  >([]);

  // Used to update both UI and local chatHistory (last 5 messages)
  const updateChatDataWithHistory = (msg: { message: string; sender: 'user' | 'bot'; profileImg: boolean }) => {
    updateChatData?.(msg); // Update external UI
    setChatHistory((prev) => {
      const updated = [...prev, msg];
      return updated.slice(-5); // Keep only last 5 messages
    });
  };

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(Number(session.user.id));
    }
  }, [session]);

  const handleSubmit = async (e: FormEvent | KeyboardEvent) => {
    e.preventDefault?.();

    const trimmed = message.trim();
    if (!trimmed || !userId) return;
    
    try {
      setIsLoading(true);
      loading?.(true);

      let chatId = existingChatId;

      // If no existing chatId, create a new chat
      if (!chatId) {
        // Create a new chat id & title by sending a prompt to generate a title
        const chatRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Generate a short title for the following question, title must be less than 100 characters:\n"${trimmed}"`,
          }),
        });

        const { chatId: newChatId } = await chatRes.json();
        if (!chatRes.ok) throw new Error('Failed to create chat');
        chatId = newChatId; // Assign new chatId
      }

      // Update UI + local state when user enters a message
      updateChatDataWithHistory({ message: trimmed, sender: 'user', profileImg: true });

      // Send the message to the /ask API to get the bot's response
      const botRes = await fetch(`/api/chat/${chatId}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, chatHistory }),
      });

      const { message: botReply } = await botRes.json();

      // Update UI + local state with bot message
      updateChatDataWithHistory({ message: botReply, sender: 'bot', profileImg: true });

      // Redirect to chat route if it's a new chat
      if (!existingChatId) {
        router.push(`/chat/${chatId}`);
      }
      
      setMessage('');
    } catch (error) {
      console.error('Error in chat input:', error);
    } finally {
      setIsLoading(false);
      loading?.(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className={cn("isolate bg-white/80 backdrop-blur-xl md:outline-1 outline-black/10 dark:outline-white/20  dark:border-none border-black/10 relative flex gap-1 sm:gap-3 w-full rounded-md dark:bg-slate-900/80 px-2 sm:px-4 py-2 border shadow-lg", message.trim() ? 'items-end' : 'items-center')}
        >
          <TextareaAutosize
            minRows={1}
            maxRows={5}
            autoFocus={focus}
            placeholder="Got a question? Ask Nexbot anything!"
            value={message}
            id='chat-input'
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e);
            }}
            className="flex-1 custom-scrollbar bg-transparent resize-none text-black/85 dark:text-white px-2 py-2 placeholder-gray-400 text-sm  transition-all duration-300 sm:text-base focus:outline-none"
          />

          <button
            type="submit"
            disabled={!message.trim()}
            className={`p-2 rounded-lg transition-colors ${
              message.trim()
                ? 'isolate dark:bg-white/10 backdrop-blur-xl md:outline-1 outline-white/10 dark:text-white text-blue-500 hover:text-white transition-all duration-300 hover:bg-gradient-to-tr hover:from-blue-400 hover:to-blue-700'
                : 'text-gray-400 dark:text-gray-600'
            }`}
          >
            {isLoading ? <div className='scale-110'><Spinner variant="blue-gradient" /></div> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
      <p className="text-xs text-center mt-2 text-gray-600 dark:text-gray-400">
        🤖 Info may be off — verify to be safe.
      </p>
    </div>
  );
}
