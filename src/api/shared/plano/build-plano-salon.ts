import { getDefaultLayout } from '@api/mock/mesa-layout'
import type {
  BloqueoMesa,
  Cliente,
  Mesa,
  Reserva,
  Turno,
  Zona,
} from '@api/types/domain.types'
import { toDateOnly } from '@api/types/domain.types'
import type { PlanoSalon, PlanoSalonParams } from '@api/types/plano-mesas.types'

function parseDate(iso: string): number {
  return new Date(iso).getTime()
}

function rangesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string,
): boolean {
  return parseDate(startA) < parseDate(endB) && parseDate(endA) > parseDate(startB)
}

export function buildPlanoSalon(
  params: PlanoSalonParams,
  data: {
    zonas: Zona[]
    mesas: Mesa[]
    turnos: Turno[]
    reservas: Reserva[]
    bloqueos: BloqueoMesa[]
    clientes: Cliente[]
  },
): PlanoSalon {
  const { fecha, turnoId } = params
  const turno = data.turnos.find((t) => t.turnoId === turnoId)
  if (!turno) throw new Error('Turno no encontrado')

  const horaInicio = `${fecha}T${String(turno.horaInicio).padStart(2, '0')}:00:00`
  const horaFin = `${fecha}T${String(turno.horaFin).padStart(2, '0')}:00:00`
  const turnoLabel = `${turno.horaInicio}:00 – ${turno.horaFin}:00`

  const reservasDia = data.reservas.filter((r) => toDateOnly(r.fecha) === fecha)

  const zonas = data.zonas.map((zona) => {
    const mesas = data.mesas
      .filter((m) => m.zonaId === zona.zonaId)
      .map((mesa) => {
        const bloqueo = data.bloqueos.find(
          (b) =>
            b.mesaId === mesa.mesaId &&
            toDateOnly(b.fecha) === fecha &&
            rangesOverlap(horaInicio, horaFin, b.horaInicio, b.horaFin),
        )

        const reserva = reservasDia.find(
          (r) =>
            r.mesaId === mesa.mesaId &&
            r.estadoDeReservaId === 1 &&
            rangesOverlap(horaInicio, horaFin, r.horaInicio, r.horaFin),
        )

        let estado: 'libre' | 'reservada' | 'bloqueada' = 'libre'
        if (bloqueo) estado = 'bloqueada'
        else if (reserva) estado = 'reservada'

        const cliente = reserva
          ? data.clientes.find((c) => c.clienteId === reserva.clienteId)
          : undefined

        return {
          mesaId: mesa.mesaId,
          capacidad: mesa.capacidad,
          zonaId: zona.zonaId,
          zonaNombre: zona.seccion,
          estado,
          layout: getDefaultLayout(mesa.mesaId),
          reserva: reserva
            ? {
                reservaId: reserva.reservaId,
                clienteNombre: cliente
                  ? `${cliente.nombre} ${cliente.apellidos}`
                  : `Cliente #${reserva.clienteId}`,
                cantidadPersonas: reserva.cantidadPersonas,
                horaInicio: reserva.horaInicio,
                horaFin: reserva.horaFin,
              }
            : undefined,
          bloqueoDetalle: bloqueo?.detalle,
        }
      })

    return { zonaId: zona.zonaId, seccion: zona.seccion, mesas }
  })

  const allMesas = zonas.flatMap((z) => z.mesas)
  return {
    fecha,
    turnoId,
    turnoLabel,
    horaInicio,
    horaFin,
    zonas,
    resumen: {
      total: allMesas.length,
      libres: allMesas.filter((m) => m.estado === 'libre').length,
      reservadas: allMesas.filter((m) => m.estado === 'reservada').length,
      bloqueadas: allMesas.filter((m) => m.estado === 'bloqueada').length,
    },
  }
}
