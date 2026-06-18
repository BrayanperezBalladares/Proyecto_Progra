import { queryOptions } from '@tanstack/react-query'
import {
  cancelarReserva,
  cambiarEstadoReserva,
  createReserva,
  deleteReserva,
  getReservas,
  updateReserva,
} from '../services/reservas.service'
import type { ReservaFormPayload } from '@api/types/domain.types'

export const reservaKeys = {
  all: ['reservas'] as const,
  list: () => [...reservaKeys.all, 'list'] as const,
}

export function reservasQueryOptions() {
  return queryOptions({
    queryKey: reservaKeys.list(),
    queryFn: getReservas,
  })
}

export const createReservaMutationOptions = {
  mutationFn: (payload: ReservaFormPayload) => createReserva(payload),
}

export const updateReservaMutationOptions = {
  mutationFn: ({ id, payload }: { id: number; payload: ReservaFormPayload }) =>
    updateReserva(id, payload),
}

export const cancelarReservaMutationOptions = {
  mutationFn: (id: number) => cancelarReserva(id),
}

export const cambiarEstadoReservaMutationOptions = {
  mutationFn: ({ id, estadoId }: { id: number; estadoId: number }) =>
    cambiarEstadoReserva(id, estadoId),
}

export const deleteReservaMutationOptions = {
  mutationFn: (id: number) => deleteReserva(id),
}
