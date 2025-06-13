'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import {  Line } from 'react-chartjs-2';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getColorByLetter } from '@/lib/utils';
import { SmallChartSkeleton } from '@/components/Skeletons/ChartFallback';
import { UserInfoSkeleton } from '@/components/Skeletons/DataTableSkeleton';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

type UserConversationStats = {
  date: string;
  chat: number;
  message: number;
  botResponse: number;
}[];

type UserGeneralStats = {
  id: number;
  name: string;
  profileImg: string;
  email: string;
  admin: boolean;
  verified: boolean;
  createdAt: string;
  totalMessages: number;
  totalChats: number;
  totalBotResponses: number;
};

type Props = {
  id: number | string;
};

const DURATIONS = [
  { label: 'All Time', value: '0' },
  { label: 'Last 7 Days', value: '7' },
  { label: 'Last 15 Days', value: '15' },
  { label: 'Last 30 Days', value: '30' },
  { label: 'Last 120 Days', value: '120' },
];

export function ShowUserInfo({ id }: Props) {
  const [userData, setUserData] = useState<UserGeneralStats | null>(null);
  const [conversationData, setConversationData] = useState<UserConversationStats>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [duration, setDuration] = useState('30');

  useEffect(() => {
    async function fetchConversationStats() {
      setLoadingStats(true);
      try {
        const res = await fetch(`/api/admin/stats/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: Number(duration) }),
        });

        if (!res.ok) throw new Error('Failed to fetch user conversation stats');
        const data: UserConversationStats = await res.json();
        setConversationData(data);
      } catch (error) {
        console.error('Error loading user conversation stats:', error);
      } finally {
        setLoadingStats(false);
      }
    }

    fetchConversationStats();
  }, [id, duration]);

  useEffect(() => {
    async function fetchUserData() {
      setLoadingUser(true);
      try {
        const res = await fetch(`/api/user/${id}`);
        if (!res.ok) throw new Error('Failed to fetch user info');
        const data: UserGeneralStats = await res.json();
        setUserData(data);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUserData();
  }, [id]);

  const chartData = {
    labels: conversationData.map((item) => item.date),
    datasets: [
      {
        label: 'User Messages',
        data: conversationData.map((item) => item.message),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Bot Responses',
        data: conversationData.map((item) => item.botResponse),
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
      },
      {
        label: 'Chats',
        data: conversationData.map((item) => item.chat),
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: false,
      },
    ],
  };

  function InfoCard({ title, value, titleColor }: { title: string; value: string | number; titleColor?: string; }) {
    return (
      <div className="flex flex-col justify-center items-start border px-2 py-2 rounded-md bg-neutral-200 dark:bg-white/5 backdrop-blur-md basis-[calc(33.333%-1rem)] min-w-fit">
        <h3 className={`text-xs font-semibold ${titleColor ? titleColor : 'text-blue-600 dark:text-blue-500'}`}>{title}</h3>
        <p className="sm:text-md text-sm ">{value}</p>
      </div>
    );
  }


  return (
    <div className="p-0 space-y-3">
      {/* Duration Selector */}
      <div className="flex items-center gap-2">
        <Label htmlFor="duration text-xs">Duration:</Label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger
            id="duration"
            className="w-fit text-xs isolate bg-white/10 backdrop-blur-xl shadow-lg outline-1 outline-white/20"
          >
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="isolate bg-white/10 backdrop-blur-xl shadow-lg outline-1 outline-white/20">
            {DURATIONS.map((d) => (
              <SelectItem
                key={d.value}
                value={d.value}
                className="bg-transparent hover:bg-blue-300 dark:bg-transparent active:bg-blue-400 dark:hover:bg-blue-200/20 dark:active:bg-blue-200/30"
              >
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      {loadingStats ? (
        <SmallChartSkeleton />
      ) : (
        <div>
          <Line data={chartData} />
        </div>
      )}

      {/* User Info */}
      {loadingUser ? (
        <UserInfoSkeleton />
      ) : (
        userData && (
          <div className="space-y-4 border-t pt-4">
            {/* Profile Info */}
            <div className="flex flex-row justify-start items-center gap-2  px-2 py-2 rounded-md  basis-[calc(33.333%-1rem)] min-w-fit">
              <Avatar className='w-10 h-10 sm:w-14 sm:h-14'>
                <AvatarImage src={userData.profileImg} />
                <AvatarFallback className={getColorByLetter(userData.name)}>
                  {userData.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold sm:text-xl text-md text-blue-600 dark:text-white/95">{userData.name}</h3>
                <p className="sm:text-sm text-xs dark:text-gray-400">{userData.email}</p>
              </div>
            </div>

            {/* Role & Status */}
            <div className="flex flex-wrap justify-between gap-2 ">
              <InfoCard title="Role" value={userData.admin ? 'Admin' : 'User'} />
              <InfoCard title="Verified" value={userData.verified ? 'Yes' : 'No'} />
              <InfoCard title="Joined On" value={new Date(userData.createdAt).toLocaleDateString()} />
            </div>

            {/* Activity Stats */}
            <div className="flex flex-wrap justify-between gap-2">
              <InfoCard title="Chats" value={userData.totalChats} />
              <InfoCard title="Messages Sent" value={userData.totalMessages} />
              <InfoCard title="Bot Replies" value={userData.totalBotResponses} />
            </div>

            {userData.totalMessages > 0 && (() => {
              const rate = (userData.totalBotResponses / userData.totalMessages) * 100;
              const formattedRate = rate.toFixed(1) + '%';

              let color = 'text-blue-600 dark:text-blue-500';
              if (rate < 40) color = 'text-red-600 dark:text-red-400';
              else if (rate < 60) color = 'text-yellow-600 dark:text-yellow-400';

              return (
                <InfoCard
                  title="Response Rate"
                  value={formattedRate}
                  titleColor={color}
                />
              );
            })()}
          </div>
        )
      )}
    </div>
  );
}
