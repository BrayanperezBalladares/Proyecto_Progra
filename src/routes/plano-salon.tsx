import { createFileRoute, redirect } from '@tanstack/react-router'
import { PlanoSalonPage } from '@ui/pages/plano-salon/plano-salon-page'

export const Route = createFileRoute('/plano-salon')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoading) return
    if (!context.auth.user) throw redirect({ to: '/login' as any })
    if (context.auth.role === 'cliente') throw redirect({ to: '/mis-reservas' as any })
  },
  component: PlanoSalonPage,
})
