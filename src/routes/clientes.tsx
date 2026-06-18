import { createFileRoute } from '@tanstack/react-router'
import { ClientesPage } from '@ui/pages/clientes/clientes-page'

export const Route = createFileRoute('/clientes')({
  component: ClientesPage,
})
