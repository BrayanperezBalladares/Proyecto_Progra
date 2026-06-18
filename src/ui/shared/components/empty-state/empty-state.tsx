import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <tr>
      <td colSpan={999}>
        <div className="app-empty-state">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-background-subtle">
            <Icon className="size-6 text-muted" aria-hidden />
          </div>
          <p className="text-sm font-semibold text-primary-dark">{title}</p>
          {description && (
            <p className="mt-1 max-w-xs text-xs text-muted">{description}</p>
          )}
          {action && <div className="mt-4">{action}</div>}
        </div>
      </td>
    </tr>
  )
}

/* Variant for use outside a table (e.g., grid/list views) */
export function EmptyStateBlock({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border px-6 py-12 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-background-subtle">
        <Icon className="size-6 text-muted" aria-hidden />
      </div>
      <p className="text-sm font-semibold text-primary-dark">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs text-xs text-muted">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
