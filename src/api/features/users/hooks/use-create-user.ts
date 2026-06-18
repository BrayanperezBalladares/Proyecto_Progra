import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createUserMutationOptions,
  userKeys,
} from '../queries/users.queries'
import type { CreateUserPayload } from '../types/user.types'

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    ...createUserMutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() })
    },
  })
}

export type { CreateUserPayload }
