import { useState } from 'react'
import { UtensilsCrossed } from 'lucide-react'
import { useMesas } from '@api/features/mesas/hooks/use-mesas'
import { useCreateMesa } from '@api/features/mesas/hooks/use-create-mesa'
import { useZonas } from '@api/shared/lookups/use-lookups'
import { zonaNombre } from '@api/shared/utils/resolve-names'
import { AppButton } from '@ui/shell/button/app-button'
import { EmptyState } from '@ui/shared/components/empty-state/empty-state'
import { ErrorMessage } from '@ui/shared/components/error-message/error-message'
import { LoadingSpinner } from '@ui/shared/components/loading-spinner/loading-spinner'
import { MockBanner } from '@ui/shared/components/mock-banner/mock-banner'
import { PageHeader } from '@ui/shared/components/page-header/page-header'
import { getMutationErrorMessage } from '@ui/shared/hooks/use-mutation-error'
import { panelClass, inputClass, selectClass, tableClass, tableWrapClass } from '@ui/shell/styles/form-classes'

export function MesasPage() {
  const { data: mesas, isLoading } = useMesas()
  const { data: zonas = [] } = useZonas()
  const createM = useCreateMesa()
  const [capacidad, setCapacidad] = useState('4')
  const [zonaId, setZonaId] = useState('1')

  const err = getMutationErrorMessage(createM.error)

  return (
    <div className="space-y-6">
      <PageHeader title="Mesas" description="Inventario de mesas por zona del restaurante." />
      <MockBanner />

      {/* Form */}
      <form
        className={panelClass}
        onSubmit={(e) => {
          e.preventDefault()
          createM.mutate({ capacidad: Number(capacidad), zonaId: Number(zonaId) })
        }}
      >
        <h2 className="mb-4 text-sm font-semibold text-primary-dark">Nueva mesa</h2>
        <div className="flex flex-wrap items-end gap-3">
          <label className="block text-xs font-medium text-muted">
            <span className="mb-1 block">Capacidad (personas)</span>
            <input
              type="number"
              min={1}
              max={20}
              className={`${inputClass} w-32`}
              value={capacidad}
              onChange={(e) => setCapacidad(e.target.value)}
            />
          </label>
          <label className="block text-xs font-medium text-muted">
            <span className="mb-1 block">Zona</span>
            <select
              className={`${selectClass} w-48`}
              value={zonaId}
              onChange={(e) => setZonaId(e.target.value)}
            >
              {zonas.map((z) => <option key={z.zonaId} value={z.zonaId}>{z.seccion}</option>)}
            </select>
          </label>
          <AppButton type="submit" isLoading={createM.isPending}>Crear mesa</AppButton>
        </div>
      </form>

      {err && <ErrorMessage message={err} />}
      {isLoading && <div className="flex justify-center py-10"><LoadingSpinner /></div>}

      {/* Table */}
      {mesas && (
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th>Mesa</th>
                <th>Capacidad</th>
                <th>Zona</th>
              </tr>
            </thead>
            <tbody>
              {mesas.length === 0 ? (
                <EmptyState icon={UtensilsCrossed} title="Sin mesas" description="Crea la primera mesa con el formulario." />
              ) : (
                mesas.map((m) => (
                  <tr key={m.mesaId}>
                    <td className="font-semibold tabular-nums">Mesa {m.mesaId}</td>
                    <td>{m.capacidad} personas</td>
                    <td className="text-muted">{zonaNombre(zonas, m.zonaId)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
