'use client';

import { Button } from '@/components/ui/button';
import { refetchContactMessages } from '@/lib/swr/mutateUsers';
import { useState } from 'react';

interface RespondedButtonProps {
  messageId: number;
  initialResponded: boolean;
}

/**
 * Button to mark a message as "responded".
 * Once clicked, disables itself and updates the server.
 */
export function RespondedButton({
  messageId,
  initialResponded,
}: RespondedButtonProps) {
  const [isResponded, setIsResponded] = useState(initialResponded);
  const [isLoading, setIsLoading] = useState(false);

  // Send POST request to mark message as responded
  const handleMarkAsResponded = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/contact/${messageId}/responded`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to mark as responded');

      setIsResponded(true);
      refetchContactMessages();
    } catch (error) {
      console.error(error);
      alert('An error occurred while marking as responded.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleMarkAsResponded}
      disabled={isResponded || isLoading}
      className={`px-4 py-2 rounded-lg transition-all duration-300 text-white ${
        isResponded
          ? 'cursor-not-allowed brightness-110 outline bg-neutral-950 dark:bg-neutral-700'
          : 'cursor-pointer bg-gradient-to-tr from-blue-500 to-blue-500 dark:from-blue-500 dark:to-blue-700 brightness-110 hover:px-5 hover:py-5 hover:-translate-y-1'
      }`}
    >
      {isResponded ? 'Responded' : isLoading ? 'Marking...' : 'Mark as Responded'}
    </Button>
  );
}
