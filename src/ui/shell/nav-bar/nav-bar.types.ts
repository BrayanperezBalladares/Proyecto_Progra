import type { LucideIcon } from 'lucide-react'

export type AppRoute =
  | '/dashboard'
  | '/plano-salon'
  | '/clientes'
  | '/reservas'
  | '/mesas'
  | '/zonas'
  | '/lista-espera'
  | '/bloqueos'

export type NavItem = {
  label: string
  to: AppRoute
  icon: LucideIcon
}

export type NavBarProps = {
  items?: NavItem[]
}
