import type { Session } from '../types/session.types'

const SESSION_KEY = 'auth_token'

export function getStoredSession(): Session | null {
  const token = localStorage.getItem(SESSION_KEY)
  if (!token) return null
  return { token, userId: 'local' }
}

export function setStoredSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, session.token)
}

export function clearStoredSession(): void {
  localStorage.removeItem(SESSION_KEY)
}
