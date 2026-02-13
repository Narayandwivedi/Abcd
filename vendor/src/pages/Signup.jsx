import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import MultiCategorySelector from '../components/MultiCategorySelector'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Signup = () => {
  const createEmptyOwner = () => ({ name: '', photo: null, previewUrl: '' })
  const { isAuthenticated, signup } = useContext(AppContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showTermsPopup, setShowTermsPopup] = useState(false)

  const [formData, setFormData] = useState({
    owners: [createEmptyOwner()],
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
    referralId: '',
    membershipType: '',
    membershipFees: '',
    utrNumber: '',
    paymentScreenshot: null,
  })
  const [previewPaymentScreenshot, setPreviewPaymentScreenshot] = useState(null)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [availableStates, setAvailableStates] = useState([])
  const [availableDistricts, setAvailableDistricts] = useState([])
  const [availableCities, setAvailableCities] = useState([])
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'
  const UPI_ID = '222716826030217@cnrb'
  const qrAmount = Number(formData.membershipFees) > 0 ? Number(formData.membershipFees) : ''
  const upiQrValue = `upi://pay?pa=${UPI_ID}&pn=ABCD Platform${qrAmount ? `&am=${qrAmount}` : ''}&cu=INR`

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
        Silver: '2000',
        Gold: '5000',
        Diamond: '10000',
        Platinum: '25000',
      }
      setFormData({ ...formData, membershipType: value, membershipFees: membershipFeeMap[value] || '' })
      setError('')
      return
    }
    if (name === 'websiteUrl') {
      // Let users type only domain (example: abc.com). Backend will add https://.
      const normalizedValue = value.replace(/^https?:\/\//i, '')
      setFormData({ ...formData, [name]: normalizedValue })
      setError('')
      return
    }
    setFormData({ ...formData, [name]: value })
    setError('')
  }

  const addOwner = () => {
    setFormData((prev) => {
      if (prev.owners.length >= 10) {
        toast.error('Maximum 10 owners allowed')
        return prev
      }
      return { ...prev, owners: [...prev.owners, createEmptyOwner()] }
    })
  }

  const removeOwner = (index) => {
    setFormData((prev) => {
      if (prev.owners.length <= 1) return prev
      const removedOwner = prev.owners[index]
      if (removedOwner?.previewUrl) {
        URL.revokeObjectURL(removedOwner.previewUrl)
      }
      return { ...prev, owners: prev.owners.filter((_, i) => i !== index) }
    })
  }

  const handleOwnerNameChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      owners: prev.owners.map((owner, i) => (i === index ? { ...owner, name: value } : owner))
    }))
    setError('')
  }

  const handleOwnerPhotoChange = (index, e) => {
    const file = e.target.files[0]
    if (!file) return

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

    const previewUrl = URL.createObjectURL(file)
    setFormData((prev) => ({
      ...prev,
      owners: prev.owners.map((owner, i) => {
        if (i !== index) return owner
        if (owner.previewUrl) URL.revokeObjectURL(owner.previewUrl)
        return { ...owner, photo: file, previewUrl }
      })
    }))
    setError('')
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

    if (!formData.businessName || !formData.mobile || !formData.state || !formData.district || !formData.city || formData.businessCategories.length === 0 || !formData.membershipFees) {
      setError('Please fill in all required fields')
      return
    }

    const hasInvalidOwners = formData.owners.some((owner) => !owner.name?.trim() || !owner.photo)
    if (hasInvalidOwners) {
      setError('Please add owner name and photo for all owners')
      return
    }

    const hasEmptyCategory = formData.businessCategories.some(item => !item.category?.trim() || !item.subCategory?.trim())
    if (hasEmptyCategory) {
      setError('Please fill in both category and subcategory for all entries')
      return
    }

    if (!formData.paymentScreenshot) {
      setError('Please upload payment screenshot')
      return
    }

    if (!/^\d{12}$/.test((formData.utrNumber || '').trim())) {
      setError('Please enter a valid 12-digit UTR number')
      return
    }

    if (!acceptedTerms) {
      setError('Please accept Terms & Conditions to continue')
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
      const ownersPayload = formData.owners.map((owner) => ({ name: owner.name.trim() }))
      submitData.append('ownerName', ownersPayload[0]?.name || '')
      submitData.append('owners', JSON.stringify(ownersPayload))
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
      if (formData.referralId) submitData.append('referralId', formData.referralId)
      if (formData.membershipType) submitData.append('membershipType', formData.membershipType)
      if (formData.utrNumber?.trim()) submitData.append('utrNumber', formData.utrNumber.trim())
      if (formData.paymentScreenshot) submitData.append('paymentScreenshot', formData.paymentScreenshot)
      formData.owners.forEach((owner) => {
        if (owner.photo) submitData.append('ownerPhotos', owner.photo)
      })

      const result = await signup(submitData)

      if (result.success) {
        setShowSuccessPopup(true)
        setFormData({
          owners: [createEmptyOwner()], mobile: '', businessName: '', gstPan: '',
          businessCategories: [{ category: '', subCategory: '' }],
          address: '', state: '', district: '', city: '', websiteUrl: '', email: '',
          referralId: '', membershipType: '',
          membershipFees: '', utrNumber: '', paymentScreenshot: null
        })
        setPreviewPaymentScreenshot(null)
        setAcceptedTerms(false)
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

  const inputClass = 'w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:border-[#1a237e] focus:ring-1 focus:ring-[#1a237e] transition-all text-xs sm:text-sm'
  const labelClass = 'block text-xs sm:text-sm font-semibold text-gray-700 mb-1'

  return (
    <div className='min-h-screen bg-gray-100 flex items-start sm:items-center justify-center p-0 sm:p-4'>
      <div className='w-full max-w-2xl bg-white shadow-none sm:shadow-xl overflow-hidden'>

        {/* Header with Logo */}
        <div className='bg-white px-3 sm:px-6 pt-0 sm:pt-4 pb-2 text-center'>
          <img src='/abcd logo3.png' alt='ABCD Logo' className='mx-auto w-20 h-20 sm:w-24 sm:h-24 object-contain mb-2' />
          <h1 className='text-[#1a237e] text-sm sm:text-lg font-extrabold tracking-wide leading-tight'>
            AGRAWAL BUSINESS & COMMUNITY DEVELOPMENT (ABCD)
          </h1>
          <p className='text-gray-600 text-[7px] sm:text-[11px] mt-1 sm:mt-0.5 whitespace-nowrap leading-none sm:leading-normal'>
            Geet Siya, 32 Bangla Parisar, Ashoka Ratan, Shankar Nagar, <span className='font-bold'>RAIPUR</span> (CG) 492004
          </p>
          <p className='text-gray-800 text-[7px] sm:text-xs mt-1.5 sm:mt-1 font-extrabold tracking-tight sm:tracking-wide whitespace-nowrap leading-none sm:leading-normal'>
            A UNIT OF CHHATTIGARH PRANTIYA AGRAWAL SANGATHAN (CGPAS)
          </p>
          <p className='text-gray-500 text-[6px] sm:text-[10px] mt-1.5 sm:mt-0.5 whitespace-nowrap leading-none sm:leading-normal'>
            Hanuman Market, Ramsagar Para, <span className='font-bold'>RAIPUR</span> (CG) 492001, Tell - 0771-3562323
          </p>
        </div>

        {/* VENDOR REGISTRATION FORM banner */}
        <div className='bg-[#1a237e] py-2 sm:py-2.5 text-center'>
          <h2 className='text-white text-lg sm:text-xl font-bold tracking-wider'>
            VENDOR REGISTRATION FORM
          </h2>
        </div>

        {/* Subtitle */}
        <div className='px-4 sm:px-6 pt-2.5 sm:pt-3 pb-1'>
          <p className='text-gray-600 text-[11px] sm:text-xs italic'>To apply for membership please complete all details</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='px-3 sm:px-6 pb-3 sm:pb-4'>
          <div className='space-y-2.5 sm:space-y-3'>

            {/* Row: Business Name + WhatsApp No */}
            <div className='grid grid-cols-2 gap-2 sm:gap-3'>
              <div>
                <label className={labelClass}>
                  Business Name <span className='text-red-500'>*</span>
                </label>
                <input type='text' name='businessName' value={formData.businessName} onChange={handleChange} className={inputClass} placeholder='Enter business name' />
              </div>
              <div>
                <label className={labelClass}>
                  WhatsApp No. <span className='text-red-500'>*</span>
                </label>
                <input type='tel' name='mobile' value={formData.mobile} onChange={handleChange} maxLength={10} className={inputClass} placeholder='9876543210' />
              </div>
            </div>

            {/* Owners */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <label className={labelClass}>
                  Owners <span className='text-red-500'>*</span>
                </label>
                <button
                  type='button'
                  onClick={addOwner}
                  className='px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-[#1a237e] border border-[#1a237e]/30 rounded hover:bg-[#1a237e]/5 transition'
                >
                  + Add Owner
                </button>
              </div>

              {formData.owners.map((owner, index) => (
                <div key={`owner-${index}`} className='border border-gray-200 rounded p-2 space-y-2 bg-gray-50'>
                  <div className='grid grid-cols-2 gap-2 sm:gap-3'>
                    <div>
                      <label className={labelClass}>
                        Owner Name {index + 1} <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='text'
                        value={owner.name}
                        onChange={(e) => handleOwnerNameChange(index, e.target.value)}
                        className={inputClass}
                        placeholder='Enter owner name'
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Owner Photo {index + 1} <span className='text-red-500'>*</span>
                      </label>
                      <div>
                        <input
                          type='file'
                          accept='image/jpeg,image/jpg,image/png,image/webp'
                          onChange={(e) => handleOwnerPhotoChange(index, e)}
                          className='hidden'
                          id={`owner-photo-upload-${index}`}
                        />
                        <label
                          htmlFor={`owner-photo-upload-${index}`}
                          className='w-full px-2.5 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded text-[10px] sm:text-sm cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap flex items-center justify-center'
                        >
                          <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                          </svg>
                          {owner.photo ? 'Photo Selected' : 'Choose Photo'}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-start justify-between gap-2'>
                    {owner.previewUrl ? (
                      <img src={owner.previewUrl} alt={`Owner ${index + 1} preview`} className='w-24 h-24 object-cover rounded border border-gray-300' />
                    ) : <div />}

                    {formData.owners.length > 1 && (
                      <button
                        type='button'
                        onClick={() => removeOwner(index)}
                        className='px-2 py-1 text-[11px] sm:text-xs font-semibold text-red-700 border border-red-300 rounded hover:bg-red-50 transition'
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* GSTN/PAN */}
            <div>
              <label className={labelClass}>
                GSTN Details / PAN No.
              </label>
              <input type='text' name='gstPan' value={formData.gstPan} onChange={handleChange} className={inputClass} placeholder='Enter GSTN or PAN number' />
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
                <div className='flex items-center rounded border border-gray-300 bg-white'>
                  <span className='px-2 text-[10px] sm:text-xs text-gray-500 select-none'>https://</span>
                  <input
                    type='text'
                    name='websiteUrl'
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    className='w-full px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-r text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1a237e] transition-all text-xs sm:text-sm'
                    placeholder='yourbusiness.com'
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type='email' name='email' value={formData.email} onChange={handleChange} className={inputClass} placeholder='vendor@example.com' />
              </div>
            </div>

            {/* Referral ID */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <div>
                <label className={labelClass}>Referral ID</label>
                <input type='text' name='referralId' value={formData.referralId} onChange={handleChange} className={inputClass} placeholder='Referral ID' />
              </div>
            </div>

            {/* Membership Type */}
            <div className='bg-[#2e7d32] rounded py-2 sm:py-2.5 px-3 sm:px-4'>
              <div className='space-y-2'>
                <span className='text-white font-bold text-xs sm:text-sm tracking-wide block'>MEMBERSHIP TYPE</span>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3'>
                {['Silver', 'Gold', 'Diamond', 'Platinum'].map((type) => (
                  <label key={type} className='flex items-center gap-1.5 cursor-pointer'>
                    <input
                      type='checkbox'
                      name='membershipType'
                      checked={formData.membershipType === type}
                      onChange={() => {
                        const selectedValue = formData.membershipType === type ? '' : type
                        handleChange({ target: { name: 'membershipType', value: selectedValue } })
                      }}
                      className='w-3.5 h-3.5 sm:w-4 sm:h-4 accent-white'
                    />
                    <span className={`font-bold text-[10px] sm:text-sm ${
                      type === 'Silver' ? 'text-gray-200' :
                      type === 'Gold' ? 'text-yellow-300' :
                      type === 'Diamond' ? 'text-cyan-200' :
                      'text-pink-200'
                    }`}>{type.toUpperCase()}</span>
                  </label>
                ))}
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className='border border-gray-200 rounded p-2.5 sm:p-3 bg-gray-50'>
              <div className='flex items-start gap-2'>
                <label className='flex items-start gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={acceptedTerms}
                    onChange={(e) => {
                      setAcceptedTerms(e.target.checked)
                      if (e.target.checked) setError('')
                    }}
                    className='mt-0.5 sm:mt-0 w-4 h-4 accent-[#2e7d32]'
                  />
                  <span className='text-[11px] sm:text-sm font-semibold text-gray-700'>
                    I agree to{' '}
                    <button
                      type='button'
                      onClick={(e) => {
                        e.preventDefault()
                        setShowTermsPopup(true)
                      }}
                      className='inline text-[#1a237e] underline underline-offset-2 hover:text-[#111a5c]'
                    >
                      Terms & Conditions
                    </button>
                  </span>
                </label>
              </div>
            </div>

            {/* Membership Fees */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <div>
                <label className={labelClass}>
                  Membership Fees (Rs.) <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-xs sm:text-sm'>₹</span>
                  <input type='number' name='membershipFees' value={formData.membershipFees} onChange={handleChange} min='1' className={inputClass + ' pl-7'} placeholder='Amount' />
                </div>
              </div>
            </div>

            {/* Payment Proof */}
            <div className='border border-gray-300 rounded p-2.5 sm:p-3 bg-gray-100'>
              <div className='flex items-center justify-between bg-white border border-gray-200 rounded p-2.5 sm:p-3 mb-2.5 sm:mb-3'>
                <div className='pr-3'>
                  <p className='text-[9px] sm:text-[10px] text-gray-600'>Scan to pay</p>
                  <p className='text-[11px] sm:text-xs font-mono text-gray-900 break-all'>{UPI_ID}</p>
                </div>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(upiQrValue)}`}
                  alt='UPI QR Code'
                  className='w-16 h-16 sm:w-24 sm:h-24 border border-gray-200 rounded bg-white p-1'
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
                  className='w-full px-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded text-xs sm:text-sm cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center'
                >
                  <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                  </svg>
                  {formData.paymentScreenshot ? formData.paymentScreenshot.name : 'Upload Payment Screenshot'}
                </label>
              </div>

              <div className='text-center text-[10px] sm:text-xs text-gray-500 mb-2'>OR</div>

              <div className='mb-2'>
                <input
                  type='text'
                  name='utrNumber'
                  value={formData.utrNumber}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 12)
                    handleChange({ target: { name: 'utrNumber', value: digitsOnly } })
                  }}
                  className={inputClass}
                  placeholder='Enter 12-digit UTR'
                  maxLength={12}
                />
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
                <p className='text-xs sm:text-sm font-semibold text-red-800'>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button type='submit' disabled={loading}
              className='w-full bg-[#2e7d32] text-white font-bold py-2.5 sm:py-3 rounded hover:bg-[#1b5e20] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm'>
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
            className='w-full bg-[#c62828] text-white font-bold py-2 sm:py-2.5 rounded hover:bg-[#b71c1c] transition-all flex items-center justify-center text-xs sm:text-sm'>
            Go to Home
          </a>
        </div>
      </div>

      {/* Terms Popup Modal */}
      {showTermsPopup && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-3 sm:px-4'>
          <div className='bg-white rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl'>
            <h3 className='text-base sm:text-lg font-bold text-gray-800 mb-3'>Annual Membership Charges & Privileges</h3>

            <div className='space-y-3 text-xs sm:text-sm text-gray-700'>
              <div>
                <p className='font-bold text-gray-900'>Silver Membership - Rs. 2000/-</p>
                <p>Welcome Kit, Premium Framed Vendor Certificate, Vendor ID Card, 25 Business Card, Every Month Free 02 Advertisements, Gift Vouchers Worth Rs. 2000/-, For Extra Advertisement @Rs. 149 Per Ad</p>
              </div>
              <div>
                <p className='font-bold text-gray-900'>Gold Membership - Rs. 5000/-</p>
                <p>Welcome Kit, Premium Framed Vendor Certificate, Vendor ID Card, Space In Monthly Magazine Voice Of ABCD, 50 Business Card, Premium Office Gifts, Invitation to Our Weekly Video Podcast, Free Sub-domain website, Every Month Free 06 Advertisements, Gift Vouchers Worth Rs. 7500/-, For Extra Advertisement @Rs. 125 Per Ad</p>
              </div>
              <div>
                <p className='font-bold text-gray-900'>Diamond Membership - Rs. 10000/-</p>
                <p>Welcome Kit, Premium Framed Vendor Certificate, Vendor ID Card, Space In Monthly Magazine Voice Of ABCD, 100 Business Card, Premium Office Gifts, Invitation to Our Weekly Video Podcast, Free Sub-domain website, Every Month Free 15 Advertisements, Gift Vouchers Worth Rs. 20000/-, For Extra Advertisement @Rs. 99 Per Ad</p>
              </div>
              <div>
                <p className='font-bold text-gray-900'>Platinum Membership - Rs. 25000/-</p>
                <p>Premium membership plan with enhanced benefits as per ABCD membership policy.</p>
              </div>
            </div>

            <div className='mt-4 flex justify-end'>
              <button
                type='button'
                onClick={() => setShowTermsPopup(false)}
                className='px-4 py-2 bg-[#1a237e] text-white text-xs sm:text-sm font-semibold rounded hover:bg-[#111a5c] transition'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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

