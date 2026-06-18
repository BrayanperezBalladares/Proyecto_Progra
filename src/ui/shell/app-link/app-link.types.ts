import type { LinkProps } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export type AppLinkProps = LinkProps & {
  children: ReactNode
  className?: string
}
