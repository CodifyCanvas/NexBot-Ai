"use client"

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
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"
import { useState } from "react"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableViewOptions } from "./data-table-view-options"
import { UserDetailsSheet } from "../UserSheet/user-details-sheet"
import { cn } from "@/lib/utils"
import { DataTableActions } from "./data-table-action"

// Props
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

// Global filter function: filters by name OR email
function globalFilterFn<TData>(row: any, _columnId: string, filterValue: string) {
  const search = filterValue.toLowerCase()
  const name = row.original.name?.toLowerCase() ?? ""
  const email = row.original.email?.toLowerCase() ?? ""
  return name.includes(search) || email.includes(search)
}

// Component
export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  // State
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Table instance
  const table = useReactTable({
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
  })

  // Handle row click
  const handleRowClick = (id: string) => {
    setSelectedUserId(id)
    setIsSheetOpen(true)
  }

  // JSX
  return (
    <div className="space-y-4">
      {/* Top controls */}
      <div className="flex items-center gap-4">
        <Input
          type="text"
          placeholder="Filter by name or email..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm py-2 bg-white backdrop-blur-md shadow-lg outline-1 outline-white/20 transition-all duration-300"
        />
        <div className="flex flex-row items-center gap-2 ml-auto">
          <DataTableActions table={table} />
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table className="w-full border-separate border-spacing-y-2">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                  data-state={row.getIsSelected() && "selected"}
                  className={"bg-transparent border-none hover:bg-white/10 transition-colors data-[state=selected]:bg-sky-300/15"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const columnId = cell.column.id

                    const isClickable =
                      columnId === "name" || columnId === "email"

                    return (
                      <TableCell
                        key={cell.id}
                        className={isClickable ? "cursor-pointer hover:underline" : ""}
                        onClick={() =>
                          isClickable ? handleRowClick(row.original.id) : undefined
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} />

      {/* Sheet component */}
      <UserDetailsSheet
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        userId={selectedUserId}
      />
    </div>
  )
}
