import { createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { RootLayout } from '@ui/layouts/root-layout'
import type { useAuth } from '@api/shared/hooks/use-auth'

export type RouterContext = {
  auth: ReturnType<typeof useAuth>
}

export const Route = createRootRouteWithContext<RouterContext>()({
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
