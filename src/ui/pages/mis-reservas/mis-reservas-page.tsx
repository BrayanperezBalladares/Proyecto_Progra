import { useQuery } from '@tanstack/react-query'
import { getMisReservas } from '@api/features/reservas/services/reservas.service'
import { useAuth } from '@api/shared/hooks/use-auth'
import { CalendarCheck } from 'lucide-react'

export function MisReservasPage() {
  const { user } = useAuth()
  const { data: reservas = [], isLoading } = useQuery({
    queryKey: ['mis-reservas'],
    queryFn: getMisReservas,
    enabled: !!user,
  })

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <CalendarCheck className="size-6 text-cta" />
        <h1 className="text-2xl font-bold text-primary">Mis reservas</h1>
      </div>

      {isLoading && (
        <p className="text-sm text-muted">Cargando reservas…</p>
      )}

      {!isLoading && reservas.length === 0 && (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted">No tienes reservas registradas.</p>
        </div>
      )}

      {!isLoading && reservas.length > 0 && (
        <ul className="flex flex-col gap-3">
          {reservas.map((r) => (
            <li
              key={r.reservaId}
              className="rounded-xl border border-border bg-surface px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  Mesa {r.mesaId} — {new Date(r.fecha).toLocaleDateString('es-CR')}
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Estado {r.estadoDeReservaId}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {new Date(r.horaInicio).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}
                {' – '}
                {new Date(r.horaFin).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}
                {' · '}
                {r.cantidadPersonas} personas
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
