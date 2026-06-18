import type {
  Cliente,
  EstadoDeReserva,
  Mesa,
  Turno,
  Zona,
} from '@api/types/domain.types'

export function clienteNombre(
  clientes: Cliente[],
  clienteId: number,
): string {
  const c = clientes.find((x) => x.clienteId === clienteId)
  return c ? `${c.nombre} ${c.apellidos}` : `#${clienteId}`
}

export function mesaLabel(mesas: Mesa[], mesaId: number): string {
  const m = mesas.find((x) => x.mesaId === mesaId)
  return m ? `Mesa ${m.mesaId} (${m.capacidad}p)` : `#${mesaId}`
}

export function zonaNombre(zonas: Zona[], zonaId: number): string {
  return zonas.find((z) => z.zonaId === zonaId)?.seccion ?? `#${zonaId}`
}

export function turnoLabel(turnos: Turno[], turnoId: number): string {
  const t = turnos.find((x) => x.turnoId === turnoId)
  return t ? `${t.horaInicio}:00 – ${t.horaFin}:00` : `#${turnoId}`
}

export function estadoLabel(
  estados: EstadoDeReserva[],
  estadoId: number,
): string {
  return estados.find((e) => e.estadoDeReservaId === estadoId)?.estado ?? '—'
}
