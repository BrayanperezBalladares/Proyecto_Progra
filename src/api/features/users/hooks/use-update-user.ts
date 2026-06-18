import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  updateUserMutationOptions,
  userKeys,
} from '../queries/users.queries'
import type { UpdateUserVariables } from '../types/user.types'

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    ...updateUserMutationOptions(),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() })
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      })
    },
  })
}

export type { UpdateUserVariables }
