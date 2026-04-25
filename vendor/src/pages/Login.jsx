import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Store,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  Shield,
  ArrowRight
} from 'lucide-react'
import GoogleLogin from '../components/GoogleLogin'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Login = () => {
  const { isAuthenticated, login } = useContext(AppContext)
  const [emailOrMobile, setEmailOrMobile] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Redirect if already logged in or after successful login
  useEffect(() => {
    if (isAuthenticated === true) {
      console.log('🔀 Login page: User is authenticated, redirecting to home')
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('📤 Submitting login form...')
      const result = await login({
        emailOrMobile: emailOrMobile.trim(),
        password: password
      })

      if (result.success) {
        console.log('✅ Login result successful')
        toast.success('Login successful! Welcome back!')
        // Navigation will happen automatically via useEffect when isAuthenticated changes
      } else {
        console.log('❌ Login result failed:', result.error)
        setError(result.error)
        toast.error(result.error || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('❌ Login form error:', err)
      setError('Something went wrong. Please try again.')
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-start sm:items-center justify-center sm:p-4'>
      {/* Main Container */}
      <div className='w-full max-w-md'>
        {/* Logo & Brand */}
        <div className='text-center mb-6 sm:mb-4 px-6 sm:px-0 pt-10 sm:pt-0'>
          <div className='flex items-center justify-center gap-3 sm:gap-4 mb-2'>
            <div className='inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg'>
              <Store className='w-6 h-6 sm:w-7 sm:h-7 text-white' />
            </div>
            <h1 className='text-2xl sm:text-3xl lg:text-2xl xl:text-2xl font-black text-gray-900'>ABCD Vendor</h1>
          </div>
          <p className='text-sm sm:text-base lg:text-sm xl:text-sm text-gray-600'>Welcome back! Sign in to continue</p>
        </div>

        {/* Login Card */}
        <div className='bg-white sm:rounded-3xl sm:shadow-xl p-6 sm:p-8 mb-6 sm:mb-6'>
          {/* Register Prompt */}
          <div className='mb-5 sm:mb-6 text-center bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl sm:rounded-2xl p-3 sm:p-4'>
            <p className='text-gray-700 text-xs sm:text-sm lg:text-xs xl:text-xs mb-2 sm:mb-3 font-medium'>New to ABCD?</p>
            <a
              href='/signup'
              className='inline-flex items-center justify-center w-full gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2.5 sm:py-3 lg:py-2 xl:py-2 px-4 sm:px-6 lg:px-4 xl:px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base lg:text-sm xl:text-sm'
            >
              Register as New Vendor
              <ArrowRight className='w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 xl:w-4 xl:h-4' />
            </a>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-5'>
            {/* Email/Mobile Input */}
            <div>
              <label className='block text-xs sm:text-sm lg:text-xs xl:text-xs font-bold text-gray-700 mb-1.5 sm:mb-2'>
                Email or Mobile Number
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 xl:w-4 xl:h-4 text-gray-400' />
                <input
                  type='text'
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  className='w-full pl-10 sm:pl-12 lg:pl-10 xl:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3.5 lg:py-2.5 xl:py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm sm:text-base lg:text-sm xl:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium'
                  placeholder='Enter your email or mobile'
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className='block text-xs sm:text-sm lg:text-xs xl:text-xs font-bold text-gray-700 mb-1.5 sm:mb-2'>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 xl:w-4 xl:h-4 text-gray-400' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full pl-10 sm:pl-12 lg:pl-10 xl:pl-10 pr-10 sm:pr-12 lg:pr-10 xl:pr-10 py-2.5 sm:py-3.5 lg:py-2.5 xl:py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm sm:text-base lg:text-sm xl:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium'
                  placeholder='Enter your password'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors'
                >
                  {showPassword ? <EyeOff className='w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 xl:w-4 xl:h-4' /> : <Eye className='w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 xl:w-4 xl:h-4' />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className='flex items-center justify-between'>
              <label className='flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500'
                />
                <span className='ml-2 text-xs sm:text-sm lg:text-xs xl:text-xs font-medium text-gray-700'>Remember me</span>
              </label>
              <a href='#' className='text-xs sm:text-sm lg:text-xs xl:text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors'>
                Forgot Password?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-red-50 border-l-4 border-red-500 rounded-xl p-3 sm:p-4'>
                <div className='flex items-center gap-2 sm:gap-3'>
                  <div className='w-5 h-5 sm:w-6 sm:h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0'>
                    <span className='text-red-600 text-xs sm:text-sm font-bold'>!</span>
                  </div>
                  <p className='text-xs sm:text-sm font-semibold text-red-800'>{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold py-3 sm:py-4 lg:py-2.5 xl:py-2.5 rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm sm:text-base lg:text-sm xl:text-sm'
            >
              {loading ? (
                <>
                  <Loader2 className='w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 xl:w-4 xl:h-4 animate-spin' />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className='w-4 h-4 sm:w-5 sm:h-5 lg:w-4 lg:h-4 xl:w-4 xl:h-4' />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className='mt-6 text-center pb-2 sm:pb-0'>
            <p className='text-xs sm:text-sm lg:text-xs xl:text-xs text-gray-600'>
              Need help?{' '}
              <a href='#' className='font-bold text-indigo-600 hover:text-indigo-700 transition-colors'>
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
