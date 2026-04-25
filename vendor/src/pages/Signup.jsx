import React, { useState } from 'react'
import { Loader2, CheckCircle, User, Phone, Building2, MapPin, Gift, CreditCard } from 'lucide-react'
import { toast } from 'react-toastify'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

const Signup = () => {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    ownerName: '',
    whatsappNumber: '',
    businessName: '',
    city: '',
    referralCode: '',
    paymentInformation: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required'
    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required'
    } else if (!/^[6-9]\d{9}$/.test(formData.whatsappNumber.trim())) {
      newErrors.whatsappNumber = 'Enter a valid 10-digit WhatsApp number'
    }
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/vendor-application/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerName: formData.ownerName.trim(),
          whatsappNumber: formData.whatsappNumber.trim(),
          businessName: formData.businessName.trim(),
          city: formData.city.trim(),
          referralCode: formData.referralCode.trim(),
          paymentInformation: formData.paymentInformation.trim(),
        }),
      })
      const data = await response.json()
      if (data.success) {
        setSubmitted(true)
        toast.success('Application submitted successfully!')
      } else {
        toast.error(data.message || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'ownerName', label: 'Business Owner Name', type: 'text', icon: User, placeholder: 'Enter your full name', required: true },
    { name: 'whatsappNumber', label: 'WhatsApp Number', type: 'tel', icon: Phone, placeholder: '9876543210', required: true, maxLength: 10 },
    { name: 'businessName', label: 'Business Name', type: 'text', icon: Building2, placeholder: 'Enter your business name', required: true },
    { name: 'city', label: 'City', type: 'text', icon: MapPin, placeholder: 'Enter your city', required: true },
    { name: 'referralCode', label: 'Referral Code', type: 'text', icon: Gift, placeholder: 'Enter referral code (if any)', required: false },
    { name: 'paymentInformation', label: 'Payment Information', type: 'text', icon: CreditCard, placeholder: 'UTR No. or transaction details', required: false },
  ]
  const firstRowFields = fields.slice(0, 2)
  const remainingFields = fields.slice(2)

  if (submitted) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4'>
        <div className='bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-5'>
            <CheckCircle className='w-11 h-11 text-green-600' />
          </div>
          <h2 className='text-2xl font-black text-gray-900 mb-3'>Application Submitted!</h2>
          <p className='text-gray-600 mb-6 leading-relaxed'>
            Thank you for applying to ABCD Vyapar! Our team will review your application and contact you on your WhatsApp number <span className='font-bold text-gray-800'>{formData.whatsappNumber}</span> within 24-48 hours.
          </p>
          <a
            href='https://abcdvyapar.com'
            className='inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95'
          >
            Go to ABCD Vyapar
          </a>
          <p className='text-sm text-gray-500 mt-4'>
            Already have an account?{' '}
            <a href='/login' className='font-bold text-indigo-600 hover:underline'>Sign In</a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-start sm:items-center justify-center px-0.5 py-2 sm:p-4'>
      <div className='w-full sm:max-w-lg py-1 sm:py-0'>
        <div className='bg-white sm:rounded-3xl sm:shadow-xl px-2 py-4 sm:p-6'>
          <div className='mb-4 text-center'>
            <h1 className='text-xl sm:text-2xl font-black text-gray-900'>Vendor Application Form</h1>
          </div>

          <form onSubmit={handleSubmit} className='space-y-3'>
            <div className='grid grid-cols-2 gap-1.5 sm:gap-2'>
              {firstRowFields.map(({ name, label, type, icon: Icon, placeholder, required, maxLength }) => (
                <div key={name}>
                  <label className='block text-xs sm:text-sm font-bold text-gray-700 mb-1.5'>
                    {label} {required && <span className='text-red-500'>*</span>}
                  </label>
                  <div className='relative'>
                    <Icon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      maxLength={maxLength}
                      className={`w-full pl-10 pr-3 py-2.5 bg-gray-50 border-2 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all font-medium ${
                        errors[name] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                      }`}
                    />
                  </div>
                  {errors[name] && (
                    <p className='text-xs text-red-500 mt-1 font-medium'>{errors[name]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Business Name + City in same row */}
            <div className='grid grid-cols-2 gap-1.5 sm:gap-2'>
              {fields.slice(2, 4).map(({ name, label, type, icon: Icon, placeholder, required, maxLength }) => (
                <div key={name}>
                  <label className='block text-xs sm:text-sm font-bold text-gray-700 mb-1.5'>
                    {label} {required && <span className='text-red-500'>*</span>}
                  </label>
                  <div className='relative'>
                    <Icon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      maxLength={maxLength}
                      className={`w-full pl-10 pr-3 py-2.5 bg-gray-50 border-2 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all font-medium ${
                        errors[name] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                      }`}
                    />
                  </div>
                  {errors[name] && (
                    <p className='text-xs text-red-500 mt-1 font-medium'>{errors[name]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Referral Code + Payment Information — each full width */}
            {fields.slice(4).map(({ name, label, type, icon: Icon, placeholder, required, maxLength }) => (
              <div key={name}>
                <label className='block text-xs sm:text-sm font-bold text-gray-700 mb-1.5'>
                  {label} {required && <span className='text-red-500'>*</span>}
                </label>
                <div className='relative'>
                  <Icon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className={`w-full pl-10 pr-3 py-2.5 bg-gray-50 border-2 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all font-medium ${
                      errors[name] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                    }`}
                  />
                </div>
                {errors[name] && (
                  <p className='text-xs text-red-500 mt-1 font-medium'>{errors[name]}</p>
                )}
              </div>
            ))}

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm mt-2'
            >
              {loading ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </form>

          <div className='mt-4 text-center'>
            <p className='text-xs text-gray-500'>
              Already have an account?{' '}
              <a href='/login' className='font-bold text-indigo-600 hover:underline'>Sign In</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
