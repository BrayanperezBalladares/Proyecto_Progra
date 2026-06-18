import { createFileRoute, redirect } from '@tanstack/react-router'
import { ZonasPage } from '@ui/pages/zonas/zonas-page'

export const Route = createFileRoute('/zonas')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoading) return
    if (!context.auth.user) throw redirect({ to: '/login' as any })
    if (context.auth.role === 'cliente') throw redirect({ to: '/mis-reservas' as any })
  },
  component: ZonasPage,
})
