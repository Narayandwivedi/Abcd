import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Store,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building2,
  MapPin,
  FileText,
  CreditCard,
  Briefcase,
  CheckCircle,
  ArrowRight,
  Loader2,
  ArrowLeft,
  Upload,
  X
} from 'lucide-react'

const Signup = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    // Business Information
    businessName: '',
    ownerName: '',
    businessCategory: '',
    gstNumber: '',

    // Contact Information
    email: '',
    mobile: '',

    // Business Address
    street: '',
    city: '',
    state: '',
    pincode: '',

    // Account Security
    password: '',
    confirmPassword: '',

    // Additional Details
    description: '',
    acceptTerms: false
  })

  // File uploads
  const [aadharCard, setAadharCard] = useState(null)
  const [gstCertificate, setGstCertificate] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    setError('')
  }

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should not exceed 5MB')
        return
      }
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPG, PNG, and PDF files are allowed')
        return
      }
      setFile(file)
      setError('')
    }
  }

  const removeFile = (setFile) => {
    setFile(null)
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.businessName || !formData.ownerName || !formData.businessCategory || !formData.gstNumber) {
          setError('Please fill in all business information fields')
          return false
        }
        if (formData.gstNumber.length !== 15) {
          setError('GST number must be 15 characters')
          return false
        }
        break
      case 2:
        if (!aadharCard) {
          setError('Please upload Aadhar card')
          return false
        }
        if (!gstCertificate) {
          setError('Please upload GST certificate')
          return false
        }
        break
      case 3:
        if (!formData.email || !formData.mobile) {
          setError('Please fill in all contact information fields')
          return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError('Please enter a valid email address')
          return false
        }
        if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
          setError('Please enter a valid 10-digit mobile number')
          return false
        }
        break
      case 4:
        if (!formData.street || !formData.city || !formData.state || !formData.pincode) {
          setError('Please fill in all address fields')
          return false
        }
        if (!/^\d{6}$/.test(formData.pincode)) {
          setError('Please enter a valid 6-digit pincode')
          return false
        }
        break
      case 5:
        if (!formData.password || !formData.confirmPassword) {
          setError('Please fill in all password fields')
          return false
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters')
          return false
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          return false
        }
        if (!formData.acceptTerms) {
          setError('You must accept the terms and conditions')
          return false
        }
        break
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
      setError('')
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateStep(5)) return

    setLoading(true)
    setError('')

    try {
      // Create FormData to handle file uploads
      const formDataToSend = new FormData()

      // Add text fields
      formDataToSend.append('businessName', formData.businessName)
      formDataToSend.append('ownerName', formData.ownerName)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('mobile', formData.mobile)
      formDataToSend.append('password', formData.password)
      formDataToSend.append('gstNumber', formData.gstNumber)
      formDataToSend.append('businessCategory', formData.businessCategory)

      // Add address as JSON string
      formDataToSend.append('businessAddress', JSON.stringify({
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      }))

      // Add description if provided
      if (formData.description) {
        formDataToSend.append('description', formData.description)
      }

      // Add file uploads
      if (aadharCard) {
        formDataToSend.append('aadharCard', aadharCard)
      }
      if (gstCertificate) {
        formDataToSend.append('gstCertificate', gstCertificate)
      }

      const response = await fetch('http://localhost:5000/api/vendor-auth/signup', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      })

      const data = await response.json()

      if (data.success) {
        alert('Registration successful! Please login to continue.')
        navigate('/login')
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStepIndicator = () => {
    const steps = [
      { num: 1, label: 'Business Info' },
      { num: 2, label: 'Documents' },
      { num: 3, label: 'Contact' },
      { num: 4, label: 'Address' },
      { num: 5, label: 'Security' }
    ]

    return (
      <div className='flex items-center justify-between'>
        {steps.map((step, index) => (
          <React.Fragment key={step.num}>
            <div className='flex flex-col items-center'>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 ${
                currentStep >= step.num
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {currentStep > step.num ? <CheckCircle className='w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6' /> : step.num}
              </div>
              <span className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium hidden sm:block ${
                currentStep >= step.num ? 'text-white' : 'text-purple-200'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 rounded transition-all duration-300 ${
                currentStep > step.num ? 'bg-white' : 'bg-white/30'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-0 lg:p-4 relative overflow-hidden'>
      {/* Animated Background */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000'></div>
      </div>

      {/* Main Container */}
      <div className='relative w-full max-w-4xl bg-white lg:rounded-3xl lg:shadow-2xl overflow-hidden min-h-screen lg:min-h-0'>
        {/* Header */}
        <div className='bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 text-white'>
          <div className='flex items-center justify-between mb-4 lg:mb-4'>
            <div className='flex items-center gap-2 lg:gap-3'>
              <div className='w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/30'>
                <Store className='w-6 h-6 lg:w-7 lg:h-7' />
              </div>
              <div>
                <h1 className='text-lg sm:text-xl lg:text-2xl font-bold'>Vendor Registration</h1>
                <p className='text-purple-100 text-xs lg:text-sm hidden sm:block'>Join ABCD Marketplace</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              className='flex items-center gap-1 lg:gap-2 text-white hover:bg-white/10 px-2 lg:px-4 py-2 rounded-lg transition-all text-sm lg:text-base'
            >
              <ArrowLeft className='w-3 h-3 lg:w-4 lg:h-4' />
              <span className='hidden sm:inline'>Back to Login</span>
              <span className='sm:hidden'>Back</span>
            </button>
          </div>
          {renderStepIndicator()}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-5 sm:p-6 lg:p-12'>
          {/* Step 1: Business Information */}
          {currentStep === 1 && (
            <div className='space-y-5 lg:space-y-6 animate-fadeIn'>
              <div className='flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6'>
                <Building2 className='w-5 h-5 lg:w-6 lg:h-6 text-indigo-600' />
                <h2 className='text-xl lg:text-2xl font-bold text-gray-900'>Business Information</h2>
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    Business Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    name='businessName'
                    value={formData.businessName}
                    onChange={handleChange}
                    className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                    placeholder='Enter your business name'
                  />
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    Owner Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    name='ownerName'
                    value={formData.ownerName}
                    onChange={handleChange}
                    className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                    placeholder='Enter owner full name'
                  />
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    Business Category <span className='text-red-500'>*</span>
                  </label>
                  <select
                    name='businessCategory'
                    value={formData.businessCategory}
                    onChange={handleChange}
                    className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                  >
                    <option value=''>Select category</option>
                    <option value='retail'>Retail</option>
                    <option value='wholesale'>Wholesale</option>
                    <option value='manufacturer'>Manufacturer</option>
                    <option value='service'>Service Provider</option>
                    <option value='other'>Other</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    GST Number <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    name='gstNumber'
                    value={formData.gstNumber}
                    onChange={handleChange}
                    maxLength={15}
                    className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all uppercase'
                    placeholder='22AAAAA0000A1Z5'
                  />
                  <p className='text-xs text-gray-500 mt-1'>Must be 15 characters</p>
                </div>
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>
                  Business Description
                </label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  rows='4'
                  className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                  placeholder='Tell us about your business...'
                ></textarea>
              </div>
            </div>
          )}

          {/* Step 2: Upload Documents */}
          {currentStep === 2 && (
            <div className='space-y-5 lg:space-y-6 animate-fadeIn'>
              <div className='flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6'>
                <FileText className='w-5 h-5 lg:w-6 lg:h-6 text-indigo-600' />
                <h2 className='text-xl lg:text-2xl font-bold text-gray-900'>Upload Documents</h2>
              </div>

              <div className='bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6 mb-8'>
                <p className='text-sm text-indigo-900'>
                  <strong>Important:</strong> Please upload clear and readable copies of the following documents for verification. All documents must be valid and match the information provided.
                </p>
              </div>

              <div className='grid md:grid-cols-2 gap-8'>
                {/* Aadhar Card Upload */}
                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-3'>
                    Aadhar Card (Owner) <span className='text-red-500'>*</span>
                  </label>
                  {!aadharCard ? (
                    <label className='w-full flex flex-col items-center px-6 py-10 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all'>
                      <Upload className='w-12 h-12 text-gray-400 mb-3' />
                      <span className='text-sm font-semibold text-gray-700 text-center mb-1'>
                        Click to upload Aadhar card
                      </span>
                      <span className='text-xs text-gray-500'>
                        JPG, PNG or PDF (Max 5MB)
                      </span>
                      <input
                        type='file'
                        className='hidden'
                        accept='image/jpeg,image/jpg,image/png,application/pdf'
                        onChange={(e) => handleFileChange(e, setAadharCard)}
                      />
                    </label>
                  ) : (
                    <div className='flex items-center justify-between p-4 bg-green-50 border-2 border-green-400 rounded-xl'>
                      <div className='flex items-center gap-3'>
                        <div className='p-2 bg-green-100 rounded-lg'>
                          <FileText className='w-6 h-6 text-green-600' />
                        </div>
                        <div>
                          <p className='text-sm font-bold text-gray-900'>{aadharCard.name}</p>
                          <p className='text-xs text-gray-500'>{(aadharCard.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      <button
                        type='button'
                        onClick={() => removeFile(setAadharCard)}
                        className='p-2 hover:bg-red-100 rounded-lg transition-colors'
                      >
                        <X className='w-5 h-5 text-red-500' />
                      </button>
                    </div>
                  )}
                  <p className='text-xs text-gray-500 mt-2'>
                    Upload a clear photo or scan of the owner's Aadhar card
                  </p>
                </div>

                {/* GST Certificate Upload */}
                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-3'>
                    GST Certificate <span className='text-red-500'>*</span>
                  </label>
                  {!gstCertificate ? (
                    <label className='w-full flex flex-col items-center px-6 py-10 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all'>
                      <Upload className='w-12 h-12 text-gray-400 mb-3' />
                      <span className='text-sm font-semibold text-gray-700 text-center mb-1'>
                        Click to upload GST certificate
                      </span>
                      <span className='text-xs text-gray-500'>
                        JPG, PNG or PDF (Max 5MB)
                      </span>
                      <input
                        type='file'
                        className='hidden'
                        accept='image/jpeg,image/jpg,image/png,application/pdf'
                        onChange={(e) => handleFileChange(e, setGstCertificate)}
                      />
                    </label>
                  ) : (
                    <div className='flex items-center justify-between p-4 bg-green-50 border-2 border-green-400 rounded-xl'>
                      <div className='flex items-center gap-3'>
                        <div className='p-2 bg-green-100 rounded-lg'>
                          <FileText className='w-6 h-6 text-green-600' />
                        </div>
                        <div>
                          <p className='text-sm font-bold text-gray-900'>{gstCertificate.name}</p>
                          <p className='text-xs text-gray-500'>{(gstCertificate.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      <button
                        type='button'
                        onClick={() => removeFile(setGstCertificate)}
                        className='p-2 hover:bg-red-100 rounded-lg transition-colors'
                      >
                        <X className='w-5 h-5 text-red-500' />
                      </button>
                    </div>
                  )}
                  <p className='text-xs text-gray-500 mt-2'>
                    Upload your business GST registration certificate
                  </p>
                </div>
              </div>

              <div className='mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg'>
                <p className='text-sm text-yellow-800'>
                  <strong>Verification Process:</strong> Your documents will be reviewed by our team within 24-48 hours. You'll receive a confirmation email once verified.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <div className='space-y-5 lg:space-y-6 animate-fadeIn'>
              <div className='flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6'>
                <Phone className='w-5 h-5 lg:w-6 lg:h-6 text-indigo-600' />
                <h2 className='text-xl lg:text-2xl font-bold text-gray-900'>Contact Information</h2>
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    Email Address <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      className='w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                      placeholder='vendor@example.com'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    Mobile Number <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <Phone className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                    <input
                      type='tel'
                      name='mobile'
                      value={formData.mobile}
                      onChange={handleChange}
                      maxLength={10}
                      className='w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                      placeholder='9876543210'
                    />
                  </div>
                  <p className='text-xs text-gray-500 mt-1'>10-digit Indian mobile number</p>
                </div>
              </div>

              <div className='bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg'>
                <p className='text-sm text-blue-800'>
                  <strong>Note:</strong> Your email and mobile number will be used for account verification and important updates.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Business Address */}
          {currentStep === 4 && (
            <div className='space-y-5 lg:space-y-6 animate-fadeIn'>
              <div className='flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6'>
                <MapPin className='w-5 h-5 lg:w-6 lg:h-6 text-indigo-600' />
                <h2 className='text-xl lg:text-2xl font-bold text-gray-900'>Business Address</h2>
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>
                  Street Address <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='street'
                  value={formData.street}
                  onChange={handleChange}
                  className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                  placeholder='Enter street address'
                />
              </div>

              <div className='grid md:grid-cols-3 gap-6'>
                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    City <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    name='city'
                    value={formData.city}
                    onChange={handleChange}
                    className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                    placeholder='City'
                  />
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    State <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    name='state'
                    value={formData.state}
                    onChange={handleChange}
                    className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                    placeholder='State'
                  />
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    Pincode <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    name='pincode'
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                    placeholder='123456'
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Account Security */}
          {currentStep === 5 && (
            <div className='space-y-5 lg:space-y-6 animate-fadeIn'>
              <div className='flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6'>
                <Lock className='w-5 h-5 lg:w-6 lg:h-6 text-indigo-600' />
                <h2 className='text-xl lg:text-2xl font-bold text-gray-900'>Account Security</h2>
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    Password <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name='password'
                      value={formData.password}
                      onChange={handleChange}
                      className='w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                      placeholder='Create password'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                    >
                      {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                    </button>
                  </div>
                  <p className='text-xs text-gray-500 mt-1'>Minimum 6 characters</p>
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    Confirm Password <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name='confirmPassword'
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className='w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                      placeholder='Confirm password'
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                    >
                      {showConfirmPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                    </button>
                  </div>
                </div>
              </div>

              <div className='bg-green-50 border-2 border-green-200 rounded-xl p-6'>
                <label className='flex items-start gap-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    name='acceptTerms'
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className='mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer'
                  />
                  <span className='text-sm text-gray-700 leading-relaxed'>
                    I agree to the{' '}
                    <a href='#' className='text-indigo-600 font-bold hover:underline'>
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href='#' className='text-indigo-600 font-bold hover:underline'>
                      Privacy Policy
                    </a>
                    . I understand my application will be reviewed before approval.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className='bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mt-6'>
              <div className='flex items-center gap-3'>
                <div className='w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0'>
                  <span className='text-red-600 text-sm font-bold'>!</span>
                </div>
                <p className='text-sm font-semibold text-red-800'>{error}</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className='flex items-center justify-between mt-6 lg:mt-10 pt-4 lg:pt-6 border-t border-gray-200'>
            {currentStep > 1 && (
              <button
                type='button'
                onClick={prevStep}
                className='flex items-center gap-1 lg:gap-2 px-4 lg:px-6 py-2 lg:py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition-all text-sm lg:text-base'
              >
                <ArrowLeft className='w-4 h-4 lg:w-5 lg:h-5' />
                Previous
              </button>
            )}

            <div className='flex-1'></div>

            {currentStep < 5 ? (
              <button
                type='button'
                onClick={nextStep}
                className='flex items-center gap-1 lg:gap-2 px-6 lg:px-8 py-2 lg:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl transition-all hover:scale-105 text-sm lg:text-base'
              >
                Next Step
                <ArrowRight className='w-4 h-4 lg:w-5 lg:h-5' />
              </button>
            ) : (
              <button
                type='submit'
                disabled={loading}
                className='flex items-center gap-1 lg:gap-2 px-6 lg:px-8 py-2 lg:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm lg:text-base'
              >
                {loading ? (
                  <>
                    <Loader2 className='w-4 h-4 lg:w-5 lg:h-5 animate-spin' />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className='w-4 h-4 lg:w-5 lg:h-5' />
                    Complete Registration
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
