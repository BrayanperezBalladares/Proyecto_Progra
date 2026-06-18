import { useQuery } from '@tanstack/react-query'
import { reservasQueryOptions } from '../queries/reservas.queries'

export function useReservas() {
  return useQuery(reservasQueryOptions())
}
