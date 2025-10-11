import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Store,
  User,
  Phone,
  FileText,
  MapPin,
  CreditCard,
  Building2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LogOut
} from 'lucide-react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const BusinessForm = () => {
  const { vendor, application, BACKEND_URL, isAuthenticated, refreshVendor, logout } = useContext(AppContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    mobile: '',
    gstNumber: '',
    businessCategory: '',
    // Business Address
    street: '',
    city: '',
    state: 'Chhattisgarh', // Hardcoded - only Chhattisgarh allowed
    pincode: '',
    // Bank Account (optional)
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    // UPI (optional)
    upiId: '',
    upiAccountHolderName: '',
  })

  // Pre-fill form with existing application data if available
  useEffect(() => {
    if (application) {
      setFormData({
        businessName: application.businessName || '',
        ownerName: application.ownerName || '',
        mobile: application.mobile || '',
        gstNumber: application.gstNumber || '',
        businessCategory: application.businessCategory || '',
        street: application.businessAddress?.street || '',
        city: application.businessAddress?.city || '',
        state: 'Chhattisgarh',
        pincode: application.businessAddress?.pincode || '',
        accountHolderName: application.bankAccount?.accountHolderName || '',
        accountNumber: application.bankAccount?.accountNumber || '',
        ifscCode: application.bankAccount?.ifscCode || '',
        bankName: application.bankAccount?.bankName || '',
        upiId: application.upiId?.upi || '',
        upiAccountHolderName: application.upiId?.accountHolderName || '',
      })
    }
  }, [application])

  // Redirect to appropriate page if application already submitted
  useEffect(() => {
    if (application) {
      if (application.applicationStatus === 'approved' || vendor?.isVerified) {
        console.log('📋 Application approved, redirecting to dashboard')
        navigate('/dashboard', { replace: true })
      } else if (['pending', 'under_review'].includes(application.applicationStatus)) {
        console.log('📋 Application pending/under review, redirecting to pending approval')
        navigate('/pending-approval', { replace: true })
      }
    }
  }, [application, vendor, navigate])

  // Prevent rendering form if already submitted (except rejected - they can resubmit)
  if (application && ['approved', 'pending', 'under_review'].includes(application.applicationStatus)) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'>
        <Loader2 className='w-8 h-8 animate-spin text-indigo-600' />
      </div>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Prepare submission data
      const submissionData = {
        businessName: formData.businessName.trim(),
        ownerName: formData.ownerName.trim(),
        mobile: parseInt(formData.mobile),
        gstNumber: formData.gstNumber.trim(),
        businessCategory: formData.businessCategory.trim(),
      }

      // Add business address if provided
      if (formData.street || formData.city || formData.state || formData.pincode) {
        submissionData.businessAddress = {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
        }
      }

      // Add bank account if provided
      if (formData.accountNumber.trim() && formData.ifscCode.trim()) {
        submissionData.bankAccount = {
          accountHolderName: formData.accountHolderName.trim(),
          accountNumber: formData.accountNumber.trim(),
          ifscCode: formData.ifscCode.trim(),
          bankName: formData.bankName.trim(),
        }
      }

      // Add UPI if provided
      if (formData.upiId.trim()) {
        submissionData.upiId = {
          upi: formData.upiId.trim(),
          accountHolderName: formData.upiAccountHolderName.trim(),
        }
      }

      console.log('📤 Submitting business form...')
      const response = await axios.post(
        `${BACKEND_URL}/api/vendor/business-form`,
        submissionData,
        { withCredentials: true }
      )

      if (response.data.success) {
        console.log('✅ Business application submitted successfully')
        toast.success('Business application submitted successfully! Your application is under review.')

        // Refresh vendor data to get updated information including application
        await refreshVendor()

        // Navigate to pending approval page
        navigate('/pending-approval', { replace: true })
      } else {
        setError(response.data.message || 'Failed to submit application')
        toast.error(response.data.message || 'Failed to submit application')
      }
    } catch (err) {
      console.error('❌ Business application submission error:', err)
      const errorMessage = err.response?.data?.message || 'Failed to submit business application'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Show loading if not authenticated or vendor data not loaded
  if (!isAuthenticated || !vendor) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'>
        <Loader2 className='w-8 h-8 animate-spin text-indigo-600' />
      </div>
    )
  }

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout? Your form data will not be saved.')) {
      await logout()
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto'>
        {/* Logout Button - Top Right */}
        <div className='flex justify-end mb-4'>
          <button
            onClick={handleLogout}
            className='inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 border-2 border-gray-200'
          >
            <LogOut className='w-4 h-4' />
            Logout
          </button>
        </div>

        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg'>
            <Store className='w-8 h-8 text-white' />
          </div>
          <h1 className='text-3xl font-black text-gray-900 mb-2'>Complete Your Business Profile</h1>
          <p className='text-base text-gray-600'>Please provide your business information to continue</p>
        </div>

        {/* Info Banner */}
        <div className='bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6'>
          <div className='flex items-start gap-3'>
            <AlertCircle className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
            <div>
              <p className='text-sm font-semibold text-blue-900 mb-1'>Required Information</p>
              <p className='text-xs text-blue-700'>
                Fill in your business details to access the vendor dashboard. Fields marked with * are required.
                Your information will be reviewed by admin for approval.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className='bg-white rounded-3xl shadow-xl p-6 sm:p-8'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Basic Information */}
            <div>
              <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <Building2 className='w-5 h-5 text-indigo-600' />
                Basic Information
              </h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='sm:col-span-2'>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    Business Name <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <Store className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                    <input
                      type='text'
                      name='businessName'
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className='w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium'
                      placeholder='Enter your business name'
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    Owner Name <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                    <input
                      type='text'
                      name='ownerName'
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      className='w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium'
                      placeholder='Enter owner name'
                      required
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
                      onChange={handleInputChange}
                      className='w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium'
                      placeholder='Enter 10-digit mobile'
                      pattern='[6-9][0-9]{9}'
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    GST Number <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <FileText className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                    <input
                      type='text'
                      name='gstNumber'
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      className='w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium uppercase'
                      placeholder='Enter 15-character GST number'
                      maxLength='15'
                      minLength='15'
                      title='GST number must be exactly 15 characters'
                      required
                    />
                  </div>
                  <p className='text-xs text-gray-500 mt-1'>Must be exactly 15 characters</p>
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>
                    Business Category <span className='text-red-500'>*</span>
                  </label>
                  <select
                    name='businessCategory'
                    value={formData.businessCategory}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium'
                    required
                  >
                    <option value=''>Select category</option>
                    <option value='Electronics'>Electronics</option>
                    <option value='Clothing'>Clothing</option>
                    <option value='Food'>Food & Beverages</option>
                    <option value='Furniture'>Furniture</option>
                    <option value='Books'>Books & Stationery</option>
                    <option value='Beauty'>Beauty & Personal Care</option>
                    <option value='Sports'>Sports & Fitness</option>
                    <option value='Other'>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Business Address */}
            <div>
              <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <MapPin className='w-5 h-5 text-indigo-600' />
                Business Address
              </h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='sm:col-span-2'>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Street Address</label>
                  <input
                    type='text'
                    name='street'
                    value={formData.street}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium'
                    placeholder='Enter street address'
                  />
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>City</label>
                  <input
                    type='text'
                    name='city'
                    value={formData.city}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium'
                    placeholder='Enter city'
                  />
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>State</label>
                  <input
                    type='text'
                    name='state'
                    value='Chhattisgarh'
                    readOnly
                    disabled
                    className='w-full px-4 py-3.5 bg-gray-100 border-2 border-gray-200 rounded-xl text-base text-gray-700 font-medium cursor-not-allowed'
                  />
                  <p className='text-xs text-gray-500 mt-1'>Only Chhattisgarh vendors are allowed</p>
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Pincode</label>
                  <input
                    type='text'
                    name='pincode'
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium'
                    placeholder='Enter pincode'
                    pattern='[0-9]{6}'
                  />
                </div>
              </div>
            </div>

            {/* Bank Details (Optional) */}
            <div>
              <h2 className='text-xl font-bold text-gray-900 mb-4 flex items-center gap-2'>
                <CreditCard className='w-5 h-5 text-indigo-600' />
                Bank Details (Optional)
              </h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Account Holder Name</label>
                  <input
                    type='text'
                    name='accountHolderName'
                    value={formData.accountHolderName}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium'
                    placeholder='Enter account holder name'
                  />
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Account Number</label>
                  <input
                    type='text'
                    name='accountNumber'
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium'
                    placeholder='Enter account number'
                  />
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>IFSC Code</label>
                  <input
                    type='text'
                    name='ifscCode'
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium'
                    placeholder='Enter IFSC code'
                  />
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>Bank Name</label>
                  <input
                    type='text'
                    name='bankName'
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium'
                    placeholder='Enter bank name'
                  />
                </div>

                <div className='sm:col-span-2'>
                  <label className='block text-sm font-bold text-gray-700 mb-2'>UPI ID</label>
                  <input
                    type='text'
                    name='upiId'
                    value={formData.upiId}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium'
                    placeholder='Enter UPI ID (e.g., yourname@paytm)'
                  />
                </div>

                {formData.upiId && (
                  <div className='sm:col-span-2'>
                    <label className='block text-sm font-bold text-gray-700 mb-2'>UPI Account Holder Name</label>
                    <input
                      type='text'
                      name='upiAccountHolderName'
                      value={formData.upiAccountHolderName}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium'
                      placeholder='Enter UPI account holder name'
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-red-50 border-l-4 border-red-500 rounded-xl p-4'>
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
              className='w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold py-4 rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-base'
            >
              {loading ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className='w-5 h-5' />
                  Submit Business Application
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600'>
            Your information will be reviewed by our admin team for approval
          </p>
        </div>
      </div>
    </div>
  )
}

export default BusinessForm
