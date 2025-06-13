'use client';

import useSWR from 'swr';
import { columns as allColumns, UsersTable } from './UserTable/columns';
import { DataTableSkeleton } from '@/components/Skeletons/DataTableSkeleton';
import { UnifiedDataTable } from '@/components/DataTable/unified-data-table';
import { isBreakpointLessThanOrEqual, useResponsiveBreakpoint } from '@/hooks/useResponsiveBreakpoint'; // 👈 import hook and helper

const fetchUsers = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export default function UserTable() {
  const { data, error, isLoading } = useSWR<UsersTable[]>('/api/user/all', fetchUsers);
  const currentBreakpoint = useResponsiveBreakpoint(); // 👈 use the custom hook

  // Filter columns based on responsiveness
  const visibleColumns = allColumns.filter((col: any) => {
    const responsive = col.responsive;
    if (!responsive || responsive === 'all') return true;
    return !isBreakpointLessThanOrEqual(currentBreakpoint, responsive);
  });

  if (error) {
    return (
      <div className="p-4 text-sm text-red-500">
        Error loading users: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-1">
      {isLoading ? (
        <DataTableSkeleton />
      ) : (
        <UnifiedDataTable columns={visibleColumns} data={data} mode="user" />
      )}
    </div>
  );
}
