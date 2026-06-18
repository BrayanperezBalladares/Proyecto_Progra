import { createFileRoute, redirect } from '@tanstack/react-router'
import { ReservasPage } from '@ui/pages/reservas/reservas-page'

export const Route = createFileRoute('/reservas')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoading) return
    if (!context.auth.user) throw redirect({ to: '/login' })
    if (context.auth.role === 'cliente') throw redirect({ to: '/mis-reservas' })
  },
  component: ReservasPage,
})
