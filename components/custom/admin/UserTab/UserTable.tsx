'use client';

import useSWR from 'swr';
import { columns as allColumns } from './UserTable/columns';
import { DataTableSkeleton } from '@/components/Skeletons/DataTableSkeleton';
import { UnifiedDataTable } from '@/components/DataTable/unified-data-table';
import {
  useResponsiveBreakpoint,
  isBreakpointLessThanOrEqual,
  Breakpoint,
} from '@/hooks/useResponsiveBreakpoint';
import { UserTable as UserTableInterface } from '@/lib/definations';
import { ColumnDef } from '@tanstack/react-table';

// Extend ColumnDef with optional responsive key
type ResponsiveColumn<T, V> = ColumnDef<T, V> & {
  responsive?: Breakpoint | 'base' | 'all'; // all three, but still controlled
};

const fetchUsers = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export default function UserTable() {
  const { data, error, isLoading } = useSWR<UserTableInterface[]>('/api/user/all', fetchUsers);
  const breakpoint = useResponsiveBreakpoint();

  // Filter columns based on responsiveness
  const visibleColumns: ResponsiveColumn<UserTableInterface, unknown>[] = allColumns.filter((col) => {
  if (!col.responsive || col.responsive === 'all') return true;
  if (['sm', 'md', 'lg', 'xl', '2xl'].includes(col.responsive)) {
    return !isBreakpointLessThanOrEqual(breakpoint, col.responsive as Breakpoint);
  }
  return true;
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
        <UnifiedDataTable<UserTableInterface>
  columns={visibleColumns}
  data={data ?? []}
  mode="user"
/>
      )}
    </div>
  );
}
