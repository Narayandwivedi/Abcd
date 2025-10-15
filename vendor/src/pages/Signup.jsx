import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Store,
  User,
  Mail,
  Phone,
  Loader2,
  ArrowLeft,
  CheckCircle
} from 'lucide-react'
import GoogleLogin from '../components/GoogleLogin'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Signup = () => {
  const { isAuthenticated, signup } = useContext(AppContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    ownerName: '',
    businessName: '',
    email: '',
    mobile: '',
    acceptTerms: false
  })

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.ownerName || !formData.businessName || !formData.email || !formData.mobile) {
      setError('Please fill in all fields')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    if (!formData.acceptTerms) {
      setError('You must accept the terms and conditions')
      return
    }

    setLoading(true)

    try {
      const result = await signup({
        ownerName: formData.ownerName,
        businessName: formData.businessName,
        email: formData.email,
        mobile: parseInt(formData.mobile),
      })

      if (result.success) {
        console.log('✅ Signup result successful')
        toast.success('Registration successful! We will review your details and contact you soon.', {
          autoClose: 5000,
        })
        // Navigation will happen automatically via useEffect when isAuthenticated changes
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 2000)
      } else {
        console.log('❌ Signup result failed:', result.error)
        setError(result.error)
        toast.error(result.error || 'Registration failed')
      }
    } catch (err) {
      console.error('Registration error:', err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-0 sm:p-4 relative overflow-hidden'>
      {/* Animated Background */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000'></div>
      </div>

      {/* Main Container */}
      <div className='relative w-full max-w-lg bg-white sm:rounded-3xl shadow-2xl overflow-hidden min-h-screen sm:min-h-0'>
        {/* Header */}
        <div className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-4 sm:px-6 py-4 sm:py-6 text-white'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-2 sm:gap-3'>
              <div className='w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/30'>
                <Store className='w-5 h-5 sm:w-7 sm:h-7' />
              </div>
              <div>
                <h1 className='text-xl sm:text-2xl font-bold'>Vendor Registration</h1>
                <p className='text-purple-100 text-xs sm:text-sm'>Join ABCD Marketplace</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              className='flex items-center gap-1 sm:gap-2 text-white hover:bg-white/10 px-2 sm:px-4 py-2 rounded-lg transition-all text-sm'
            >
              <ArrowLeft className='w-4 h-4' />
              <span className='hidden sm:inline'>Back</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-4 sm:p-6'>
          {/* Form Fields */}
          <div className='space-y-3 sm:space-y-4'>
            {/* Owner Name */}
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                Owner Name <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <User className='absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='text'
                  name='ownerName'
                  value={formData.ownerName}
                  onChange={handleChange}
                  className='w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm sm:text-base'
                  placeholder='Enter owner name'
                />
              </div>
            </div>

            {/* Business Name */}
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                Business Name <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <Store className='absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='text'
                  name='businessName'
                  value={formData.businessName}
                  onChange={handleChange}
                  className='w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm sm:text-base'
                  placeholder='Enter your business name'
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                Email Address <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm sm:text-base'
                  placeholder='vendor@example.com'
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                Mobile Number <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <Phone className='absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='tel'
                  name='mobile'
                  value={formData.mobile}
                  onChange={handleChange}
                  maxLength={10}
                  className='w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm sm:text-base'
                  placeholder='9876543210'
                />
              </div>
            </div>

            {/* Terms */}
            <div className='bg-green-50 border-2 border-green-200 rounded-xl p-3'>
              <label className='flex items-start gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  name='acceptTerms'
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className='mt-0.5 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer'
                />
                <span className='text-xs text-gray-700 leading-relaxed'>
                  I agree to the{' '}
                  <a href='#' className='text-indigo-600 font-bold hover:underline'>
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href='#' className='text-indigo-600 font-bold hover:underline'>
                    Privacy Policy
                  </a>
                  . I understand I'll need to complete my business profile after registration.
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-red-50 border-l-4 border-red-500 rounded-lg p-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0'>
                    <span className='text-red-600 text-sm font-bold'>!</span>
                  </div>
                  <p className='text-sm font-semibold text-red-800'>{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 sm:py-4 rounded-xl hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm sm:text-base'
            >
              {loading ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  Creating Account...
                </>
              ) : (
                <>
                  <CheckCircle className='w-5 h-5' />
                  Create Vendor Account
                </>
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className='mt-4 sm:mt-6 text-center'>
            <p className='text-gray-600 text-xs sm:text-sm'>
              Already have an account?{' '}
              <a href='/login' className='text-indigo-600 font-bold hover:text-indigo-700 transition-colors'>
                Sign In
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
