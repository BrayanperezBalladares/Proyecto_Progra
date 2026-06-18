import { queryOptions } from '@tanstack/react-query'
import {
  bloquearZona,
  createBloqueo,
  deleteBloqueo,
  getBloqueos,
} from '../services/bloqueos.service'
import type { BloqueoMesaFormPayload } from '@api/types/domain.types'

export const bloqueoKeys = {
  all: ['bloqueos'] as const,
  list: () => [...bloqueoKeys.all, 'list'] as const,
}

export function bloqueosQueryOptions() {
  return queryOptions({
    queryKey: bloqueoKeys.list(),
    queryFn: getBloqueos,
  })
}

export const createBloqueoMutationOptions = {
  mutationFn: (payload: BloqueoMesaFormPayload) => createBloqueo(payload),
}

export const deleteBloqueoMutationOptions = {
  mutationFn: (id: number) => deleteBloqueo(id),
}

export const bloquearZonaMutationOptions = {
  mutationFn: (vars: {
    zonaId: number
    inicio: string
    fin: string
    fecha: string
    detalle: string
  }) => bloquearZona(vars.zonaId, vars.inicio, vars.fin, vars.fecha, vars.detalle),
}
