import { FlaskConical, WifiOff } from 'lucide-react'
import { isMockApi } from '@api/config'

type ApiModeBannerProps = {
  connected?: boolean
  loading?: boolean
  errorMessage?: string
}

export function ApiModeBanner({ connected, loading, errorMessage }: ApiModeBannerProps) {
  const mock = isMockApi()

  if (mock) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-cta/30 bg-cta/10 px-4 py-3 text-sm text-primary-dark">
        <FlaskConical className="mt-0.5 size-4 shrink-0 text-cta" aria-hidden />
        <p>
          Modo simulado (mock). Para usar ProyectoIProgra2, define{' '}
          <code className="text-xs">VITE_USE_MOCK_API=false</code> y ejecuta el API en{' '}
          <code className="text-xs">http://localhost:5147</code>.
        </p>
      </div>
    )
  }

  if (loading || connected) return null

  if (errorMessage) {
    return (
      <div
        className="flex items-start gap-3 rounded-lg border border-danger/30 bg-red-50 px-4 py-3 text-sm text-red-900"
        role="alert"
      >
        <WifiOff className="mt-0.5 size-4 shrink-0" aria-hidden />
        <div>
          <p className="font-medium">No se pudo conectar con el API</p>
          <p className="mt-1 text-red-800">{errorMessage}</p>
          <p className="mt-2 text-xs text-red-700">
            En otra terminal:{' '}
            <code>cd &quot;C:\Proyecto prograII\ProyectoIProgra2&quot; ; dotnet run --launch-profile http</code>
          </p>
        </div>
      </div>
    )
  }

  return null
}
