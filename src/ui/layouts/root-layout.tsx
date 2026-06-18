import { Outlet } from '@tanstack/react-router'
import { NavBar } from '@ui/shell/nav-bar/nav-bar'

export function RootLayout() {
  return (
    <div className="min-h-svh bg-background text-primary-dark">
      <NavBar />
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
