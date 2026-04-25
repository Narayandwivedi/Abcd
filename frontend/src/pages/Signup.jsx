import React, { useState } from 'react'
import { Loader2, CheckCircle, User, Phone, MapPin, Gift, Upload, Hash, FileText } from 'lucide-react'
import { toast } from 'react-toastify'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'
const UPI_ID = '222716826030217@cnrb'
const MEMBERSHIP_AMOUNT = 499 // Default user membership amount

const Signup = () => {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    whatsappNumber: '',
    city: '',
    referralCode: '',
    utrNumber: '',
  })
  const [paymentScreenshot, setPaymentScreenshot] = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState(null)
  const [referralInfo, setReferralInfo] = useState(null)
  const [isVerifyingReferral, setIsVerifyingReferral] = useState(false)
  const [errors, setErrors] = useState({})

  const upiQrValue = `upi://pay?pa=${UPI_ID}&pn=ABCD Platform&am=${MEMBERSHIP_AMOUNT}&cu=INR`

  const verifyReferral = async (code) => {
    if (code.length !== 8) {
      setReferralInfo(null)
      return
    }
    setIsVerifyingReferral(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/user-application/verify-referral/${code}`)
      const data = await response.json()
      if (data.success) {
        setReferralInfo(data.data)
      } else {
        setReferralInfo(null)
      }
    } catch (error) {
      console.error('Referral verification error:', error)
      setReferralInfo(null)
    } finally {
      setIsVerifyingReferral(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'referralCode') {
      const upperValue = value.toUpperCase().slice(0, 8)
      setFormData(prev => ({ ...prev, [name]: upperValue }))
      if (upperValue.length === 8) {
        verifyReferral(upperValue)
      } else {
        setReferralInfo(null)
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPG, PNG, WebP)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB')
      return
    }
    setPaymentScreenshot(file)
    setScreenshotPreview(URL.createObjectURL(file))
    if (errors.payment) setErrors(prev => ({ ...prev, payment: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required'
    } else if (!/^[6-9]\d{9}$/.test(formData.whatsappNumber.trim())) {
      newErrors.whatsappNumber = 'Enter a valid 10-digit number'
    }
    if (!formData.city.trim()) newErrors.city = 'City is required'
    
    // Either UTR or screenshot is required
    const hasUtr = formData.utrNumber.trim().length > 0
    const hasScreenshot = !!paymentScreenshot
    if (!hasUtr && !hasScreenshot) {
      newErrors.payment = 'Please upload a payment screenshot or enter a UTR number'
    }
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
      const submitData = new FormData()
      submitData.append('fullName', formData.fullName.trim())
      submitData.append('whatsappNumber', formData.whatsappNumber.trim())
      submitData.append('city', formData.city.trim())
      submitData.append('referralCode', formData.referralCode.trim())
      if (formData.utrNumber.trim()) submitData.append('utrNumber', formData.utrNumber.trim())
      if (paymentScreenshot) submitData.append('paymentScreenshot', paymentScreenshot)

      const response = await fetch(`${BACKEND_URL}/api/user-application/submit`, {
        method: 'POST',
        body: submitData,
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

  const inputClass = (name) =>
    `w-full pl-10 pr-3 py-2.5 bg-gray-50 border-2 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all font-medium ${
      errors[name] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
    }`

  const labelClass = 'block text-xs sm:text-sm font-bold text-gray-700 mb-1.5'

  if (submitted) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4'>
        <div className='bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-5'>
            <CheckCircle className='w-11 h-11 text-green-600' />
          </div>
          <h2 className='text-2xl font-black text-gray-900 mb-3'>Application Submitted!</h2>
          <p className='text-gray-600 mb-6 leading-relaxed'>
            Thank you for applying to ABCD Platform! Our team will review your application and contact you on your WhatsApp number <span className='font-bold text-gray-800'>{formData.whatsappNumber}</span> within 24–48 hours.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className='inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95'
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-start sm:items-center justify-center px-2 py-4 sm:p-4'>
      <div className='w-full max-w-lg'>

        {/* Header */}
        <div className='text-center mb-5 sm:mb-4 px-2 pt-6 sm:pt-0'>
          <div className='flex items-center justify-center gap-2 mb-1'>
            <FileText className='w-5 h-5 text-indigo-600' />
            <h1 className='text-xl sm:text-2xl lg:text-xl font-black text-gray-900'>ABCD User Application</h1>
          </div>
          <p className='text-sm sm:text-base lg:text-sm xl:text-sm text-gray-600'>Submit your application — our team will contact you!</p>
        </div>

        {/* Card */}
        <div className='bg-white sm:rounded-3xl sm:shadow-xl p-4 sm:p-8'>
          <form onSubmit={handleSubmit} className='space-y-4'>

            {/* Row 1: Full Name + WhatsApp */}
            <div className='grid grid-cols-2 gap-2'>
              <div>
                <label className={labelClass}>Full Name <span className='text-red-500'>*</span></label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <input type='text' name='fullName' value={formData.fullName} onChange={handleChange} placeholder='Your full name' className={inputClass('fullName')} />
                </div>
                {errors.fullName && <p className='text-xs text-red-500 mt-1'>{errors.fullName}</p>}
              </div>
              <div>
                <label className={labelClass}>WhatsApp No. <span className='text-red-500'>*</span></label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <input type='tel' name='whatsappNumber' value={formData.whatsappNumber} onChange={handleChange} placeholder='9876543210' maxLength={10} className={inputClass('whatsappNumber')} />
                </div>
                {errors.whatsappNumber && <p className='text-xs text-red-500 mt-1'>{errors.whatsappNumber}</p>}
              </div>
            </div>

            {/* Row 2: City + Referral Code */}
            <div className='grid grid-cols-2 gap-2'>
              <div>
                <label className={labelClass}>City <span className='text-red-500'>*</span></label>
                <div className='relative'>
                  <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <input type='text' name='city' value={formData.city} onChange={handleChange} placeholder='Your city' className={inputClass('city')} />
                </div>
                {errors.city && <p className='text-xs text-red-500 mt-1'>{errors.city}</p>}
              </div>
              <div>
                <label className={labelClass}>Referral Code</label>
                <div className='relative'>
                  <Gift className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <input 
                    type='text' 
                    name='referralCode' 
                    value={formData.referralCode} 
                    onChange={handleChange} 
                    placeholder='Referral code' 
                    maxLength={8}
                    className={inputClass('referralCode')} 
                  />
                  {isVerifyingReferral && (
                    <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                      <Loader2 className='w-4 h-4 animate-spin text-indigo-500' />
                    </div>
                  )}
                </div>
                {referralInfo && (
                  <p className='text-xs text-green-600 mt-1 font-bold'>
                    {referralInfo.name}-{referralInfo.city}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Section */}
            <div className='border-2 border-gray-200 rounded-2xl overflow-hidden'>
              <div className='bg-[#1a237e] px-3 py-2'>
                <p className='text-white text-xs sm:text-sm font-bold'>Payment Information</p>
                <p className='text-indigo-200 text-[10px]'>Upload screenshot OR enter UTR number (at least one required)</p>
              </div>

              <div className='p-3 space-y-3'>
                {/* QR + Bank Details */}
                <div className='flex items-start gap-3 bg-gray-50 rounded-xl p-2.5'>
                  {/* QR Code */}
                  <div className='flex-shrink-0'>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(upiQrValue)}`}
                      alt='UPI QR Code'
                      className='w-20 h-20 sm:w-24 sm:h-24 border border-gray-200 rounded-lg bg-white p-1'
                    />
                    <p className='text-[9px] text-gray-500 text-center mt-1'>Scan to pay</p>
                  </div>

                  {/* Bank Details */}
                  <div className='flex-1 space-y-1'>
                    <p className='text-[#1a237e] text-[10px] sm:text-xs font-bold uppercase tracking-tight'>Bank Details</p>
                    {[
                      ['UPI ID', UPI_ID],
                      ['Bank', 'CANARA BANK'],
                      ['A/C No.', '78552200030217'],
                      ['IFSC', 'CNRB0017855'],
                    ].map(([label, value]) => (
                      <div key={label} className='flex justify-between items-start gap-1'>
                        <span className='text-gray-500 text-[9px] sm:text-[10px] shrink-0'>{label}</span>
                        <span className='text-gray-900 text-[9px] sm:text-[10px] font-semibold text-right break-all'>{value}</span>
                      </div>
                    ))}
                    <div className='mt-1.5 bg-indigo-50 rounded-lg px-2 py-1'>
                      <p className='text-indigo-700 text-[10px] font-bold'>Amount: ₹{MEMBERSHIP_AMOUNT}</p>
                    </div>
                  </div>
                </div>

                {/* Upload Screenshot */}
                <div>
                  <input type='file' id='payment-screenshot' accept='image/jpeg,image/jpg,image/png,image/webp' onChange={handleScreenshotChange} className='hidden' />
                  <label
                    htmlFor='payment-screenshot'
                    className='flex items-center justify-center gap-2 w-full py-2.5 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-xs sm:text-sm text-gray-600 cursor-pointer hover:bg-gray-100 hover:border-indigo-400 transition-all'
                  >
                    <Upload className='w-4 h-4' />
                    {paymentScreenshot ? paymentScreenshot.name : 'Upload Payment Screenshot'}
                  </label>
                  {screenshotPreview && (
                    <div className='mt-2 relative'>
                      <img src={screenshotPreview} alt='Payment screenshot' className='w-full h-24 object-cover rounded-xl border border-gray-200' />
                      <button
                        type='button'
                        onClick={() => { setPaymentScreenshot(null); setScreenshotPreview(null) }}
                        className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600'
                      >✕</button>
                    </div>
                  )}
                </div>

                {/* OR divider */}
                <div className='flex items-center gap-2'>
                  <div className='flex-1 h-px bg-gray-200' />
                  <span className='text-[10px] text-gray-400 font-semibold'>OR</span>
                  <div className='flex-1 h-px bg-gray-200' />
                </div>

                {/* UTR Number */}
                <div>
                  <div className='relative'>
                    <Hash className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <input
                      type='text'
                      name='utrNumber'
                      value={formData.utrNumber}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 12)
                        setFormData(prev => ({ ...prev, utrNumber: digitsOnly }))
                        if (errors.payment) setErrors(prev => ({ ...prev, payment: '' }))
                      }}
                      placeholder='Enter 12-digit UTR number'
                      maxLength={12}
                      className='w-full pl-10 pr-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium'
                    />
                  </div>
                </div>

                {errors.payment && <p className='text-xs text-red-500 font-medium'>{errors.payment}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm'
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

            <p className='text-center text-xs text-gray-500'>
              Already have an account?{' '}
              <a href='/login' className='font-bold text-indigo-600 hover:underline'>Sign In</a>
            </p>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup
