import { createFileRoute } from '@tanstack/react-router'
import { ReservasPage } from '@ui/pages/reservas/reservas-page'

export const Route = createFileRoute('/reservas')({
  component: ReservasPage,
})
