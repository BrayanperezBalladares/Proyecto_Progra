import { useState } from 'react'
import { Trash2, Ban } from 'lucide-react'
import { useBloqueos, useCreateBloqueo, useDeleteBloqueo, useBloquearZona } from '@api/features/bloqueos/hooks/use-bloqueos'
import { useMesas } from '@api/features/mesas/hooks/use-mesas'
import { useZonas } from '@api/shared/lookups/use-lookups'
import { mesaLabel } from '@api/shared/utils/resolve-names'
import { AppButton } from '@ui/shell/button/app-button'
import { AppIconButton } from '@ui/shell/icon-button/app-icon-button'
import { EmptyState } from '@ui/shared/components/empty-state/empty-state'
import { ErrorMessage } from '@ui/shared/components/error-message/error-message'
import { MockBanner } from '@ui/shared/components/mock-banner/mock-banner'
import { PageHeader } from '@ui/shared/components/page-header/page-header'
import { getMutationErrorMessage } from '@ui/shared/hooks/use-mutation-error'
import {
  panelClass, selectClass, inputClass, tableClass, tableWrapClass,
  fromDateTimeLocal,
} from '@ui/shell/styles/form-classes'

export function BloqueosPage() {
  const { data: bloqueos } = useBloqueos()
  const { data: mesas = [] } = useMesas()
  const { data: zonas = [] } = useZonas()
  const createM = useCreateBloqueo()
  const deleteM = useDeleteBloqueo()
  const zonaM = useBloquearZona()

  const [form, setForm] = useState({
    mesaId: '1',
    fecha: '2026-06-20',
    horaInicio: '2026-06-20T12:00',
    horaFin: '2026-06-20T15:00',
    detalle: '',
  })
  const [zonaBlock, setZonaBlock] = useState({
    zonaId: '1',
    fecha: '2026-06-20',
    inicio: '2026-06-20T18:00',
    fin: '2026-06-20T22:00',
    detalle: 'Bloqueo de zona',
  })

  const err =
    getMutationErrorMessage(createM.error) ??
    getMutationErrorMessage(zonaM.error) ??
    getMutationErrorMessage(deleteM.error)

  const fField = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.value })),
  })

  const zField = (key: keyof typeof zonaBlock) => ({
    value: zonaBlock[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setZonaBlock((s) => ({ ...s, [key]: e.target.value })),
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Bloqueos de mesa" description="Mantenimiento, eventos privados y cierres temporales por mesa o zona." />
      <MockBanner />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Block single mesa */}
        <form
          className={panelClass}
          onSubmit={(e) => {
            e.preventDefault()
            createM.mutate({
              mesaId: Number(form.mesaId),
              fecha: form.fecha,
              horaInicio: fromDateTimeLocal(form.horaInicio),
              horaFin: fromDateTimeLocal(form.horaFin),
              detalle: form.detalle,
            })
          }}
        >
          <h2 className="mb-4 text-sm font-semibold text-primary-dark">Bloquear mesa</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-medium text-muted">
              <span className="mb-1 block">Mesa</span>
              <select className={selectClass} {...fField('mesaId')}>
                {mesas.map((m) => <option key={m.mesaId} value={m.mesaId}>{mesaLabel(mesas, m.mesaId)}</option>)}
              </select>
            </label>
            <label className="block text-xs font-medium text-muted">
              <span className="mb-1 block">Fecha</span>
              <input type="date" className={inputClass} {...fField('fecha')} />
            </label>
            <label className="block text-xs font-medium text-muted">
              <span className="mb-1 block">Inicio del bloqueo</span>
              <input type="datetime-local" className={inputClass} {...fField('horaInicio')} />
            </label>
            <label className="block text-xs font-medium text-muted">
              <span className="mb-1 block">Fin del bloqueo</span>
              <input type="datetime-local" className={inputClass} {...fField('horaFin')} />
            </label>
            <label className="block text-xs font-medium text-muted sm:col-span-2">
              <span className="mb-1 block">Motivo</span>
              <input type="text" placeholder="Ej: Mantenimiento, evento privado…" className={inputClass} {...fField('detalle')} />
            </label>
          </div>
          <AppButton type="submit" className="mt-4" isLoading={createM.isPending}>
            Bloquear mesa
          </AppButton>
        </form>

        {/* Block entire zone */}
        <form
          className="rounded-md border border-warning/30 bg-warning-light p-5 shadow-xs"
          onSubmit={(e) => {
            e.preventDefault()
            zonaM.mutate({
              zonaId: Number(zonaBlock.zonaId),
              fecha: zonaBlock.fecha,
              inicio: fromDateTimeLocal(zonaBlock.inicio),
              fin: fromDateTimeLocal(zonaBlock.fin),
              detalle: zonaBlock.detalle,
            })
          }}
        >
          <h2 className="mb-1 text-sm font-semibold text-cta">Bloquear zona completa</h2>
          <p className="mb-4 text-xs text-muted">Bloquea todas las mesas de la zona seleccionada.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-medium text-cta">
              <span className="mb-1 block">Zona</span>
              <select className={selectClass} {...zField('zonaId')}>
                {zonas.map((z) => <option key={z.zonaId} value={z.zonaId}>{z.seccion}</option>)}
              </select>
            </label>
            <label className="block text-xs font-medium text-cta">
              <span className="mb-1 block">Fecha</span>
              <input type="date" className={inputClass} {...zField('fecha')} />
            </label>
            <label className="block text-xs font-medium text-cta">
              <span className="mb-1 block">Inicio</span>
              <input type="datetime-local" className={inputClass} {...zField('inicio')} />
            </label>
            <label className="block text-xs font-medium text-cta">
              <span className="mb-1 block">Fin</span>
              <input type="datetime-local" className={inputClass} {...zField('fin')} />
            </label>
            <label className="block text-xs font-medium text-cta sm:col-span-2">
              <span className="mb-1 block">Motivo</span>
              <input type="text" className={inputClass} {...zField('detalle')} />
            </label>
          </div>
          <AppButton type="submit" className="mt-4" variant="secondary" isLoading={zonaM.isPending}>
            Bloquear zona
          </AppButton>
        </form>
      </div>

      {err && <ErrorMessage message={err} />}

      {/* Table */}
      {bloqueos && (
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th>Mesa</th>
                <th>Fecha</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Motivo</th>
                <th><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {bloqueos.length === 0 ? (
                <EmptyState icon={Ban} title="Sin bloqueos activos" description="No hay bloqueos de mesa registrados." />
              ) : (
                bloqueos.map((b) => (
                  <tr key={b.bloqueoMesaId}>
                    <td className="font-medium">{mesaLabel(mesas, b.mesaId)}</td>
                    <td className="tabular-nums text-muted">{b.fecha}</td>
                    <td className="tabular-nums text-xs text-muted">
                      {new Date(b.horaInicio).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="tabular-nums text-xs text-muted">
                      {new Date(b.horaFin).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="max-w-xs truncate text-muted">{b.detalle}</td>
                    <td>
                      <div className="flex justify-end">
                        <AppIconButton
                          variant="danger"
                          label="Eliminar bloqueo"
                          icon={<Trash2 className="size-3.5" />}
                          isLoading={deleteM.isPending}
                          onClick={() => deleteM.mutate(b.bloqueoMesaId)}
                        />
                      </div>
                    </td>
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
