'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getColorByLetter } from '@/lib/utils';
import { DataTableColumnHeader } from '@/components/DataTable/data-table-column-header';
import ToggleVerified from './Toggle-verified';
import { DeleteRowDialogButton } from '@/components/DataTable/delete-table-row-dialog';
import { refetchUsers } from '@/lib/swr/mutateUsers';
import { UserTable } from '@/lib/definations';

// Extended column type to support `responsive`
type ResponsiveColumn<T> = ColumnDef<T, unknown> & {
  responsive?: 'base' | 'sm' | 'md' | 'lg' | 'xl' | 'all';
};

export const columns: ResponsiveColumn<UserTable>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'id',
    responsive: 'sm',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="#" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.index + 1}</span>
    ),
  },

  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const { name, profileImg } = row.original;
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={profileImg ? profileImg : undefined} />
            <AvatarFallback className={getColorByLetter(name)}>
              {name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{name}</span>
        </div>
      );
    },
  },

  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <span>{row.original.email}</span>,
  },

  {
    accessorKey: 'admin',
    responsive: 'md',
    header: 'Admin',
    cell: ({ row }) => {
      const isAdmin = Boolean(row.original.admin);
      return (
        <div className="flex justify-center w-20">
          <Badge
            className={
              isAdmin
                ? 'bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-300'
                : 'bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-900 dark:text-yellow-300'
            }
          >
            {isAdmin ? 'Admin' : 'User'}
          </Badge>
        </div>
      );
    },
  },

  {
    accessorKey: 'verified',
    header: 'Verified',
    cell: ({ row }) => <ToggleVerified user={row.original} />,
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <DeleteRowDialogButton
          id={row.original.id}
          entityName="user"
          apiBasePath="/api/user"
          refetchData={refetchUsers}
          buttonLabel="Delete User"
          confirmDescription="This action cannot be undone. This will permanently delete the user and all associated data."
        />
      </div>
    ),
  },
];
