import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { isAuthenticated, loading, hasPermission } = useAdminAuth()

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4'></div>
          <p className='text-gray-600 font-medium'>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4'>
        <div className='bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center'>
          <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
            <svg className='w-10 h-10 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>Access Denied</h2>
          <p className='text-gray-600 mb-6'>You do not have permission to view this page. Please contact the administrator.</p>
          <button
            onClick={() => window.history.back()}
            className='w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition'
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
