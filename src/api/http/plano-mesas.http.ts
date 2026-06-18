import { apiClient } from '@api/client'
import { buildPlanoSalon } from '@api/shared/plano/build-plano-salon'
import type {
  BloqueoMesa,
  Cliente,
  Mesa,
  Reserva,
  Turno,
  Zona,
} from '@api/types/domain.types'
import type { PlanoSalonParams } from '@api/types/plano-mesas.types'

export async function fetchPlanoSalonHttp(
  params: PlanoSalonParams,
): Promise<ReturnType<typeof buildPlanoSalon>> {
  const [zonasRes, mesasRes, reservasRes, bloqueosRes, clientesRes, turnosRes] =
    await Promise.all([
      apiClient.get<Zona[]>('/Zona'),
      apiClient.get<Mesa[]>('/Mesa'),
      apiClient.get<Reserva[]>('/Reserva'),
      apiClient.get<BloqueoMesa[]>('/BloqueoMesa'),
      apiClient.get<Cliente[]>('/Cliente'),
      apiClient.get<Turno[]>('/Turno'),
    ])

  return buildPlanoSalon(params, {
    zonas: zonasRes.data,
    mesas: mesasRes.data,
    reservas: reservasRes.data,
    bloqueos: bloqueosRes.data,
    clientes: clientesRes.data,
    turnos: turnosRes.data,
  })
}
