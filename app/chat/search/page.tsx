// app/chat/search/page.tsx
import { Metadata } from "next";
import SearchBox from "@/components/custom/SearchBox";

// SEO Metadata for this search page
export const metadata: Metadata = {
  title: "Search Chats — Find Conversations Instantly | NexBot",
  description:
    "Quickly search your past AI conversations on NexBot. Instantly locate chats by title without endless scrolling.",
};

const SearchPage = () => {
  return (
    <div className="flex h-full w-full justify-center items-center flex-col p-4 gap-6 z-20">
      
      {/* Page Heading */}
      <div className="text-center z-20 mt-5 flex flex-col items-center gap-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl text-blue-500 dark:text-blue-500/90 font-semibold">
          Find the Right Chat, Right Away
        </h1>
        <p className="text-xs md:text-sm lg:text-base text-neutral-400 px-4">
          No more endless scrolling—search and rediscover your AI chat titles instantly.
        </p>
      </div>

      {/* Search input (triggers dynamic DB fetch on type) */}
      <SearchBox />
    </div>
  );
};

export default SearchPage;
