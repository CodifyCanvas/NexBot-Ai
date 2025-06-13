'use client';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ShowMessageInfo } from './show-message-info';

interface MessageDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  messageId: string | number| null;
}

/**
 * Drawer component that shows details of a selected message.
 * Appears as a full-height overlay with a blurred background.
 */
export function MessageDetailsDrawer({
  open,
  onClose,
  messageId,
}: MessageDetailsDrawerProps) {

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="bg-white/50 dark:bg-white/5 min-h-screen backdrop-blur-md">
        <DrawerHeader>
          <DrawerTitle>Message Details</DrawerTitle>
          <DrawerDescription className="text-xs text-gray-500 mt-2 sr-only">
            Note: Conversation stats are based on the selected duration.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4">
          {messageId ? (
            <ShowMessageInfo id={messageId} />
          ) : (
            <p className="text-sm text-muted-foreground">No message selected.</p>
          )}
        </div>

        <DrawerFooter>
          <DrawerClose asChild className="bg-white/50 dark:bg-white/10">
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
