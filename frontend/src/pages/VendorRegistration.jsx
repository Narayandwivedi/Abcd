import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const VendorRegistration = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    businessType: '',
    gstNumber: '',
    address: '',
    city: '',
    state: 'Chhattisgarh',
    pincode: '',
    description: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (formData.gstNumber && formData.gstNumber.length !== 15) {
      setError('GST number must be 15 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/vendor-auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          businessName: formData.businessName,
          ownerName: formData.ownerName,
          email: formData.email,
          mobile: parseInt(formData.phone),
          password: formData.password,
          gstNumber: formData.gstNumber,
          businessCategory: formData.businessType,
          businessAddress: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert('Vendor registration successful! You can now login.')
        navigate('/vendor-login')
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

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-10'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl mb-4 shadow-lg'>
            <span className='text-4xl'>🏪</span>
          </div>
          <h1 className='text-5xl font-black bg-gradient-to-r from-green-700 via-teal-700 to-blue-700 bg-clip-text text-transparent mb-3'>
            Become a Vendor
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Join ABCD marketplace and grow your business with thousands of potential customers
          </p>
        </div>

        {/* Registration Form Card */}
        <div className='bg-white rounded-3xl shadow-2xl p-8 md:p-12'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Business Information Section */}
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                <span className='text-2xl'>🏢</span>
                Business Information
              </h2>

              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>Business Name *</label>
                  <input
                    type='text'
                    name='businessName'
                    value={formData.businessName}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition'
                    placeholder='Enter business name'
                    required
                  />
                </div>

                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>Owner Name *</label>
                  <input
                    type='text'
                    name='ownerName'
                    value={formData.ownerName}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition'
                    placeholder='Enter your full name'
                    required
                  />
                </div>

                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>Business Type *</label>
                  <select
                    name='businessType'
                    value={formData.businessType}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition'
                    required
                  >
                    <option value=''>Select business type</option>
                    <option value='retail'>Retail</option>
                    <option value='wholesale'>Wholesale</option>
                    <option value='manufacturer'>Manufacturer</option>
                    <option value='service'>Service Provider</option>
                    <option value='other'>Other</option>
                  </select>
                </div>

                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>GST Number</label>
                  <input
                    type='text'
                    name='gstNumber'
                    value={formData.gstNumber}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition'
                    placeholder='Enter GST number (optional)'
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                <span className='text-2xl'>📞</span>
                Contact Information
              </h2>

              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>Email Address *</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition'
                    placeholder='your@email.com'
                    required
                  />
                </div>

                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>Phone Number *</label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition'
                    placeholder='+91 1234567890'
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                <span className='text-2xl'>📍</span>
                Business Address
              </h2>

              <div className='space-y-4'>
                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>Street Address *</label>
                  <input
                    type='text'
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition'
                    placeholder='Enter street address'
                    required
                  />
                </div>

                <div className='grid md:grid-cols-3 gap-4'>
                  <div>
                    <label className='block text-gray-700 font-semibold mb-2'>City *</label>
                    <input
                      type='text'
                      name='city'
                      value={formData.city}
                      onChange={handleChange}
                      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition'
                      placeholder='City'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-gray-700 font-semibold mb-2'>State *</label>
                    <input
                      type='text'
                      name='state'
                      value={formData.state}
                      onChange={handleChange}
                      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition'
                      placeholder='State'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-gray-700 font-semibold mb-2'>Pincode *</label>
                    <input
                      type='text'
                      name='pincode'
                      value={formData.pincode}
                      onChange={handleChange}
                      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition'
                      placeholder='Pincode'
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Description */}
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                <span className='text-2xl'>📝</span>
                About Your Business
              </h2>

              <div>
                <label className='block text-gray-700 font-semibold mb-2'>Business Description *</label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  rows='4'
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition'
                  placeholder='Tell us about your business, products, and services...'
                  required
                ></textarea>
              </div>
            </div>

            {/* Account Security */}
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                <span className='text-2xl'>🔒</span>
                Account Security
              </h2>

              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>Password *</label>
                  <input
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition'
                    placeholder='Create a strong password'
                    required
                  />
                </div>

                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>Confirm Password *</label>
                  <input
                    type='password'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition'
                    placeholder='Re-enter your password'
                    required
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className='bg-green-50 rounded-xl p-6 border border-green-200'>
              <label className='flex items-start gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  className='mt-1 w-5 h-5 rounded border-green-300 text-green-600 focus:ring-2 focus:ring-green-500'
                  required
                />
                <span className='text-gray-700 text-sm'>
                  I agree to the{' '}
                  <a href='#' className='text-green-700 font-semibold hover:underline'>Terms and Conditions</a>
                  {' '}and{' '}
                  <a href='#' className='text-green-700 font-semibold hover:underline'>Vendor Policy</a>.
                  I understand that my application will be reviewed before approval.
                </span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl'>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <button
                type='submit'
                disabled={loading}
                className='flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
              <Link
                to='/vendor-login'
                className='flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all text-center'
              >
                Already a vendor? Login
              </Link>
            </div>
          </form>

          {/* Additional Info */}
          <div className='mt-8 pt-8 border-t border-gray-200'>
            <p className='text-center text-gray-600'>
              Have questions?{' '}
              <a href='#' className='text-blue-600 font-semibold hover:underline'>
                Contact our vendor support team
              </a>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className='mt-12 grid md:grid-cols-3 gap-6'>
          <div className='bg-white rounded-2xl p-6 shadow-lg text-center'>
            <div className='text-4xl mb-3'>🚀</div>
            <h3 className='font-bold text-lg mb-2 text-gray-800'>Grow Your Business</h3>
            <p className='text-gray-600 text-sm'>Reach thousands of customers across India</p>
          </div>

          <div className='bg-white rounded-2xl p-6 shadow-lg text-center'>
            <div className='text-4xl mb-3'>💰</div>
            <h3 className='font-bold text-lg mb-2 text-gray-800'>Low Commission</h3>
            <p className='text-gray-600 text-sm'>Competitive rates to maximize your profits</p>
          </div>

          <div className='bg-white rounded-2xl p-6 shadow-lg text-center'>
            <div className='text-4xl mb-3'>🛠️</div>
            <h3 className='font-bold text-lg mb-2 text-gray-800'>Easy Management</h3>
            <p className='text-gray-600 text-sm'>User-friendly dashboard to manage your store</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorRegistration
