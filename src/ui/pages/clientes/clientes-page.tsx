import { useState } from 'react'
import { Pencil, Trash2, Users } from 'lucide-react'
import type { Cliente } from '@api/types/domain.types'
import { useClientes } from '@api/features/clientes/hooks/use-clientes'
import { useCreateCliente } from '@api/features/clientes/hooks/use-create-cliente'
import { useUpdateCliente } from '@api/features/clientes/hooks/use-update-cliente'
import { useDeleteCliente } from '@api/features/clientes/hooks/use-delete-cliente'
import { AppButton } from '@ui/shell/button/app-button'
import { AppIconButton } from '@ui/shell/icon-button/app-icon-button'
import { ConfirmDialog } from '@ui/shared/components/confirm-dialog/confirm-dialog'
import { EmptyState } from '@ui/shared/components/empty-state/empty-state'
import { ErrorMessage } from '@ui/shared/components/error-message/error-message'
import { LoadingSpinner } from '@ui/shared/components/loading-spinner/loading-spinner'
import { MockBanner } from '@ui/shared/components/mock-banner/mock-banner'
import { PageHeader } from '@ui/shared/components/page-header/page-header'
import { getMutationErrorMessage } from '@ui/shared/hooks/use-mutation-error'
import { inputClass, panelClass, tableClass, tableWrapClass } from '@ui/shell/styles/form-classes'

type FormState = {
  ced: string
  nombre: string
  apellidos: string
  tel: string
  email: string
}

const empty: FormState = { ced: '', nombre: '', apellidos: '', tel: '', email: '' }

const fieldLabels: Record<keyof FormState, string> = {
  ced: 'Cédula',
  nombre: 'Nombre',
  apellidos: 'Apellidos',
  tel: 'Teléfono',
  email: 'Correo electrónico',
}

function toPayload(f: FormState) {
  return {
    ced: Number(f.ced),
    nombre: f.nombre,
    apellidos: f.apellidos,
    tel: Number(f.tel),
    email: f.email,
  }
}

export function ClientesPage() {
  const { data: clientes, isLoading, isError, error } = useClientes()
  const createM = useCreateCliente()
  const updateM = useUpdateCliente()
  const deleteM = useDeleteCliente()
  const [editing, setEditing] = useState<Cliente | null>(null)
  const [form, setForm] = useState<FormState>(empty)
  const [toDelete, setToDelete] = useState<Cliente | null>(null)

  const err =
    getMutationErrorMessage(createM.error) ??
    getMutationErrorMessage(updateM.error) ??
    getMutationErrorMessage(deleteM.error) ??
    (isError && error instanceof Error ? error.message : isError ? 'Error al cargar clientes' : null)

  const startEdit = (c: Cliente) => {
    setEditing(c)
    setForm({ ced: String(c.ced), nombre: c.nombre, apellidos: c.apellidos, tel: String(c.tel), email: c.email })
  }

  const cancelEdit = () => { setEditing(null); setForm(empty) }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = toPayload(form)
    if (editing) {
      updateM.mutate({ id: editing.clienteId, payload }, { onSuccess: cancelEdit })
    } else {
      createM.mutate(payload, { onSuccess: () => setForm(empty) })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Clientes" description="Gestión del directorio de clientes del restaurante." />
      <MockBanner />

      {/* Form */}
      <form onSubmit={submit} className={panelClass}>
        <h2 className="mb-4 text-sm font-semibold text-primary-dark">
          {editing ? `Editar — ${editing.nombre} ${editing.apellidos}` : 'Nuevo cliente'}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(Object.keys(fieldLabels) as (keyof FormState)[]).map((key) => (
            <label key={key} className="block text-xs font-medium text-muted">
              <span className="mb-1 block">{fieldLabels[key]}</span>
              <input
                required
                type={key === 'email' ? 'email' : key === 'ced' || key === 'tel' ? 'number' : 'text'}
                className={inputClass}
                value={form[key]}
                onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))}
              />
            </label>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <AppButton type="submit" isLoading={createM.isPending || updateM.isPending}>
            {editing ? 'Guardar cambios' : 'Crear cliente'}
          </AppButton>
          {editing && (
            <AppButton type="button" variant="secondary" onClick={cancelEdit}>
              Cancelar
            </AppButton>
          )}
        </div>
      </form>

      {err && <ErrorMessage message={err} />}
      {isLoading && <div className="flex justify-center py-10"><LoadingSpinner /></div>}

      {/* Table */}
      {clientes && (
        <div className={tableWrapClass}>
          <table className={tableClass}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cédula</th>
                <th>Nombre completo</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <EmptyState icon={Users} title="Sin clientes" description="Agrega el primer cliente con el formulario." />
              ) : (
                clientes.map((c) => (
                  <tr key={c.clienteId}>
                    <td className="tabular-nums text-muted">#{c.clienteId}</td>
                    <td className="tabular-nums">{c.ced}</td>
                    <td className="font-medium">{c.nombre} {c.apellidos}</td>
                    <td className="text-muted">{c.email}</td>
                    <td className="tabular-nums text-muted">{c.tel}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <AppIconButton
                          label={`Editar ${c.nombre}`}
                          icon={<Pencil className="size-3.5" />}
                          onClick={() => startEdit(c)}
                        />
                        <AppIconButton
                          variant="danger"
                          label={`Eliminar ${c.nombre}`}
                          icon={<Trash2 className="size-3.5" />}
                          isLoading={deleteM.isPending && toDelete?.clienteId === c.clienteId}
                          onClick={() => setToDelete(c)}
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

      <ConfirmDialog
        isOpen={!!toDelete}
        title="Eliminar cliente"
        description={toDelete ? <>¿Eliminar a <strong>{toDelete.nombre} {toDelete.apellidos}</strong>? Esta acción no se puede deshacer.</> : null}
        confirmLabel="Eliminar"
        isConfirming={deleteM.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && deleteM.mutate(toDelete.clienteId, { onSuccess: () => setToDelete(null) })}
      />
    </div>
  )
}
