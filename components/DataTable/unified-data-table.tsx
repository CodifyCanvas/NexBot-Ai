'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { DataTablePagination } from '@/components/DataTable/data-table-pagination';
import { DataTableViewOptions } from '@/components/DataTable/data-table-view-options';
import { UnifiedDataTableActions } from './unified-data-table-actions';
import { MessageDetailsDrawer } from '../custom/admin/ContactTab/UserDrawer/message-details-drawer';
import { UserDetailsSheet } from '../custom/admin/UserTab/UserSheet/user-details-sheet';

interface UnifiedDataTableProps<TData> {
  columns: ColumnDef<TData>[]; // Remove TValue
  data: TData[];
  mode: 'user' | 'inbox';
}

const globalFilterFn = <TData extends { name?: string; email?: string }>(
  row: { original: TData },
  _columnId: string,
  filterValue: string
): boolean => {
  const search = filterValue.toLowerCase();
  const name = row.original.name?.toLowerCase?.() ?? '';
  const email = row.original.email?.toLowerCase?.() ?? '';
  return name.includes(search) || email.includes(search);
};




export function UnifiedDataTable<
  TData extends { id: string | number; name?: string; email?: string },
>({
  columns,
  data,
  mode,
}: UnifiedDataTableProps<TData>){
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
  });

  const handleRowClick = (id: string | number) => {
    setSelectedId(id);
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex items-center gap-4">
        <Input
          type="text"
          placeholder="Filter by name or email..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm py-2 bg-white/50 backdrop-blur-md shadow-lg outline-1 outline-white/20 transition-all duration-300"
        />
        <div className="flex flex-row items-center gap-2 ml-auto">
          <UnifiedDataTableActions<TData> table={table} mode={mode} />
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <UITable className="w-full border-separate border-spacing-y-2">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className='bg-transparent hover:bg-blue-500/20 transition-colors' key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="bg-transparent border-none hover:bg-white/10 transition-colors data-[state=selected]:bg-sky-300/15"
                >
                  {row.getVisibleCells().map((cell) => {
                    const columnId = cell.column.id;
                    const isClickable =
                      columnId === 'name' || columnId === 'email';
                    return (
                      <TableCell
                        key={cell.id}
                        className={
                          isClickable ? 'cursor-pointer hover:underline' : ''
                        }
                        onClick={() =>
                          isClickable
                            ? handleRowClick(row.original.id)
                            : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : globalFilter ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 bg-transparent hover:bg-sky-300/10 text-center">
                  No results for &quot;<strong>{globalFilter}</strong>&quot;. Try different keywords!
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 bg-transparent hover:bg-sky-300/10 text-center">
                 Whoops! No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </UITable>
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} />

      {/* Sheet Drawer (Conditional) */}
      {mode === 'inbox' ? (
        <MessageDetailsDrawer
          open={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          messageId={selectedId}
        />
      ) : (
        <UserDetailsSheet
          open={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          userId={selectedId}
        />
      )}
    </div>
  );
}
