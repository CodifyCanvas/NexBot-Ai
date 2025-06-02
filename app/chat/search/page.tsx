// app/chat/search/page.tsx
import SearchBox from '@/components/custom/SearchBox'
import { Metadata } from 'next';

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
      <div className='flex flex-col items-center justify-center gap-2 text-center z-20 mt-5'>
       <h1 className='text-xl text-blue-500  dark:text-blue-500/90 sm:text-2xl md:text-3xl'>Find the Right Chat, Right Away</h1>
       <p className='text-xs text-neutral-400 px-4 py-1 md:text-sm lg:text-lg'>No more endless scrolling—search and discover messages instantly.</p>
      </div>
      <SearchBox />
    </div>
  )
}

export default SearchPage