import { useState } from 'react'
import { Trash2, ArrowRightCircle, Clock } from 'lucide-react'
import type { ListaDeEspera } from '@api/types/domain.types'
import {
  useConvertirListaEspera,
  useCreateListaEspera,
  useDeleteListaEspera,
  useListaEspera,
} from '@api/features/lista-espera/hooks/use-lista-espera'
import { useClientes } from '@api/features/clientes/hooks/use-clientes'
import { useMesas } from '@api/features/mesas/hooks/use-mesas'
import { useTurnos } from '@api/shared/lookups/use-lookups'
import { clienteNombre, mesaLabel, turnoLabel } from '@api/shared/utils/resolve-names'
import { AppButton } from '@ui/shell/button/app-button'
import { AppIconButton } from '@ui/shell/icon-button/app-icon-button'
import { EmptyState } from '@ui/shared/components/empty-state/empty-state'
import { ErrorMessage } from '@ui/shared/components/error-message/error-message'
import { MockBanner } from '@ui/shared/components/mock-banner/mock-banner'
import { PageHeader } from '@ui/shared/components/page-header/page-header'
import { getMutationErrorMessage } from '@ui/shared/hooks/use-mutation-error'
import { panelClass, selectClass, inputClass, tableClass, tableWrapClass } from '@ui/shell/styles/form-classes'

export function ListaEsperaPage() {
  const { data: lista } = useListaEspera()
  const { data: clientes = [] } = useClientes()
  const { data: mesas = [] } = useMesas()
  const { data: turnos = [] } = useTurnos()
  const createM = useCreateListaEspera()
  const deleteM = useDeleteListaEspera()
  const convertM = useConvertirListaEspera()

  const [form, setForm] = useState({ clienteId: '1', turnoId: '2', cantidadPersonas: '2' })
  const [convertTarget, setConvertTarget] = useState<ListaDeEspera | null>(null)
  const [mesaId, setMesaId] = useState('1')

  const err =
    getMutationErrorMessage(createM.error) ??
    getMutationErrorMessage(convertM.error) ??
    getMutationErrorMessage(deleteM.error)

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.value })),
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Lista de espera" description="Cola de clientes en espera por turno. Convierte directamente a reserva." />
      <MockBanner />

      {/* Form */}
      <form
        className={panelClass}
        onSubmit={(e) => {
          e.preventDefault()
          createM.mutate({
            clienteId: Number(form.clienteId),
            turnoId: Number(form.turnoId),
            cantidadPersonas: Number(form.cantidadPersonas),
          })
        }}
      >
        <h2 className="mb-4 text-sm font-semibold text-primary-dark">Agregar a la cola</h2>
        <div className="flex flex-wrap items-end gap-3">
          <label className="block text-xs font-medium text-muted">
            <span className="mb-1 block">Cliente</span>
            <select className={`${selectClass} w-48`} {...field('clienteId')}>
              {clientes.map((c) => <option key={c.clienteId} value={c.clienteId}>{clienteNombre(clientes, c.clienteId)}</option>)}
            </select>
          </label>
          <label className="block text-xs font-medium text-muted">
            <span className="mb-1 block">Turno</span>
            <select className={`${selectClass} w-40`} {...field('turnoId')}>
              {turnos.map((t) => <option key={t.turnoId} value={t.turnoId}>{turnoLabel(turnos, t.turnoId)}</option>)}
            </select>
          </label>
          <label className="block text-xs font-medium text-muted">
            <span className="mb-1 block">Personas</span>
            <input type="number" min={1} max={20} className={`${inputClass} w-24`} {...field('cantidadPersonas')} />
          </label>
          <AppButton type="submit" isLoading={createM.isPending}>Encolar</AppButton>
        </div>
      </form>

      {err && <ErrorMessage message={err} />}

      {/* Table */}
      {lista && (
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Turno</th>
                <th>Personas</th>
                <th>Hora solicitud</th>
                <th><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {lista.length === 0 ? (
                <EmptyState icon={Clock} title="Cola vacía" description="No hay clientes en espera actualmente." />
              ) : (
                lista.map((entry) => (
                  <tr key={entry.listaDeEsperaId}>
                    <td className="tabular-nums text-muted">{entry.listaDeEsperaId}</td>
                    <td className="font-medium">{clienteNombre(clientes, entry.clienteId)}</td>
                    <td>{turnoLabel(turnos, entry.turnoId)}</td>
                    <td className="tabular-nums">{entry.cantidadPersonas}</td>
                    <td className="tabular-nums text-muted text-xs">
                      {new Date(entry.horaSolicitud).toLocaleString('es-CR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <AppIconButton
                          label="Convertir a reserva"
                          icon={<ArrowRightCircle className="size-3.5" />}
                          onClick={() => setConvertTarget(entry)}
                        />
                        <AppIconButton
                          variant="danger"
                          label="Quitar de la cola"
                          icon={<Trash2 className="size-3.5" />}
                          isLoading={deleteM.isPending}
                          onClick={() => deleteM.mutate(entry.listaDeEsperaId)}
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

      {/* Convert to reservation dialog */}
      {convertTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="convert-dialog-title"
          onClick={(e) => { if (e.target === e.currentTarget) setConvertTarget(null) }}
        >
          <div className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-lg">
            <h3 id="convert-dialog-title" className="text-base font-semibold text-primary-dark">
              Convertir a reserva
            </h3>
            <p className="mt-2 text-sm text-muted">
              Cliente: <strong className="text-primary-dark">{clienteNombre(clientes, convertTarget.clienteId)}</strong>
            </p>
            <label className="mt-4 block text-xs font-medium text-muted">
              <span className="mb-1 block">Asignar mesa</span>
              <select
                className={selectClass}
                value={mesaId}
                onChange={(e) => setMesaId(e.target.value)}
              >
                {mesas.map((m) => <option key={m.mesaId} value={m.mesaId}>{mesaLabel(mesas, m.mesaId)}</option>)}
              </select>
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <AppButton variant="secondary" onClick={() => setConvertTarget(null)}>
                Cancelar
              </AppButton>
              <AppButton
                isLoading={convertM.isPending}
                onClick={() =>
                  convertM.mutate(
                    { listaId: convertTarget.listaDeEsperaId, mesaId: Number(mesaId) },
                    { onSuccess: () => setConvertTarget(null) },
                  )
                }
              >
                Confirmar reserva
              </AppButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
