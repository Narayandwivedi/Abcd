import { createContext, useContext, useState, useEffect } from 'react'
import api from '../config/axios'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [subAdmin, setSubAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if sub-admin is already logged in on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await api.get('/api/subadmin/me')
      if (response.data.success) {
        setSubAdmin(response.data.subAdmin)
      } else {
        setSubAdmin(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setSubAdmin(null)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    subAdmin,
    setSubAdmin,
    loading,
    checkAuth
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
