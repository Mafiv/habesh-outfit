import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  signup: (name: string, email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('stylish_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = useCallback((email: string, _password: string) => {
    const u = { name: email.split('@')[0], email }
    setUser(u)
    localStorage.setItem('stylish_user', JSON.stringify(u))
    return true
  }, [])

  const signup = useCallback((name: string, email: string, _password: string) => {
    const u = { name, email }
    setUser(u)
    localStorage.setItem('stylish_user', JSON.stringify(u))
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('stylish_user')
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
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
