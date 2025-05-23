// app/components/custom/ShareChat.tsx
'use client'

import { MessageSquareShare } from 'lucide-react'
import React, { useState } from 'react'
import { Switch } from '../ui/switch'
import { toast } from 'sonner'
import { refreshChats } from '@/lib/chat-refresh'

const ShareChat = ({chatId, isShareable}: {chatId: string, isShareable: boolean}) => {
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

      refreshChats();

      toast.success(data.message, { richColors: true })
    } catch (err) {
      console.error('Error updating share status:', err)
      toast.error('Could not update share status. Try again.', { richColors: true })
      setIsSharable(prev => !checked) // rollback toggle
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
        className='cursor-pointer'
      />
    </div>
  )
}

export default ShareChat