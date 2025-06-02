'use client';

import React from 'react';
import Link from 'next/link';
import { Search, SquareArrowOutUpRight, Star } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { ChatResult } from '@/lib/definations';


interface SearchChatCardProps {
  searchChats: ChatResult[];
}

const formatDateHeading = (date: Date) => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'dd MMM');
};

const groupChatsByDate = (chats: ChatResult[]) => {
  const grouped: { [date: string]: ChatResult[] } = {};

  chats.forEach((chat) => {
    const created = chat.createdAt ? new Date(chat.createdAt) : new Date();
    const dateKey = formatDateHeading(created);

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push(chat);
  });

  return grouped;
};

const SearchChatCard: React.FC<SearchChatCardProps> = ({ searchChats }) => {
  if (searchChats.length === 0) {
    return (
      <p className="text-neutral-400 px-4 flex flex-row gap-2 items-center">
        <Search size={17} />
        No Result
      </p>
    );
  }

  const groupedChats = groupChatsByDate(searchChats);

  return (
    <>
      {Object.entries(groupedChats).map(([date, chats]) => (
        <div key={date} className="p-0 scale-80 sm:scale-100">
          <div className="text-sm text-gray-400 font-medium px-3 mb-1">{date}</div>
          {chats.map((chat) => (
            <Link
              href={`/chat/${chat.chatId}`}
              key={chat.chatId}
              className="flex flex-row gap-2 px-0 sm:px-3 py-2 rounded-md dark:hover:bg-blue-500/50 hover:bg-blue-300/80 cursor-pointer no-underline"
            >
              {/* Colored indicator bar */}
              <div className="w-1 min-h-full rounded-4xl gradient" />
 
              {/* Main content */}
              <div className="flex flex-row items-center justify-between w-full">
                <div className="flex flex-col gap-0.5 overflow-hidden flex-1">
                  <div className=" dark:text-white font-semibold text-sm h-5 truncate">
                    {chat.chatTitle}
                  </div>
                </div>

                <div className="flex flex-row items-center justify-center gap-3">
                  {chat.favorite ? (
                    <Star size={17} className="text-yellow-500 fill-yellow-300" />
                  ) : (
                    <Star size={17} className="text-yellow-500" />
                  )}
                  <SquareArrowOutUpRight size={17} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </>
  );
};

export default SearchChatCard;
