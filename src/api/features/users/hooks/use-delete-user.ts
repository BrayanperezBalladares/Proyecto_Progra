import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  deleteUserMutationOptions,
  userKeys,
} from '../queries/users.queries'
import type { DeleteUserVariables } from '../types/user.types'

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    ...deleteUserMutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() })
    },
  })
}

export type { DeleteUserVariables }
