import { useQuery } from '@tanstack/react-query'
import { mesasQueryOptions } from '../queries/mesas.queries'

export function useMesas() {
  return useQuery(mesasQueryOptions())
}
