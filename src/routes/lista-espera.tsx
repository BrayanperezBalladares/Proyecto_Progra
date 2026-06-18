import { createFileRoute, redirect } from '@tanstack/react-router'
import { ListaEsperaPage } from '@ui/pages/lista-espera/lista-espera-page'

export const Route = createFileRoute('/lista-espera')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoading) return
    if (!context.auth.user) throw redirect({ to: '/login' as any })
    if (context.auth.role === 'cliente') throw redirect({ to: '/mis-reservas' as any })
  },
  component: ListaEsperaPage,
})
