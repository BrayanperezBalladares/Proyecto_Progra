import type { User } from '@api/features/users/types/user.types'

export type UserTableProps = {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  isDeletingId?: number | null
}

export type UserTableColumnActions = {
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  isDeletingId?: number | null
}
