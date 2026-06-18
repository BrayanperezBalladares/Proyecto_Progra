import { Link } from '@tanstack/react-router'
import type { AppLinkProps } from './app-link.types'

export function AppLink({ children, className = '', ...props }: AppLinkProps) {
  return (
    <Link
      className={`cursor-pointer text-sm font-medium text-secondary transition-colors duration-200 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
      {...props}
    >
      {children}
    </Link>
  )
}
