import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from 'react'
import { authClient } from '../lib/auth-client'

interface User {
  name: string
  email: string
  id: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession()

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name || session.user.email.split('@')[0],
        email: session.user.email,
      }
    : null

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({ email, password })
    return !error
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const { error } = await authClient.signUp.email({ name, email, password })
    return !error
  }, [])

  const loginWithGoogle = useCallback(async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: window.location.origin,
    })
  }, [])

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/login`,
      })
      return !error
    } catch {
      return false
    }
  }, [])

  const logout = useCallback(async () => {
    await authClient.signOut()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: isPending,
        login,
        signup,
        loginWithGoogle,
        requestPasswordReset,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
