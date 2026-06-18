import { createColumnHelper } from '@tanstack/react-table'
import type { User } from '@api/features/users/types/user.types'
import type { UserTableColumnActions } from './user-table.types'
import { UserActions } from './pieces/user-actions'

const columnHelper = createColumnHelper<User>()

export function createUserTableColumns(actions: UserTableColumnActions) {
  return [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('username', {
      header: 'Username',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original
        const isDeleting = actions.isDeletingId === user.id

        return (
          <UserActions
            user={user}
            isDeleting={isDeleting}
            onEdit={actions.onEdit}
            onDelete={actions.onDelete}
          />
        )
      },
    }),
  ]
}
