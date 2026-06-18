const config: Record<string, { dot: string; badge: string }> = {
  Activa:    { dot: 'bg-success',   badge: 'bg-success-light text-success ring-success/30' },
  Cancelada: { dot: 'bg-danger',    badge: 'bg-danger-light text-danger ring-danger/30' },
  Atendida:  { dot: 'bg-muted',     badge: 'bg-background-subtle text-muted ring-border' },
  Libre:     { dot: 'bg-success',   badge: 'bg-success-light text-success ring-success/30' },
  Reservada: { dot: 'bg-primary',   badge: 'bg-primary/10 text-primary ring-primary/20' },
  Bloqueada: { dot: 'bg-warning',   badge: 'bg-warning-light text-cta ring-warning/30' },
}

const fallback = { dot: 'bg-muted', badge: 'bg-background-subtle text-muted ring-border' }

type StatusBadgeProps = {
  label: string
}

export function StatusBadge({ label }: StatusBadgeProps) {
  const { dot, badge } = config[label] ?? fallback
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${badge}`}
    >
      <span className={`size-1.5 shrink-0 rounded-full ${dot}`} aria-hidden />
      {label}
    </span>
  )
}
