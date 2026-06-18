import { createFileRoute } from '@tanstack/react-router'
import { ListaEsperaPage } from '@ui/pages/lista-espera/lista-espera-page'

export const Route = createFileRoute('/lista-espera')({
  component: ListaEsperaPage,
})
