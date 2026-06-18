import { createFileRoute, redirect } from '@tanstack/react-router'
import { MesasPage } from '@ui/pages/mesas/mesas-page'

export const Route = createFileRoute('/mesas')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoading) return
    if (!context.auth.user) throw redirect({ to: '/login' })
    if (context.auth.role === 'cliente') throw redirect({ to: '/mis-reservas' })
  },
  component: MesasPage,
})
