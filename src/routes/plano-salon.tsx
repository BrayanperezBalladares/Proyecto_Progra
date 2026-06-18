import { createFileRoute } from '@tanstack/react-router'
import { PlanoSalonPage } from '@ui/pages/plano-salon/plano-salon-page'

export const Route = createFileRoute('/plano-salon')({
  component: PlanoSalonPage,
})
