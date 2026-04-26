import React from 'react'
import CityDropdown from '../../../component/CityDropdown'
import CategoryDropdown from '../../../component/CategoryDropdown'
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
          categoryId: '',
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
        <div className='flex items-center justify-between p-4 md:p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 flex-shrink-0 rounded-t-xl md:rounded-t-2xl'>
          <h2 className='text-lg md:text-2xl font-bold text-white drop-shadow-md'>Post Your Buy Lead</h2>
          <button
            onClick={() => setShowBuyForm(false)}
            className='text-white/80 hover:text-white transition-colors duration-200'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className='overflow-y-auto flex-1 p-4 md:p-6'>
          <form onSubmit={handleBuyLeadSubmit} className='space-y-2 md:space-y-3 lg:space-y-2'>
            <div className='grid grid-cols-[3fr_2fr] gap-3 md:gap-4'>
              {/* Name */}
              <div>
                <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Your Name *</label>
                <input
                  type='text'
                  value={buyLeadData.name}
                  onChange={(e) => setBuyLeadData({ ...buyLeadData, name: e.target.value })}
                  className='w-full px-3 py-2.5 md:px-3 md:py-2.5 lg:px-3 lg:py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-xs'
                  placeholder='Enter name'
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
                  className='w-full px-3 py-2.5 md:px-3 md:py-2.5 lg:px-3 lg:py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-xs'
                  placeholder='Enter mobile'
                  pattern='[0-9]{10}'
                  maxLength='10'
                  required
                />
              </div>
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
                className='border-2 border-gray-300 rounded-lg h-[42px] md:h-[44px] lg:h-[38px]'
              />
            </div>

            <div className='grid grid-cols-[3fr_2fr] gap-3 md:gap-4'>
              {/* Item Required */}
              <div>
                <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Item Required *</label>
                <input
                  type='text'
                  value={buyLeadData.itemRequired}
                  onChange={(e) => setBuyLeadData({ ...buyLeadData, itemRequired: e.target.value })}
                  className='w-full px-3 py-2.5 md:px-3 md:py-2.5 lg:px-3 lg:py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-xs'
                  placeholder='What do you want to buy?'
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Category *</label>
                <CategoryDropdown
                  value={buyLeadData.majorCategory}
                  onChange={(cat) => {
                    if (cat) {
                      setBuyLeadData({ ...buyLeadData, majorCategory: cat.name, categoryId: cat.id })
                    } else {
                      setBuyLeadData({ ...buyLeadData, majorCategory: '', categoryId: '' })
                    }
                  }}
                  categories={categories}
                  placeholder='Select Category'
                  required={true}
                  className='border-2 border-gray-300 rounded-lg h-[40px] md:h-[42px] lg:h-[36px]'
                />
              </div>
            </div>

            {/* Quality & Quantity Description */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Quality & Quantity Description *</label>
              <textarea
                value={buyLeadData.qualityQuantityDesc}
                onChange={(e) => setBuyLeadData({ ...buyLeadData, qualityQuantityDesc: e.target.value })}
                className='w-full px-3 py-2 md:px-3 md:py-2 lg:px-3 lg:py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-xs'
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
                className='w-full px-3 py-2 md:px-3 md:py-2 lg:px-3 lg:py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-xs'
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
                className='w-full px-3 py-2 md:px-3 md:py-2 lg:px-3 lg:py-1.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-xs'
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
