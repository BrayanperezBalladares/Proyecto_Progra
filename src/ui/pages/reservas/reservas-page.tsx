import { useMemo, useState } from 'react'
import { Pencil, Ban, CalendarCheck } from 'lucide-react'
import type { Reserva } from '@api/types/domain.types'
import { useReservas } from '@api/features/reservas/hooks/use-reservas'
import {
  useCancelarReserva,
  useCambiarEstadoReserva,
  useCreateReserva,
  useUpdateReserva,
} from '@api/features/reservas/hooks/use-reserva-mutations'
import { useClientes } from '@api/features/clientes/hooks/use-clientes'
import { useMesas } from '@api/features/mesas/hooks/use-mesas'
import { useEstadosReserva, useTurnos } from '@api/shared/lookups/use-lookups'
import { clienteNombre, estadoLabel, mesaLabel, turnoLabel } from '@api/shared/utils/resolve-names'
import { AppButton } from '@ui/shell/button/app-button'
import { AppIconButton } from '@ui/shell/icon-button/app-icon-button'
import { StatusBadge } from '@ui/shared/components/status-badge/status-badge'
import { EmptyState } from '@ui/shared/components/empty-state/empty-state'
import { ErrorMessage } from '@ui/shared/components/error-message/error-message'
import { LoadingSpinner } from '@ui/shared/components/loading-spinner/loading-spinner'
import { MockBanner } from '@ui/shared/components/mock-banner/mock-banner'
import { PageHeader } from '@ui/shared/components/page-header/page-header'
import { getMutationErrorMessage } from '@ui/shared/hooks/use-mutation-error'
import {
  panelClass, inputClass, selectClass, tableClass, tableWrapClass,
  toDateTimeLocal, fromDateTimeLocal,
} from '@ui/shell/styles/form-classes'

type FormState = {
  clienteId: string
  mesaId: string
  turnoId: string
  cantidadPersonas: string
  fecha: string
  horaInicio: string
  horaFin: string
}

const defaultForm: FormState = {
  clienteId: '1',
  mesaId: '1',
  turnoId: '2',
  cantidadPersonas: '2',
  fecha: '2026-06-20',
  horaInicio: '2026-06-20T12:00',
  horaFin: '2026-06-20T15:00',
}

