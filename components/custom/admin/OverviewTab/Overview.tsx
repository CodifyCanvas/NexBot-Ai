"use client";

import React from "react";
import useSWR from "swr";
import StatsCards from "./StatsCards";
import StatsChart from "./StatsChart";
import { AdminStats } from "@/lib/definations";

// Generic fetcher function for useSWR data fetching
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch admin stats");
  }
  return response.json();
};

/**
 * Overview Component
 *
 * Displays admin statistics summary and chart.
 * Uses SWR for data fetching with caching and revalidation.
 */
const Overview: React.FC = () => {
  // Fetch stats data with SWR
  const { data: stats, error, isLoading } = useSWR<AdminStats>(
    "/api/admin/stats",
    fetcher
  );

  // Log error if present
  React.useEffect(() => {
    if (error) {
      console.error("Error loading admin stats:", error);
    }
  }, [error]);

  return (
    <div className="w-full mx-auto px-4 space-y-6">
      {/* Display stats summary cards, pass loading state */}
      <StatsCards data={stats ?? undefined} loading={isLoading} />
      
      {/* Display stats chart (assumes chart handles its own data) */}
      <StatsChart />
    </div>
  );
};

export default Overview;
