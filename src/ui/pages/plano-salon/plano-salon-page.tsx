import { useMemo, useState } from 'react'
import { UtensilsCrossed, Wine } from 'lucide-react'
import type { PlanoMesaItem } from '@api/types/plano-mesas.types'
import { usePlanoSalon } from '@api/features/plano-mesas/hooks/use-plano-salon'
import { useTurnos } from '@api/shared/lookups/use-lookups'
import { isApiError } from '@api/client'
import { ApiModeBanner } from '@ui/shared/components/api-mode-banner/api-mode-banner'
import { LoadingSpinner } from '@ui/shared/components/loading-spinner/loading-spinner'
import { selectClass } from '@ui/shell/styles/form-classes'
import { ZonaFloorMap } from './components/zona-floor-map/zona-floor-map'
import { MesaDetailPanel } from './components/mesa-detail-panel/mesa-detail-panel'

const legend = [
  { estado: 'libre' as const, color: 'bg-emerald-500', label: 'Libre' },
  { estado: 'reservada' as const, color: 'bg-primary', label: 'Reservada' },
  { estado: 'bloqueada' as const, color: 'bg-cta', label: 'Bloqueada' },
]

export function PlanoSalonPage() {
  const { data: turnos = [] } = useTurnos()
  const [fecha, setFecha] = useState('2026-06-20')
  const [turnoId, setTurnoId] = useState(2)
  const [selectedMesa, setSelectedMesa] = useState<PlanoMesaItem | null>(null)

  const { data: plano, isLoading, isFetching, isError, error, isSuccess } =
    usePlanoSalon({ fecha, turnoId })

  const apiError = isError && isApiError(error) ? error.message : undefined
  const selectedId = selectedMesa?.mesaId ?? null

  const resumenCards = useMemo(() => {
    if (!plano) return []
    return [
      { label: 'Mesas', value: plano.resumen.total, accent: 'text-primary' },
      { label: 'Libres', value: plano.resumen.libres, accent: 'text-emerald-600' },
      { label: 'Reservadas', value: plano.resumen.reservadas, accent: 'text-primary' },
      { label: 'Bloqueadas', value: plano.resumen.bloqueadas, accent: 'text-cta' },
    ]
  }, [plano])

  return (
    <div className="-mx-4 -mt-2 space-y-6 sm:-mx-6">
      <header className="restaurant-hero relative overflow-hidden">
        <div
          className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-cta/20 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/90">
              <UtensilsCrossed className="size-3.5" aria-hidden />
              Salón en vivo
            </p>
            <h1 className="font-display text-3xl text-amber-50 sm:text-4xl">
              Plano del restaurante
            </h1>
            <p className="mt-2 max-w-xl text-sm text-amber-100/90">
              Mapa por zonas: terraza, salón principal y barra. Estados según
              reservas y bloqueos del turno seleccionado.
            </p>
          </div>
          <Wine
            className="hidden size-14 text-amber-200/30 sm:block"
            aria-hidden
          />
        </div>
      </header>

      <div className="px-4 sm:px-6">
        <ApiModeBanner
          connected={isSuccess}
          errorMessage={apiError}
        />

        <div className="restaurant-zone-card mt-6 flex flex-wrap items-end gap-4 p-5">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-primary-dark">
              Fecha del servicio
            </span>
            <input
              type="date"
              className={selectClass}
              value={fecha}
              onChange={(e) => {
                setFecha(e.target.value)
                setSelectedMesa(null)
              }}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-primary-dark">Turno</span>
            <select
              className={selectClass}
              value={turnoId}
              onChange={(e) => {
                setTurnoId(Number(e.target.value))
                setSelectedMesa(null)
              }}
            >
              {turnos.map((t) => (
                <option key={t.turnoId} value={t.turnoId}>
                  {t.horaInicio}:00 – {t.horaFin}:00
                </option>
              ))}
            </select>
          </label>
          {plano && (
            <p className="text-sm text-muted">
              Servicio: <strong className="text-primary-dark">{plano.fecha}</strong>{' '}
              · {plano.turnoLabel}
              {isFetching && !isLoading && ' (actualizando…)'}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-6 rounded-lg border border-amber-200/60 bg-amber-50/50 px-4 py-3">
          {legend.map((item) => (
            <span
              key={item.estado}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-dark"
            >
              <span
                className={`size-3.5 rounded-full ${item.color} shadow-sm ring-2 ring-white`}
                aria-hidden
              />
              {item.label}
            </span>
          ))}
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        )}

        {plano && !isLoading && (
          <>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {resumenCards.map((c) => (
                <div
                  key={c.label}
                  className="restaurant-zone-card text-center"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {c.label}
                  </p>
                  <p className={`mt-1 font-display text-4xl ${c.accent}`}>
                    {c.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
                {plano.zonas.map((zona) => (
                  <ZonaFloorMap
                    key={zona.zonaId}
                    zona={zona}
                    selectedMesaId={selectedId}
                    onSelectMesa={setSelectedMesa}
                  />
                ))}
              </div>
              <MesaDetailPanel mesa={selectedMesa} fecha={fecha} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
