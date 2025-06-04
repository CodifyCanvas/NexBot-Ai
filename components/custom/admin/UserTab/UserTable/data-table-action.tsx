import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { refetchUsers } from "@/lib/swr/mutateUsers";

export function DataTableActions({ table }: { table: Table<any> }) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleBulkDelete = async () => {
    const ids = selectedRows.map((row) => row.original.id);

    try {
      const res = await fetch("/api/user/delete-many-users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      console.log("Deleting users with IDs:", ids);
      if (!res.ok) throw new Error("Failed to delete users");

      toast.success("Selected users deleted");
      refetchUsers(); // refresh the list
      table.resetRowSelection(); // clear checkboxes
    } catch (err) {
      console.error(err);
      toast.error("Error deleting selected users");
    }
  };

  if (selectedRows.length === 0) return null;

  return (
    <div className="flex justify-center">
      <Button
        variant="destructive"
        onClick={handleBulkDelete}
        disabled={selectedRows.length === 0}
        className="ml-auto danger_button h-8"
      >
        Delete {selectedRows.length} Selected
      </Button>
    </div>
  );
}
