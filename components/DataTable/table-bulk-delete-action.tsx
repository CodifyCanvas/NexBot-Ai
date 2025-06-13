'use client';

import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

interface TableBulkDeleteActionProps {
  table: Table<any>;
  entityName: string; // e.g. 'user' or 'message'
  apiEndpoint: string; // e.g. '/api/user/delete-many-users'
  onSuccess?: () => void; // refetch function, e.g. refetchUsers
}

export function TableBulkDeleteAction({
  table,
  entityName,
  apiEndpoint,
  onSuccess,
}: TableBulkDeleteActionProps) {
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
    } catch (err: any) {
      console.error(`Bulk delete error for ${entityName}:`, err);
      toast.error(err.message || `Something went wrong while deleting ${entityName}s.`, {
        richColors: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (selectedRows.length === 0) return null;

  return (
    <div className="flex justify-center">
      <Button
        variant="destructive"
        onClick={handleDelete}
        disabled={loading}
        className="ml-auto danger_button h-8"
      >
        {loading
          ? `Deleting...`
          : `Delete ${selectedRows.length} ${entityName}${
              selectedRows.length > 1 ? 's' : ''
            }`}
      </Button>
    </div>
  );
}
