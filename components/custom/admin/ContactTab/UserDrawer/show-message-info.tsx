  'use client';

  import { useEffect, useState, useCallback } from 'react';
  import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
  import { RespondedButton } from './RespondedButton';
  import { getColorByLetter } from '@/lib/utils';
  import { ShowMessageInfoSkeleton } from '@/components/Skeletons/ShowMessageInfoSkeleton';
  import { ContactTable } from '@/lib/definations';

  interface ShowMessageInfoProps {
    id: number | string;
  }

  /**
   * Component to display full details of a contact message
   */
  export function ShowMessageInfo({ id }: ShowMessageInfoProps) {
    const [messageData, setMessageData] = useState<ContactTable | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Fetch message details from API
     */
    useEffect(() => {
      const fetchMessage = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/contact/${id}`);
          if (!res.ok) throw new Error('Failed to fetch contact message');

          const data: ContactTable = await res.json();
          setMessageData(data);
        } catch (err) {
          console.error('Error fetching message:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchMessage();
    }, [id]);

    /**
     * Format date in a readable string
     * Format: 12:00:00 AM - 14/Jun/2025
     */
    const formatDateTime = useCallback((value?: string | Date | null): string | null => {
      if (!value) return null;

      return new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
        .format(new Date(value))
        .replace(',', ' -');
    }, []);

    // Show loading skeleton
    if (isLoading) return <ShowMessageInfoSkeleton />;

    // Fallback if message is not found
    if (!messageData) {
      return (
        <div className="text-center text-sm text-gray-700 dark:text-gray-400 md:px-5">
          Message not found.
        </div>
      );
    }

    // Main UI
    return (
      <div className="space-y-4 pt-1 border-t md:px-5">
        {/* Header: Avatar + Name/Email + Timestamp */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 py-2 rounded-md md:px-2">
            <Avatar className="w-10 h-10 sm:w-14 sm:h-14 shadow-md dark:shadow-none outline">
              <AvatarImage src="" />
              <AvatarFallback className={getColorByLetter(messageData.name)}>
                {messageData.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="text-md sm:text-xl font-semibold text-black/90 dark:text-white">
                {messageData?.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-900 dark:text-gray-400 truncate max-w-[300px] sm:max-w-[400px] md:max-w-fit">
                {messageData?.email}
              </p>
            </div>
          </div>

          <div className="text-right text-xs sm:text-sm text-gray-700 dark:text-gray-400">
            <span className="block font-medium">Message Received</span>
            <span>{formatDateTime(messageData.createdAt)}</span>
          </div>
        </div>

        {/* Message Content */}
        <div className="bg-black/5 dark:bg-white/5 backdrop-blur-md p-3 rounded-lg max-h-[50vh] overflow-y-auto custom-scrollbar outline">
          <div className="text-sm text-gray-600 dark:text-gray-400">Message</div>
          <div className="pt-2 text-sm text-black dark:text-gray-200 whitespace-pre-wrap">
            {messageData.message}
          </div>
        </div>

        {/* Action Button + Response Timestamp */}
        <div className="flex justify-between items-center">
          <RespondedButton
            messageId={messageData.id}
            initialResponded={!!messageData.respondedAt}
          />
          {messageData.respondedAt && (
            <div className="text-right text-xs sm:text-sm text-gray-700 dark:text-gray-400">
              <span className="block font-medium">Responded</span>
              <span>{formatDateTime(messageData.respondedAt)}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
