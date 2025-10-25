import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AdminAuthContext = createContext(null)

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
axios.defaults.withCredentials = true

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if admin is logged in on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/admin/me')
      if (response.data.success) {
        setAdmin(response.data.admin)
        setIsAuthenticated(true)
      }
    } catch (error) {
      setAdmin(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/admin/login', { email, password })
      if (response.data.success) {
        setAdmin(response.data.admin)
        setIsAuthenticated(true)
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      return { success: false, message }
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/admin/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setAdmin(null)
      setIsAuthenticated(false)
    }
  }

  const value = {
    admin,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
