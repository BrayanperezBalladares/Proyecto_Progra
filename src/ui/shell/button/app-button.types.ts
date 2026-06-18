import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: AppButtonVariant
  isLoading?: boolean
  children: ReactNode
}
