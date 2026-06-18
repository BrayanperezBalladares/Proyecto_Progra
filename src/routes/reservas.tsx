import { createFileRoute, redirect } from '@tanstack/react-router'
import { ReservasPage } from '@ui/pages/reservas/reservas-page'

export const Route = createFileRoute('/reservas')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoading) return
    if (!context.auth.user) throw redirect({ to: '/login' as any })
    if (context.auth.role === 'cliente') throw redirect({ to: '/mis-reservas' as any })
  },
  component: ReservasPage,
})
