import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import Overview from '@/components/custom/admin/OverviewTab/Overview';
import Users from '@/components/custom/admin/UserTab/Users';
import UserTable from '@/components/custom/admin/UserTab/UserTable';
import Link from 'next/link';
import { CornerUpLeft } from 'lucide-react';



export default function AdminDashboard() {


  return (
    <div className="flex w-full flex-col gap-6 p-5">
      <Tabs defaultValue="users">
        <TabsList className="bg-transparent flex-row items-center w-fit flex gap-4">
          <Link href={'/chat'} className='bg-transparent w-fit h-fit flex gap-2 sm:gap-4 transition-all duration-300'>
          <div
            className="rounded-full h-7  bg-transparent  transition-all duration-300 outline flex flex-row items-center gap-2 sm:h-11 text-sm sm:text-2xl font-thin px-3 py-1 sm:py-5
            text-black dark:text-gray-400 
            active:bg-gradient-to-tr active:dark:text-white from-blue-500 to-blue-700"
            >
            <CornerUpLeft className='w-4 h-4 sm:w-6 sm:h-6 transition-all duration-300' />
            Back to Chats
          </div>
            </Link>
          <TabsTrigger
            value="overview"
            className="rounded-full bg-transparent  transition-all duration-300 outline text-sm sm:text-2xl  font-thin px-3 sm:py-5
             text-black dark:text-gray-400 
             data-[state=active]:text-white data-[state=active]:bg-gradient-to-tr from-blue-500 to-blue-700"
          >
            Overview
          </TabsTrigger>

          <TabsTrigger
            value="users"
            className="rounded-full bg-transparent outline text-sm sm:text-2xl font-thin px-3 sm:py-5
             text-black dark:text-gray-400 
             data-[state=active]:text-white data-[state=active]:bg-gradient-to-tr from-blue-500 to-blue-700"
          >
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-5">
          <Overview />
        </TabsContent>

        <TabsContent value="users" className="pt-5">
          <UserTable /> 
        </TabsContent>
      </Tabs>
    </div>
  );
}
