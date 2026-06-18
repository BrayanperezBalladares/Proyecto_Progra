import { useQuery } from '@tanstack/react-query'
import { planoSalonQueryOptions } from '../queries/plano-mesas.queries'
import type { PlanoSalonParams } from '@api/types/plano-mesas.types'

export function usePlanoSalon(params: PlanoSalonParams) {
  return useQuery(planoSalonQueryOptions(params))
}
