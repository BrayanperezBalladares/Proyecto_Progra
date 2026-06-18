import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  cancelarReservaMutationOptions,
  cambiarEstadoReservaMutationOptions,
  createReservaMutationOptions,
  deleteReservaMutationOptions,
  reservaKeys,
  updateReservaMutationOptions,
} from '../queries/reservas.queries'

export function useCreateReserva() {
  const qc = useQueryClient()
  return useMutation({
    ...createReservaMutationOptions,
    onSuccess: () => qc.invalidateQueries({ queryKey: reservaKeys.all }),
  })
}

export function useUpdateReserva() {
  const qc = useQueryClient()
  return useMutation({
    ...updateReservaMutationOptions,
    onSuccess: () => qc.invalidateQueries({ queryKey: reservaKeys.all }),
  })
}

export function useCancelarReserva() {
  const qc = useQueryClient()
  return useMutation({
    ...cancelarReservaMutationOptions,
    onSuccess: () => qc.invalidateQueries({ queryKey: reservaKeys.all }),
  })
}

export function useCambiarEstadoReserva() {
  const qc = useQueryClient()
  return useMutation({
    ...cambiarEstadoReservaMutationOptions,
    onSuccess: () => qc.invalidateQueries({ queryKey: reservaKeys.all }),
  })
}

export function useDeleteReserva() {
  const qc = useQueryClient()
  return useMutation({
    ...deleteReservaMutationOptions,
    onSuccess: () => qc.invalidateQueries({ queryKey: reservaKeys.all }),
  })
}
