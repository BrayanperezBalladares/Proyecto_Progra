import { createFileRoute } from '@tanstack/react-router'
import { BloqueosPage } from '@ui/pages/bloqueos/bloqueos-page'

export const Route = createFileRoute('/bloqueos')({
  component: BloqueosPage,
})
