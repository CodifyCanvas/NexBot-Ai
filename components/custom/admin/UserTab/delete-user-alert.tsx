'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { CircleCheck } from 'lucide-react';
import { refetchUsers } from '@/lib/swr/mutateUsers';

interface DeleteUserDialogButtonProps {
  userId: string;
}

export function DeleteUserDialogButton({ userId }: DeleteUserDialogButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      toast.custom(() => (
        <div className="isolate p-4 w-80 bg-green-300/50 flex-row dark:bg-green-300/20 backdrop-blur-2xl shadow-lg md:outline outline-1 outline-white/20 border dark:border-none border-black/10 rounded-md flex items-center gap-2">
          <CircleCheck size={17} className="text-green-800 dark:text-green-300" />
          <span className="font-semibold text-sm text-green-800 dark:text-green-300 truncate">
            User deleted successfully!
          </span>
        </div>
      ), { position: 'top-center' });

      refetchUsers();

    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user. Please try again or check the console.', {
        richColors: true,
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className="text-red-400 hover:text-red-500 cursor-pointer font-medium hover:underline transition-colors">
          Delete User
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="isolate bg-white/10 backdrop-blur-xl shadow-xl border dark:border-none border-black/10 md:outline md:outline-1 md:outline-white/20">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="danger_button"
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
