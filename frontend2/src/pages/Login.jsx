import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 flex items-center justify-center p-4'>
      {/* Decorative Background */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute top-20 left-20 w-96 h-96 bg-purple-200 opacity-20 rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 right-20 w-80 h-80 bg-pink-200 opacity-20 rounded-full blur-3xl'></div>
        <div className='absolute top-1/2 left-1/3 w-64 h-64 bg-orange-200 opacity-20 rounded-full blur-3xl'></div>
      </div>

      <div className='relative z-10 w-full max-w-md'>
        {/* Logo Section */}
        <div className='text-center mb-8'>
          <div className='inline-block bg-white shadow-lg rounded-3xl p-4 mb-4 border border-purple-100'>
            <div className='bg-gradient-to-br from-purple-600 to-pink-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-md'>
              <span className='text-4xl font-black text-white'>A</span>
            </div>
          </div>
          <h1 className='text-4xl font-black bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent mb-2'>Welcome Back!</h1>
          <p className='text-gray-600'>Sign in to your ABCD account</p>
        </div>

        {/* Login Card */}
        <div className='bg-white rounded-3xl p-8 shadow-2xl border border-purple-100'>
          <form className='space-y-6'>
            {/* Email Input */}
            <div>
              <label htmlFor='email' className='block text-gray-700 font-semibold mb-2'>
                Email Address
              </label>
              <input
                type='email'
                id='email'
                placeholder='you@example.com'
                className='w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white'
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor='password' className='block text-gray-700 font-semibold mb-2'>
                Password
              </label>
              <input
                type='password'
                id='password'
                placeholder='Enter your password'
                className='w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white'
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className='flex items-center justify-between'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  className='w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-2 focus:ring-purple-500'
                />
                <span className='text-gray-600 text-sm'>Remember me</span>
              </label>
              <a href='#' className='text-purple-600 hover:text-purple-700 text-sm font-semibold'>
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type='submit'
              className='w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-black text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105'
            >
              Sign In
            </button>

            {/* Divider */}
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 bg-white text-gray-500'>Or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className='grid grid-cols-2 gap-4'>
              <button
                type='button'
                className='flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-purple-300 transition-all'
              >
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
                  <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
                  <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
                  <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
                </svg>
                Google
              </button>

              <button
                type='button'
                className='flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-purple-300 transition-all'
              >
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                </svg>
                Facebook
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className='mt-8 text-center space-y-3'>
            <p className='text-gray-600'>
              Don't have an account?{' '}
              <a href='#' className='text-purple-600 hover:text-purple-700 font-bold'>
                Sign up for free
              </a>
            </p>
            <p className='text-gray-600'>
              Want to sell your products?{' '}
              <Link to='/vendor-registration' className='text-green-600 hover:text-green-700 font-bold'>
                Join as a Vendor
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className='text-center text-gray-500 text-sm mt-6'>
          By signing in, you agree to our{' '}
          <a href='#' className='underline hover:text-gray-700'>Terms</a>
          {' '}and{' '}
          <a href='#' className='underline hover:text-gray-700'>Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}

export default Login
