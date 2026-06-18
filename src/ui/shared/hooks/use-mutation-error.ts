import { isApiError } from '@api/client'

export function getMutationErrorMessage(
  error: unknown,
  fallback = 'Operation failed',
): string | null {
  if (!error) return null
  if (isApiError(error)) return error.message
  if (error instanceof Error) return error.message
  return fallback
}
