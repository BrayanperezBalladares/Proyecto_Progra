import { queryOptions } from '@tanstack/react-query'
import { getPlanoSalon } from '../services/plano-mesas.service'
import type { PlanoSalonParams } from '@api/types/plano-mesas.types'

export const planoMesasKeys = {
  all: ['plano-mesas'] as const,
  salon: (params: PlanoSalonParams) =>
    [...planoMesasKeys.all, 'salon', params] as const,
}

export function planoSalonQueryOptions(params: PlanoSalonParams) {
  return queryOptions({
    queryKey: planoMesasKeys.salon(params),
    queryFn: () => getPlanoSalon(params),
    staleTime: 10_000,
  })
}
