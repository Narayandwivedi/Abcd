import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAdminAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Logo Section */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl mb-4'>
            <span className='text-4xl font-black text-white'>A</span>
          </div>
          <h1 className='text-3xl font-bold text-white mb-2'>ABCD Admin Panel</h1>
          <p className='text-blue-200'>Secure Admin Access</p>
        </div>

        {/* Login Card */}
        <div className='bg-white rounded-2xl shadow-2xl p-8'>
          <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Admin Login</h2>

          {error && (
            <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-600 text-sm flex items-center gap-2'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                </svg>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Email Field */}
            <div>
              <label htmlFor='email' className='block text-sm font-semibold text-gray-700 mb-2'>
                Email Address
              </label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none'
                placeholder='admin@abcd.com'
                autoComplete='email'
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor='password' className='block text-sm font-semibold text-gray-700 mb-2'>
                Password
              </label>
              <div className='relative'>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none'
                  placeholder='Enter your password'
                  autoComplete='current-password'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
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

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {loading ? (
                <>
                  <svg className='animate-spin h-5 w-5 text-white' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                'Login to Admin Panel'
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className='mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
            <p className='text-xs text-yellow-800 flex items-start gap-2'>
              <svg className='w-4 h-4 mt-0.5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
              </svg>
              <span>
                <strong>Security Notice:</strong> You have 3 login attempts per 24 hours. After 3 failed attempts, your IP will be blocked for 24 hours.
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className='text-center text-blue-200 text-sm mt-6'>
          ABCD Vyapar - Admin Access Only
        </p>
      </div>
    </div>
  )
}

export default Login
