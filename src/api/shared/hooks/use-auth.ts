import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export type Role = 'admin' | 'recepcionista' | 'cliente'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: Role
}

function extractRole(session: Session): Role {
  const role = session.user.app_metadata?.role
  if (role === 'admin' || role === 'recepcionista') return role
  return 'cliente'
}

function sessionToAuthUser(session: Session): AuthUser {
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    name: session.user.user_metadata?.full_name ?? session.user.email ?? '',
    role: extractRole(session),
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session ? sessionToAuthUser(data.session) : null)
      setIsLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session ? sessionToAuthUser(session) : null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password })

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })

  const signOut = () => supabase.auth.signOut()

  return {
    user,
    role: user?.role ?? 'cliente',
    isLoading,
    signIn,
    signOut,
    signInWithGoogle,
  }
}
