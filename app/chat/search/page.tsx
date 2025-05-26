import SearchBox from '@/components/custom/SearchBox'
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react'

export const metadata: Metadata = {
  title: "NexBot - Search",
  description: "Search for conversations and messages",
  icons: {
    icon: "/assets/images/main_logo.png",
  },
};

const SearchPage = () => {
  return (
    <div className='flex h-full w-full justify-center flex-col items-center p-2 realtive gap-6 z-20'>
      <div className='flex flex-col items-center justify-center gap-2 text-center z-20'>
       <h1 className='text-3xl text-white'>Find the Right Chat, Right Away</h1>
       <p className='text-md text-neutral-400'>No more endless scrolling—search and discover messages instantly.</p>
      </div>
      <Image
              src="/assets/images/chat_background.png"
              alt="background"
              fill
              className="absolute inset-0 z-0 object-cover opacity-30"
            />

      <SearchBox />
    </div>
  )
}

export default SearchPage