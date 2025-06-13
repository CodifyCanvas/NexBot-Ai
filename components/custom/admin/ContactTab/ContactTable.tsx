'use client';

import useSWR from 'swr';
import { columns as allColumns } from './ContactTable/columns';
import { DataTableSkeleton } from '@/components/Skeletons/DataTableSkeleton';
import { UnifiedDataTable } from '@/components/DataTable/unified-data-table';
import {
  useResponsiveBreakpoint,
  isBreakpointLessThanOrEqual,
} from '@/hooks/useResponsiveBreakpoint';
import { ContactTable as ContactTableDefination } from '@/lib/definations';

const fetchContactMessages = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch contact messages');
  return res.json();
};

export default function ContactTable() {
  const { data, error, isLoading } = useSWR<ContactTableDefination[]>('/api/contact', fetchContactMessages);
  const breakpoint = useResponsiveBreakpoint();

  const visibleColumns = allColumns.filter((col: any) => {
    const responsive = col.responsive;

    // Always show if no responsive setting or it's set to 'all'
    if (!responsive || responsive === 'all') return true;

    // Hide column if screen is below or equal to its responsive limit
    return !isBreakpointLessThanOrEqual(breakpoint, responsive);
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
        <UnifiedDataTable columns={visibleColumns} data={data} mode="inbox" />
      )}
    </div>
  );
}
