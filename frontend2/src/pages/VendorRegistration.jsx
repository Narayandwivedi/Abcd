import { useState } from 'react'
import { Link } from 'react-router-dom'

const VendorRegistration = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    businessType: '',
    gstNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    description: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Vendor Registration:', formData)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-10'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl mb-4 shadow-lg transform hover:rotate-12 transition-transform'>
            <span className='text-4xl'>🏪</span>
          </div>
          <h1 className='text-5xl font-black bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 bg-clip-text text-transparent mb-3'>
            Become a Vendor
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Join ABCD marketplace and grow your business with thousands of potential customers
          </p>
        </div>

        {/* Registration Form Card */}
        <div className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-emerald-100'>
          <form onSubmit={handleSubmit} className='space-y-8'>
            {/* Business Information Section */}
            <div className='bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200'>
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
                    className='w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-white'
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
                    className='w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-white'
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
                    className='w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-white'
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
                    className='w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-white'
                    placeholder='Enter GST number (optional)'
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className='bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200'>
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
                    className='w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-white'
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
                    className='w-full px-4 py-3 border-2 border-teal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-white'
                    placeholder='+91 1234567890'
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className='bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200'>
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
                    className='w-full px-4 py-3 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition bg-white'
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
                      className='w-full px-4 py-3 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition bg-white'
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
                      className='w-full px-4 py-3 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition bg-white'
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
                      className='w-full px-4 py-3 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition bg-white'
                      placeholder='Pincode'
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Description */}
            <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200'>
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
                  className='w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white'
                  placeholder='Tell us about your business, products, and services...'
                  required
                ></textarea>
              </div>
            </div>

            {/* Account Security */}
            <div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200'>
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
                    className='w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white'
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
                    className='w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white'
                    placeholder='Re-enter your password'
                    required
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className='bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-6 border-2 border-emerald-300'>
              <label className='flex items-start gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  className='mt-1 w-5 h-5 rounded border-emerald-400 text-emerald-600 focus:ring-2 focus:ring-emerald-500'
                  required
                />
                <span className='text-gray-700 text-sm'>
                  I agree to the{' '}
                  <a href='#' className='text-emerald-700 font-bold hover:underline'>Terms and Conditions</a>
                  {' '}and{' '}
                  <a href='#' className='text-emerald-700 font-bold hover:underline'>Vendor Policy</a>.
                  I understand that my application will be reviewed before approval.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <button
                type='submit'
                className='flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-black text-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105'
              >
                Submit Application
              </button>
              <Link
                to='/login'
                className='flex-1 bg-gradient-to-r from-purple-200 to-pink-200 text-purple-900 py-4 rounded-xl font-black text-lg hover:from-purple-300 hover:to-pink-300 transition-all text-center shadow-md'
              >
                Already a vendor? Login
              </Link>
            </div>
          </form>

          {/* Additional Info */}
          <div className='mt-8 pt-8 border-t-2 border-gray-200'>
            <p className='text-center text-gray-600'>
              Have questions?{' '}
              <a href='#' className='text-emerald-600 font-bold hover:underline'>
                Contact our vendor support team
              </a>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className='mt-12 grid md:grid-cols-3 gap-6'>
          <div className='bg-white rounded-2xl p-6 shadow-lg text-center border-2 border-emerald-100 hover:border-emerald-300 transition-all transform hover:-translate-y-2'>
            <div className='text-4xl mb-3'>🚀</div>
            <h3 className='font-black text-lg mb-2 text-emerald-800'>Grow Your Business</h3>
            <p className='text-gray-600 text-sm'>Reach thousands of customers across India</p>
          </div>

          <div className='bg-white rounded-2xl p-6 shadow-lg text-center border-2 border-teal-100 hover:border-teal-300 transition-all transform hover:-translate-y-2'>
            <div className='text-4xl mb-3'>💰</div>
            <h3 className='font-black text-lg mb-2 text-teal-800'>Low Commission</h3>
            <p className='text-gray-600 text-sm'>Competitive rates to maximize your profits</p>
          </div>

          <div className='bg-white rounded-2xl p-6 shadow-lg text-center border-2 border-cyan-100 hover:border-cyan-300 transition-all transform hover:-translate-y-2'>
            <div className='text-4xl mb-3'>🛠️</div>
            <h3 className='font-black text-lg mb-2 text-cyan-800'>Easy Management</h3>
            <p className='text-gray-600 text-sm'>User-friendly dashboard to manage your store</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorRegistration
