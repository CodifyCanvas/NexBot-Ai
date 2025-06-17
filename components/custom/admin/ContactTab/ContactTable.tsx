'use client';

import useSWR from 'swr';
import { columns as allColumns } from './ContactTable/columns';
import { DataTableSkeleton } from '@/components/Skeletons/DataTableSkeleton';
import { UnifiedDataTable } from '@/components/DataTable/unified-data-table';
import {
  useResponsiveBreakpoint,
  isBreakpointLessThanOrEqual,
  Breakpoint,
} from '@/hooks/useResponsiveBreakpoint';
import { ContactTable as ContactTableInterface } from '@/lib/definations';
import { ColumnDef } from '@tanstack/react-table';

// Extend ColumnDef with optional responsive breakpoint support
type ResponsiveColumn<T, V> = ColumnDef<T, V> & {
  responsive?: Breakpoint | 'base' | 'all'; // all three, but still controlled
};

const fetchContactMessages = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch contact messages');
  return res.json();
};

export default function ContactTable() {
  const { data, error, isLoading } = useSWR<ContactTableInterface[]>('/api/contact', fetchContactMessages);
  const breakpoint = useResponsiveBreakpoint();

  // Filter visible columns based on responsive settings
  const visibleColumns: ResponsiveColumn<ContactTableInterface, unknown>[] = allColumns.filter((col) => {
  if (!col.responsive || col.responsive === 'all') return true;
  if (['sm', 'md', 'lg', 'xl', '2xl'].includes(col.responsive)) {
    return !isBreakpointLessThanOrEqual(breakpoint, col.responsive as Breakpoint);
  }
  return true;
});

  if (error) {
    return (
      <div className="p-4 text-sm text-red-500">
        Error Loading Contact Messages: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-1">
      {isLoading ? (
        <DataTableSkeleton />
      ) : (
        <UnifiedDataTable<ContactTableInterface>
          columns={visibleColumns}
          data={data ?? []}
          mode="inbox"
        />
      )}
    </div>
  );
}
