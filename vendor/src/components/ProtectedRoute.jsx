import { useContext, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AppContext)
  const location = useLocation()

  useEffect(() => {
    console.log('🛡️ ProtectedRoute render:', {
      path: location.pathname,
      isAuthenticated,
      loading,
      timestamp: new Date().toISOString()
    })
  }, [isAuthenticated, loading, location.pathname])

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('⏳ ProtectedRoute: Loading authentication state...')
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
          <p className='mt-4 text-gray-600 font-medium'>Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('🚫 ProtectedRoute: Not authenticated, redirecting to login')
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  // User is authenticated, render the protected content
  console.log('✅ ProtectedRoute: Authenticated, rendering protected content')
  return children
}

export default ProtectedRoute
