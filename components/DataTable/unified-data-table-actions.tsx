import { Table } from '@tanstack/react-table';
import { refetchUsers, refetchContactMessages } from '@/lib/swr/mutateUsers';
import { TableBulkDeleteAction } from './table-bulk-delete-action';

type UnifiedDataTableActionsProps<T extends { id: string | number }> = {
  mode: 'user' | 'inbox';
  table: Table<T>;
};


export function UnifiedDataTableActions<T extends { id: string | number }>(
  props: UnifiedDataTableActionsProps<T>
) {
  const { mode, table } = props;

  if (mode === 'user') {
    return (
      <TableBulkDeleteAction<T>
        table={table}
        entityName="user"
        apiEndpoint="/api/user/delete-many-users"
        onSuccess={refetchUsers}
      />
    );
  } else if (mode === 'inbox') {
    return (
      <TableBulkDeleteAction<T>
        table={table}
        entityName="message"
        apiEndpoint="/api/contact/delete-many-messages"
        onSuccess={refetchContactMessages}
      />
    );
  }
  return null;
}

