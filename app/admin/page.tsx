import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import Overview from '@/components/custom/admin/OverviewTab/Overview';
import UserTable from '@/components/custom/admin/UserTab/UserTable';
import ContactTable from '@/components/custom/admin/ContactTab/ContactTable';

import Link from 'next/link';
import { ChartSpline, CornerUpLeft, Mail, UsersRound } from 'lucide-react';
import { Metadata } from 'next';

// SEO metadata
export const metadata: Metadata = {
  title: "Admin Dashboard — NexBot Insights & Management",
  description:
    "Monitor NexBot’s performance with real-time analytics. View stats on users, conversations, messages, and manage feedback — all from a central admin dashboard.",
};

export default function AdminDashboard() {
  // Tab configuration array
  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      icon: <ChartSpline className="w-4 h-4 sm:w-6 sm:h-6 transition-all duration-300" />,
      content: <Overview />,
    },
    {
      key: 'users',
      label: 'Users',
      icon: <UsersRound className="w-4 h-4 sm:w-6 sm:h-6 transition-all duration-300" />,
      content: <UserTable />,
    },
    {
      key: 'contact',
      label: 'Inbox',
      icon: <Mail className="w-4 h-4 sm:w-6 sm:h-6 transition-all duration-300" />,
      content: <ContactTable />,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6 p-5">
      <Tabs defaultValue="overview">
        {/* Tabs header with nav and triggers */}
        <TabsList className="bg-transparent flex-row items-center w-fit flex gap-4">

          {/* Back to chat link */}
          <Link
            href="/chat"
            className="bg-transparent w-fit h-fit flex gap-2 sm:gap-4 transition-all duration-300"
          >
            <div className="rounded-full h-7 sm:h-11 cursor-pointer bg-transparent transition-all duration-300 outline dark:outline text-sm sm:text-xl font-thin px-3 py-1 sm:py-5 text-black dark:text-gray-400 active:bg-gradient-to-tr active:dark:text-white from-blue-500 to-blue-500 dark:from-blue-500 dark:to-blue-700 flex items-center gap-2">
              <CornerUpLeft className="w-4 h-4 sm:w-6 sm:h-6 transition-all duration-300" />
              <span className="hidden sm:block">Back to Chats</span>
            </div>
          </Link>

          {/* Render each tab button */}
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="rounded-full bg-transparent cursor-pointer data-[state=active]:outline-none outline transition-all duration-300 dark:outline text-sm sm:text-xl font-thin px-3 sm:py-5 text-black dark:text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gradient-to-tr from-blue-500 to-blue-500 dark:from-blue-500 dark:to-blue-700 flex items-center flex-row gap-2"
            >
              {tab.icon}
              <span className="hidden sm:block">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab content sections */}
        {tabItems.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="pt-5">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
