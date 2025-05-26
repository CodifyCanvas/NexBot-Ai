"use client";

import { useEffect, useState } from "react";
import { User } from "@/lib/definations";

const useUser = (autoFetch: boolean = true) => {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/user", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const user: User = await response.json();
      setData(user);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("🚧 Uh-oh! We ran into a glitch while loading your info. Please contact the developer if this keeps happening."));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setLoading(false);
    setError(null);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []);


  return { user: data, loading, error, refetch: fetchData, reset };
};

export default useUser;
