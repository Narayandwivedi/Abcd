import { useContext, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, vendor, application } = useContext(AppContext)
  const location = useLocation()

  useEffect(() => {
    console.log('🛡️ ProtectedRoute render:', {
      path: location.pathname,
      isAuthenticated,
      loading,
      isBusinessApplicationSubmitted: vendor?.isBusinessApplicationSubmitted,
      applicationStatus: application?.applicationStatus,
      isVerified: vendor?.isVerified,
      timestamp: new Date().toISOString()
    })
  }, [isAuthenticated, loading, vendor, application, location.pathname])

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

  // Check if vendor is verified/approved by admin (skip check for /pending-approval page)
  if (vendor && !vendor.isVerified && location.pathname !== '/pending-approval') {
    console.log('⏳ ProtectedRoute: Vendor not verified, redirecting to pending approval page')
    return <Navigate to='/pending-approval' replace />
  }

  // User is authenticated, form is completed, and approved - render the protected content
  console.log('✅ ProtectedRoute: Authenticated and authorized, rendering protected content')
  return children
}

export default ProtectedRoute
