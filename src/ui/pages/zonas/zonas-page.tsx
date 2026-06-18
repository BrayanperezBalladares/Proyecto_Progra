import { useState } from 'react'
import { Pencil, Trash2, MapPin } from 'lucide-react'
import type { Zona } from '@api/types/domain.types'
import { useZonas, useCreateZona, useUpdateZona, useDeleteZona } from '@api/features/zonas/hooks/use-zonas'
import { AppButton } from '@ui/shell/button/app-button'
import { AppIconButton } from '@ui/shell/icon-button/app-icon-button'
import { ConfirmDialog } from '@ui/shared/components/confirm-dialog/confirm-dialog'
import { EmptyStateBlock } from '@ui/shared/components/empty-state/empty-state'
import { ErrorMessage } from '@ui/shared/components/error-message/error-message'
import { MockBanner } from '@ui/shared/components/mock-banner/mock-banner'
import { PageHeader } from '@ui/shared/components/page-header/page-header'
import { getMutationErrorMessage } from '@ui/shared/hooks/use-mutation-error'
import { panelClass, inputClass } from '@ui/shell/styles/form-classes'

export function ZonasPage() {
  const { data: zonas } = useZonas()
  const createM = useCreateZona()
  const updateM = useUpdateZona()
  const deleteM = useDeleteZona()
  const [seccion, setSeccion] = useState('')
  const [editing, setEditing] = useState<Zona | null>(null)
  const [toDelete, setToDelete] = useState<Zona | null>(null)

  const err =
    getMutationErrorMessage(createM.error) ??
    getMutationErrorMessage(updateM.error) ??
    getMutationErrorMessage(deleteM.error)

  const cancelEdit = () => { setEditing(null); setSeccion('') }

  return (
    <div className="space-y-6">
      <PageHeader title="Zonas" description="Secciones del restaurante (Interior, Terraza, Jardín, etc.)." />
      <MockBanner />

      {/* Form */}
      <form
        className={panelClass}
        onSubmit={(e) => {
          e.preventDefault()
          if (editing) {
            updateM.mutate({ id: editing.zonaId, payload: { seccion } }, { onSuccess: cancelEdit })
          } else {
            createM.mutate({ seccion }, { onSuccess: () => setSeccion('') })
          }
        }}
      >
        <h2 className="mb-4 text-sm font-semibold text-primary-dark">
          {editing ? `Editar zona — ${editing.seccion}` : 'Nueva zona'}
        </h2>
        <div className="flex flex-wrap items-end gap-3">
          <label className="block text-xs font-medium text-muted">
            <span className="mb-1 block">Nombre de la sección</span>
            <input
              required
              type="text"
              placeholder="Ej: Terraza norte"
              className={`${inputClass} w-56`}
              value={seccion}
              onChange={(e) => setSeccion(e.target.value)}
            />
          </label>
          <AppButton type="submit" isLoading={createM.isPending || updateM.isPending}>
            {editing ? 'Guardar' : 'Crear zona'}
          </AppButton>
          {editing && (
            <AppButton type="button" variant="secondary" onClick={cancelEdit}>
              Cancelar
            </AppButton>
          )}
        </div>
      </form>

      {err && <ErrorMessage message={err} />}

      {/* List */}
      {zonas && (
        zonas.length === 0 ? (
          <EmptyStateBlock
            icon={MapPin}
            title="Sin zonas"
            description="Crea la primera zona con el formulario."
          />
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2" role="list">
            {zonas.map((z) => (
              <li
                key={z.zonaId}
                className="flex items-center justify-between rounded-md border border-border bg-surface px-4 py-3 shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                    <MapPin className="size-3.5 text-primary" aria-hidden />
                  </div>
                  <span className="text-sm font-medium text-primary-dark">{z.seccion}</span>
                </div>
                <div className="flex gap-1">
                  <AppIconButton
                    label={`Editar ${z.seccion}`}
                    icon={<Pencil className="size-3.5" />}
                    onClick={() => { setEditing(z); setSeccion(z.seccion) }}
                  />
                  <AppIconButton
                    variant="danger"
                    label={`Eliminar ${z.seccion}`}
                    icon={<Trash2 className="size-3.5" />}
                    onClick={() => setToDelete(z)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )
      )}

      <ConfirmDialog
        isOpen={!!toDelete}
        title="Eliminar zona"
        description={toDelete ? <>¿Eliminar la zona <strong>{toDelete.seccion}</strong>? Las mesas asignadas a ella deben reasignarse primero.</> : null}
        confirmLabel="Eliminar"
        isConfirming={deleteM.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && deleteM.mutate(toDelete.zonaId, { onSuccess: () => setToDelete(null) })}
      />
    </div>
  )
}
