import { useEffect, useState, createContext, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

// Move BACKEND_URL outside component to prevent recreating on every render
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

const AppContextProvider = (props) => {
  const navigate = useNavigate()

  // Auth states
  const [vendor, setVendor] = useState(null)
  const [application, setApplication] = useState(null) // Business application data
  const [isAuthenticated, setIsAuthenticated] = useState(null) // null = loading, true/false = auth status
  const [loading, setLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)

  // Debug: Log state changes
  useEffect(() => {
    console.log('📊 Auth State Changed:', { isAuthenticated, loading, vendor: vendor?.businessName || vendor?.email || 'null' })
  }, [isAuthenticated, loading, vendor])

  // Memoize functions to prevent re-renders
  const checkAuthStatus = useCallback(async () => {
    // Prevent multiple simultaneous auth checks
    if (isCheckingAuth) {
      console.log('🔄 Auth check already in progress, skipping...')
      return
    }

    console.log('🔍 Checking authentication status...')
    try {
      setIsCheckingAuth(true)
      setLoading(true)
      const response = await axios.get(`${BACKEND_URL}/api/vendor-auth/status`, {
        withCredentials: true
      })

      console.log('✅ Auth status response:', {
        isLoggedIn: response.data.isLoggedIn,
        vendor: response.data.vendor?.businessName || 'N/A'
      })

      if (response.data.isLoggedIn) {
        setIsAuthenticated(true)
        setVendor(response.data.vendor)
        console.log('✓ User authenticated successfully')

        // Fetch vendor details including application status
        try {
          const detailsResponse = await axios.get(`${BACKEND_URL}/api/vendor/details`, {
            withCredentials: true
          })
          if (detailsResponse.data.success) {
            setVendor(detailsResponse.data.vendorData)
            setApplication(detailsResponse.data.application)
            console.log('✓ Vendor details and application loaded')
          }
        } catch (err) {
          console.log('⚠️ Could not fetch vendor details:', err.message)
        }
      } else {
        setIsAuthenticated(false)
        setVendor(null)
        setApplication(null)
        console.log('✗ User not authenticated')
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error.message)
      setIsAuthenticated(false)
      setVendor(null)
      setApplication(null)
    } finally {
      setLoading(false)
      setIsCheckingAuth(false)
    }
  }, [])

  // Check authentication status on app load ONLY
  useEffect(() => {
    // Only check auth on initial mount when both are null
    if (isAuthenticated === null && !vendor) {
      console.log('🔄 Initial auth check on app load')
      checkAuthStatus()
    }
  }, []) // Empty deps - only run once on mount

  // Login function
  const login = useCallback(async (loginData) => {
    console.log('🔐 Attempting login...')
    try {
      const response = await axios.post(`${BACKEND_URL}/api/vendor-auth/login`, loginData, {
        withCredentials: true
      })

      if (response.data.success) {
        console.log('✅ Login successful, received vendor data:', response.data.vendorData?.businessName)

        // Immediately set auth state - this will allow navigation
        setIsAuthenticated(true)
        setVendor(response.data.vendorData)
        setLoading(false)

        console.log('✓ Auth state updated: isAuthenticated=true, vendor set')
        return { success: true }
      } else {
        console.log('❌ Login failed:', response.data.message)
        return {
          success: false,
          error: response.data.message || 'Login failed'
        }
      }
    } catch (error) {
      console.error('❌ Login error:', error.response?.data?.message || error.message)
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      }
    }
  }, [])

  // Signup function
  const signup = useCallback(async (signupData) => {
    console.log('📝 Attempting signup...')
    try {
      const response = await axios.post(`${BACKEND_URL}/api/vendor-auth/signup`, signupData, {
        withCredentials: true
      })

      if (response.data.success) {
        console.log('✅ Signup successful, received vendor data:', response.data.vendorData?.businessName)

        // Immediately set auth state - this will allow navigation
        setIsAuthenticated(true)
        setVendor(response.data.vendorData)
        setLoading(false)

        console.log('✓ Auth state updated: isAuthenticated=true, vendor set')
        return { success: true }
      } else {
        console.log('❌ Signup failed:', response.data.message)
        return {
          success: false,
          error: response.data.message || 'Signup failed'
        }
      }
    } catch (error) {
      console.error('❌ Signup error:', error.response?.data?.message || error.message)
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed'
      }
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/vendor-auth/logout`, {}, {
        withCredentials: true
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsAuthenticated(false)
      setVendor(null)
      navigate('/login')
    }
  }, [navigate])

  // Refresh vendor data (useful after profile updates)
  const refreshVendor = useCallback(async () => {
    await checkAuthStatus()
  }, [checkAuthStatus])

  // Update vendor data locally (for optimistic updates)
  const updateVendor = useCallback((vendorData) => {
    setVendor(prevVendor => ({ ...prevVendor, ...vendorData }))
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    BACKEND_URL,
    // Auth values
    vendor,
    application,
    isAuthenticated,
    loading,
    // Auth functions
    login,
    signup,
    logout,
    checkAuthStatus,
    refreshVendor,
    updateVendor,
  }), [vendor, application, isAuthenticated, loading, login, signup, logout, checkAuthStatus, refreshVendor, updateVendor])

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
