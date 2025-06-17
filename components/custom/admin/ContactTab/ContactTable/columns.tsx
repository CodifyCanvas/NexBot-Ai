'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDateDDMonYYYY, getColorByLetter } from '@/lib/utils';
import { DataTableColumnHeader } from '@/components/DataTable/data-table-column-header';
import { DataTableRespondedColumnHeader } from './dataTable-responded-column-header';
import { DeleteRowDialogButton } from '@/components/DataTable/delete-table-row-dialog';
import { refetchContactMessages } from '@/lib/swr/mutateUsers';
import { ContactTable } from '@/lib/definations';

// Extend ColumnDef with optional responsive prop
type ResponsiveColumn<T, V> = ColumnDef<T, V> & {
  responsive?: 'base' | 'sm' | 'md' | 'lg' | 'xl' | 'all';
};

export const columns: ResponsiveColumn<ContactTable, unknown>[] = [
  // Bulk select checkbox
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(!!checked)}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(!!checked)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ID column (responsive 'sm')
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <div className="text-left font-medium">{row.index + 1}</div>,
    responsive: 'sm',
  },

  // Name column with avatar
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const name = row.original.name ?? '';
      const firstLetter = name.charAt(0).toUpperCase();
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" alt={name} />
            <AvatarFallback className={getColorByLetter(name)}>{firstLetter}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{name}</span>
        </div>
      );
    },
  },

  // Email column
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },

  // Message column (responsive 'md')
  {
    accessorKey: 'message',
    header: 'Message',
    responsive: 'md',
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate whitespace-nowrap overflow-hidden text-ellipsis">
        {row.original.message}
      </div>
    ),
  },

  // Responded status column with filtering
  {
    accessorKey: 'respondedAt',
    header: ({ column }) => <DataTableRespondedColumnHeader column={column} title="Responded" />,
    cell: ({ row }) => {
      const hasResponded = Boolean(row.original.respondedAt);
      return (
        <div className="flex justify-center">
          <Badge
            className={
              hasResponded
                ? 'bg-blue-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-300'
                : 'bg-yellow-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-300'
            }
          >
            {hasResponded ? 'Yes' : 'No'}
          </Badge>
        </div>
      );
    },
    filterFn: (row, columnId, value) => {
      const respondedAt = row.getValue<Date | null>(columnId);
      if (value === 'responded') return respondedAt !== null;
      if (value === 'unresponded') return respondedAt === null;
      return true;
    },
    enableColumnFilter: true,
  },

  // Received date column (responsive 'all')
  {
    accessorKey: 'createdAt',
    header: 'Received',
    responsive: 'all',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="flex justify-center w-20">
          <p className="max-w-10 w-fit text-ellipsis">{formatDateDDMonYYYY(date)}</p>
        </div>
      ); 
    },
  },

  // Actions column with Delete button
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <DeleteRowDialogButton
          id={row.original.id}
          entityName="message"
          apiBasePath="/api/contact"
          refetchData={refetchContactMessages}
          buttonLabel="Delete"
          confirmDescription="This action cannot be undone. This will permanently delete the message."
        />
      </div>
    ),
  },
];
