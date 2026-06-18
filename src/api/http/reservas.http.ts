import { apiClient } from '@api/client'
import type { Reserva, ReservaFormPayload } from '@api/types/domain.types'

export async function getReservasHttp(): Promise<Reserva[]> {
  const { data } = await apiClient.get<Reserva[]>('/Reserva')
  return data
}

export async function createReservaHttp(payload: ReservaFormPayload): Promise<Reserva> {
  const { data } = await apiClient.post<Reserva>('/Reserva', {
    reservaId: 0,
    estadoDeReservaId: 1,
    ...payload,
  })
  return data
}

export async function updateReservaHttp(id: number, payload: ReservaFormPayload): Promise<Reserva> {
  const { data } = await apiClient.put<Reserva>(`/Reserva/${id}`, {
    reservaId: id,
    estadoDeReservaId: 1,
    ...payload,
  })
  return data
}

export async function cancelarReservaHttp(id: number): Promise<Reserva> {
  const { data } = await apiClient.put<Reserva>(`/Reserva/${id}/cancelar`)
  return data
}

export async function cambiarEstadoReservaHttp(id: number, estadoId: number): Promise<Reserva> {
  const { data } = await apiClient.put<Reserva>(`/Reserva/${id}/estado/${estadoId}`)
  return data
}

export async function deleteReservaHttp(id: number): Promise<void> {
  await apiClient.delete(`/Reserva/${id}`)
}

export async function getMisReservasHttp(): Promise<Reserva[]> {
  const { data } = await apiClient.get<Reserva[]>('/Reserva/mis-reservas')
  return data
}
