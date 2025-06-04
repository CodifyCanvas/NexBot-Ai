'use client';

import useSWR from 'swr';
import { columns as allColumns, UsersTable } from './UserTable/columns';
import { DataTable } from './UserTable/data-table';
import { DataTableSkeleton } from '@/components/Skeletons/DataTableSkeleton';
import { useState, useEffect } from 'react';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpointOrder: Breakpoint[] = ['sm', 'md', 'lg', 'xl', '2xl'];

function isBreakpointLessOrEqual(current: Breakpoint, target: Breakpoint) {
  return breakpointOrder.indexOf(current) <= breakpointOrder.indexOf(target);
}

function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('2xl');

  useEffect(() => {
    function updateBreakpoint() {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else if (width < 1280) setBreakpoint('xl');
      else setBreakpoint('2xl');
    }
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

const fetcher = (url: string) =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  });

export default function UserTable() {
  const { data, error, isLoading } = useSWR<UsersTable[]>('/api/user/all', fetcher);
  const breakpoint = useBreakpoint();

  const columns = allColumns.filter((col: any) => {
    const responsive = col.responsive;

    // If no responsive property or 'all', always show
    if (!responsive || responsive === 'all') return true;

    // Hide column if current breakpoint is less or equal to responsive breakpoint
    // E.g., responsive = 'md' means hide on md and smaller
    return !isBreakpointLessOrEqual(breakpoint, responsive);
  });

  if (error) {
    return <div className="p-4 text-sm text-red-500">Error loading users: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-1">
      {isLoading ? <DataTableSkeleton /> : <DataTable columns={columns} data={data} allColumns={allColumns} />}
    </div>
  );
}
