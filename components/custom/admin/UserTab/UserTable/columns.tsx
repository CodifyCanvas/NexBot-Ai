"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getColorByLetter } from "@/lib/utils"
import { DataTableColumnHeader } from "./data-table-column-header"
import ToggleVerified from "./Toggle-verified"
import { DeleteUserDialogButton } from "../delete-user-alert"
import { useEffect, useState } from "react"

// Define the user type
export type UsersTable = {
  id: string
  profileImg: string
  name: string
  email: string
  admin: boolean
  verified: boolean
}

// Column definitions for the table
export const columns: ColumnDef<UsersTable>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
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
    accessorKey: "id",
    responsive: "sm", // 👈 Custom field
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div className="text-left font-medium">{row.original.id}</div>
    ),
  },

  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const { name, profileImg } = row.original
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={profileImg} />
            <AvatarFallback className={getColorByLetter(name)}>
              {name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{name}</span>
        </div>
      )
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },

  {
    accessorKey: "admin",
    header: "Admin",
    responsive: "md", // 👈 Custom field
    cell: ({ row }) => {
      const isAdmin = row.original.admin
      return (
        <div className="flex justify-center w-20">
          <Badge
            className={
              isAdmin
                ? "bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-300"
                : "bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-900 dark:text-yellow-300"
            }
          >
            {isAdmin ? "admin" : "user"}
          </Badge>
        </div>
      )
    },
  },

  {
  accessorKey: "verified",
  header: "Verified",
  cell: ({ row }) => {
    return <ToggleVerified data={row.original} />;
  }
  },

  {
  id: "actions",
  header: "Actions",
  cell: ({ row }) => (
    <div className="flex items-center gap-2">
      {/* ✅ Render the delete dialog here */}
      <DeleteUserDialogButton userId={row.original.id} />
    </div>
  ),
}

]

