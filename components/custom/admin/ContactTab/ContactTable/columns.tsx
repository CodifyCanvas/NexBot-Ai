'use client';

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getColorByLetter } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/DataTable/data-table-column-header";
import { DeleteContactMessageDialogButton } from "../delete-contact-message-alert";
import { DeleteRowDialogButton } from "@/components/DataTable/delete-table-row-dialog";
import { refetchContactMessages } from "@/lib/swr/mutateUsers";

// Contact message type
export type ContactTable = {
  id: number;
  name: string;
  email: string;
  message: string;
  respondedAt: Date | null;
  createdAt: Date;
};

// Columns for the Contact Message Table
export const columns: ColumnDef<ContactTable>[] = [
  // ✅ Bulk select checkbox column
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(checked) =>
          table.toggleAllPageRowsSelected(!!checked)
        }
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

  // ✅ ID column
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div className="text-left font-medium">{row.original.id}</div>
    ),
    responsive: "sm",
  },

  // ✅ Name column with avatar
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.name;
      const firstLetter = name.charAt(0).toUpperCase();
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={""} />
            <AvatarFallback className={getColorByLetter(name)}>
              {firstLetter}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{name}</span>
        </div>
      );
    },
  },

  // ✅ Email column
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },

  // ✅ Message column (truncated for readability)
  {
    accessorKey: "message",
    header: "Message",
    responsive: "md",
    cell: ({ row }) => {
      const message = row.original.message;
      return (
        <div className="max-w-[200px] truncate whitespace-nowrap overflow-hidden text-ellipsis">
          {message}
        </div>
      );
    },
  },

  // ✅ Responded status column
  {
    accessorKey: "respondedAt",
    header: "Responded",
    cell: ({ row }) => {
      const hasResponded = Boolean(row.original.respondedAt);
      return (
        <div className="flex justify-center">
          <Badge
            className={
              hasResponded
                ? "bg-blue-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-300"
                : "bg-yellow-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-300"
            }
          >
            {hasResponded ? "Yes" : "No"}
          </Badge>
        </div>
      );
    },
    enableColumnFilter: true,
  },

  // ✅ Received date column
  {
    accessorKey: "createdAt",
    header: "Received",
    responsive: "all",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="flex justify-center w-20">
          <p className="max-w-10 w-fit text-ellipsis">
            {date.toLocaleDateString()}
          </p>
        </div>
      );
    },
  },

  // ✅ Actions column (e.g., Delete)
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <DeleteRowDialogButton id={row.original.id} entityName="message" apiBasePath="/api/contact" refetchData={refetchContactMessages} buttonLabel="Delete" />
      </div>
    ),
  },
];
