import { Loader2 } from 'lucide-react'
import type { AppIconButtonProps } from './app-icon-button.types'

const variantClasses: Record<NonNullable<AppIconButtonProps['variant']>, string> = {
  ghost:
    'text-muted hover:bg-background-subtle hover:text-primary-dark cursor-pointer',
  danger:
    'text-danger hover:bg-danger-light cursor-pointer',
}

export function AppIconButton({
  variant = 'ghost',
  isLoading = false,
  disabled,
  label,
  icon,
  loadingIcon,
  className = '',
  ...props
}: AppIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled ?? isLoading}
      className={`inline-flex size-8 items-center justify-center rounded-md transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading
        ? (loadingIcon ?? <Loader2 className="size-3.5 animate-spin" aria-hidden />)
        : icon}
    </button>
  )
}
