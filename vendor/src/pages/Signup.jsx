import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Store,
  User,
  Mail,
  Phone,
  MapPin,
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
    city: '',
    membershipCategory: '',
    category: '',
    subCategory: '',
    vendorPhoto: null
  })
  const [previewPhoto, setPreviewPhoto] = useState(null)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPG, PNG, or WebP)')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo size should be less than 5MB')
        return
      }

      setFormData({
        ...formData,
        vendorPhoto: file
      })

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewPhoto(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.ownerName || !formData.businessName || !formData.mobile || !formData.city || !formData.category || !formData.subCategory) {
      setError('Please fill in all required fields')
      return
    }

    // Validate photo is uploaded
    if (!formData.vendorPhoto) {
      setError('Please upload your photo')
      return
    }

    // Email validation only if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    setLoading(true)

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append('ownerName', formData.ownerName)
      submitData.append('businessName', formData.businessName)
      submitData.append('mobile', formData.mobile)
      submitData.append('city', formData.city)
      submitData.append('category', formData.category)
      submitData.append('subCategory', formData.subCategory)
      if (formData.membershipCategory) submitData.append('membershipCategory', formData.membershipCategory)
      if (formData.email) submitData.append('email', formData.email)
      if (formData.vendorPhoto) submitData.append('vendorPhoto', formData.vendorPhoto)

      const result = await signup(submitData)

      if (result.success) {
        console.log('✅ Signup result successful')
        // Show success popup modal
        setShowSuccessPopup(true)

        // Clear form
        setFormData({
          ownerName: '',
          businessName: '',
          email: '',
          mobile: '',
          city: '',
          membershipCategory: '',
          category: '',
          subCategory: '',
          vendorPhoto: null
        })
        setPreviewPhoto(null)

        // Redirect to abcdvyapar.com after 8 seconds
        setTimeout(() => {
          setShowSuccessPopup(false)
          window.location.href = 'https://abcdvyapar.com'
        }, 8000)
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

            {/* City */}
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                City <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <MapPin className='absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                <select
                  name='city'
                  value={formData.city}
                  onChange={handleChange}
                  className='w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm sm:text-base appearance-none cursor-pointer'
                >
                  <option value=''>Select your District</option>
                  <option value='Balod'>Balod</option>
                  <option value='Baloda Bazar'>Baloda Bazar</option>
                  <option value='Balrampur'>Balrampur</option>
                  <option value='Bastar'>Bastar</option>
                  <option value='Bemetara'>Bemetara</option>
                  <option value='Bijapur'>Bijapur</option>
                  <option value='Bilaspur'>Bilaspur</option>
                  <option value='Dantewada'>Dantewada</option>
                  <option value='Dhamtari'>Dhamtari</option>
                  <option value='Durg'>Durg</option>
                  <option value='Gariaband'>Gariaband</option>
                  <option value='Gaurela-Pendra-Marwahi'>Gaurela-Pendra-Marwahi</option>
                  <option value='Janjgir-Champa'>Janjgir-Champa</option>
                  <option value='Jashpur'>Jashpur</option>
                  <option value='Kanker'>Kanker</option>
                  <option value='Kawardha'>Kawardha (Kabirdham)</option>
                  <option value='Khairagarh-Chhuikhadan-Gandai'>Khairagarh-Chhuikhadan-Gandai</option>
                  <option value='Kondagaon'>Kondagaon</option>
                  <option value='Korba'>Korba</option>
                  <option value='Korea'>Korea (Koriya)</option>
                  <option value='Mahasamund'>Mahasamund</option>
                  <option value='Manendragarh-Chirmiri-Bharatpur'>Manendragarh-Chirmiri-Bharatpur</option>
                  <option value='Mohla-Manpur-Ambagarh Chouki'>Mohla-Manpur-Ambagarh Chouki</option>
                  <option value='Mungeli'>Mungeli</option>
                  <option value='Narayanpur'>Narayanpur</option>
                  <option value='Raigarh'>Raigarh</option>
                  <option value='Raipur'>Raipur</option>
                  <option value='Rajnandgaon'>Rajnandgaon</option>
                  <option value='Sakti'>Sakti</option>
                  <option value='Sarangarh-Bilaigarh'>Sarangarh-Bilaigarh</option>
                  <option value='Sukma'>Sukma</option>
                  <option value='Surajpur'>Surajpur</option>
                  <option value='Surguja'>Surguja</option>
                </select>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                Email Address <span className='text-gray-500'>(Optional)</span>
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm sm:text-base'
                  placeholder='vendor@example.com (optional)'
                />
              </div>
            </div>

            {/* Business Category */}
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                Business Category <span className='text-red-500'>*</span>
              </label>
              <select
                name='category'
                value={formData.category}
                onChange={handleChange}
                className='w-full px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm sm:text-base appearance-none cursor-pointer'
              >
                <option value=''>Select Business Category</option>
                <option value='Retail'>Retail</option>
                <option value='Wholesale'>Wholesale</option>
                <option value='Manufacturing'>Manufacturing</option>
                <option value='Services'>Services</option>
                <option value='Food & Beverage'>Food & Beverage</option>
                <option value='Healthcare'>Healthcare</option>
                <option value='Technology'>Technology</option>
                <option value='Construction'>Construction</option>
                <option value='Education'>Education</option>
                <option value='Transportation'>Transportation</option>
                <option value='Real Estate'>Real Estate</option>
                <option value='Other'>Other</option>
              </select>
            </div>

            {/* Business Sub-Category */}
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                Business Sub-Category <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                name='subCategory'
                value={formData.subCategory}
                onChange={handleChange}
                className='w-full px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm sm:text-base'
                placeholder='e.g., Grocery Store, Electronics, etc.'
              />
            </div>

            {/* Membership Category Selection */}
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                Membership Category <span className='text-gray-500'>(Optional)</span>
              </label>
              <select
                name='membershipCategory'
                value={formData.membershipCategory}
                onChange={handleChange}
                className='w-full px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm sm:text-base appearance-none cursor-pointer'
              >
                <option value=''>Select Membership Category</option>
                <option value='Bronze'>Bronze - Rs. 1,000 per year</option>
                <option value='Silver'>Silver - Rs. 2,000 per year</option>
                <option value='Gold'>Gold - Rs. 5,000 per year</option>
                <option value='Diamond'>Diamond - Rs. 10,000 per year</option>
                <option value='Platinum'>Platinum - Rs. 25,000 per year</option>
              </select>
            </div>

            {/* Photo Upload */}
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                Upload Your Photo <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <input
                  type='file'
                  accept='image/jpeg,image/jpg,image/png,image/webp'
                  onChange={handlePhotoChange}
                  className='hidden'
                  id='vendor-photo-upload'
                />
                <label
                  htmlFor='vendor-photo-upload'
                  className='w-full px-4 py-2.5 sm:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm sm:text-base cursor-pointer flex items-center justify-center hover:bg-gray-100'
                >
                  <User className='w-5 h-5 mr-2 text-gray-400' />
                  {formData.vendorPhoto ? formData.vendorPhoto.name : 'Choose Photo'}
                </label>
              </div>

              {/* Photo Preview */}
              {previewPhoto && (
                <div className='mt-3 relative flex justify-center'>
                  <div className='relative'>
                    <img
                      src={previewPhoto}
                      alt='Vendor photo preview'
                      className='w-24 h-32 sm:w-32 sm:h-40 object-cover rounded-xl border-2 border-indigo-200'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        setFormData({ ...formData, vendorPhoto: null })
                        setPreviewPhoto(null)
                      }}
                      className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
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
                  Submitting Registration...
                </>
              ) : (
                <>
                  <CheckCircle className='w-5 h-5' />
                  Submit Registration Form
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

          {/* Go to Home Button */}
          <div className='mt-4 sm:mt-6'>
            <a
              href='https://abcdvyapar.com'
              target='_blank'
              rel='noopener noreferrer'
              className='w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-3 sm:py-4 rounded-xl hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base'
            >
              Go to Home
            </a>
          </div>
        </form>
      </div>

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4'>
          <div className='bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center transform transition-all animate-bounce-in shadow-2xl'>
            {/* Success Icon */}
            <div className='mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 sm:mb-6'>
              <svg className='w-10 h-10 sm:w-12 sm:h-12 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
            </div>

            {/* Success Message */}
            <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4'>
              Application Submitted Successfully!
            </h2>
            <p className='text-gray-600 mb-2 text-sm sm:text-base'>
              Your vendor application is now under review.
            </p>
            <p className='text-gray-700 font-semibold text-sm sm:text-base mb-2'>
              Our team will contact you soon after reviewing your profile.
            </p>
            <p className='text-gray-600 text-xs sm:text-sm'>
              You will receive login credentials via email/mobile once approved.
            </p>

            {/* Auto Close Info */}
            <div className='mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500'>
              Redirecting to abcdvyapar.com in 8 seconds...
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Signup
