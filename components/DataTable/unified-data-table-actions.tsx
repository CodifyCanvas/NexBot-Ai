'use client';

import { Table as ReactTable } from '@tanstack/react-table';
import { TableBulkDeleteAction } from './table-bulk-delete-action';
import { refetchContactMessages, refetchUsers } from '@/lib/swr/mutateUsers';

interface UnifiedDataTableActionsProps {
  table: ReactTable<any>;
  mode: 'user' | 'inbox'; // determines what type of data and API to use
}

/**
 * UnifiedDataTableActions
 * Renders bulk delete action component configured based on the mode.
 * - mode 'user': bulk delete users
 * - mode 'inbox': bulk delete inbox messages
 */

export function UnifiedDataTableActions({
  table,
  mode,
}: UnifiedDataTableActionsProps) {
  switch (mode) {
    case 'user':
      return (
        <TableBulkDeleteAction
          table={table}
          entityName="user"
          apiEndpoint="/api/user/delete-many-users"
          onSuccess={refetchUsers}
        />
      );

    case 'inbox':
      return (
        <TableBulkDeleteAction
          table={table}
          entityName="message"
          apiEndpoint="/api/contact/delete-many-messages"
          onSuccess={refetchContactMessages}
        />
      );

    default:
      return null; // no action for unknown mode
  }
}
