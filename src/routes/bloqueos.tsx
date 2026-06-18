import { createFileRoute, redirect } from '@tanstack/react-router'
import { BloqueosPage } from '@ui/pages/bloqueos/bloqueos-page'

export const Route = createFileRoute('/bloqueos')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoading) return
    if (!context.auth.user) throw redirect({ to: '/login' })
    if (context.auth.role === 'cliente') throw redirect({ to: '/mis-reservas' })
  },
  component: BloqueosPage,
})
