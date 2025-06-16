"use client"

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Table } from "@tanstack/react-table"
import { Columns3Cog } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function DataTableViewOptions<TData>({
  table,
}: {
  table: Table<TData>
}) {

  const columnLabelMap: Record<string, string> = {
    // add overrides as needed
  id: 'Serial No',
  createdAt: 'Recieved',
  respondedAt: 'Responded',
};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex bg-white/50"
        >
          <Columns3Cog />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
  <DropdownMenuSeparator />
  {table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    )
    .map((column) => {
      const label = columnLabelMap[column.id] ?? column.id;
      return (
        <DropdownMenuCheckboxItem
          key={column.id}
          className="capitalize focus:bg-blue-400/50"
          checked={column.getIsVisible()}
          onCheckedChange={(value) => column.toggleVisibility(!!value)}
        >
          {label}
        </DropdownMenuCheckboxItem>
      );
    })}
</DropdownMenuContent>

    </DropdownMenu>
  )
}
