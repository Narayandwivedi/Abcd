import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()

  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
  })

  // Handle sending OTP
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${backendUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('OTP sent to your email successfully!')
        setOtpSent(true)
      } else {
        toast.error(data.message || 'Failed to send OTP')
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle reset password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate passwords match
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${backendUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPass: formData.newPassword
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Password reset successfully!')
        setOtpSent(false)
        setFormData({ email: '', otp: '', newPassword: '', confirmNewPassword: '' })
        // Navigate to login page
        setTimeout(() => {
          navigate('/login')
        }, 1500)
      } else {
        toast.error(data.message || 'Password reset failed')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle resend OTP
  const handleResendOTP = () => {
    setOtpSent(false)
    setFormData({ ...formData, otp: '', newPassword: '', confirmNewPassword: '' })
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center py-12 px-4 relative overflow-hidden'>
      {/* Decorative Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute top-20 right-20 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 left-20 w-80 h-80 bg-purple-500 opacity-10 rounded-full blur-3xl'></div>
      </div>

      <div className='max-w-md w-full relative z-10'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-black text-white mb-2'>Reset Password</h1>
          <p className='text-gray-400'>
            {otpSent ? 'Enter OTP and new password' : 'Enter your email to receive OTP'}
          </p>
        </div>

        {/* Reset Password Form */}
        <div className='bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20'>
          {!otpSent ? (
            /* Send OTP Form */
            <form onSubmit={handleSendOTP} className='space-y-6'>
              <div>
                <label className='block text-white font-semibold mb-2 text-sm'>Email Address</label>
                <div className='relative'>
                  <input
                    type='email'
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className='w-full px-4 py-3 pl-11 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-sm'
                    placeholder='you@example.com'
                    required
                  />
                  <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                  </svg>
                </div>
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
              >
                {loading ? (
                  <div className='flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3'></div>
                    Sending OTP...
                  </div>
                ) : 'Send OTP'}
              </button>

              <div className='text-center mt-6'>
                <Link to='/login' className='text-blue-400 hover:text-blue-300 font-semibold text-sm'>
                  ← Back to Login
                </Link>
              </div>
            </form>
          ) : (
            /* Reset Password Form */
            <form onSubmit={handleResetPassword} className='space-y-5'>
              <div>
                <label className='block text-white font-semibold mb-2 text-sm'>OTP</label>
                <div className='relative'>
                  <input
                    type='text'
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    className='w-full px-4 py-3 pl-11 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-sm'
                    placeholder='Enter 6-digit OTP'
                    maxLength='6'
                    required
                  />
                  <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' />
                  </svg>
                </div>
              </div>

              <div>
                <label className='block text-white font-semibold mb-2 text-sm'>New Password</label>
                <div className='relative'>
                  <input
                    type='password'
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className='w-full px-4 py-3 pl-11 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-sm'
                    placeholder='Enter new password'
                    required
                  />
                  <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                  </svg>
                </div>
              </div>

              <div>
                <label className='block text-white font-semibold mb-2 text-sm'>Confirm New Password</label>
                <div className='relative'>
                  <input
                    type='password'
                    value={formData.confirmNewPassword}
                    onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })}
                    className='w-full px-4 py-3 pl-11 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-sm'
                    placeholder='Confirm new password'
                    required
                  />
                  <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                </div>
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
              >
                {loading ? (
                  <div className='flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3'></div>
                    Resetting Password...
                  </div>
                ) : 'Reset Password'}
              </button>

              <div className='flex justify-between items-center mt-6'>
                <button
                  type='button'
                  onClick={handleResendOTP}
                  className='text-blue-400 hover:text-blue-300 font-semibold text-sm'
                >
                  Resend OTP
                </button>
                <Link to='/login' className='text-blue-400 hover:text-blue-300 font-semibold text-sm'>
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Additional Info */}
        <div className='mt-6 text-center'>
          <p className='text-gray-400 text-sm'>
            Don't have an account?{' '}
            <Link to='/signup' className='text-blue-400 font-bold hover:text-blue-300'>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
