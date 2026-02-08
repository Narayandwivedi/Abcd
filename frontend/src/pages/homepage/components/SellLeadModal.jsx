import React from 'react'
import CityDropdown from '../../../component/CityDropdown'
import { toast } from 'react-toastify'

const SellLeadModal = ({
  showSellForm,
  setShowSellForm,
  sellLeadData,
  setSellLeadData
}) => {
  const handleSellLeadSubmit = async (e) => {
    e.preventDefault()
    if (!sellLeadData.vendorName || !sellLeadData.vendorLocation || !sellLeadData.productServiceOffered ||
        !sellLeadData.brand || !sellLeadData.mrpListPrice || !sellLeadData.specialOfferPrice ||
        !sellLeadData.stockQtyAvailable || !sellLeadData.validity || !sellLeadData.mobileNo) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'
      const response = await fetch(`${BACKEND_URL}/api/sell-lead/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sellLeadData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Sell lead submitted successfully! It will be visible after admin approval.')
        setShowSellForm(false)
        setSellLeadData({
          vendorName: '',
          vendorLocation: '',
          productServiceOffered: '',
          brand: '',
          modelDetail: '',
          mrpListPrice: '',
          specialOfferPrice: '',
          stockQtyAvailable: '',
          validity: '',
          mobileNo: ''
        })
      } else {
        toast.error(data.message || 'Failed to submit sell lead')
      }
    } catch (error) {
      console.error('Error submitting sell lead:', error)
      toast.error('Failed to submit sell lead. Please try again.')
    }
  }

  if (!showSellForm) return null

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-2 md:p-4'>
      <div className='bg-white rounded-xl md:rounded-2xl max-w-2xl w-full shadow-2xl max-h-[95vh] md:max-h-[90vh] flex flex-col'>
        {/* Fixed Header */}
        <div className='flex items-center justify-between p-4 md:p-6 border-b border-gray-200 flex-shrink-0'>
          <h2 className='text-lg md:text-2xl font-bold text-gray-800'>Post Your Sell Lead</h2>
          <button
            onClick={() => setShowSellForm(false)}
            className='text-gray-500 hover:text-gray-700 transition'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className='overflow-y-auto flex-1 p-4 md:p-6'>
          <form onSubmit={handleSellLeadSubmit} className='space-y-2 md:space-y-4'>
            {/* Vendor Name */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Vendor Name *</label>
              <input
                type='text'
                value={sellLeadData.vendorName}
                onChange={(e) => setSellLeadData({ ...sellLeadData, vendorName: e.target.value })}
                className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                placeholder='Enter vendor/business name'
                required
              />
            </div>

            {/* Vendor Location */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Vendor Location (Town/District) *</label>
              <CityDropdown
                value={sellLeadData.vendorLocation}
                onChange={(city) => setSellLeadData({ ...sellLeadData, vendorLocation: city })}
                placeholder='Select location'
                required={true}
                darkMode={false}
                className='border-2 border-gray-300 rounded-lg md:rounded-xl h-[42px] md:h-[50px]'
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Mobile Number *</label>
              <input
                type='tel'
                value={sellLeadData.mobileNo}
                onChange={(e) => setSellLeadData({ ...sellLeadData, mobileNo: e.target.value })}
                className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                placeholder='Enter mobile number'
                pattern='[0-9]{10}'
                maxLength='10'
                required
              />
            </div>

            {/* Product/Service Offered */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Product/Service Offered *</label>
              <input
                type='text'
                value={sellLeadData.productServiceOffered}
                onChange={(e) => setSellLeadData({ ...sellLeadData, productServiceOffered: e.target.value })}
                className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                placeholder='What are you selling?'
                required
              />
            </div>

            {/* Brand */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Brand *</label>
              <input
                type='text'
                value={sellLeadData.brand}
                onChange={(e) => setSellLeadData({ ...sellLeadData, brand: e.target.value })}
                className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                placeholder='Enter brand name'
                required
              />
            </div>

            {/* Model Detail (Optional) */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Model Detail</label>
              <input
                type='text'
                value={sellLeadData.modelDetail}
                onChange={(e) => setSellLeadData({ ...sellLeadData, modelDetail: e.target.value })}
                className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                placeholder='Enter model (optional)'
              />
            </div>

            {/* MRP/List Price */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>MRP/List Price (Unit) *</label>
              <input
                type='text'
                value={sellLeadData.mrpListPrice}
                onChange={(e) => setSellLeadData({ ...sellLeadData, mrpListPrice: e.target.value })}
                className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                placeholder='e.g., ₹5000'
                required
              />
            </div>

            {/* Special Offer Price */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Special Offer Price (Unit) *</label>
              <input
                type='text'
                value={sellLeadData.specialOfferPrice}
                onChange={(e) => setSellLeadData({ ...sellLeadData, specialOfferPrice: e.target.value })}
                className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                placeholder='e.g., ₹4000'
                required
              />
            </div>

            {/* Stock Quantity Available */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Stock Quantity Available *</label>
              <input
                type='text'
                value={sellLeadData.stockQtyAvailable}
                onChange={(e) => setSellLeadData({ ...sellLeadData, stockQtyAvailable: e.target.value })}
                className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                placeholder='e.g., 100 units'
                required
              />
            </div>

            {/* Validity */}
            <div>
              <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Validity *</label>
              <input
                type='text'
                value={sellLeadData.validity}
                onChange={(e) => setSellLeadData({ ...sellLeadData, validity: e.target.value })}
                className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                placeholder='e.g., Valid till 31st Dec 2024'
                required
              />
            </div>

            <button
              type='submit'
              className='w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition shadow-lg text-sm md:text-base'
            >
              Submit Sell Lead
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SellLeadModal
