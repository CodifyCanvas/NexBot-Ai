// components/UserDetailsSheet.tsx
"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ShowUserInfo } from "./show-user-info"

interface UserDetailsSheetProps {
  open: boolean
  onClose: () => void
  userId: string | null
}

export function UserDetailsSheet({ open, onClose, userId }: UserDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onClose} >
      <SheetContent side="right"  className="bg-white/5 backdrop-blur-md">
        <SheetHeader>
          <SheetTitle>User Details</SheetTitle>
          <SheetDescription className="text-xs text-gray-500 mt-2">Note: Conversation stats are based on the selected duration.</SheetDescription>
        </SheetHeader>
        <div className="px-2">
          {userId ? (
            <ShowUserInfo id={userId} />
          ) : (
            <p>No user selected.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

