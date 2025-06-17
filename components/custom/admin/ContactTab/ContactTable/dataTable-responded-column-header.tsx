import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableRespondedColumnHeaderProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, unknown>;
  title: string;
}

export function DataTableRespondedColumnHeader<TData>({
  column,
  title,
  className,
}: DataTableRespondedColumnHeaderProps<TData>) {
  const filterValue = (column.getFilterValue() as string) || "all";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-3 h-8"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-1 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="ml-1 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="mr-2 h-4 w-4" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="mr-2 h-4 w-4" />
            Desc
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Filter options */}
          <DropdownMenuItem
            onClick={() => column.setFilterValue(undefined)}
            className={filterValue === "all" ? "font-semibold" : ""}
          >
            All
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => column.setFilterValue("responded")}
            className={filterValue === "responded" ? "font-semibold" : ""}
          >
            Responded
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => column.setFilterValue("unresponded")}
            className={filterValue === "unresponded" ? "font-semibold" : ""}
          >
            Unresponded
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="mr-2 h-4 w-4" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
