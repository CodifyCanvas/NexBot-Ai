"use client";

import React from "react";
import useSWR from "swr";
import StatsCards from "./StatsCards";
import StatsChart from "./StatsChart";

type AdminStats = {
  totalUsers: number;
  ActiveUsers: number;
  TotalChats: number;
  TotalMessages: number;
};

// fetcher function for useSWR
const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
});

const Overview = () => {
  const { data: stats, error, isLoading } = useSWR<AdminStats>("/api/admin/stats", fetcher);

  if (error) {
    console.error("Error loading admin stats:", error);
  }

  return (
    <div className="w-full mx-auto px-4 space-y-6">
      <StatsCards data={stats ?? undefined} loading={isLoading} />
      <StatsChart />
    </div>
  );
};

export default Overview;
