import { queryOptions } from '@tanstack/react-query'
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../services/users.service'
import type {
  CreateUserPayload,
  DeleteUserVariables,
  UpdateUserVariables,
} from '../types/user.types'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: () => [...userKeys.lists()] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
}

export function usersQueryOptions() {
  return queryOptions({
    queryKey: userKeys.list(),
    queryFn: getUsers,
    staleTime: 60_000,
  })
}

export function userDetailQueryOptions(id: number) {
  return queryOptions({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: id > 0,
  })
}

export function createUserMutationOptions() {
  return {
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
  }
}

export function updateUserMutationOptions() {
  return {
    mutationFn: ({ id, payload }: UpdateUserVariables) => updateUser(id, payload),
  }
}

export function deleteUserMutationOptions() {
  return {
    mutationFn: ({ id }: DeleteUserVariables) => deleteUser(id),
  }
}
