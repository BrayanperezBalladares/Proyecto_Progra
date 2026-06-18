import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import type { AppButtonProps } from './app-button.types'

const variantClasses: Record<NonNullable<AppButtonProps['variant']>, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer disabled:opacity-50',
  secondary:
    'bg-surface text-primary ring-1 ring-inset ring-primary hover:bg-background-subtle cursor-pointer disabled:opacity-50',
  ghost:
    'bg-transparent text-primary-dark hover:bg-background-subtle cursor-pointer disabled:opacity-50',
  danger:
    'bg-danger text-white hover:opacity-90 shadow-xs cursor-pointer disabled:opacity-50',
}

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  function AppButton(
    { variant = 'primary', isLoading = false, disabled, className = '', children, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled ?? isLoading}
        className={`inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="size-3.5 animate-spin" aria-hidden />}
        {children}
      </button>
    )
  },
)
