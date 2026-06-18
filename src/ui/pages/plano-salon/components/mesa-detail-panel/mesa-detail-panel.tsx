import { Calendar, Clock, User, Ban, Armchair } from 'lucide-react'
import type { PlanoMesaItem } from '@api/types/plano-mesas.types'
import { StatusBadge } from '@ui/shared/components/status-badge/status-badge'

type MesaDetailPanelProps = {
  mesa: PlanoMesaItem | null
  fecha?: string
}

const estadoLabels = {
  libre: 'Libre',
  reservada: 'Reservada',
  bloqueada: 'Bloqueada',
} as const

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function MesaDetailPanel({ mesa, fecha }: MesaDetailPanelProps) {
  if (!mesa) {
    return (
      <aside className="restaurant-zone-card flex min-h-[240px] flex-col items-center justify-center gap-3 p-6 text-center">
        <Armchair className="size-10 text-cta/40" aria-hidden />
        <p className="text-sm text-muted">
          Toca una mesa en el plano para ver reserva, bloqueo o disponibilidad.
        </p>
      </aside>
    )
  }

  return (
    <aside className="restaurant-zone-card space-y-4 border-cta/20 p-6">
      <div className="flex items-start justify-between gap-2 border-b border-amber-100 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cta">
            Detalle de mesa
          </p>
          <h3 className="font-display text-2xl text-primary">Mesa {mesa.mesaId}</h3>
          <p className="text-sm text-muted">
            {mesa.zonaNombre} · hasta {mesa.capacidad} comensales
            {fecha ? ` · ${fecha}` : ''}
          </p>
        </div>
        <StatusBadge label={estadoLabels[mesa.estado]} />
      </div>

      {mesa.estado === 'libre' && (
        <p className="rounded-md border border-success/20 bg-success-light px-3 py-3 text-sm text-success">
          Disponible para asignar en este turno.
        </p>
      )}

      {mesa.estado === 'reservada' && mesa.reserva && (
        <ul className="space-y-3 text-sm">
          <li className="flex items-center gap-2 font-medium text-primary-dark">
            <User className="size-4 text-cta" aria-hidden />
            {mesa.reserva.clienteNombre}
          </li>
          <li className="flex items-center gap-2 text-muted">
            <Clock className="size-4" aria-hidden />
            {formatTime(mesa.reserva.horaInicio)} – {formatTime(mesa.reserva.horaFin)}
          </li>
          <li className="flex items-center gap-2 text-muted">
            <Calendar className="size-4" aria-hidden />
            {mesa.reserva.cantidadPersonas} comensales · Reserva #{mesa.reserva.reservaId}
          </li>
        </ul>
      )}

      {mesa.estado === 'bloqueada' && (
        <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950">
          <Ban className="mt-0.5 size-4 shrink-0 text-cta" aria-hidden />
          {mesa.bloqueoDetalle ?? 'Mesa bloqueada en este horario'}
        </p>
      )}
    </aside>
  )
}
