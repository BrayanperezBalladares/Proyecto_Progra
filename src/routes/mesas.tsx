import { createFileRoute } from '@tanstack/react-router'
import { MesasPage } from '@ui/pages/mesas/mesas-page'

export const Route = createFileRoute('/mesas')({
  component: MesasPage,
})
