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

interface DeleteRowDialogButtonProps {
  id: number | string;                   // ID of item to delete
  entityName: string;                    // e.g. 'user' or 'message', used for UI text
  apiBasePath: string;                   // e.g. '/api/user' or '/api/contact'
  refetchData: () => void;               // function to refresh data after successful deletion
  buttonLabel?: string;                  // optional custom button label, defaults to 'Delete'
  confirmDescription?: string;           // optional description in the dialog
}

/**
 * Reusable delete confirmation dialog button.
 * Handles deletion of different entity types by passing relevant props.
 */
export function DeleteRowDialogButton({
  id,
  entityName,
  apiBasePath,
  refetchData,
  buttonLabel = 'Delete',
  confirmDescription,
}: DeleteRowDialogButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBasePath}/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      toast.custom(() => (
        <div className="isolate p-4 w-80 bg-green-300/50 flex-row dark:bg-green-300/20 backdrop-blur-2xl shadow-lg md:outline outline-1 outline-white/20 border dark:border-none border-black/10 rounded-md flex items-center gap-2">
          <CircleCheck size={17} className="text-green-800 dark:text-green-300" />
          <span className="font-semibold text-sm text-green-800 dark:text-green-300 truncate">
            {entityName.charAt(0).toUpperCase() + entityName.slice(1)} deleted successfully!
          </span>
        </div>
      ), { position: 'top-center' });

      refetchData();      // Refresh data list after deletion
    } catch (error) {
      console.error(`Error deleting ${entityName}:`, error);
      toast.error(`Failed to delete ${entityName}. Please try again or check the console.`, {
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
        <button
          className="text-red-400 hover:text-red-500 cursor-pointer font-medium hover:underline transition-colors"
          aria-label={`Delete ${entityName}`}
        >
          {buttonLabel}
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="isolate bg-white/10 backdrop-blur-xl shadow-xl border dark:border-none border-black/10 md:outline md:outline-1 md:outline-white/20">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {confirmDescription ||
              `This action cannot be undone. This will permanently delete the ${entityName}.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="danger_button"
          >
            {loading ? 'Deleting...' : `Yes, Delete`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
