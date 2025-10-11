import { useEffect, useState, createContext, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

// Move BACKEND_URL outside component to prevent recreating on every render
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

const AppContextProvider = (props) => {
  const navigate = useNavigate()

  // Auth states
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(null) // null = loading, true/false = auth status
  const [loading, setLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)

  // Memoize functions to prevent re-renders
  const checkAuthStatus = useCallback(async () => {
    // Prevent multiple simultaneous auth checks
    if (isCheckingAuth) return

    try {
      setIsCheckingAuth(true)
      setLoading(true)
      const response = await axios.get(`${BACKEND_URL}/api/auth/status`, {
        withCredentials: true
      })

      if (response.data.isLoggedIn) {
        setIsAuthenticated(true)
        setUser(response.data.user)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
      setIsCheckingAuth(false)
    }
  }, [])

  // Check authentication status on app load
  useEffect(() => {
    // Only check auth if we haven't already checked
    if (isAuthenticated === null && !user) {
      checkAuthStatus()
    }
  }, [isAuthenticated, user, checkAuthStatus])

  // Login function
  const login = useCallback(async (loginData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, loginData, {
        withCredentials: true
      })

      if (response.data.success) {
        setIsAuthenticated(true)
        setUser(response.data.userData)
        return { success: true }
      } else {
        return {
          success: false,
          error: response.data.message || 'Login failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      }
    }
  }, [])

  // Signup function
  const signup = useCallback(async (signupData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/signup`, signupData, {
        withCredentials: true
      })

      if (response.data.success) {
        setIsAuthenticated(true)
        setUser(response.data.userData)
        return { success: true }
      } else {
        return {
          success: false,
          error: response.data.message || 'Signup failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed'
      }
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, {
        withCredentials: true
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsAuthenticated(false)
      setUser(null)
      navigate('/login')
    }
  }, [navigate])

  // Google OAuth function
  const googleAuth = useCallback(async (credential) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/google`,
        { credential },
        { withCredentials: true }
      )

      if (response.data.success) {
        setIsAuthenticated(true)
        setUser(response.data.userData)
        return { success: true }
      } else {
        return {
          success: false,
          error: response.data.message || 'Google login failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Google login failed'
      }
    }
  }, [])

  // Refresh user data (useful after profile updates)
  const refreshUser = useCallback(async () => {
    await checkAuthStatus()
  }, [checkAuthStatus])

  // Update user data locally (for optimistic updates)
  const updateUser = useCallback((userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }))
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    BACKEND_URL,
    // Auth values
    user,
    isAuthenticated,
    loading,
    // Auth functions
    login,
    signup,
    logout,
    googleAuth,
    checkAuthStatus,
    refreshUser,
    updateUser,
  }), [user, isAuthenticated, loading, login, signup, logout, googleAuth, checkAuthStatus, refreshUser, updateUser])

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
