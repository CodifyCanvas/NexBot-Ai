'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Spinner from '../../Spinner';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

type StatPoint = {
  date: string;
  users: number;
  chats: number;
  messages: number;
};

const DURATIONS = [
  { label: 'All Time', value: '0' },
  { label: 'Last 7 Days', value: '7' },
  { label: 'Last 15 Days', value: '15' },
  { label: 'Last 30 Days', value: '30' },
  { label: 'Last 120 Days', value: '120' },
];

const StatsChart = () => {
  const [dailyStats, setDailyStats] = useState<StatPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState('30');

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: Number(duration) }),
        });
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data: StatPoint[] = await res.json();
        setDailyStats(data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [duration]);

  const chartData = {
    labels: dailyStats.map((point) => point.date),
    datasets: [
      {
        label: 'Users',
        data: dailyStats.map((point) => point.users),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.2)',
        tension: 0.4,
      },
      {
        label: 'Chats',
        data: dailyStats.map((point) => point.chats),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.2)',
        tension: 0.4,
      },
      {
        label: 'Messages',
        data: dailyStats.map((point) => point.messages),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245,158,11,0.2)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#9ca3af',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(107,114,128,0.2)' },
      },
    },
  };

  return (
    <Card className="w-full max-w-full @container/card bg-white dark:bg-white/10 backdrop-blur-xl shadow-sm border border-black/10 dark:border-none transition-all duration-300  overflow-hidden">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CardTitle>Daily Activity Chart</CardTitle>
        <div className="flex items-center gap-2 mt-3 md:mt-0">
          <Label htmlFor="duration">Duration:</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="w-32 isolate bg-white/10 backdrop-blur-xl shadow-lg outline-1 outline-white/20" id="duration">
              <SelectValue className='' placeholder="Select" />
            </SelectTrigger>
            <SelectContent className='isolate bg-white/10 backdrop-blur-xl shadow-lg outline-1 outline-white/20'>
              {DURATIONS.map((d) => (
                <SelectItem className='bg-transparent hover:bg-blue-300 dark:bg-transparent active:bg-blue-400 dark:hover:bg-blue-200/20 dark:active:bg-blue-200/30' key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[250px] w-full overflow-x-auto">
        {loading ? (
          <div className='w-full h-full flex justify-center items-center'>
            <div className='scale-150'>
              <Spinner variant='blue-gradient' />
            </div>
          </div>
        ) : (
          <div className="w-full bg-transparent">
            <Line className={"max-h-60"} data={chartData} options={chartOptions} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsChart;
