import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import GoogleLogin from '../component/GoogleLogin'
import { QRCodeSVG } from 'qrcode.react'

const Signup = () => {
  const { BACKEND_URL, checkAuthStatus } = useContext(AppContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    fatherName: '',
    address: '',
    city: '',
    gotra: '',
    passportPhoto: null,
    utrNumber: '',
    paymentImage: null
  })
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [previewPassportPhoto, setPreviewPassportPhoto] = useState(null)

  // UPI ID for payment
  const UPI_ID = '222716826030217@cnrb'

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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPG, PNG, or WebP)')
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB')
        return
      }

      setFormData({
        ...formData,
        paymentImage: file
      })

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePassportPhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPG, PNG, or WebP)')
        return
      }

      // Validate file size (max 5MB for passport photo)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo size should be less than 5MB')
        return
      }

      setFormData({
        ...formData,
        passportPhoto: file
      })

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewPassportPhoto(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUTRChange = (e) => {
    const value = e.target.value
    setFormData({
      ...formData,
      utrNumber: value
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

    // Validate passport photo is uploaded
    if (!formData.passportPhoto) {
      toast.error('Please upload your passport size photo')
      setLoading(false)
      return
    }

    // Validate payment - either screenshot or UTR must be provided
    if (!formData.paymentImage && !formData.utrNumber) {
      toast.error('Please upload payment screenshot OR enter UTR number')
      setLoading(false)
      return
    }

    try {
      // Create FormData for multipart/form-data
      const submitData = new FormData()
      submitData.append('fullName', formData.fullName)
      submitData.append('mobile', formData.mobile)
      submitData.append('fatherName', formData.fatherName)
      submitData.append('address', formData.address)
      submitData.append('gotra', formData.gotra)
      if (formData.email) submitData.append('email', formData.email)
      if (formData.city) submitData.append('city', formData.city)
      if (formData.passportPhoto) submitData.append('passportPhoto', formData.passportPhoto)
      if (formData.utrNumber) submitData.append('utrNumber', formData.utrNumber)
      if (formData.paymentImage) submitData.append('paymentImage', formData.paymentImage)

      const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        body: submitData,
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Registration submitted! Admin will verify your payment and contact you with login credentials.', {
          autoClose: 6000,
        })
        // Clear form
        setFormData({
          fullName: '',
          email: '',
          mobile: '',
          fatherName: '',
          address: '',
          city: '',
          gotra: '',
          passportPhoto: null,
          utrNumber: '',
          paymentImage: null
        })
        setPreviewImage(null)
        setPreviewPassportPhoto(null)

        // Navigate to login after delay
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 3000)
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

      <div className='max-w-xl md:max-w-2xl w-full relative z-10 overflow-y-auto max-h-screen py-4'>
        {/* Header */}
        <div className='text-center mb-3 md:mb-6'>
          <h1 className='text-2xl md:text-4xl font-black text-white mb-1 md:mb-2'>Join as a Member</h1>
          <p className='text-gray-400 text-xs md:text-base'>Complete payment to register on ABCD Platform</p>
        </div>

        {/* Signup Form */}
        <div className='bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-5 md:p-8 border border-white/20'>
          <form onSubmit={handleSubmit} className='space-y-3 md:space-y-5'>
            {/* Full Name Field */}
            <div>
              <label className='block text-white font-semibold mb-1 md:mb-2 text-xs md:text-sm'>
                Full Name <span className='text-red-400'>*</span>
              </label>
              <div className='relative'>
                <input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                  className='w-full px-3 md:px-4 py-2 md:py-3 pl-9 md:pl-11 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm text-xs md:text-sm'
                  placeholder='Enter your full name'
                  required
                />
                <svg className='absolute left-2.5 md:left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                </svg>
              </div>
            </div>

            {/* Mobile Number Field */}
            <div>
              <label className='block text-white font-semibold mb-1 md:mb-2 text-xs md:text-sm'>
                Mobile Number <span className='text-red-400'>*</span>
              </label>
              <div className='relative'>
                <input
                  type='tel'
                  name='mobile'
                  value={formData.mobile}
                  onChange={handleChange}
                  className='w-full px-3 md:px-4 py-2 md:py-3 pl-9 md:pl-11 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm text-xs md:text-sm'
                  placeholder='10-digit mobile number'
                  maxLength='10'
                  required
                />
                <svg className='absolute left-2.5 md:left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                </svg>
              </div>
            </div>

            {/* Father's Name Field */}
            <div>
              <label className='block text-white font-semibold mb-1 md:mb-2 text-xs md:text-sm'>
                Father's Name <span className='text-red-400'>*</span>
              </label>
              <div className='relative'>
                <input
                  type='text'
                  name='fatherName'
                  value={formData.fatherName}
                  onChange={handleChange}
                  className='w-full px-3 md:px-4 py-2 md:py-3 pl-9 md:pl-11 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm text-xs md:text-sm'
                  placeholder="Enter your father's name"
                  required
                />
                <svg className='absolute left-2.5 md:left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                </svg>
              </div>
            </div>

            {/* Address Field */}
            <div>
              <label className='block text-white font-semibold mb-1 md:mb-2 text-xs md:text-sm'>
                Address <span className='text-red-400'>*</span>
              </label>
              <div className='relative'>
                <textarea
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  className='w-full px-3 md:px-4 py-2 md:py-3 pl-9 md:pl-11 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm text-xs md:text-sm resize-none'
                  placeholder='Enter your full address'
                  rows='3'
                  required
                />
                <svg className='absolute left-2.5 md:left-3.5 top-3 w-4 h-4 md:w-5 md:h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                </svg>
              </div>
            </div>

            {/* City Dropdown */}
            <div>
              <label className='block text-white font-semibold mb-1 md:mb-2 text-xs md:text-sm'>
                City <span className='text-red-400'>*</span>
              </label>
              <div className='relative'>
                <select
                  name='city'
                  value={formData.city}
                  onChange={handleChange}
                  className='w-full px-3 md:px-4 py-2 md:py-3 pl-9 md:pl-11 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm text-xs md:text-sm appearance-none cursor-pointer'
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
                <svg className='absolute left-2.5 md:left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
                <svg className='absolute right-2.5 md:right-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 pointer-events-none' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </div>
            </div>

            {/* Gotra Dropdown */}
            <div>
              <label className='block text-white font-semibold mb-1 md:mb-2 text-xs md:text-sm'>
                Gotra <span className='text-red-400'>*</span>
              </label>
              <div className='relative'>
                <select
                  name='gotra'
                  value={formData.gotra}
                  onChange={handleChange}
                  className='w-full px-3 md:px-4 py-2 md:py-3 pl-9 md:pl-11 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm text-xs md:text-sm appearance-none cursor-pointer'
                  required
                >
                  <option value='' className='bg-gray-800'>Select your Gotra</option>
                  <option value='Bansal' className='bg-gray-800'>Bansal</option>
                  <option value='Kuchhal' className='bg-gray-800'>Kuchhal</option>
                  <option value='Kansal' className='bg-gray-800'>Kansal</option>
                  <option value='Bindal' className='bg-gray-800'>Bindal</option>
                  <option value='Singhal' className='bg-gray-800'>Singhal</option>
                  <option value='Jindal' className='bg-gray-800'>Jindal</option>
                  <option value='Mittal' className='bg-gray-800'>Mittal</option>
                  <option value='Garg' className='bg-gray-800'>Garg</option>
                  <option value='Nangal' className='bg-gray-800'>Nangal</option>
                  <option value='Mangal' className='bg-gray-800'>Mangal</option>
                  <option value='Tayal' className='bg-gray-800'>Tayal</option>
                  <option value='Tingal' className='bg-gray-800'>Tingal</option>
                  <option value='Madhukul' className='bg-gray-800'>Madhukul</option>
                  <option value='Goyal' className='bg-gray-800'>Goyal</option>
                  <option value='Airan' className='bg-gray-800'>Airan</option>
                  <option value='Goyan' className='bg-gray-800'>Goyan</option>
                  <option value='Dharan' className='bg-gray-800'>Dharan</option>
                  <option value='Bhandal' className='bg-gray-800'>Bhandal</option>
                </select>
                <svg className='absolute left-2.5 md:left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                </svg>
                <svg className='absolute right-2.5 md:right-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 pointer-events-none' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className='block text-white font-semibold mb-1 md:mb-2 text-xs md:text-sm'>Email Address (Optional)</label>
              <div className='relative'>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full px-3 md:px-4 py-2 md:py-3 pl-9 md:pl-11 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm text-xs md:text-sm'
                  placeholder='you@example.com (optional)'
                />
                <svg className='absolute left-2.5 md:left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                </svg>
              </div>
            </div>

            {/* Passport Size Photo Upload */}
            <div>
              <label className='block text-white font-semibold mb-1 md:mb-2 text-xs md:text-sm'>
                Upload Passport Size Photo <span className='text-red-400'>*</span>
              </label>
              <div className='relative'>
                <input
                  type='file'
                  accept='image/jpeg,image/jpg,image/png,image/webp'
                  onChange={handlePassportPhotoChange}
                  className='hidden'
                  id='passport-photo-upload'
                  required
                />
                <label
                  htmlFor='passport-photo-upload'
                  className='w-full px-3 md:px-4 py-2 md:py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm text-xs md:text-sm cursor-pointer flex items-center justify-center hover:bg-white/30'
                >
                  <svg className='w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                  </svg>
                  {formData.passportPhoto ? formData.passportPhoto.name : 'Choose Passport Photo'}
                </label>
              </div>

              {/* Photo Preview */}
              {previewPassportPhoto && (
                <div className='mt-2 relative flex justify-center'>
                  <div className='relative'>
                    <img
                      src={previewPassportPhoto}
                      alt='Passport photo preview'
                      className='w-24 h-32 md:w-32 md:h-40 object-cover rounded-lg border-2 border-white/30'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        setFormData({ ...formData, passportPhoto: null })
                        setPreviewPassportPhoto(null)
                      }}
                      className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
                    >
                      <svg className='w-3 h-3 md:w-4 md:h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Section */}
            <div className='bg-white/5 rounded-lg p-3 md:p-5 border border-white/20'>
              <h3 className='text-white font-bold text-xs md:text-sm mb-2 md:mb-3 flex items-center'>
                <svg className='w-4 h-4 md:w-5 md:h-5 mr-1.5 text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' />
                </svg>
                Please Pay Rs 500 for 1 Year Membership
              </h3>

              {/* QR Code Display */}
              <div className='flex items-center justify-between bg-white/10 rounded-lg p-2.5 md:p-4 mb-3 md:mb-4'>
                <div className='flex-1'>
                  <p className='text-gray-300 text-[10px] md:text-xs mb-0.5 md:mb-1'>Scan to Pay via UPI</p>
                  <p className='text-white font-mono text-xs md:text-sm'>{UPI_ID}</p>
                </div>
                <div className='bg-white p-1.5 md:p-2 rounded-md'>
                  <QRCodeSVG value={`upi://pay?pa=${UPI_ID}&pn=ABCD Platform`} size={70} className='md:hidden' />
                  <QRCodeSVG value={`upi://pay?pa=${UPI_ID}&pn=ABCD Platform`} size={100} className='hidden md:block' />
                </div>
              </div>

              {/* Payment Screenshot Upload - Single Line */}
              <div className='mb-2 md:mb-3'>
                <div className='relative'>
                  <input
                    type='file'
                    accept='image/jpeg,image/jpg,image/png,image/webp'
                    onChange={handleFileChange}
                    className='hidden'
                    id='payment-upload'
                  />
                  <label
                    htmlFor='payment-upload'
                    className='w-full px-3 md:px-4 py-2 md:py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm text-xs md:text-sm cursor-pointer flex items-center justify-center hover:bg-white/30'
                  >
                    <svg className='w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                    </svg>
                    {formData.paymentImage ? formData.paymentImage.name : 'Upload Payment Screenshot'}
                  </label>
                </div>

                {/* Image Preview */}
                {previewImage && (
                  <div className='mt-2 relative'>
                    <img
                      src={previewImage}
                      alt='Payment preview'
                      className='w-full h-24 md:h-32 object-cover rounded-lg border border-white/30'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        setFormData({ ...formData, paymentImage: null })
                        setPreviewImage(null)
                      }}
                      className='absolute top-1 md:top-2 right-1 md:right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
                    >
                      <svg className='w-3 h-3 md:w-4 md:h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* OR Divider */}
              <div className='flex items-center my-2 md:my-3'>
                <div className='flex-1 border-t border-white/20'></div>
                <span className='px-3 text-gray-400 text-xs md:text-sm font-semibold'>OR</span>
                <div className='flex-1 border-t border-white/20'></div>
              </div>

              {/* UTR Number Input */}
              <div>
                <input
                  type='text'
                  name='utrNumber'
                  value={formData.utrNumber}
                  onChange={handleUTRChange}
                  className='w-full px-3 md:px-4 py-2 md:py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition backdrop-blur-sm text-xs md:text-sm'
                  placeholder='Enter 12-digit UTR number'
                  maxLength='12'
                />
              </div>

              {/* Note */}
              <div className='mt-2 md:mt-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-2 md:p-2.5'>
                <p className='text-yellow-300 text-[10px] md:text-xs'>
                  <strong>Note:</strong> Upload payment screenshot OR enter UTR number (any one of them is required)
                </p>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className='flex items-start'>
              <input
                type='checkbox'
                id='terms'
                className='w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 text-purple-600 bg-white/20 border-white/30 rounded focus:ring-purple-500'
                required
              />
              <label htmlFor='terms' className='ml-2 text-[11px] md:text-xs text-gray-300'>
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
              className='w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 md:py-3 rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-xs md:text-sm'
            >
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>

          {/* Login Link */}
          <div className='mt-4 md:mt-6 text-center'>
            <p className='text-gray-300 text-xs md:text-sm'>
              Already have an account?{' '}
              <Link to='/login' className='text-purple-400 font-bold hover:text-purple-300 transition-colors'>
                Sign In
              </Link>
            </p>
          </div>

          {/* Note */}
          <div className='mt-3 md:mt-5 bg-blue-500/10 border border-blue-400/30 rounded-lg p-2.5 md:p-3'>
            <p className='text-blue-300 text-[10px] md:text-xs'>
              <strong>Note:</strong> After registration, admin will verify your payment and provide login credentials via mobile/email.
            </p>
          </div>

          {/* Go to Home Button */}
          <div className='mt-4 md:mt-5 text-center'>
            <a
              href='https://abcdvyapar.com'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-2.5 md:py-3 rounded-lg font-bold hover:from-green-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-xs md:text-sm'
            >
              Go to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
