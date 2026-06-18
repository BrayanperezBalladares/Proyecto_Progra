import { useMemo } from 'react'
import {
  CalendarCheck,
  CalendarDays,
  Users,
  Clock,
  Ban,
  Map,
  UtensilsCrossed,
  MapPin,
  ArrowRight,
} from 'lucide-react'
import { useDashboardStats } from '@api/features/dashboard/hooks/use-dashboard-stats'
import { AppLink } from '@ui/shell/app-link/app-link'
import { MockBanner } from '@ui/shared/components/mock-banner/mock-banner'
import { LoadingSpinner } from '@ui/shared/components/loading-spinner/loading-spinner'

const today = new Date().toLocaleDateString('es-CR', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const quickLinks = [
  { to: '/plano-salon'  as const, label: 'Plano del salón',  desc: 'Estado de mesas en tiempo real', icon: Map },
  { to: '/reservas'     as const, label: 'Reservas',          desc: 'Crear, editar y cancelar',       icon: CalendarCheck },
  { to: '/clientes'     as const, label: 'Clientes',          desc: 'Gestión de clientes',            icon: Users },
  { to: '/lista-espera' as const, label: 'Lista de espera',   desc: 'Cola por turno',                 icon: Clock },
  { to: '/mesas'        as const, label: 'Mesas',             desc: 'Inventario por zona',            icon: UtensilsCrossed },
  { to: '/zonas'        as const, label: 'Zonas',             desc: 'Secciones del restaurante',      icon: MapPin },
  { to: '/bloqueos'     as const, label: 'Bloqueos',          desc: 'Cierres y mantenimiento',        icon: Ban },
] as const

type StatConfig = {
  label: string
  key: 'reservasActivas' | 'reservasHoy' | 'clientesTotal' | 'enListaEspera' | 'mesasBloqueadas'
  icon: typeof CalendarCheck
  accent: string
  bg: string
}

const statConfigs: StatConfig[] = [
  { label: 'Reservas activas',  key: 'reservasActivas',  icon: CalendarCheck, accent: 'text-primary',  bg: 'bg-primary/10' },
  { label: 'Reservas hoy',      key: 'reservasHoy',      icon: CalendarDays,  accent: 'text-secondary', bg: 'bg-secondary/10' },
  { label: 'Clientes',          key: 'clientesTotal',    icon: Users,         accent: 'text-success',   bg: 'bg-success-light' },
  { label: 'En lista espera',   key: 'enListaEspera',    icon: Clock,         accent: 'text-cta',       bg: 'bg-cta-light' },
  { label: 'Mesas bloqueadas',  key: 'mesasBloqueadas',  icon: Ban,           accent: 'text-danger',    bg: 'bg-danger-light' },
]

export function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats()

  const statCards = useMemo(() => {
    if (!stats) return []
    return statConfigs.map((c) => ({ ...c, value: stats[c.key] }))
  }, [stats])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted capitalize">{today}</p>
        </div>
        <MockBanner />
      </div>

      {/* KPI stats */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" label="Cargando estadísticas" />
        </div>
      )}

      {statCards.length > 0 && (
        <section aria-label="Resumen operativo">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
            Resumen operativo
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {statCards.map(({ label, value, icon: Icon, accent, bg }) => (
              <div key={label} className="stat-card">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted">{label}</p>
                  <span className={`flex size-7 items-center justify-center rounded-md ${bg}`}>
                    <Icon className={`size-3.5 ${accent}`} aria-hidden />
                  </span>
                </div>
                <p className={`mt-3 text-3xl font-bold tabular-nums ${accent}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick links */}
      <section aria-label="Accesos rápidos">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
          Accesos rápidos
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {quickLinks.map(({ to, label, desc, icon: Icon }) => (
            <li key={to}>
              <AppLink
                to={to}
                className="group flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3 no-underline transition-all duration-150 hover:border-primary/30 hover:bg-background-subtle hover:shadow-sm"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background-subtle transition-colors duration-150 group-hover:bg-primary/10">
                  <Icon className="size-4 text-muted transition-colors duration-150 group-hover:text-primary" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-primary-dark">{label}</span>
                  <span className="block truncate text-xs text-muted">{desc}</span>
                </span>
                <ArrowRight className="size-3.5 shrink-0 text-border transition-colors duration-150 group-hover:text-primary" aria-hidden />
              </AppLink>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
