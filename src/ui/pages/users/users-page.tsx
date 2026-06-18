import { useState } from 'react'
import { useCreateUser } from '@api/features/users/hooks/use-create-user'
import { useDeleteUser } from '@api/features/users/hooks/use-delete-user'
import { useUpdateUser } from '@api/features/users/hooks/use-update-user'
import { useUsers } from '@api/features/users/hooks/use-users'
import type { User } from '@api/features/users/types/user.types'
import { isApiError } from '@api/client'
import { ConfirmDialog } from '@ui/shared/components/confirm-dialog/confirm-dialog'
import { ErrorMessage } from '@ui/shared/components/error-message/error-message'
import { LoadingSpinner } from '@ui/shared/components/loading-spinner/loading-spinner'
import { UserForm } from './components/user-form/user-form'
import { UserTable } from './components/user-table/user-table'

export function UsersPage() {
  const { data: users, isLoading, isError, error } = useUsers()
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const listErrorMessage =
    isError && isApiError(error)
      ? error.message
      : isError
        ? 'Failed to load users'
        : null

  const mutationError =
    (createUserMutation.isError && createUserMutation.error) ||
    (updateUserMutation.isError && updateUserMutation.error) ||
    (deleteUserMutation.isError && deleteUserMutation.error)

  const mutationErrorMessage =
    mutationError && isApiError(mutationError)
      ? mutationError.message
      : mutationError
        ? 'Operation failed'
        : null

  const handleEdit = (user: User) => {
    setEditingUser(user)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
  }

  const handleConfirmDelete = () => {
    if (!userToDelete) return
    deleteUserMutation.mutate(
      { id: userToDelete.id },
      {
        onSuccess: () => {
          setUserToDelete(null)
          if (editingUser?.id === userToDelete.id) {
            setEditingUser(null)
          }
        },
      },
    )
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">User management</h1>
        <p className="mt-1 text-sm text-gray-600">
          List, create, update, and delete users
        </p>
      </header>

      {editingUser ? (
        <UserForm
          key={editingUser.id}
          mode="edit"
          initialValues={{
            name: editingUser.name,
            email: editingUser.email,
            username: editingUser.username,
          }}
          isSubmitting={updateUserMutation.isPending}
          onCancel={handleCancelEdit}
          onSubmit={(payload) =>
            updateUserMutation.mutate(
              { id: editingUser.id, payload },
              { onSuccess: () => setEditingUser(null) },
            )
          }
        />
      ) : (
        <UserForm
          key="create"
          mode="create"
          isSubmitting={createUserMutation.isPending}
          onSubmit={(payload) => createUserMutation.mutate(payload)}
        />
      )}

      {mutationErrorMessage && (
        <ErrorMessage message={mutationErrorMessage} />
      )}

      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {listErrorMessage && <ErrorMessage message={listErrorMessage} />}

      {users && users.length > 0 && (
        <UserTable
          users={users}
          onEdit={handleEdit}
          onDelete={setUserToDelete}
          isDeletingId={
            deleteUserMutation.isPending ? userToDelete?.id ?? null : null
          }
        />
      )}

      {users && users.length === 0 && (
        <p className="text-sm text-gray-500">No users found.</p>
      )}

      <ConfirmDialog
        isOpen={userToDelete !== null}
        title="Delete user"
        description={
          userToDelete ? (
            <>
              Are you sure you want to delete{' '}
              <strong>{userToDelete.name}</strong>? This action cannot be undone.
            </>
          ) : null
        }
        confirmLabel="Delete"
        isConfirming={deleteUserMutation.isPending}
        onCancel={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
