import React, { useState } from 'react'
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
  TrendingUp,
  Package,
  BarChart3
} from 'lucide-react'

const Login = () => {
  const [emailOrMobile, setEmailOrMobile] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/vendor-auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          emailOrMobile: emailOrMobile.trim(),
          password: password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('vendorData', JSON.stringify(data.vendorData))
        navigate('/home')
      } else {
        setError(data.message || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-0 lg:p-4 relative overflow-hidden'>
      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000'></div>
      </div>

      {/* Main Container */}
      <div className='relative w-full max-w-6xl grid lg:grid-cols-2 gap-0 bg-white lg:rounded-3xl lg:shadow-2xl overflow-hidden min-h-screen lg:min-h-0'>
        {/* Left Side - Branding */}
        <div className='bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 lg:p-16 text-white relative overflow-hidden hidden lg:block'>
          {/* Decorative Pattern */}
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32'></div>
            <div className='absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-48'></div>
          </div>

          {/* Content */}
          <div className='relative z-10 h-full flex flex-col justify-between'>
            {/* Logo & Title */}
            <div>
              <div className='flex items-center gap-3 mb-12'>
                <div className='w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/30'>
                  <Store className='w-7 h-7' />
                </div>
                <h1 className='text-3xl font-bold'>ABCD Vendor Hub</h1>
              </div>

              <h2 className='text-5xl font-extrabold leading-tight mb-6'>
                Power Your<br />
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200'>
                  Business Growth
                </span>
              </h2>

              <p className='text-lg text-purple-100 mb-12 leading-relaxed'>
                Manage your inventory, track sales in real-time, and reach thousands of customers with our powerful vendor platform.
              </p>
            </div>

            {/* Features */}
            <div className='space-y-6'>
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0'>
                  <TrendingUp className='w-6 h-6' />
                </div>
                <div>
                  <h3 className='font-semibold text-lg mb-1'>Real-Time Analytics</h3>
                  <p className='text-purple-200 text-sm'>Track your sales and performance metrics instantly</p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0'>
                  <Package className='w-6 h-6' />
                </div>
                <div>
                  <h3 className='font-semibold text-lg mb-1'>Smart Inventory</h3>
                  <p className='text-purple-200 text-sm'>Manage products with ease and efficiency</p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0'>
                  <BarChart3 className='w-6 h-6' />
                </div>
                <div>
                  <h3 className='font-semibold text-lg mb-1'>Growth Insights</h3>
                  <p className='text-purple-200 text-sm'>Make data-driven decisions to scale faster</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className='p-5 sm:p-6 lg:p-16 flex flex-col justify-center min-h-screen lg:min-h-0'>
          {/* Mobile Logo */}
          <div className='lg:hidden flex items-center justify-center gap-2 mb-6'>
            <div className='w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center'>
              <Store className='w-6 h-6 text-white' />
            </div>
            <h1 className='text-xl font-bold text-gray-800'>ABCD Vendor</h1>
          </div>

          {/* Welcome Text */}
          <div className='mb-6 lg:mb-10'>
            <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-3'>Welcome Back!</h2>
            <p className='text-gray-600 text-base lg:text-lg'>Sign in to manage your vendor account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className='space-y-5 lg:space-y-6'>
            {/* Email or Mobile Input */}
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2 lg:mb-3'>
                Email or Mobile Number
              </label>
              <div className='relative group'>
                <div className='absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors'>
                  <Mail className='w-5 h-5' />
                </div>
                <input
                  type='text'
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  className='w-full pl-11 lg:pl-12 pr-3 lg:pr-4 py-3 lg:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium text-sm lg:text-base'
                  placeholder='Enter email or mobile number'
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2 lg:mb-3'>
                Password
              </label>
              <div className='relative group'>
                <div className='absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors'>
                  <Lock className='w-5 h-5' />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full pl-11 lg:pl-12 pr-11 lg:pr-14 py-3 lg:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-200 font-medium text-sm lg:text-base'
                  placeholder='Enter your password'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-0 pr-3 lg:pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors'
                >
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className='flex items-center justify-between'>
              <label className='flex items-center cursor-pointer group'>
                <input
                  type='checkbox'
                  className='w-4 h-4 lg:w-5 lg:h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer'
                />
                <span className='ml-2 lg:ml-3 text-xs lg:text-sm font-medium text-gray-700 group-hover:text-gray-900'>
                  Remember me
                </span>
              </label>
              <a href='#' className='text-xs lg:text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors'>
                Forgot Password?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-red-50 border-l-4 border-red-500 rounded-lg p-3 lg:p-4 animate-shake'>
                <div className='flex items-center gap-2 lg:gap-3'>
                  <div className='w-5 h-5 lg:w-6 lg:h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0'>
                    <span className='text-red-600 text-xs lg:text-sm font-bold'>!</span>
                  </div>
                  <p className='text-xs lg:text-sm font-semibold text-red-800'>{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold py-3 lg:py-4 px-6 rounded-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 lg:gap-3 text-base lg:text-lg'
            >
              {loading ? (
                <>
                  <Loader2 className='w-5 h-5 lg:w-6 lg:h-6 animate-spin' />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className='w-5 h-5 lg:w-6 lg:h-6' />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className='mt-6 lg:mt-10 pt-6 lg:pt-8 border-t border-gray-200'>
            <div className='flex items-center justify-center gap-2 text-gray-500 text-xs lg:text-sm'>
              <Shield className='w-3 h-3 lg:w-4 lg:h-4' />
              <span>Secured with end-to-end encryption</span>
            </div>

            {/* Register Link */}
            <div className='mt-4 lg:mt-6 text-center'>
              <p className='text-gray-600 mb-2 lg:mb-3 text-sm lg:text-base'>Don't have a vendor account?</p>
              <a
                href='/signup'
                className='inline-block w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm lg:text-base'
              >
                Register Your Business
              </a>
            </div>

            <p className='text-center text-xs lg:text-sm text-gray-600 mt-4 lg:mt-6'>
              Need assistance?{' '}
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
