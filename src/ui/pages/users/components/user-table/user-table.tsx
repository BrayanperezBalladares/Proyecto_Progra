import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import { createUserTableColumns } from './user-table.columns'
import type { UserTableProps } from './user-table.types'
import { UserRow } from './pieces/user-row'

export function UserTable({
  users,
  onEdit,
  onDelete,
  isDeletingId = null,
}: UserTableProps) {
  const columns = useMemo(
    () =>
      createUserTableColumns({
        onEdit,
        onDelete,
        isDeletingId,
      }),
    [onEdit, onDelete, isDeletingId],
  )

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <UserRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
