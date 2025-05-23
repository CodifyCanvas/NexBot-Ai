'use client';

import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TextareaAutosize from 'react-textarea-autosize';
import { Send } from 'lucide-react';

import Spinner from './Spinner';

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
  const updateChatDataWithHistory = (msg: { message: string; sender: 'user' | 'bot' }) => {
    updateChatData?.(msg); // Update external UI
    setChatHistory((prev) => {
      const updated = [...prev, msg];
      return updated.slice(-5); // Keep only last 5 messages
    });
  };

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id as number);
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
      updateChatDataWithHistory({ message: trimmed, sender: 'user' });

      // Send the message to the /ask API to get the bot's response
      const botRes = await fetch(`/api/chat/${chatId}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, chatHistory }),
      });

      const { message: botReply } = await botRes.json();

      // Update UI + local state with bot message
      updateChatDataWithHistory({ message: botReply, sender: 'bot' });

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
          className="relative flex items-end gap-1 sm:gap-3 w-full rounded-lg md:rounded-4xl bg-[#202124] px-2 sm:px-4 py-2 border border-white/90 shadow-md"
        >
          <TextareaAutosize
            minRows={1}
            maxRows={5}
            autoFocus={focus}
            placeholder="Got a question? Ask Nexbot anything!"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e);
            }}
            className="flex-1 bg-transparent resize-none text-white px-2 py-2 placeholder-gray-400 text-sm sm:text-base focus:outline-none"
          />

          <button
            type="submit"
            disabled={!message.trim()}
            className={`p-2 rounded-lg transition-colors ${
              message.trim()
                ? 'bg-white/10 text-white hover:bg-gradient-to-r hover:from-[var(--color-peach)] hover:to-[var(--color-purple)]'
                : 'text-gray-600'
            }`}
          >
            {isLoading ? <Spinner variant="gradient" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
      <p className="text-xs text-center mt-2 text-gray-400">
        🤖 Info may be off — verify to be safe.
      </p>
    </div>
  );
}
