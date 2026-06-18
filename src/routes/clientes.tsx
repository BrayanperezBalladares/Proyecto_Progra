import { createFileRoute, redirect } from '@tanstack/react-router'
import { ClientesPage } from '@ui/pages/clientes/clientes-page'

export const Route = createFileRoute('/clientes')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoading) return
    if (!context.auth.user) throw redirect({ to: '/login' })
    if (context.auth.role === 'cliente') throw redirect({ to: '/mis-reservas' })
  },
  component: ClientesPage,
})
