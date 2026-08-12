import React, { useState, useContext } from 'react'
import { Loader2, CheckCircle, User, Phone, MapPin, Upload, Hash, Camera, Users, CalendarDays } from 'lucide-react'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const UPI_ID = '222716826030217@cnrb'
const UPI_NAME = 'Chhattisgarh Prantiya Agrawal Sammelan'

const BANK_DETAILS = {
  bankName: 'Canara Bank',
  branch: 'Raipur',
  accountNo: '785 522 000 302 17',
  ifsc: 'CNRB0017855',
  accountName: 'Chhattisgarh Prantiya Agrawal Sammelan',
}

const REGISTRATION_TYPES = [
  {
    value: 'with-room-1-night',
    label: 'With Room – 1 Night',
    fee: '500',
    feeLabel: '₹500',
    desc: 'Twin / Triple Sharing – ₹500',
  },
  {
    value: 'with-room-2-nights',
    label: 'With Room – 2 Nights',
    fee: '1500',
    feeLabel: '₹1500',
    desc: 'Twin / Triple Sharing – ₹1500',
  },
  {
    value: 'without-room',
    label: 'Without Room',
    fee: '300',
    feeLabel: '₹300',
    desc: 'Registration Fee ₹300',
  },
]

const GENDERS = ['Male', 'Female', 'Other']

