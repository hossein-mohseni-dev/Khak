import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { api } from '../services'
import { setToken } from '../services/http'
import type { User } from '../types'

interface AuthCtx {
  user: User | null
  ready: boolean
  login: (email: string, password: string) => Promise<User>
  register: (payload: { name: string; email: string; password: string }) => Promise<User>
  logout: () => void
  refresh: () => Promise<User>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    api
      .me()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setReady(true))
  }, [])

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      ready,
      async login(email, password) {
        const data = await api.login({ email, password })
        setToken(data.token)
        setUser(data.user)
        return data.user
      },
      async register(payload) {
        const data = await api.register(payload)
        setToken(data.token)
        setUser(data.user)
        return data.user
      },
      logout() {
        setToken(null)
        setUser(null)
      },
      async refresh() {
        const me = await api.me()
        setUser(me)
        return me
      },
    }),
    [user, ready],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
