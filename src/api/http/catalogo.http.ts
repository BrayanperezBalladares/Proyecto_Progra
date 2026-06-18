import { apiClient } from '@api/client'
import type { EstadoDeReserva, Turno, Zona } from '@api/types/domain.types'

export async function fetchZonasHttp() {
  const { data } = await apiClient.get<Zona[]>('/Zona')
  return data
}

export async function fetchTurnosHttp() {
  const { data } = await apiClient.get<Turno[]>('/Turno')
  return data
}

export async function fetchEstadosHttp() {
  const { data } = await apiClient.get<EstadoDeReserva[]>('/EstadoDeReserva')
  return data
}
