import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import GoogleLogin from '../component/GoogleLogin'

const Signup = () => {
  const { BACKEND_URL, checkAuthStatus } = useContext(AppContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    city: '',
    gotra: ''
  })
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      navigate('/')
    }
  }, [navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate mobile number (10 digits starting with 6-9)
    const mobileRegex = /^[6-9]\d{9}$/
    if (!mobileRegex.test(formData.mobile)) {
      toast.error('Please enter a valid 10-digit Indian mobile number')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          mobile: parseInt(formData.mobile),
          city: formData.city,
          gotra: formData.gotra,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Account created successfully! We will review your details and contact you soon.', {
          autoClose: 5000,
        })
        // Update auth state
        if (checkAuthStatus) {
          await checkAuthStatus()
        } else {
          // Fallback: Store user data and dispatch event
          localStorage.setItem('userData', JSON.stringify(data.userData))
          window.dispatchEvent(new Event('authChange'))
        }
        // Navigate to home
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 2000)
      } else {
        toast.error(data.message || 'Signup failed')
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 relative overflow-hidden fixed inset-0'>
      {/* Decorative Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute top-20 right-20 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 left-20 w-80 h-80 bg-blue-500 opacity-10 rounded-full blur-3xl'></div>
      </div>

      <div className='max-w-md w-full relative z-10 overflow-y-auto max-h-screen py-4'>
        {/* Header */}
        <div className='text-center mb-4'>
          <h1 className='text-3xl font-black text-white mb-2'>Create Account</h1>
          <p className='text-gray-400 text-sm'>Join ABCD Platform today</p>
        </div>

        {/* Signup Form */}
        <div className='bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Full Name Field */}
            <div>
              <label className='block text-white font-semibold mb-1.5 text-sm'>
                Full Name <span className='text-red-400'>*</span>
              </label>
              <div className='relative'>
                <input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                  className='w-full px-4 py-2.5 pl-10 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm text-sm'
                  placeholder='Enter your full name'
                  required
                />
                <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                </svg>
              </div>
            </div>

            {/* Mobile Number Field */}
            <div>
              <label className='block text-white font-semibold mb-1.5 text-sm'>
                Mobile Number <span className='text-red-400'>*</span>
              </label>
              <div className='relative'>
                <input
                  type='tel'
                  name='mobile'
                  value={formData.mobile}
                  onChange={handleChange}
                  className='w-full px-4 py-2.5 pl-10 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm text-sm'
                  placeholder='10-digit mobile number'
                  maxLength='10'
                  required
                />
                <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                </svg>
              </div>
            </div>

            {/* City Dropdown */}
            <div>
              <label className='block text-white font-semibold mb-1.5 text-sm'>
                City <span className='text-red-400'>*</span>
              </label>
              <div className='relative'>
                <select
                  name='city'
                  value={formData.city}
                  onChange={handleChange}
                  className='w-full px-4 py-2.5 pl-10 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm text-sm appearance-none cursor-pointer'
                  required
                >
                  <option value='' className='bg-gray-800'>Select your District</option>
                  <option value='Balod' className='bg-gray-800'>Balod</option>
                  <option value='Baloda Bazar' className='bg-gray-800'>Baloda Bazar</option>
                  <option value='Balrampur' className='bg-gray-800'>Balrampur</option>
                  <option value='Bastar' className='bg-gray-800'>Bastar</option>
                  <option value='Bemetara' className='bg-gray-800'>Bemetara</option>
                  <option value='Bijapur' className='bg-gray-800'>Bijapur</option>
                  <option value='Bilaspur' className='bg-gray-800'>Bilaspur</option>
                  <option value='Dantewada' className='bg-gray-800'>Dantewada</option>
                  <option value='Dhamtari' className='bg-gray-800'>Dhamtari</option>
                  <option value='Durg' className='bg-gray-800'>Durg</option>
                  <option value='Gariaband' className='bg-gray-800'>Gariaband</option>
                  <option value='Gaurela-Pendra-Marwahi' className='bg-gray-800'>Gaurela-Pendra-Marwahi</option>
                  <option value='Janjgir-Champa' className='bg-gray-800'>Janjgir-Champa</option>
                  <option value='Jashpur' className='bg-gray-800'>Jashpur</option>
                  <option value='Kanker' className='bg-gray-800'>Kanker</option>
                  <option value='Kawardha' className='bg-gray-800'>Kawardha (Kabirdham)</option>
                  <option value='Khairagarh-Chhuikhadan-Gandai' className='bg-gray-800'>Khairagarh-Chhuikhadan-Gandai</option>
                  <option value='Kondagaon' className='bg-gray-800'>Kondagaon</option>
                  <option value='Korba' className='bg-gray-800'>Korba</option>
                  <option value='Korea' className='bg-gray-800'>Korea (Koriya)</option>
                  <option value='Mahasamund' className='bg-gray-800'>Mahasamund</option>
                  <option value='Manendragarh-Chirmiri-Bharatpur' className='bg-gray-800'>Manendragarh-Chirmiri-Bharatpur</option>
                  <option value='Mohla-Manpur-Ambagarh Chouki' className='bg-gray-800'>Mohla-Manpur-Ambagarh Chouki</option>
                  <option value='Mungeli' className='bg-gray-800'>Mungeli</option>
                  <option value='Narayanpur' className='bg-gray-800'>Narayanpur</option>
                  <option value='Raigarh' className='bg-gray-800'>Raigarh</option>
                  <option value='Raipur' className='bg-gray-800'>Raipur</option>
                  <option value='Rajnandgaon' className='bg-gray-800'>Rajnandgaon</option>
                  <option value='Sakti' className='bg-gray-800'>Sakti</option>
                  <option value='Sarangarh-Bilaigarh' className='bg-gray-800'>Sarangarh-Bilaigarh</option>
                  <option value='Sukma' className='bg-gray-800'>Sukma</option>
                  <option value='Surajpur' className='bg-gray-800'>Surajpur</option>
                  <option value='Surguja' className='bg-gray-800'>Surguja</option>
                </select>
                <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
                <svg className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </div>
            </div>

            {/* Gotra Dropdown */}
            <div>
              <label className='block text-white font-semibold mb-1.5 text-sm'>
                Gotra <span className='text-red-400'>*</span>
              </label>
              <div className='relative'>
                <select
                  name='gotra'
                  value={formData.gotra}
                  onChange={handleChange}
                  className='w-full px-4 py-2.5 pl-10 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm text-sm appearance-none cursor-pointer'
                  required
                >
                  <option value='' className='bg-gray-800'>Select your Gotra</option>
                  <option value='Garg' className='bg-gray-800'>Garg</option>
                  <option value='Mangal' className='bg-gray-800'>Mangal</option>
                  <option value='Goel' className='bg-gray-800'>Goel</option>
                  <option value='Kansal' className='bg-gray-800'>Kansal</option>
                  <option value='Singhal' className='bg-gray-800'>Singhal</option>
                  <option value='Mittal' className='bg-gray-800'>Mittal</option>
                  <option value='Bansal' className='bg-gray-800'>Bansal</option>
                  <option value='Jindal' className='bg-gray-800'>Jindal</option>
                  <option value='Tayal' className='bg-gray-800'>Tayal</option>
                  <option value='Goyal' className='bg-gray-800'>Goyal</option>
                  <option value='Bindal' className='bg-gray-800'>Bindal</option>
                  <option value='Narangal' className='bg-gray-800'>Narangal</option>
                  <option value='Bhandal' className='bg-gray-800'>Bhandal</option>
                  <option value='Airan' className='bg-gray-800'>Airan</option>
                  <option value='Dharan' className='bg-gray-800'>Dharan</option>
                  <option value='Madhukul' className='bg-gray-800'>Madhukul</option>
                  <option value='Kuchhal' className='bg-gray-800'>Kuchhal</option>
                  <option value='Nangal' className='bg-gray-800'>Nangal</option>
                </select>
                <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                </svg>
                <svg className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className='block text-white font-semibold mb-1.5 text-sm'>Email Address (Optional)</label>
              <div className='relative'>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full px-4 py-2.5 pl-10 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm text-sm'
                  placeholder='you@example.com (optional)'
                />
                <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                </svg>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className='flex items-start'>
              <input
                type='checkbox'
                id='terms'
                className='w-4 h-4 mt-1 text-purple-600 bg-white/20 border-white/30 rounded focus:ring-purple-500'
                required
              />
              <label htmlFor='terms' className='ml-2 text-sm text-gray-300'>
                I agree to the{' '}
                <a href='#' className='text-purple-400 hover:text-purple-300 font-semibold'>
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href='#' className='text-purple-400 hover:text-purple-300 font-semibold'>
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm'
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className='mt-6 text-center'>
            <p className='text-gray-300 text-sm'>
              Already have an account?{' '}
              <Link to='/login' className='text-purple-400 font-bold hover:text-purple-300 transition-colors'>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
