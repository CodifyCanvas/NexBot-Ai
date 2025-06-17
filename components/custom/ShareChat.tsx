// app/components/custom/ShareChat.tsx
'use client'

import { CircleCheck, MessageSquareShare } from 'lucide-react'
import React, { useState } from 'react'
import { Switch } from '../ui/switch'
import { toast } from 'sonner'
import { refreshChats } from '@/lib/chat-refresh'

const ShareChat = ({ chatId, isShareable }: { chatId: string, isShareable: boolean }) => {
  const [isSharable, setIsSharable] = useState(isShareable)
  const [loading, setLoading] = useState(false)

  const handleToggle = async (checked: boolean) => {
    try {
      setLoading(true)
      setIsSharable(checked)

      const response = await fetch(`/api/chat/${chatId}/share`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isShareable: checked }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update share status')
      }

      toast.custom(() => (
          <div
            className="isolate p-4 w-80 bg-green-300/50 flex-row dark:bg-green-300/20 backdrop-blur-2xl shadow-lg md:outline-1 outline-white/20 border dark:border-none border-black/10 rounded-md flex items-center gap-2"
          >
            <CircleCheck size={17} className='text-green-800 dark:text-green-300' /> {/* Icon */}
            <span className="font-semibold text-sm whitespace-nowrap overflow-hidden text-green-800 dark:text-green-300">
              {data.message}
            </span>
          </div>
        ),
        {
          position: 'top-center',
        }
      );
      refreshChats();

    } catch (err) {
      console.error('Error updating share status:', err)
      toast.error('Could not update share status. Try again.', { richColors: true })
      setIsSharable(() => !checked) // rollback toggle
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-row flex-1 items-center justify-between gap-2 rounded-sm'>
      <div className='flex flex-row gap-2 items-center justify-center'>
        <MessageSquareShare className='text-muted-foreground' />
        <span>Share</span>
      </div>
      <Switch
        checked={isSharable}
        onCheckedChange={handleToggle}
        disabled={loading}
        className="cursor-pointer data-[state=checked]:bg-blue-500 "
        thumbClassName="data-[state=checked]:bg-white"
      />
    </div>
  )
}

export default ShareChat