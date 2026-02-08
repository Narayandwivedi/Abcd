import React from 'react'
import CityDropdown from '../../../component/CityDropdown'
import { toast } from 'react-toastify'

const BuyLeadModal = ({
  showBuyForm,
  setShowBuyForm,
  buyLeadData,
  setBuyLeadData,
  categories
}) => {
  const handleBuyLeadSubmit = async (e) => {
    e.preventDefault()
    if (!buyLeadData.name || !buyLeadData.mobileNo || !buyLeadData.townCity || !buyLeadData.itemRequired ||
        !buyLeadData.majorCategory || !buyLeadData.qualityQuantityDesc ||
        !buyLeadData.priceRange || !buyLeadData.deliveryAddress) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'
      const response = await fetch(`${BACKEND_URL}/api/buy-lead/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buyLeadData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Buy lead submitted successfully! It will be visible after admin approval.')
        setShowBuyForm(false)
        setBuyLeadData({
          name: '',
          mobileNo: '',
          townCity: '',
          itemRequired: '',
          majorCategory: '',
          minorCategory: '',
          qualityQuantityDesc: '',
          priceRange: '',
          deliveryAddress: ''
        })
      } else {
        toast.error(data.message || 'Failed to submit buy lead')
      }
    } catch (error) {
      console.error('Error submitting buy lead:', error)
      toast.error('Failed to submit buy lead. Please try again.')
    }
  }

  if (!showBuyForm) return null

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-2 md:p-4'>
      <div className='bg-white rounded-xl md:rounded-2xl max-w-2xl w-full shadow-2xl max-h-[95vh] md:max-h-[90vh] flex flex-col'>
        {/* Fixed Header */}
        <div className='flex items-center justify-between p-4 md:p-6 border-b border-gray-200 flex-shrink-0'>
          <h2 className='text-lg md:text-2xl font-bold text-gray-800'>Post Your Buy Lead</h2>
          <button
            onClick={() => setShowBuyForm(false)}
            className='text-gray-500 hover:text-gray-700 transition'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className='overflow-y-auto flex-1 p-4 md:p-6'>
          <form onSubmit={handleBuyLeadSubmit} className='space-y-2 md:space-y-4'>
            {/* Name */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Your Name *</label>
              <input
                type='text'
                value={buyLeadData.name}
                onChange={(e) => setBuyLeadData({ ...buyLeadData, name: e.target.value })}
                className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                placeholder='Enter your name'
                required
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Mobile Number *</label>
              <input
                type='tel'
                value={buyLeadData.mobileNo}
                onChange={(e) => setBuyLeadData({ ...buyLeadData, mobileNo: e.target.value })}
                className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                placeholder='Enter your mobile number'
                pattern='[0-9]{10}'
                maxLength='10'
                required
              />
            </div>

            {/* Town/City */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Town/City *</label>
              <CityDropdown
                value={buyLeadData.townCity}
                onChange={(city) => setBuyLeadData({ ...buyLeadData, townCity: city })}
                placeholder='Select your city'
                required={true}
                darkMode={false}
                className='border-2 border-gray-300 rounded-lg md:rounded-xl h-[42px] md:h-[50px]'
              />
            </div>

            {/* Item Required */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Item Required *</label>
              <input
                type='text'
                value={buyLeadData.itemRequired}
                onChange={(e) => setBuyLeadData({ ...buyLeadData, itemRequired: e.target.value })}
                className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                placeholder='What do you want to buy?'
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Category *</label>
              <select
                value={buyLeadData.majorCategory}
                onChange={(e) => setBuyLeadData({ ...buyLeadData, majorCategory: e.target.value })}
                className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                required
              >
                <option value=''>Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Quality & Quantity Description */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Quality & Quantity Description *</label>
              <textarea
                value={buyLeadData.qualityQuantityDesc}
                onChange={(e) => setBuyLeadData({ ...buyLeadData, qualityQuantityDesc: e.target.value })}
                className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                placeholder='Describe the quality and quantity you need'
                rows='2'
                required
              />
            </div>

            {/* Price Range */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Price Range *</label>
              <input
                type='text'
                value={buyLeadData.priceRange}
                onChange={(e) => setBuyLeadData({ ...buyLeadData, priceRange: e.target.value })}
                className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                placeholder='e.g., ₹1000 - ₹5000'
                required
              />
            </div>

            {/* Delivery Address */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Delivery Address *</label>
              <textarea
                value={buyLeadData.deliveryAddress}
                onChange={(e) => setBuyLeadData({ ...buyLeadData, deliveryAddress: e.target.value })}
                className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                placeholder='Enter complete delivery address'
                rows='2'
                required
              />
            </div>

            <button
              type='submit'
              className='w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition shadow-lg text-sm md:text-base'
            >
              Submit Buy Lead
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BuyLeadModal
