import { createFileRoute, redirect } from '@tanstack/react-router'
import { MisReservasPage } from '@ui/pages/mis-reservas/mis-reservas-page'

export const Route = createFileRoute('/mis-reservas')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoading) return
    if (!context.auth.user) throw redirect({ to: '/login' })
  },
  component: MisReservasPage,
})