const AgraMahakumbh2026 = () => {
  const { BACKEND_URL } = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [registrationNo, setRegistrationNo] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    mobileNo: '',
    dob: '',
    age: '',
    fatherName: '',
    address: '',
    registrationType: '',
    utrNumber: '',
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [paymentFile, setPaymentFile] = useState(null)
  const [paymentPreview, setPaymentPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [dobParts, setDobParts] = useState({ year: '', month: '', day: '' })
  const [showDobPopup, setShowDobPopup] = useState(false)
  const [dobStep, setDobStep] = useState('year')
  const [tempDob, setTempDob] = useState({ year: '', month: '', day: '' })

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 101 }, (_, i) => currentYear - i)

  const daysInMonth = (year, month) => {
    if (!year || !month) return []
    const lastDay = new Date(year, month, 0).getDate()
    const today = new Date()
    const maxDay = year === today.getFullYear() && month === today.getMonth() + 1 ? today.getDate() : lastDay
    return Array.from({ length: maxDay }, (_, i) => i + 1)
  }

  const applyDob = (year, month, day) => {
    if (year && month && day) {
      const dd = String(day).padStart(2, '0')
      const mm = String(month).padStart(2, '0')
      const dobValue = `${year}-${mm}-${dd}`
      const birthDate = new Date(dobValue)
      const today = new Date()
      let calculatedAge = today.getFullYear() - birthDate.getFullYear()
      const monthDifference = today.getMonth() - birthDate.getMonth()
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--
      }
      setFormData((prev) => ({ ...prev, dob: dobValue, age: calculatedAge > 0 ? String(calculatedAge) : '0' }))
    } else {
      setFormData((prev) => ({ ...prev, dob: '', age: '' }))
    }
  }

  const openDobPopup = () => {
    setTempDob({ ...dobParts })
    setDobStep(dobParts.year ? (dobParts.month ? 'day' : 'month') : 'year')
    setShowDobPopup(true)
  }

  const selectDobPart = (part, value) => {
    const next = { ...tempDob, [part]: value }
    if (part === 'year') {
      next.month = ''
      next.day = ''
      setDobStep('month')
    } else if (part === 'month') {
      next.day = ''
      setDobStep('day')
    }
    setTempDob(next)
  }

  const confirmDob = () => {
    const { year, month, day } = tempDob
    if (!year || !month || !day) return
    setDobParts({ year, month, day })
    applyDob(year, month, day)
    setShowDobPopup(false)
  }

  const dobDisplay = dobParts.year && dobParts.month && dobParts.day
    ? `${String(dobParts.day).padStart(2, '0')}-${String(dobParts.month).padStart(2, '0')}-${dobParts.year}`
    : ''

  const selectedType = REGISTRATION_TYPES.find((t) => t.value === formData.registrationType)

  const upiQrValue = selectedType
    ? `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${selectedType.fee}.00&cu=INR&tn=${encodeURIComponent(
        `Agra Mahakumbh 2026 - ${selectedType.label}`
      )}`
    : `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&cu=INR&tn=${encodeURIComponent('Agra Mahakumbh 2026')}`

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'mobileNo') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10)
      setFormData((prev) => ({ ...prev, [name]: cleaned }))
    } else if (name === 'utrNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 12)
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photo size should be less than 5MB')
      return
    }
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    if (errors.photo) setErrors((prev) => ({ ...prev, photo: '' }))
  }

  const handlePaymentChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB')
      return
    }
    setPaymentFile(file)
    setPaymentPreview(URL.createObjectURL(file))
    if (errors.payment) setErrors((prev) => ({ ...prev, payment: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.gender) newErrors.gender = 'Please select your gender'
    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = 'Mobile number is required'
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNo.trim())) {
      newErrors.mobileNo = 'Enter a valid 10-digit number'
    }
    if (!formData.registrationType) newErrors.registrationType = 'Please select a registration type'
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required"
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!photoFile) newErrors.photo = 'Please upload your photo'
    if (!paymentFile) newErrors.payment = 'Please upload the payment screenshot'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const submitData = new FormData()
      submitData.append('fullName', formData.fullName.trim())
      submitData.append('gender', formData.gender)
      submitData.append('mobileNo', formData.mobileNo.trim())
      submitData.append('dob', formData.dob)
      submitData.append('age', formData.age)
      submitData.append('fatherName', formData.fatherName.trim())
      submitData.append('address', formData.address.trim())
      submitData.append('registrationType', formData.registrationType)
      submitData.append('registrationFee', selectedType ? selectedType.fee : '')
      if (formData.utrNumber.trim()) submitData.append('utrNumber', formData.utrNumber.trim())
      if (photoFile) submitData.append('photo', photoFile)
      if (paymentFile) submitData.append('paymentScreenshot', paymentFile)

      const response = await fetch(`${BACKEND_URL}/api/agra-mahakumbh-2026/submit`, {
        method: 'POST',
        body: submitData,
      })
      const data = await response.json()
      if (data.success) {
        setRegistrationNo(data.registrationNo)
        setSubmitted(true)
        toast.success('Registration submitted successfully!')
      } else {
        toast.error(data.message || 'Failed to submit registration')
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      gender: '',
      mobileNo: '',
      dob: '',
      age: '',
      fatherName: '',
      address: '',
      registrationType: '',
      utrNumber: '',
    })
    setPhotoFile(null)
    setPhotoPreview(null)
    setPaymentFile(null)
    setPaymentPreview(null)
    setDobParts({ year: '', month: '', day: '' })
    setErrors({})
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
          <h2 className='text-2xl font-black text-gray-900 mb-3'>Registration Submitted!</h2>

          <div className='bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-4 mb-6'>
            <p className='text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-1'>Your Registration Number</p>
            <div className='flex items-center justify-center gap-3'>
              <span className='text-2xl font-black text-indigo-900 tracking-widest'>{registrationNo}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(registrationNo)
                  toast.success('Registration number copied!', { position: 'bottom-center', autoClose: 1000 })
                }}
                className='p-2 bg-white text-indigo-600 rounded-lg shadow-sm hover:bg-indigo-50 transition-colors border border-indigo-100'
                title='Copy Number'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
                </svg>
              </button>
            </div>
            <p className='text-[10px] text-red-500 font-bold mt-2 uppercase'>⚠️ Please take a screenshot for future reference</p>
          </div>

          <p className='text-gray-600 mb-6 text-sm leading-relaxed'>
            Thank you for registering for Agra Mahakumbh 2026! Our team will verify your payment and registration. Your registration will be confirmed after verification.
          </p>
          <button
            onClick={resetForm}
            className='inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95'
          >
            Register Another Person
          </button>
          <button
            onClick={() => { window.location.href = '/' }}
            className='mt-3 inline-flex items-center justify-center gap-2 w-full bg-indigo-50 text-indigo-700 font-bold py-3 px-6 rounded-xl hover:bg-indigo-100 transition-all duration-200'
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'>
      <img src='/agra alankaran.avif' alt='Agra Mahakumbh 2026' className='w-full h-auto object-cover' />

      <div className='w-full max-w-lg mx-auto px-2 py-6 sm:py-8'>

        {/* Card */}
        <div className='bg-white sm:rounded-3xl sm:shadow-xl p-4 sm:p-8'>
          <form onSubmit={handleSubmit} className='space-y-4'>

            {/* Row 1: Full Name + Mobile No */}
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
                <label className={labelClass}>Mobile No. <span className='text-red-500'>*</span></label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <input type='tel' inputMode='numeric' name='mobileNo' value={formData.mobileNo} onChange={handleChange} placeholder='9876543210' maxLength={10} className={inputClass('mobileNo')} />
                </div>
                {errors.mobileNo && <p className='text-xs text-red-500 mt-1'>{errors.mobileNo}</p>}
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className={labelClass}>Gender <span className='text-red-500'>*</span></label>
              <div className='grid grid-cols-3 gap-2'>
                {GENDERS.map((g) => (
                  <label
                    key={g}
                    className={`flex items-center justify-center gap-1.5 px-2 py-2.5 border-2 rounded-xl cursor-pointer transition-all font-bold text-[11px] sm:text-xs ${
                      formData.gender === g
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-indigo-300'
                    }`}
                  >
                    <input type='radio' name='gender' value={g} checked={formData.gender === g} onChange={handleChange} className='hidden' />
                    <Users className='w-3.5 h-3.5' />
                    {g}
                  </label>
                ))}
              </div>
              {errors.gender && <p className='text-xs text-red-500 mt-1'>{errors.gender}</p>}
            </div>

            {/* Row 2: Father's Name + Address */}
            <div className='grid grid-cols-2 gap-2'>
              <div>
                <label className={labelClass}>Father&apos;s Name <span className='text-red-500'>*</span></label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <input type='text' name='fatherName' value={formData.fatherName} onChange={handleChange} placeholder="Father's full name" className={inputClass('fatherName')} />
                </div>
                {errors.fatherName && <p className='text-xs text-red-500 mt-1'>{errors.fatherName}</p>}
              </div>
              <div>
                <label className={labelClass}>Address <span className='text-red-500'>*</span></label>
                <div className='relative'>
                  <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <input type='text' name='address' value={formData.address} onChange={handleChange} placeholder='Your address' className={inputClass('address')} />
                </div>
                {errors.address && <p className='text-xs text-red-500 mt-1'>{errors.address}</p>}
              </div>
            </div>

            {/* Row: DOB + Age */}
            <div className='grid grid-cols-2 gap-2'>
              <div>
                <label className={labelClass}>Date of Birth</label>
                <div className='relative'>
                  <button
                    type='button'
                    onClick={openDobPopup}
                    className='w-full flex items-center gap-2 pl-3 pr-9 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-xs sm:text-sm text-left transition-all font-medium hover:border-indigo-300 focus:outline-none focus:border-indigo-500 focus:bg-white'
                  >
                    <CalendarDays className='w-4 h-4 text-gray-400 shrink-0' />
                    <span className={`flex-1 truncate ${dobDisplay ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                      {dobDisplay || 'Select Date of Birth'}
                    </span>
                  </button>
                  {dobDisplay && (
                    <button
                      type='button'
                      onClick={() => { setDobParts({ year: '', month: '', day: '' }); applyDob('', '', '') }}
                      className='absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 transition-colors'
                      aria-label='Clear Date of Birth'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className={labelClass}>Age <span className='text-gray-400 font-medium'>(auto)</span></label>
                <div className='relative'>
                  <Hash className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <input type='number' name='age' value={formData.age} onChange={handleChange} placeholder='Years' className='w-full pl-10 pr-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium' />
                </div>
              </div>
            </div>

            {/* Registration Type */}
            <div>
              <label className={labelClass}>Registration Type <span className='text-red-500'>*</span></label>
              <div className='space-y-2'>
                {REGISTRATION_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center justify-between gap-2 border-2 rounded-xl px-3 py-2.5 cursor-pointer transition-all ${
                      formData.registrationType === type.value
                        ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                        : 'border-gray-200 bg-gray-50 hover:border-indigo-300'
                    }`}
                  >
                    <span className='flex items-center gap-2'>
                      <input type='radio' name='registrationType' value={type.value} checked={formData.registrationType === type.value} onChange={handleChange} className='accent-indigo-600 w-3.5 h-3.5 cursor-pointer' />
                      <span className='flex flex-col'>
                        <span className='text-[11px] sm:text-xs font-bold text-gray-800'>{type.label}</span>
                        <span className='text-[9px] text-gray-500'>{type.desc}</span>
                      </span>
                    </span>
                    <span className='shrink-0 bg-indigo-600 text-white text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-lg'>{type.feeLabel}</span>
                  </label>
                ))}
              </div>
              {errors.registrationType && <p className='text-xs text-red-500 mt-1'>{errors.registrationType}</p>}
            </div>

            {/* Photo Upload */}
            <div>
              <label className={labelClass}>Photo <span className='text-red-500'>*</span></label>
              <input type='file' id='photo' accept='image/*' onChange={handlePhotoChange} className='hidden' />
              <label
                htmlFor='photo'
                className='flex items-center justify-center gap-2 w-full py-2.5 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-xs sm:text-sm text-gray-600 cursor-pointer hover:bg-gray-100 hover:border-indigo-400 transition-all'
              >
                <Camera className='w-4 h-4' />
                {photoFile ? photoFile.name : 'Upload Passport Size Photo (Max 5MB)'}
              </label>
              {photoPreview && (
                <div className='mt-2 relative'>
                  <img src={photoPreview} alt='Photo' className='w-full h-24 object-cover rounded-xl border border-gray-200' />
                  <button
                    type='button'
                    onClick={() => { setPhotoFile(null); setPhotoPreview(null) }}
                    className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600'
                  >✕</button>
                </div>
              )}
              {errors.photo && <p className='text-xs text-red-500 mt-1'>{errors.photo}</p>}
            </div>

            {/* Payment Section */}
            <div className='border-2 border-gray-200 rounded-2xl overflow-hidden'>
              <div className='bg-[#1a237e] px-3 py-2'>
                <p className='text-white text-xs sm:text-sm font-bold'>Payment Information</p>
                <p className='text-indigo-200 text-[10px]'>Upload screenshot or enter UTR number</p>
              </div>

              <div className='p-3 space-y-3'>
                {/* QR + Bank Details */}
                <div className='flex items-start gap-3 bg-gray-50 rounded-xl p-2.5'>
                  <div className='flex-shrink-0'>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(upiQrValue)}`}
                      alt='UPI QR Code'
                      className='w-20 h-20 sm:w-24 sm:h-24 border border-gray-200 rounded-lg bg-white p-1'
                    />
                    <p className='text-[9px] text-gray-500 text-center mt-1'>Scan to pay</p>
                  </div>

                  <div className='flex-1 space-y-1'>
                    <p className='text-[#1a237e] text-[10px] sm:text-xs font-bold uppercase tracking-tight'>Bank Details</p>
                    {[
                      ['UPI ID', UPI_ID],
                      ['Bank', BANK_DETAILS.bankName.toUpperCase()],
                      ['A/C No.', BANK_DETAILS.accountNo],
                      ['IFSC', BANK_DETAILS.ifsc],
                    ].map(([label, value]) => (
                      <div key={label} className='flex justify-between items-start gap-1'>
                        <span className='text-gray-500 text-[9px] sm:text-[10px] shrink-0'>{label}</span>
                        <span className='text-gray-900 text-[9px] sm:text-[10px] font-semibold text-right break-all'>{value}</span>
                      </div>
                    ))}
                    <div className='mt-1.5 bg-indigo-50 rounded-lg px-2 py-1'>
                      <p className='text-indigo-700 text-[10px] font-bold'>
                        {selectedType ? `Amount: ${selectedType.feeLabel}` : 'Select registration type for amount'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Upload Screenshot */}
                <div>
                  <input type='file' id='payment-screenshot' accept='image/jpeg,image/jpg,image/png,image/webp' onChange={handlePaymentChange} className='hidden' />
                  <label
                    htmlFor='payment-screenshot'
                    className='flex items-center justify-center gap-2 w-full py-2.5 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-xs sm:text-sm text-gray-600 cursor-pointer hover:bg-gray-100 hover:border-indigo-400 transition-all'
                  >
                    <Upload className='w-4 h-4' />
                    {paymentFile ? paymentFile.name : 'Upload Payment Screenshot'}
                  </label>
                  {paymentPreview && (
                    <div className='mt-2 relative'>
                      <img src={paymentPreview} alt='Payment screenshot' className='w-full h-24 object-cover rounded-xl border border-gray-200' />
                      <button
                        type='button'
                        onClick={() => { setPaymentFile(null); setPaymentPreview(null) }}
                        className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600'
                      >✕</button>
                    </div>
                  )}
                  {errors.payment && <p className='text-xs text-red-500 mt-1'>{errors.payment}</p>}
                </div>

                {/* OR divider */}
                <div className='flex items-center gap-2'>
                  <div className='flex-1 h-px bg-gray-200' />
                  <span className='text-[10px] text-gray-400 font-semibold'>OR</span>
                  <div className='flex-1 h-px bg-gray-200' />
                </div>

                {/* UTR Number */}
                <div className='relative'>
                  <Hash className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                  <input
                    type='text'
                    name='utrNumber'
                    value={formData.utrNumber}
                    onChange={handleChange}
                    placeholder='Enter 12-digit UTR number'
                    maxLength={12}
                    className='w-full pl-10 pr-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium'
                  />
                </div>
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
                'Submit Registration'
              )}
            </button>

            <p className='text-center text-xs text-gray-500'>
              Registration fee must be paid in advance. Your submission will be verified by our team.
            </p>

          </form>
        </div>
      </div>

      {showDobPopup && (
        <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
          <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={() => setShowDobPopup(false)} />
          <div className='relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-5 sm:p-6 overflow-hidden animate-fade-in'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-base font-black text-gray-900'>Select Date of Birth</h3>
              <button
                type='button'
                onClick={() => setShowDobPopup(false)}
                className='w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors'
                aria-label='Close'
              >
                <svg className='w-4 h-4 text-gray-500' fill='none' stroke='currentColor' strokeWidth={2} viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            {/* Stepper indicator */}
            <div className='flex gap-1.5 mb-4'>
              {['Year', 'Month', 'Date'].map((label, i) => {
                const stepName = ['year', 'month', 'day'][i]
                const active = dobStep === stepName
                const done = i === 0 ? !!tempDob.year : i === 1 ? !!tempDob.month : !!tempDob.day
                return (
                  <div
                    key={label}
                    className={`flex-1 rounded-lg py-2 text-center text-[11px] font-black ${
                      active ? 'bg-indigo-600 text-white' : done ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {label}
                  </div>
                )
              })}
            </div>

            {/* Step: Year */}
            {dobStep === 'year' && (
              <div className='max-h-64 overflow-y-auto grid grid-cols-4 gap-1.5 pr-1'>
                {years.map((y) => (
                  <button
                    key={y}
                    type='button'
                    onClick={() => selectDobPart('year', String(y))}
                    className={`py-2 rounded-lg text-xs font-bold border-2 transition-all ${
                      tempDob.year === String(y)
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-indigo-300'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}

            {/* Step: Month */}
            {dobStep === 'month' && (
              <div className='max-h-64 overflow-y-auto grid grid-cols-3 gap-1.5 pr-1'>
                {MONTHS.map((m, i) => (
                  <button
                    key={m}
                    type='button'
                    onClick={() => selectDobPart('month', String(i + 1))}
                    className={`px-1 py-2 rounded-lg text-[11px] font-bold border-2 transition-all ${
                      tempDob.month === String(i + 1)
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-indigo-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
                <button
                  type='button'
                  onClick={() => setDobStep('year')}
                  className='col-span-3 py-2 rounded-lg text-xs font-bold text-gray-500 bg-gray-50 border-2 border-dashed border-gray-300 hover:border-indigo-300 hover:text-indigo-600 transition-all'
                >
                  ← Change Year
                </button>
              </div>
            )}

            {/* Step: Day */}
            {dobStep === 'day' && (
              <div className='max-h-64 overflow-y-auto grid grid-cols-7 gap-1.5 pr-1'>
                {daysInMonth(Number(tempDob.year), Number(tempDob.month)).map((d) => (
                  <button
                    key={d}
                    type='button'
                    onClick={() => selectDobPart('day', String(d))}
                    className={`py-2 rounded-lg text-xs font-bold border-2 transition-all ${
                      tempDob.day === String(d)
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-indigo-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
                <button
                  type='button'
                  onClick={() => setDobStep('month')}
                  className='col-span-7 py-2 rounded-lg text-xs font-bold text-gray-500 bg-gray-50 border-2 border-dashed border-gray-300 hover:border-indigo-300 hover:text-indigo-600 transition-all'
                >
                  ← Change Month
                </button>
              </div>
            )}

            {/* Live preview */}
            {tempDob.year && tempDob.month && tempDob.day && (
              <p className='mt-3 text-center text-sm font-black text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl py-2'>
                {String(tempDob.day).padStart(2, '0')}-{String(tempDob.month).padStart(2, '0')}-{tempDob.year}
              </p>
            )}

            {/* Footer */}
            <div className='mt-4 flex gap-2'>
              <button
                type='button'
                onClick={() => setShowDobPopup(false)}
                className='flex-1 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={confirmDob}
                disabled={!tempDob.year || !tempDob.month || !tempDob.day}
                className='flex-1 py-2.5 rounded-xl text-sm font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed'
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgraMahakumbh2026