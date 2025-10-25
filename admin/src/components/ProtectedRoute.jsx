import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth()

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

  return children
}

export default ProtectedRoute
