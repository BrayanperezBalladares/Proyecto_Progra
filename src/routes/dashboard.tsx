import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardPage } from '@ui/pages/dashboard/dashboard-page'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoading) return
    if (!context.auth.user) throw redirect({ to: '/login' as any })
    if (context.auth.role === 'cliente') throw redirect({ to: '/mis-reservas' as any })
  },
  component: DashboardPage,
})
