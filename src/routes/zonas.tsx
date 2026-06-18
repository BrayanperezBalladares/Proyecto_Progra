import { createFileRoute } from '@tanstack/react-router'
import { ZonasPage } from '@ui/pages/zonas/zonas-page'

export const Route = createFileRoute('/zonas')({
  component: ZonasPage,
})
