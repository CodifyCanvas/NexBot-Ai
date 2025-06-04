"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { CircleCheck } from "lucide-react";

interface ToggleVerifiedProps {
  data: {
    id: number;
    verified: boolean;
  };
}

const ToggleVerified: React.FC<ToggleVerifiedProps> = ({ data }) => {
  const [isVerified, setIsVerified] = useState(data.verified);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setLoading(true);
    setIsVerified(checked);

    const response = await fetch(`/api/admin/verified/${data.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: checked }),
    });

    const result = await response.json();

    if (response.ok) {
      toast.custom(
        () => (
          <div className="isolate p-4 w-80 bg-green-300/50 flex-row dark:bg-green-300/20 backdrop-blur-2xl shadow-lg md:outline-1 outline-white/20 border dark:border-none border-black/10 rounded-md flex items-center gap-2">
            <CircleCheck size={17} className="text-green-800 dark:text-green-300" />
            <span className="font-semibold text-sm whitespace-nowrap overflow-hidden text-green-800 dark:text-green-300">
              {result.message}
            </span>
          </div>
        ),
        { position: "top-center" }
      );
    } else {
      console.error("Error updating verification status:", result.error || result.message);
      toast.error("Could not update verification status. Try again.", { richColors: true });
      setIsVerified((prev) => !checked); // rollback toggle
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-row items-center justify-between gap-2 rounded-sm">
      <Switch
        checked={isVerified}
        onCheckedChange={handleToggle}
        disabled={loading}
        className="cursor-pointer data-[state=checked]:bg-blue-500"
        thumbClassName="data-[state=checked]:bg-white"
      />
    </div>
  );
};

export default ToggleVerified;
