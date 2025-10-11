import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import GoogleLogin from '../component/GoogleLogin'

const Login = () => {
  const { isAuthenticated, login } = useContext(AppContext)
  const navigate = useNavigate()

  const [emailOrMobile, setEmailOrMobile] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login({ emailOrMobile, password })

      if (result.success) {
        toast.success('Login successful!')
        navigate('/', { replace: true })
      } else {
        toast.error(result.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
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
          <h1 className='text-4xl font-black text-white mb-2'>Welcome Back</h1>
          <p className='text-gray-400'>Sign in to continue to ABCD Platform</p>
        </div>

        {/* Login Form */}
        <div className='bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20'>
          {/* Google Login at Top */}
          <div className='mb-6'>
            <GoogleLogin />
          </div>

          {/* Divider */}
          <div className='relative mb-6'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-white/20'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-4 bg-white/10 text-gray-400'>Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Email or Mobile Field */}
            <div>
              <label className='block text-white font-semibold mb-2 text-sm'>Email or Mobile Number</label>
              <div className='relative'>
                <input
                  type='text'
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  className='w-full px-4 py-3 pl-11 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-sm'
                  placeholder='Email or 10-digit mobile number'
                  required
                />
                <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                </svg>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className='block text-white font-semibold mb-2 text-sm'>Password</label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full px-4 py-3 pl-11 pr-11 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-sm'
                  placeholder='Enter your password'
                  required
                />
                <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                </svg>
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300'
                >
                  {showPassword ? (
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' />
                    </svg>
                  ) : (
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className='flex items-center justify-between'>
              <label className='flex items-center cursor-pointer'>
                <input type='checkbox' className='w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500' />
                <span className='ml-2 text-sm text-gray-300'>Remember me</span>
              </label>
              <Link to='/forgot-password' className='text-sm text-blue-400 hover:text-blue-300 font-semibold'>
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Links */}
          <div className='mt-8 text-center space-y-3'>
            <p className='text-gray-400 text-sm'>
              Don't have an account?{' '}
              <Link to='/signup' className='text-blue-400 font-bold hover:text-blue-300'>
                Sign Up
              </Link>
            </p>
            <p className='text-gray-400 text-sm'>
              Want to sell your products?{' '}
              <a href='https://vendor.abcdvyapar.com' target='_blank' rel='noopener noreferrer' className='text-green-400 font-bold hover:text-green-300'>
                Join as a Vendor
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
