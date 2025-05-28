'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input } from '../ui/input';
import { X } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent, CardHeader } from '../ui/card';
import Spinner from './Spinner';
import SearchChatCard from './SearchChatCard';
import { ChatResult } from '@/lib/definations';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

const ChatSearchBox: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatResults, setChatResults] = useState<ChatResult[]>([]);

  const { open: sidebarOpen } = useSidebar();

  // Debounce search text
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedText(searchText.trim());
    }, 300);
    return () => clearTimeout(delay);
  }, [searchText]);

  // Fetch chat results
  const fetchChats = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/chat?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch chats');
      const data = await response.json();
      setChatResults(data);
    } catch (error) {
      console.error('Chat fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedText === '') {
      setChatResults([]);
      return;
    }
    fetchChats(debouncedText);
  }, [debouncedText, fetchChats]);

  const renderResults = useMemo(() => {
    if (isLoading) {
      return (
        <div className="w-full flex justify-center items-center">
          <Spinner variant="gradient" />
        </div>
      );
    }

    if (!debouncedText.trim()) return null;

    if (chatResults.length === 0) {
      return <p className="text-gray-500 text-sm text-center">No chats found.</p>;
    }

    return <SearchChatCard searchChats={chatResults} />;
  }, [isLoading, chatResults, debouncedText]);

  return (
    <Card
      className={cn(
        'bg-transparent relative border-2 w-full h-full md:h-auto z-10 rounded-4xl shadow-2xs shadow-pink-500 transition-all duration-300',
        searchText ? 'min-h-[24rem]' : 'h-24',
        sidebarOpen ? 'md:w-full' : 'md:w-2/3',
        'lg:w-2/3 xl:w-1/2'
      )}
    >
      <CardHeader className="flex items-center gap-2 px-7">
        <Input
          type="text"
          variant="minimal"
          placeholder="Search anything you've said or seen..."
          className="w-full min-h-10"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {searchText && (
          <X
            className="cursor-pointer text-gray-400 hover:text-white"
            onClick={() => setSearchText('')}
          />
        )}
      </CardHeader>

      {debouncedText && (
        <>
          <hr className="border-neutral-700" />
          <CardContent className="p-0 sm:p-2">
            <ScrollArea className="max-h-72 custom-scrollbar w-full rounded-md overflow-y-auto">
              <div className="sm:p-2 flex flex-col gap-1">{renderResults}</div>
            </ScrollArea>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default ChatSearchBox;
