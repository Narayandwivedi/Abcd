import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessAddress: '',
    city: '',
    state: '',
    zipCode: '',
    businessType: '',
    taxId: '',
    description: ''
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.businessAddress.trim()) {
      newErrors.businessAddress = 'Business address is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Business type is required'
    }

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    console.log('Vendor registration:', formData)
    // Add your registration logic here
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 flex items-center justify-center py-12 px-4 relative overflow-hidden'>
      {/* Decorative Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute top-20 right-20 w-96 h-96 bg-green-500 opacity-10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 left-20 w-80 h-80 bg-teal-500 opacity-10 rounded-full blur-3xl'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500 opacity-5 rounded-full blur-3xl'></div>
      </div>

      <div className='max-w-4xl w-full relative z-10'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-teal-400 rounded-2xl mb-4 shadow-lg'>
            <svg className='w-10 h-10 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
            </svg>
          </div>
          <h1 className='text-4xl font-black text-white mb-2'>Vendor Registration</h1>
          <p className='text-gray-300'>Join our marketplace and start selling your products</p>
        </div>

        {/* Registration Form */}
        <div className='bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20'>
          <form onSubmit={handleSubmit}>
            {/* Business Information */}
            <div className='mb-8'>
              <h2 className='text-xl font-bold text-white mb-4 pb-2 border-b-2 border-green-400'>
                Business Information
              </h2>

              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-white font-semibold mb-2 text-sm'>
                    Business Name <span className='text-red-400'>*</span>
                  </label>
                  <input
                    type='text'
                    name='businessName'
                    value={formData.businessName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/20 border ${errors.businessName ? 'border-red-400' : 'border-white/30'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition backdrop-blur-sm`}
                    placeholder='Enter business name'
                  />
                  {errors.businessName && <p className='text-red-400 text-sm mt-1'>{errors.businessName}</p>}
                </div>

                <div>
                  <label className='block text-white font-semibold mb-2 text-sm'>
                    Owner Name <span className='text-red-400'>*</span>
                  </label>
                  <input
                    type='text'
                    name='ownerName'
                    value={formData.ownerName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/20 border ${errors.ownerName ? 'border-red-400' : 'border-white/30'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition backdrop-blur-sm`}
                    placeholder='Enter owner name'
                  />
                  {errors.ownerName && <p className='text-red-400 text-sm mt-1'>{errors.ownerName}</p>}
                </div>

                <div>
                  <label className='block text-white font-semibold mb-2 text-sm'>
                    Business Type <span className='text-red-400'>*</span>
                  </label>
                  <select
                    name='businessType'
                    value={formData.businessType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/20 border ${errors.businessType ? 'border-red-400' : 'border-white/30'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition backdrop-blur-sm`}
                  >
                    <option value='' className='bg-gray-800'>Select business type</option>
                    <option value='retail' className='bg-gray-800'>Retail</option>
                    <option value='wholesale' className='bg-gray-800'>Wholesale</option>
                    <option value='manufacturer' className='bg-gray-800'>Manufacturer</option>
                    <option value='distributor' className='bg-gray-800'>Distributor</option>
                    <option value='individual' className='bg-gray-800'>Individual Seller</option>
                  </select>
                  {errors.businessType && <p className='text-red-400 text-sm mt-1'>{errors.businessType}</p>}
                </div>

                <div>
                  <label className='block text-white font-semibold mb-2 text-sm'>
                    Tax ID / Business License
                  </label>
                  <input
                    type='text'
                    name='taxId'
                    value={formData.taxId}
                    onChange={handleChange}
                    className='w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition backdrop-blur-sm'
                    placeholder='Enter tax ID or business license'
                  />
                </div>
              </div>

              <div className='mt-6'>
                <label className='block text-white font-semibold mb-2 text-sm'>
                  Business Description
                </label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  rows='4'
                  className='w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition backdrop-blur-sm'
                  placeholder='Tell us about your business...'
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className='mb-8'>
              <h2 className='text-xl font-bold text-white mb-4 pb-2 border-b-2 border-green-400'>
                Contact Information
              </h2>

              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-white font-semibold mb-2 text-sm'>
                    Email <span className='text-red-400'>*</span>
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/20 border ${errors.email ? 'border-red-400' : 'border-white/30'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition backdrop-blur-sm`}
                    placeholder='vendor@example.com'
                  />
                  {errors.email && <p className='text-red-400 text-sm mt-1'>{errors.email}</p>}
                </div>

                <div>
                  <label className='block text-white font-semibold mb-2 text-sm'>
                    Phone Number <span className='text-red-400'>*</span>
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/20 border ${errors.phone ? 'border-red-400' : 'border-white/30'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition backdrop-blur-sm`}
                    placeholder='(123) 456-7890'
                  />
                  {errors.phone && <p className='text-red-400 text-sm mt-1'>{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Business Address */}
            <div className='mb-8'>
              <h2 className='text-xl font-bold text-white mb-4 pb-2 border-b-2 border-green-400'>
                Business Address
              </h2>

              <div className='space-y-6'>
                <div>
                  <label className='block text-white font-semibold mb-2 text-sm'>
                    Street Address <span className='text-red-400'>*</span>
                  </label>
                  <input
                    type='text'
                    name='businessAddress'
                    value={formData.businessAddress}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/20 border ${errors.businessAddress ? 'border-red-400' : 'border-white/30'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition backdrop-blur-sm`}
                    placeholder='123 Business Street'
                  />
                  {errors.businessAddress && <p className='text-red-400 text-sm mt-1'>{errors.businessAddress}</p>}
                </div>

                <div className='grid md:grid-cols-3 gap-6'>
                  <div>
                    <label className='block text-white font-semibold mb-2 text-sm'>
                      City <span className='text-red-400'>*</span>
                    </label>
                    <input
                      type='text'
                      name='city'
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/20 border ${errors.city ? 'border-red-400' : 'border-white/30'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition backdrop-blur-sm`}
                      placeholder='City'
                    />
                    {errors.city && <p className='text-red-400 text-sm mt-1'>{errors.city}</p>}
                  </div>

                  <div>
                    <label className='block text-white font-semibold mb-2 text-sm'>
                      State <span className='text-red-400'>*</span>
                    </label>
                    <input
                      type='text'
                      name='state'
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/20 border ${errors.state ? 'border-red-400' : 'border-white/30'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition backdrop-blur-sm`}
                      placeholder='State'
                    />
                    {errors.state && <p className='text-red-400 text-sm mt-1'>{errors.state}</p>}
                  </div>

                  <div>
                    <label className='block text-white font-semibold mb-2 text-sm'>
                      ZIP Code
                    </label>
                    <input
                      type='text'
                      name='zipCode'
                      value={formData.zipCode}
                      onChange={handleChange}
                      className='w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition backdrop-blur-sm'
                      placeholder='12345'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className='mb-8'>
              <h2 className='text-xl font-bold text-white mb-4 pb-2 border-b-2 border-green-400'>
                Account Security
              </h2>

              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-white font-semibold mb-2 text-sm'>
                    Password <span className='text-red-400'>*</span>
                  </label>
                  <input
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/20 border ${errors.password ? 'border-red-400' : 'border-white/30'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition backdrop-blur-sm`}
                    placeholder='Create a strong password'
                  />
                  {errors.password && <p className='text-red-400 text-sm mt-1'>{errors.password}</p>}
                </div>

                <div>
                  <label className='block text-white font-semibold mb-2 text-sm'>
                    Confirm Password <span className='text-red-400'>*</span>
                  </label>
                  <input
                    type='password'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/20 border ${errors.confirmPassword ? 'border-red-400' : 'border-white/30'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition backdrop-blur-sm`}
                    placeholder='Confirm your password'
                  />
                  {errors.confirmPassword && <p className='text-red-400 text-sm mt-1'>{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-xl font-bold hover:from-green-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105'
            >
              Complete Registration
            </button>
          </form>

          {/* Divider */}
          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-white/20'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 bg-white/10 text-gray-400'>Already registered?</span>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className='mt-6 text-center'>
            <Link
              to='/login'
              className='block w-full bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white py-3 rounded-xl font-bold hover:bg-white/20 transition-all'
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className='mt-6 text-center text-gray-400 text-sm'>
          <p>Your information is secure and encrypted • We respect your privacy</p>
        </div>
      </div>
    </div>
  )
}

export default Register