export function ReservasPage() {
  const { data: reservas, isLoading } = useReservas()
  const { data: clientes = [] } = useClientes()
  const { data: mesas = [] } = useMesas()
  const { data: turnos = [] } = useTurnos()
  const { data: estados = [] } = useEstadosReserva()
  const createM = useCreateReserva()
  const updateM = useUpdateReserva()
  const cancelM = useCancelarReserva()
  const estadoM = useCambiarEstadoReserva()

  const [filterEstado, setFilterEstado] = useState<number | 'all'>('all')
  const [editing, setEditing] = useState<Reserva | null>(null)
  const [form, setForm] = useState<FormState>(defaultForm)

  const filtered = useMemo(() => {
    if (!reservas) return []
    return filterEstado === 'all' ? reservas : reservas.filter((r) => r.estadoDeReservaId === filterEstado)
  }, [reservas, filterEstado])

  const err = getMutationErrorMessage(createM.error) ?? getMutationErrorMessage(updateM.error)

  const startEdit = (r: Reserva) => {
    setEditing(r)
    setForm({
      clienteId: String(r.clienteId),
      mesaId: String(r.mesaId),
      turnoId: String(r.turnoId),
      cantidadPersonas: String(r.cantidadPersonas),
      fecha: r.fecha,
      horaInicio: toDateTimeLocal(r.horaInicio),
      horaFin: toDateTimeLocal(r.horaFin),
    })
  }

  const cancelEdit = () => { setEditing(null); setForm(defaultForm) }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      clienteId: Number(form.clienteId),
      mesaId: Number(form.mesaId),
      turnoId: Number(form.turnoId),
      cantidadPersonas: Number(form.cantidadPersonas),
      fecha: form.fecha,
      horaInicio: fromDateTimeLocal(form.horaInicio),
      horaFin: fromDateTimeLocal(form.horaFin),
    }
    if (editing) {
      updateM.mutate({ id: editing.reservaId, payload }, { onSuccess: cancelEdit })
    } else {
      createM.mutate(payload)
    }
  }

  const field = <K extends keyof FormState>(key: K) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.value })),
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Reservas" description="Crear, editar, cancelar y cambiar estado de reservas." />
      <MockBanner />

      {/* Form */}
      <form onSubmit={submit} className={panelClass}>
        <h2 className="mb-4 text-sm font-semibold text-primary-dark">
          {editing ? `Editar reserva #${editing.reservaId}` : 'Nueva reserva'}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-xs font-medium text-muted">
            <span className="mb-1 block">Cliente</span>
            <select className={selectClass} {...field('clienteId')}>
              {clientes.map((c) => <option key={c.clienteId} value={c.clienteId}>{c.nombre} {c.apellidos}</option>)}
            </select>
          </label>
          <label className="block text-xs font-medium text-muted">
            <span className="mb-1 block">Mesa</span>
            <select className={selectClass} {...field('mesaId')}>
              {mesas.map((m) => <option key={m.mesaId} value={m.mesaId}>{mesaLabel(mesas, m.mesaId)}</option>)}
            </select>
          </label>
          <label className="block text-xs font-medium text-muted">
            <span className="mb-1 block">Turno</span>
            <select className={selectClass} {...field('turnoId')}>
              {turnos.map((t) => <option key={t.turnoId} value={t.turnoId}>{turnoLabel(turnos, t.turnoId)}</option>)}
            </select>
          </label>
          <label className="block text-xs font-medium text-muted">
            <span className="mb-1 block">Personas</span>
            <input type="number" min={1} max={20} className={inputClass} {...field('cantidadPersonas')} />
          </label>
          <label className="block text-xs font-medium text-muted">
            <span className="mb-1 block">Fecha</span>
            <input type="date" className={inputClass} {...field('fecha')} />
          </label>
          <label className="block text-xs font-medium text-muted">
            <span className="mb-1 block">Inicio del servicio</span>
            <input type="datetime-local" className={inputClass} {...field('horaInicio')} />
          </label>
          <label className="block text-xs font-medium text-muted">
            <span className="mb-1 block">Fin del servicio</span>
            <input type="datetime-local" className={inputClass} {...field('horaFin')} />
          </label>
        </div>
        <div className="mt-4 flex gap-2">
          <AppButton type="submit" isLoading={createM.isPending || updateM.isPending}>
            {editing ? 'Guardar cambios' : 'Crear reserva'}
          </AppButton>
          {editing && <AppButton type="button" variant="secondary" onClick={cancelEdit}>Cancelar</AppButton>}
        </div>
      </form>

      {err && <ErrorMessage message={err} />}

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Estado:</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setFilterEstado('all')}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-150 cursor-pointer ${filterEstado === 'all' ? 'bg-primary text-white' : 'bg-background-subtle text-muted hover:bg-border'}`}
          >
            Todos
          </button>
          {estados.map((e) => (
            <button
              key={e.estadoDeReservaId}
              type="button"
              onClick={() => setFilterEstado(e.estadoDeReservaId)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-150 cursor-pointer ${filterEstado === e.estadoDeReservaId ? 'bg-primary text-white' : 'bg-background-subtle text-muted hover:bg-border'}`}
            >
              {e.estado}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <div className="flex justify-center py-10"><LoadingSpinner /></div>}

      {/* Table */}
      {reservas && (
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Mesa</th>
                <th>Fecha</th>
                <th>Turno</th>
                <th>Personas</th>
                <th>Estado</th>
                <th><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <EmptyState icon={CalendarCheck} title="Sin reservas" description="No hay reservas para el filtro seleccionado." />
              ) : (
                filtered.map((r) => (
                  <tr key={r.reservaId}>
                    <td className="tabular-nums text-muted">#{r.reservaId}</td>
                    <td className="font-medium">{clienteNombre(clientes, r.clienteId)}</td>
                    <td>{mesaLabel(mesas, r.mesaId)}</td>
                    <td className="tabular-nums text-muted">{r.fecha}</td>
                    <td>{turnoLabel(turnos, r.turnoId)}</td>
                    <td className="tabular-nums">{r.cantidadPersonas}</td>
                    <td><StatusBadge label={estadoLabel(estados, r.estadoDeReservaId)} /></td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        {r.estadoDeReservaId === 1 && (
                          <>
                            <AppIconButton
                              label="Editar reserva"
                              icon={<Pencil className="size-3.5" />}
                              onClick={() => startEdit(r)}
                            />
                            <AppIconButton
                              variant="danger"
                              label="Cancelar reserva"
                              icon={<Ban className="size-3.5" />}
                              isLoading={cancelM.isPending}
                              onClick={() => cancelM.mutate(r.reservaId)}
                            />
                            <AppButton
                              variant="ghost"
                              className="h-8 px-2.5 py-0 text-xs"
                              isLoading={estadoM.isPending}
                              onClick={() => estadoM.mutate({ id: r.reservaId, estadoId: 3 })}
                            >
                              Atendida
                            </AppButton>
                          </>
                        )}
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
