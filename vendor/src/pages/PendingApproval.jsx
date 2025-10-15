import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Store,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  LogOut,
  RefreshCw
} from 'lucide-react'
import { AppContext } from '../context/AppContext'

const PendingApproval = () => {
  const { vendor, application, logout, refreshVendor, isAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Redirect to dashboard if approved
  useEffect(() => {
    if (vendor?.isVerified) {
      navigate('/dashboard', { replace: true })
    }
  }, [vendor, navigate])

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout()
    }
  }

  const handleRefresh = async () => {
    await refreshVendor()
  }

  if (!vendor) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
          <p className='mt-4 text-gray-600 font-medium'>Loading...</p>
        </div>
      </div>
    )
  }

  const getStatusInfo = () => {
    return {
      icon: <Clock className='w-16 h-16 text-yellow-500' />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      title: 'Application Under Review',
      message: 'Your vendor registration has been submitted and is awaiting admin approval.',
      detail: 'This process typically takes 24-48 hours. You will be notified once your account is approved and you can access the dashboard.'
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-2xl mx-auto'>
        {/* Header with Logout */}
        <div className='flex justify-between items-center mb-8'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
              <Store className='w-6 h-6 text-white' />
            </div>
            <div>
              <h1 className='text-xl font-bold text-gray-900'>ABCD Vendor</h1>
              <p className='text-sm text-gray-600'>{vendor?.businessName || 'Vendor Portal'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className='inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 border-2 border-gray-200'
          >
            <LogOut className='w-4 h-4' />
            Logout
          </button>
        </div>

        {/* Status Card */}
        <div className='bg-white rounded-3xl shadow-xl p-8 sm:p-10'>
          {/* Status Icon */}
          <div className='flex justify-center mb-6'>
            <div className={`${statusInfo.bgColor} border-2 ${statusInfo.borderColor} rounded-full p-6`}>
              {statusInfo.icon}
            </div>
          </div>

          {/* Status Title */}
          <h2 className='text-3xl font-black text-gray-900 text-center mb-4'>
            {statusInfo.title}
          </h2>

          {/* Status Message */}
          <div className={`${statusInfo.bgColor} border-2 ${statusInfo.borderColor} rounded-2xl p-6 mb-6`}>
            <p className={`text-base font-semibold ${statusInfo.textColor} text-center mb-3`}>
              {statusInfo.message}
            </p>
            <p className={`text-sm ${statusInfo.textColor} text-center opacity-90`}>
              {statusInfo.detail}
            </p>
          </div>

          {/* Vendor Details */}
          <div className='bg-gray-50 rounded-2xl p-6 mb-6'>
            <h3 className='text-lg font-bold text-gray-900 mb-4'>Submitted Information</h3>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-sm font-medium text-gray-600'>Owner Name:</span>
                <span className='text-sm font-bold text-gray-900'>{vendor?.ownerName || 'N/A'}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm font-medium text-gray-600'>Business Name:</span>
                <span className='text-sm font-bold text-gray-900'>{vendor?.businessName || 'N/A'}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm font-medium text-gray-600'>Email:</span>
                <span className='text-sm font-bold text-gray-900'>{vendor?.email || 'N/A'}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm font-medium text-gray-600'>Mobile:</span>
                <span className='text-sm font-bold text-gray-900'>{vendor?.mobile || 'N/A'}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm font-medium text-gray-600'>Status:</span>
                <span className='text-sm font-bold uppercase text-yellow-600'>
                  Pending Approval
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='space-y-3'>
            <button
              onClick={handleRefresh}
              className='w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold py-4 rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2'
            >
              <RefreshCw className='w-5 h-5' />
              Refresh Status
            </button>
          </div>

          {/* Support Link */}
          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              Need help?{' '}
              <a href='#' className='font-bold text-indigo-600 hover:text-indigo-700 transition-colors'>
                Contact Support
              </a>
            </p>
          </div>
        </div>

        {/* Info Note */}
        <div className='mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-4'>
          <div className='flex items-start gap-3'>
            <AlertCircle className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
            <div>
              <p className='text-sm font-semibold text-blue-900 mb-1'>What happens next?</p>
              <p className='text-xs text-blue-700'>
                Once your account is approved, you'll have full access to the vendor dashboard where you can add products, manage orders, track payments, and much more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PendingApproval
