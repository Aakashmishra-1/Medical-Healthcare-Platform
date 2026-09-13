import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('hc_user')
      const token = localStorage.getItem('hc_token')
      if (storedUser && token) {
        setUser(JSON.parse(storedUser))
      }
    } catch {
      localStorage.removeItem('hc_user')
      localStorage.removeItem('hc_token')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('hc_token', token)
    localStorage.setItem('hc_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('hc_token')
    localStorage.removeItem('hc_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
