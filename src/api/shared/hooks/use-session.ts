import { useSyncExternalStore } from 'react'
import {
  clearStoredSession,
  getStoredSession,
  setStoredSession,
} from '../services/auth.service'
import type { Session } from '../types/session.types'

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

export function useSession() {
  const session = useSyncExternalStore(
    subscribe,
    getStoredSession,
    () => null,
  )

  return {
    session,
    isAuthenticated: session !== null,
    signIn: (next: Session) => {
      setStoredSession(next)
      window.dispatchEvent(new Event('storage'))
    },
    signOut: () => {
      clearStoredSession()
      window.dispatchEvent(new Event('storage'))
    },
  }
}
