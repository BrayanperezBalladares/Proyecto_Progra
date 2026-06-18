import { FlaskConical } from 'lucide-react'
import { isMockApi } from '@api/config'

export function MockBanner() {
  if (!isMockApi()) return null

  return (
    <div className="flex items-center gap-2 rounded-md border border-warning/30 bg-warning-light px-3 py-2 text-xs">
      <FlaskConical className="size-3.5 shrink-0 text-cta" aria-hidden />
      <span className="text-primary-dark">
        <strong>Modo simulado</strong> — los datos son de prueba.{' '}
        <span className="text-muted">
          Cambia <code className="font-mono">VITE_USE_MOCK_API=false</code> para usar el API real.
        </span>
      </span>
    </div>
  )
}
