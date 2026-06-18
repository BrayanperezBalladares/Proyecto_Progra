import { Loader2, Pencil, Trash2 } from 'lucide-react'
import type { User } from '@api/features/users/types/user.types'
import { AppIconButton } from '@ui/shell/icon-button/app-icon-button'

type UserActionsProps = {
  user: User
  isDeleting: boolean
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UserActions({
  user,
  isDeleting,
  onEdit,
  onDelete,
}: UserActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <AppIconButton
        label={`Edit ${user.name}`}
        icon={<Pencil className="size-4" aria-hidden="true" />}
        onClick={() => onEdit(user)}
      />
      <AppIconButton
        variant="danger"
        label={`Delete ${user.name}`}
        isLoading={isDeleting}
        icon={<Trash2 className="size-4" aria-hidden="true" />}
        loadingIcon={
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        }
        onClick={() => onDelete(user)}
      />
    </div>
  )
}
