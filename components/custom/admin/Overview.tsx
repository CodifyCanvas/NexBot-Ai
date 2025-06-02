import React from 'react';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Users,
  Activity,
  MessagesSquare,
  Send,
} from 'lucide-react';
import StatsCardsFallback from '@/components/Skeletons/StatsCardsFallback';

type AdminStats = {
  totalUsers: number;
  ActiveUsers: number;
  TotalChats: number;
  TotalMessages: number;
};

const iconMap = {
  totalUsers: Users,
  ActiveUsers: Activity,
  TotalChats: MessagesSquare,
  TotalMessages: Send,
};

const cardData = [
  { key: 'totalUsers', label: 'Total Accounts' },
  { key: 'ActiveUsers', label: 'Active Accounts' },
  { key: 'TotalChats', label: 'Total Chats' },
  { key: 'TotalMessages', label: 'Total Messages' },
];

type Props = {
  data?: AdminStats;
  loading?: boolean;
};


const Overview: React.FC<Props> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardData.map(({ key }) => (
          <StatsCardsFallback key={key} />
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardData.map(({ key, label }) => {
        const Icon = iconMap[key as keyof AdminStats];
        const value = data[key as keyof AdminStats] ?? '...';

        return (
          <Card
            key={key}
            className="@container/card bg-blue-500/10 dark:bg-white/10 backdrop-blur-xl shadow-sm border border-black/10 dark:border-none transition-all duration-300"
          >
            <CardHeader>
              <CardDescription className="font-medium">{label}</CardDescription>
              <CardTitle className="text-2xl font-semibold flex items-center gap-2 tabular-nums @[250px]/card:text-3xl">
                {value} <Icon />
              </CardTitle>
              <CardAction />
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-thin">Lifetime</div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default Overview;
