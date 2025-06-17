'use client';

import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { CircleCheck } from 'lucide-react';
import { User } from '@/lib/definations';

interface ToggleVerifiedProps {
  user: User
}

const ToggleVerified: React.FC<ToggleVerifiedProps> = ({ user }) => {
  const [isVerified, setIsVerified] = useState(user.verified);
  const [isUpdating, setIsUpdating] = useState(false);

  // Show success toast
  const showSuccessToast = (message: string) => {
    toast.custom(
      () => (
        <div className="isolate p-4 w-80 bg-green-300/50 flex-row dark:bg-green-300/20 backdrop-blur-2xl shadow-lg md:outline-1 outline-white/20 border dark:border-none border-black/10 rounded-md flex items-center gap-2">
          <CircleCheck size={17} className="text-green-800 dark:text-green-300" />
          <span className="font-semibold text-sm whitespace-nowrap overflow-hidden text-green-800 dark:text-green-300">
            {message}
          </span>
        </div>
      ),
      { position: 'top-center' }
    );
  };

  /**
   * Handle verification toggle
   */
  const handleVerificationToggle = async (nextState: boolean) => {
    setIsUpdating(true);
    setIsVerified(nextState); // Optimistic update

    try {
      const response = await fetch(`/api/admin/verified/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: nextState }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message);
      }

      showSuccessToast(result.message || 'Verification status updated');
    } catch (error) {
      console.error('Failed to update verification status:', error);
      toast.error('Could not update verification status. Please try again.', {
        richColors: true,
      });
      setIsVerified(() => !nextState); // Rollback on failure
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 rounded-sm">
      <Switch
        checked={isVerified}
        onCheckedChange={handleVerificationToggle}
        disabled={isUpdating}
        className="cursor-pointer data-[state=checked]:bg-blue-500"
        thumbClassName="data-[state=checked]:bg-white"
      />
    </div>
  );
};

export default ToggleVerified;
