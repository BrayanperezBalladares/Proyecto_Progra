import { queryOptions } from '@tanstack/react-query'
import { createMesa, getMesas } from '../services/mesas.service'
import type { MesaFormPayload } from '@api/types/domain.types'

export const mesaKeys = {
  all: ['mesas'] as const,
  list: () => [...mesaKeys.all, 'list'] as const,
}

export function mesasQueryOptions() {
  return queryOptions({ queryKey: mesaKeys.list(), queryFn: getMesas })
}

export const createMesaMutationOptions = {
  mutationFn: (payload: MesaFormPayload) => createMesa(payload),
}
