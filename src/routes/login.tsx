import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginPage } from '@ui/pages/login/login-page'

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isLoading && context.auth.user) {
      const dest = context.auth.role === 'cliente' ? '/mis-reservas' : '/dashboard'
      throw redirect({ to: dest })
    }
  },
  component: LoginPage,
})
