import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import MultiCategorySelector from '../components/MultiCategorySelector'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Signup = () => {
  const { isAuthenticated, signup } = useContext(AppContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    ownerName: '',
    mobile: '',
    businessName: '',
    gstPan: '',
    businessCategories: [{ category: '', subCategory: '' }],
    address: '',
    state: '',
    district: '',
    city: '',
    websiteUrl: '',
    email: '',
    referredByName: '',
    referralId: '',
    membershipType: '',
    membershipFees: '',
    paymentScreenshot: null,
    vendorPhoto: null
  })
  const [previewPhoto, setPreviewPhoto] = useState(null)
  const [previewPaymentScreenshot, setPreviewPaymentScreenshot] = useState(null)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [availableStates, setAvailableStates] = useState([])
  const [availableDistricts, setAvailableDistricts] = useState([])
  const [availableCities, setAvailableCities] = useState([])
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'
  const UPI_ID = '222716826030217@cnrb'

  useEffect(() => {
    fetchStates()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const fetchStates = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/cities/states`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        setAvailableStates(data.states.sort())
      }
    } catch (error) {
      console.error('Error fetching states:', error)
    }
  }

  const fetchDistrictsByState = async (selectedState) => {
    if (!selectedState) {
      setAvailableDistricts([])
      setAvailableCities([])
      return
    }
    try {
      setLoadingDistricts(true)
      const response = await fetch(`${BACKEND_URL}/api/cities/districts/${encodeURIComponent(selectedState)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        setAvailableDistricts(data.districts)
      }
    } catch (error) {
      console.error('Error fetching districts:', error)
      toast.error('Failed to load districts')
    } finally {
      setLoadingDistricts(false)
    }
  }

  const fetchCitiesByDistrict = async (selectedDistrict) => {
    if (!selectedDistrict) {
      setAvailableCities([])
      return
    }
    try {
      setLoadingCities(true)
      const response = await fetch(`${BACKEND_URL}/api/cities/district/${encodeURIComponent(selectedDistrict)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        setAvailableCities(data.cities)
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
      toast.error('Failed to load cities')
    } finally {
      setLoadingCities(false)
    }
  }

  const handleStateChange = (e) => {
    const selectedState = e.target.value
    setFormData({ ...formData, state: selectedState, district: '', city: '' })
    setError('')
    setAvailableCities([])
    fetchDistrictsByState(selectedState)
  }

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value
    setFormData({ ...formData, district: selectedDistrict, city: '' })
    setError('')
    fetchCitiesByDistrict(selectedDistrict)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'membershipType') {
      const membershipFeeMap = {
        Silver: '1999',
        Gold: '4999',
        Diamond: '9999',
      }
      setFormData({ ...formData, membershipType: value, membershipFees: membershipFeeMap[value] || '' })
      setError('')
      return
    }
    setFormData({ ...formData, [name]: value })
    setError('')
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPG, PNG, or WebP)')
        e.target.value = ''
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Photo size should be less than 10MB')
        e.target.value = ''
        return
      }
      setFormData({ ...formData, vendorPhoto: file })
      const reader = new FileReader()
      reader.onloadend = () => setPreviewPhoto(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handlePaymentScreenshotChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid payment screenshot (JPG, PNG, or WebP)')
        e.target.value = ''
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Payment screenshot size should be less than 10MB')
        e.target.value = ''
        return
      }
      setFormData({ ...formData, paymentScreenshot: file })
      const reader = new FileReader()
      reader.onloadend = () => setPreviewPaymentScreenshot(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.ownerName || !formData.businessName || !formData.mobile || !formData.state || !formData.district || !formData.city || formData.businessCategories.length === 0 || !formData.membershipFees) {
      setError('Please fill in all required fields')
      return
    }

    const hasEmptyCategory = formData.businessCategories.some(item => !item.category?.trim() || !item.subCategory?.trim())
    if (hasEmptyCategory) {
      setError('Please fill in both category and subcategory for all entries')
      return
    }

    if (!formData.vendorPhoto) {
      setError('Please upload your photo')
      return
    }

    if (!formData.paymentScreenshot) {
      setError('Please upload payment screenshot')
      return
    }

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
      const submitData = new FormData()
      submitData.append('ownerName', formData.ownerName)
      submitData.append('businessName', formData.businessName)
      submitData.append('mobile', formData.mobile)
      submitData.append('state', formData.state)
      submitData.append('district', formData.district)
      submitData.append('city', formData.city)
      submitData.append('businessCategories', JSON.stringify(formData.businessCategories))
      submitData.append('membershipFees', formData.membershipFees)
      if (formData.email) submitData.append('email', formData.email)
      if (formData.websiteUrl) submitData.append('websiteUrl', formData.websiteUrl)
      if (formData.gstPan) submitData.append('gstPan', formData.gstPan)
      if (formData.address) submitData.append('address', formData.address)
      if (formData.referredByName) submitData.append('referredByName', formData.referredByName)
      if (formData.referralId) submitData.append('referralId', formData.referralId)
      if (formData.membershipType) submitData.append('membershipType', formData.membershipType)
      if (formData.paymentScreenshot) submitData.append('paymentScreenshot', formData.paymentScreenshot)
      if (formData.vendorPhoto) submitData.append('vendorPhoto', formData.vendorPhoto)

      const result = await signup(submitData)

      if (result.success) {
        setShowSuccessPopup(true)
        setFormData({
          ownerName: '', mobile: '', businessName: '', gstPan: '',
          businessCategories: [{ category: '', subCategory: '' }],
          address: '', state: '', district: '', city: '', websiteUrl: '', email: '',
          referredByName: '', referralId: '', membershipType: '',
          membershipFees: '', paymentScreenshot: null, vendorPhoto: null
        })
        setPreviewPhoto(null)
        setPreviewPaymentScreenshot(null)
        setAvailableDistricts([])
        setAvailableCities([])
        setTimeout(() => {
          setShowSuccessPopup(false)
          window.location.href = 'https://abcdvyapar.com'
        }, 8000)
      } else {
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

  const inputClass = 'w-full px-3 py-2.5 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e] transition-all text-sm'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1'

  return (
    <div className='min-h-screen bg-gray-100 flex items-start sm:items-center justify-center p-0 sm:p-4'>
      <div className='w-full max-w-2xl bg-white shadow-none sm:shadow-xl overflow-hidden'>

        {/* Header with Logo */}
        <div className='bg-white px-3 sm:px-6 pt-3 sm:pt-4 pb-2 text-center'>
          <img src='/abcd logo3.png' alt='ABCD Logo' className='mx-auto w-20 h-20 sm:w-24 sm:h-24 object-contain mb-2' />
          <h1 className='text-[#1a237e] text-sm sm:text-lg font-extrabold tracking-wide leading-tight'>
            AGRAWAL BUSINESS & COMMUNITY DEVELOPMENT (ABCD)
          </h1>
          <p className='text-gray-600 text-[9px] sm:text-[11px] mt-0.5'>
            Geet Siya, 32 Bangla Parisar, Ashoka Ratan, Shankar Nagar, <span className='font-bold'>RAIPUR</span> (CG) 492004
          </p>
          <p className='text-gray-800 text-[10px] sm:text-xs mt-1 font-extrabold tracking-wide'>
            A UNIT OF CHHATTIGARH PRANTIYA AGRAWAL SANGATHAN (CGPAS)
          </p>
          <p className='text-gray-500 text-[8px] sm:text-[10px] mt-0.5'>
            Hanuman Market, Ramsagar Para, <span className='font-bold'>RAIPUR</span> (CG) 492001, Tell - 0771-3562323
          </p>
        </div>

        {/* VENDOR REGISTRATION FORM banner */}
        <div className='bg-[#1a237e] py-2.5 text-center'>
          <h2 className='text-white text-lg sm:text-xl font-bold tracking-wider'>
            VENDOR REGISTRATION FORM
          </h2>
        </div>

        {/* Subtitle */}
        <div className='px-4 sm:px-6 pt-3 pb-1'>
          <p className='text-gray-600 text-xs italic'>To apply for membership please complete all details</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='px-3 sm:px-6 pb-3 sm:pb-4'>
          <div className='space-y-3'>

            {/* Row: Applicants Name + WhatsApp No */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <div>
                <label className={labelClass}>
                  Applicant's Name <span className='text-red-500'>*</span>
                </label>
                <input type='text' name='ownerName' value={formData.ownerName} onChange={handleChange} className={inputClass} placeholder='Enter full name' />
              </div>
              <div>
                <label className={labelClass}>
                  WhatsApp No. <span className='text-red-500'>*</span>
                </label>
                <input type='tel' name='mobile' value={formData.mobile} onChange={handleChange} maxLength={10} className={inputClass} placeholder='9876543210' />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className={labelClass}>
                Upload Your Photo <span className='text-red-500'>*</span>
              </label>
              <div>
                <input type='file' accept='image/jpeg,image/jpg,image/png,image/webp' onChange={handlePhotoChange} className='hidden' id='vendor-photo-upload' />
                <label htmlFor='vendor-photo-upload' className='w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded text-sm cursor-pointer hover:bg-gray-200 transition-colors whitespace-nowrap flex items-center justify-center'>
                  <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                  </svg>
                  {formData.vendorPhoto ? formData.vendorPhoto.name : 'Choose Photo'}
                </label>
              </div>
              {previewPhoto && (
                <div className='mt-2 relative'>
                  <img src={previewPhoto} alt='Preview' className='w-full h-24 sm:h-32 object-cover rounded border border-gray-300' />
                  <button type='button' onClick={() => { setFormData({ ...formData, vendorPhoto: null }); setPreviewPhoto(null) }}
                    className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600'>
                    x
                  </button>
                </div>
              )}
            </div>

            {/* Row: Business Name + GSTN/PAN */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <div>
                <label className={labelClass}>
                  Business Name <span className='text-red-500'>*</span>
                </label>
                <input type='text' name='businessName' value={formData.businessName} onChange={handleChange} className={inputClass} placeholder='Enter business name' />
              </div>
              <div>
                <label className={labelClass}>
                  GSTN Details / PAN No.
                </label>
                <input type='text' name='gstPan' value={formData.gstPan} onChange={handleChange} className={inputClass} placeholder='Enter GSTN or PAN number' />
              </div>
            </div>

            {/* Business Categories */}
            <MultiCategorySelector
              value={formData.businessCategories}
              onChange={(businessCategories) => {
                setFormData({ ...formData, businessCategories })
                setError('')
              }}
              required
            />

            {/* Address */}
            <div>
              <label className={labelClass}>Address</label>
              <textarea name='address' value={formData.address} onChange={handleChange} rows={2} className={inputClass + ' resize-none'} placeholder='Enter full address' />
            </div>

            {/* Row: State + District + City */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
              <div>
                <label className={labelClass}>
                  State <span className='text-red-500'>*</span>
                </label>
                <select name='state' value={formData.state} onChange={handleStateChange} className={inputClass + ' appearance-none cursor-pointer capitalize'}>
                  <option value=''>Select State</option>
                  {availableStates.map((state) => (
                    <option key={state} value={state} className='capitalize'>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  District <span className='text-red-500'>*</span>
                </label>
                <select
                  name='district'
                  value={formData.district}
                  onChange={handleDistrictChange}
                  disabled={!formData.state || loadingDistricts}
                  className={inputClass + ' appearance-none cursor-pointer capitalize disabled:opacity-50'}
                >
                  <option value=''>
                    {loadingDistricts ? 'Loading...' : !formData.state ? 'Select state first' : availableDistricts.length === 0 ? 'No districts available' : 'Select District'}
                  </option>
                  {availableDistricts.map((district) => (
                    <option key={district} value={district} className='capitalize'>{district}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  City <span className='text-red-500'>*</span>
                </label>
                <select name='city' value={formData.city} onChange={handleChange} disabled={!formData.district || loadingCities} className={inputClass + ' appearance-none cursor-pointer capitalize disabled:opacity-50'}>
                  <option value=''>
                    {loadingCities ? 'Loading...' : !formData.district ? 'Select district first' : availableCities.length === 0 ? 'No cities available' : 'Select City'}
                  </option>
                  {availableCities.map((city) => (
                    <option key={city} value={city} className='capitalize'>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row: Website + Email */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <div>
                <label className={labelClass}>Website If Any</label>
                <input type='url' name='websiteUrl' value={formData.websiteUrl} onChange={handleChange} className={inputClass} placeholder='https://www.yourbusiness.com' />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type='email' name='email' value={formData.email} onChange={handleChange} className={inputClass} placeholder='vendor@example.com' />
              </div>
            </div>

            {/* Row: Referred By + Referral ID */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <div>
                <label className={labelClass}>Referred By (Name)</label>
                <input type='text' name='referredByName' value={formData.referredByName} onChange={handleChange} className={inputClass} placeholder='Referrer name' />
              </div>
              <div>
                <label className={labelClass}>Referral ID</label>
                <input type='text' name='referralId' value={formData.referralId} onChange={handleChange} className={inputClass} placeholder='Referral ID' />
              </div>
            </div>

            {/* Membership Type - Radio buttons like PDF */}
            <div className='bg-[#2e7d32] rounded py-2.5 px-4'>
              <div className='flex items-center justify-between flex-wrap gap-2'>
                <span className='text-white font-bold text-sm tracking-wide'>MEMBERSHIP TYPE</span>
                <div className='flex items-center gap-4 sm:gap-6'>
                  {['Silver', 'Gold', 'Diamond'].map((type) => (
                    <label key={type} className='flex items-center gap-1.5 cursor-pointer'>
                      <input
                        type='radio'
                        name='membershipType'
                        value={type}
                        checked={formData.membershipType === type}
                        onChange={handleChange}
                        className='w-4 h-4 accent-white'
                      />
                      <span className={`font-bold text-sm ${
                        type === 'Silver' ? 'text-gray-200' :
                        type === 'Gold' ? 'text-yellow-300' :
                        'text-cyan-200'
                      }`}>{type.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Membership Benefits Info */}
            <div className='border border-gray-200 rounded p-3 bg-gray-50 text-xs text-gray-700 space-y-2.5'>
              <p className='font-bold text-gray-800 underline text-sm'>I hereby agree to all the Terms & Conditions</p>
              <p className='font-semibold text-gray-600'>Annual Membership charges & privileges</p>

              <div>
                <p className='font-bold text-gray-800'>Silver Membership - Rs. 1999/-</p>
                <p className='text-gray-600'>Welcome Kit, Premium Framed Vendor Certificate, Vendor ID Card, 25 Business Card, Every Month Free 02 Advertisements, Gift Vouchers Worth Rs. 2000/-, For Extra Advertisement @Rs. 149 Per Ad</p>
              </div>
              <div>
                <p className='font-bold text-gray-800'>Gold Membership - Rs. 4999/-</p>
                <p className='text-gray-600'>Welcome Kit, Premium Framed Vendor Certificate, Vendor ID Card, Space In Monthly Magazine Voice Of ABCD, 50 Business Card, Premium Office Gifts, Invitation to Our Weekly Video Podcast, Free Sub-domain website, Every Month Free 06 Advertisements, Gift Vouchers Worth Rs. 7500/-, For Extra Advertisement @Rs. 125 Per Ad</p>
              </div>
              <div>
                <p className='font-bold text-gray-800'>Diamond Membership - Rs. 9999/-</p>
                <p className='text-gray-600'>Welcome Kit, Premium Framed Vendor Certificate, Vendor ID Card, Space In Monthly Magazine Voice Of ABCD, 100 Business Card, Premium Office Gifts, Invitation to Our Weekly Video Podcast, Free Sub-domain website, Every Month Free 15 Advertisements, Gift Vouchers Worth Rs. 20000/-, For Extra Advertisement @Rs. 99 Per Ad</p>
              </div>
            </div>

            {/* Membership Fees */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <div>
                <label className={labelClass}>
                  Membership Fees (Rs.) <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm'>₹</span>
                  <input type='number' name='membershipFees' value={formData.membershipFees} onChange={handleChange} min='1' className={inputClass + ' pl-7'} placeholder='Amount' />
                </div>
              </div>
            </div>

            {/* Payment QR + Screenshot Upload */}
            <div className='border border-gray-200 rounded p-3 bg-gray-50'>
              <div className='flex items-center justify-between bg-white border border-gray-200 rounded p-3 mb-3'>
                <div className='pr-3'>
                  <p className='text-[10px] text-gray-600'>Scan to pay</p>
                  <p className='text-xs font-mono text-gray-900 break-all'>{UPI_ID}</p>
                </div>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`upi://pay?pa=${UPI_ID}&pn=ABCD Platform`)}`}
                  alt='UPI QR Code'
                  className='w-20 h-20 sm:w-24 sm:h-24 border border-gray-200 rounded bg-white p-1'
                />
              </div>

              <div className='mb-2'>
                <input
                  type='file'
                  accept='image/jpeg,image/jpg,image/png,image/webp'
                  onChange={handlePaymentScreenshotChange}
                  className='hidden'
                  id='payment-screenshot-upload'
                />
                <label
                  htmlFor='payment-screenshot-upload'
                  className='w-full px-3 py-2.5 bg-white border border-gray-300 rounded text-sm cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center'
                >
                  <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                  </svg>
                  {formData.paymentScreenshot ? formData.paymentScreenshot.name : 'Upload Payment Screenshot'}
                </label>
              </div>
              {previewPaymentScreenshot && (
                <div className='mt-2 relative'>
                  <img src={previewPaymentScreenshot} alt='Payment screenshot preview' className='w-full h-24 sm:h-32 object-cover rounded border border-gray-300' />
                  <button
                    type='button'
                    onClick={() => {
                      setFormData({ ...formData, paymentScreenshot: null })
                      setPreviewPaymentScreenshot(null)
                    }}
                    className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600'
                  >
                    x
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-red-50 border-l-4 border-red-500 p-3'>
                <p className='text-sm font-semibold text-red-800'>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button type='submit' disabled={loading}
              className='w-full bg-[#2e7d32] text-white font-bold py-3 rounded hover:bg-[#1b5e20] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm'>
              {loading ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  Submitting Registration...
                </>
              ) : (
                'Submit Registration Form'
              )}
            </button>
          </div>

        </form>

        {/* Footer */}
        <div className='bg-[#2e7d32] px-4 py-2 text-center'>
          <p className='text-green-100 text-[10px]'>
            Website : www.abcdvyapar.com &nbsp;|&nbsp; Email : info@abcdvyapar.com
          </p>
        </div>

        {/* Login Link */}
        <div className='mt-4 text-center px-3 sm:px-6'>
          <p className='text-gray-600 text-xs'>
            Already have an account?{' '}
            <a href='/login' className='text-[#2e7d32] font-bold hover:underline'>Sign In</a>
          </p>
        </div>

        {/* Go to Home */}
        <div className='mt-3 px-3 sm:px-6 pb-3 sm:pb-4'>
          <a href='https://abcdvyapar.com' target='_blank' rel='noopener noreferrer'
            className='w-full bg-[#c62828] text-white font-bold py-2.5 rounded hover:bg-[#b71c1c] transition-all flex items-center justify-center text-sm'>
            Go to Home
          </a>
        </div>
      </div>

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4'>
          <div className='bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl'>
            <div className='mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 sm:mb-6'>
              <svg className='w-10 h-10 sm:w-12 sm:h-12 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
            </div>
            <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-3'>
              Application Submitted Successfully!
            </h2>
            <p className='text-gray-600 mb-2 text-sm'>
              Your vendor application is now under review.
            </p>
            <p className='text-gray-700 font-semibold text-sm mb-2'>
              Our team will contact you soon after reviewing your profile.
            </p>
            <p className='text-gray-600 text-xs'>
              You will receive login credentials via email/mobile once approved.
            </p>
            <div className='mt-4 text-xs text-gray-500'>
              Redirecting to abcdvyapar.com in 8 seconds...
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Signup

