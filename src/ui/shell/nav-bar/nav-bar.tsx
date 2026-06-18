import { useEffect, useRef, useState, useCallback } from 'react'
import {
  LayoutDashboard,
  Map,
  CalendarCheck,
  Users,
  Clock,
  UtensilsCrossed,
  MapPin,
  Ban,
  ChefHat,
  Menu,
  X,
} from 'lucide-react'
import { AppLink } from '../app-link/app-link'
import type { NavBarProps, NavItem } from './nav-bar.types'

const defaultItems: NavItem[] = [
  { label: 'Dashboard',     to: '/dashboard',    icon: LayoutDashboard },
  { label: 'Plano salón',   to: '/plano-salon',  icon: Map },
  { label: 'Reservas',      to: '/reservas',     icon: CalendarCheck },
  { label: 'Clientes',      to: '/clientes',     icon: Users },
  { label: 'Lista espera',  to: '/lista-espera', icon: Clock },
  { label: 'Mesas',         to: '/mesas',        icon: UtensilsCrossed },
  { label: 'Zonas',         to: '/zonas',        icon: MapPin },
  { label: 'Bloqueos',      to: '/bloqueos',     icon: Ban },
]

export function NavBar({ items = defaultItems }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setIsOpen(false), [])

  /* Close on ESC, trap focus inside drawer */
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        triggerRef.current?.focus()
        return
      }
      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last?.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first?.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    /* Move focus into drawer */
    drawerRef.current?.querySelector<HTMLElement>('a, button')?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  return (
    <>
      {/* Skip to main content */}
      <a href="#main-content" className="skip-link">
        Ir al contenido principal
      </a>

      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 shadow-xs backdrop-blur-sm">
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
          style={{ height: 'var(--header-height)' }}
          aria-label="Navegación principal"
        >
          {/* Brand */}
          <AppLink
            to="/dashboard"
            className="flex shrink-0 items-center gap-2 font-sans text-base font-bold text-primary no-underline hover:text-primary"
          >
            <ChefHat className="size-5 text-cta" aria-hidden />
            <span className="hidden xs:inline sm:inline">Restaurante Progra</span>
            <span className="inline xs:hidden sm:hidden">RP</span>
          </AppLink>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-0.5 lg:flex" role="list">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.to}>
                  <AppLink
                    to={item.to}
                    activeProps={{
                      className:
                        'inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white no-underline',
                    }}
                    inactiveProps={{
                      className:
                        'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted no-underline hover:bg-background-subtle hover:text-primary-dark transition-colors duration-150',
                    }}
                  >
                    <Icon className="size-3.5 shrink-0" aria-hidden />
                    {item.label}
                  </AppLink>
                </li>
              )
            })}
          </ul>

          {/* Mobile hamburger */}
          <button
            ref={triggerRef}
            type="button"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setIsOpen((v) => !v)}
            className="flex size-9 cursor-pointer items-center justify-center rounded-md text-primary-dark transition-colors duration-150 hover:bg-background-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
          >
            {isOpen ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div
          className="nav-overlay lg:hidden"
          aria-hidden="true"
          onClick={close}
        />
      )}

      {/* Mobile drawer */}
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        className="nav-drawer lg:hidden"
        data-open={String(isOpen)}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <ChefHat className="size-4 text-cta" aria-hidden />
            <span className="text-sm font-bold text-primary">Restaurante Progra</span>
          </div>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={close}
            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-background-subtle hover:text-primary-dark"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        {/* Drawer nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Menú móvil">
          <ul className="space-y-1" role="list">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.to} onClick={close}>
                  <AppLink
                    to={item.to}
                    activeProps={{
                      className:
                        'flex items-center gap-3 rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-white no-underline',
                    }}
                    inactiveProps={{
                      className:
                        'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-primary-dark no-underline hover:bg-background-subtle transition-colors duration-150',
                    }}
                  >
                    <Icon className="size-4 shrink-0 text-muted" aria-hidden />
                    {item.label}
                  </AppLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}
