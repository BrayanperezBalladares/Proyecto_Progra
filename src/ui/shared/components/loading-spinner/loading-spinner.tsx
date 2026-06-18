type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const sizeClasses = { sm: 'size-5', md: 'size-8', lg: 'size-10' }

export function LoadingSpinner({ size = 'md', label = 'Cargando…' }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={`inline-block animate-spin rounded-full border-2 border-primary/20 border-t-primary ${sizeClasses[size]}`}
    />
  )
}
