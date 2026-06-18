import { apiClient } from '@api/client'
import type { BloqueoMesa, BloqueoMesaFormPayload } from '@api/types/domain.types'

export async function getBloqueosHttp(): Promise<BloqueoMesa[]> {
  const { data } = await apiClient.get<BloqueoMesa[]>('/BloqueoMesa')
  return data
}

export async function createBloqueoHttp(payload: BloqueoMesaFormPayload): Promise<BloqueoMesa> {
  const { data } = await apiClient.post<BloqueoMesa>('/BloqueoMesa', {
    bloqueoMesaId: 0,
    ...payload,
  })
  return data
}

export async function deleteBloqueoHttp(id: number): Promise<void> {
  await apiClient.delete(`/BloqueoMesa/${id}`)
}

export async function bloquearZonaHttp(
  zonaId: number,
  inicio: string,
  fin: string,
): Promise<BloqueoMesa[]> {
  const { data } = await apiClient.post<BloqueoMesa[]>(
    `/BloqueoMesa/zona?zonaId=${zonaId}&inicio=${encodeURIComponent(inicio)}&fin=${encodeURIComponent(fin)}`,
  )
  return data
}
