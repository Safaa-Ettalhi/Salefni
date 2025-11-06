import { createContext, useContext, useState, useEffect } from 'react'
import { loginAdmin } from '../services/api'


const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const result = await loginAdmin(email, password)
      if (result.success) {
        setAdmin(result.admin)
        localStorage.setItem('admin', JSON.stringify(result.admin))
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem('admin')
  }
  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin')
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin))
    }
  }, [])

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}

