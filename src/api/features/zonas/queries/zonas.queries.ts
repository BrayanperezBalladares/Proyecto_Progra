import { queryOptions } from '@tanstack/react-query'
import { createZona, deleteZona, getZonas, updateZona } from '../services/zonas.service'
import type { ZonaFormPayload } from '@api/types/domain.types'

export const zonaKeys = {
  all: ['zonas'] as const,
  list: () => [...zonaKeys.all, 'list'] as const,
}

export function zonasQueryOptions() {
  return queryOptions({ queryKey: zonaKeys.list(), queryFn: getZonas })
}

export const createZonaMutationOptions = {
  mutationFn: (payload: ZonaFormPayload) => createZona(payload),
}

export const updateZonaMutationOptions = {
  mutationFn: ({ id, payload }: { id: number; payload: ZonaFormPayload }) =>
    updateZona(id, payload),
}

export const deleteZonaMutationOptions = {
  mutationFn: (id: number) => deleteZona(id),
}
