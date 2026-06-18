import { useQuery } from '@tanstack/react-query'
import { usersQueryOptions } from '../queries/users.queries'

export function useUsers() {
  return useQuery(usersQueryOptions())
}
