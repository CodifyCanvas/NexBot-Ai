'use client';

import { useState } from 'react';
import { Table } from '@tanstack/react-table';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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

type TableBulkDeleteActionProps<T extends { id: string | number }> = {
  table: Table<T>;
  entityName: string;
  apiEndpoint: string;
  onSuccess: () => void;
};

export function TableBulkDeleteAction<T extends { id: string | number }>({
  table,
  entityName,
  apiEndpoint,
  onSuccess,
}: TableBulkDeleteActionProps<T>) {
  const [loading, setLoading] = useState(false);
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleDelete = async () => {
    const ids = selectedRows.map((row) => row.original.id);
    setLoading(true);

    try {
      const res = await fetch(apiEndpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || `Failed to delete selected ${entityName}s.`);
      }

      toast.success(data?.message || `Selected ${entityName}s deleted successfully.`, {
        richColors: true,
      });

      if (onSuccess) onSuccess();
      table.resetRowSelection();
    } catch (err: unknown) {
  console.error(`Bulk delete error for ${entityName}:`, err);

  // Safely extract message from unknown error
  const message = err instanceof Error ? err.message : `Something went wrong while deleting ${entityName}s.`;

  toast.error(message, {
    richColors: true,
  });
} finally {
      setLoading(false);
    }
  };

  if (selectedRows.length === 0) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          disabled={loading}
          className="ml-auto danger_button h-8"
        >
          {loading
            ? `Deleting...`
            : `Delete ${selectedRows.length} ${entityName}${
                selectedRows.length > 1 ? 's' : ''
              }`}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='isolate bg-white/10 backdrop-blur-xl shadow-lg md:outline-1 outline-white/20 border dark:border-none border-black/10'>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {selectedRows.length} {entityName}
            {selectedRows.length > 1 ? 's' : ''}. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="danger_button text-white hover:bg-destructive/90"
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
