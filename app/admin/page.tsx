'use client';

import { useEffect, useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import Overview from '@/components/custom/admin/Overview';
import Users from '@/components/custom/admin/Users';

type AdminStats = {
  totalUsers: number;
  ActiveUsers: number;
  TotalChats: number;
  TotalMessages: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      setStatsLoading(true);
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data: AdminStats = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Error loading admin stats:', error);
      } finally {
        setStatsLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="flex w-full flex-col gap-6 p-5">
      <Tabs defaultValue="overview">
        <TabsList className="bg-transparent w-fit flex gap-4">
          <TabsTrigger
            value="overview"
            className="rounded-full text-white bg-transparent text-2xl font-thin px-3 py-5 data-[state=active]:bg-gradient-to-tr from-blue-500 to-blue-700"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="rounded-full text-white bg-transparent text-2xl font-thin px-3 py-5 data-[state=active]:bg-gradient-to-tr from-blue-500 to-blue-700"
          >
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-5">
          <Overview data={stats ?? undefined} loading={statsLoading} />
        </TabsContent>

        <TabsContent value="users" className="pt-5">
          <Users />
        </TabsContent>
      </Tabs>
    </div>
  );
}
