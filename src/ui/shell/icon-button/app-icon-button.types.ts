import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type AppIconButtonVariant = 'ghost' | 'danger'

export type AppIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: AppIconButtonVariant
  isLoading?: boolean
  label: string
  icon: ReactNode
  loadingIcon?: ReactNode
}
