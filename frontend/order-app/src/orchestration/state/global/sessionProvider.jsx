import { createContext, useContext, useEffect, useState } from 'react'
import { useServiceContainer } from './appProvider'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { auth } = useServiceContainer()
  const [session, setSession] = useState({
    accessToken: null,
    isAuthenticated: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setSession(auth.restoreSession())
    setIsLoading(false)
  }, [auth])

  async function login(username, password) {
    const nextSession = await auth.loginUser({ username, password })
    setSession(nextSession)
    return nextSession
  }

  async function logout() {
    await auth.logoutUser()
    setSession({
      accessToken: null,
      isAuthenticated: false,
    })
  }

  const value = {
    ...session,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('Auth context is not available.')
  }

  return auth
}
