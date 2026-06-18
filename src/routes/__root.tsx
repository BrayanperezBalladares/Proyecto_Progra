import { createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { RootLayout } from '@ui/layouts/root-layout'

export const Route = createRootRoute({
  component: RootRouteComponent,
})

function RootRouteComponent() {
  return (
    <>
      <RootLayout />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
