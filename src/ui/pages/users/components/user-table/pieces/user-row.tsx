import { flexRender, type Row } from '@tanstack/react-table'
import type { User } from '@api/features/users/types/user.types'

type UserRowProps = {
  row: Row<User>
}

export function UserRow({ row }: UserRowProps) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="px-4 py-3 text-left text-sm text-gray-700">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  )
}
