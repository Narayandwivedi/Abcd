import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import CityDropdown from '../component/CityDropdown'

const BuyLeads = () => {
  const navigate = useNavigate()
  const [approvedBuyLeads, setApprovedBuyLeads] = useState([])
  const [filteredBuyLeads, setFilteredBuyLeads] = useState([])
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  // Categories list
  const categories = [
    'Advocates', 'Automobiles', 'Beauty parlour', 'Books n stationery', 'Catering',
    'CCTV', 'Chartered accountants', 'Clothing', 'Digital marketing', 'Doctors',
    'Education n training', 'Electrical', 'Electronics', 'Engineers', 'Fruits n Veg',
    'Furniture', 'Grocery', 'Hardware', 'Home appliances', 'Home service',
    'Hospital', 'Hotel', 'Interior decorators', 'Logistics n courier', 'Marble and tiles',
    'Medicine', 'Pathology', 'Properties', 'Restaurent', 'Sports',
    'Telecommunication', 'Tour n Travels', 'Tuition and coaching', 'Web solutions'
  ]

  useEffect(() => {
    fetchApprovedBuyLeads()
  }, [])

  // Filter leads when filters change
  useEffect(() => {
    let filtered = [...approvedBuyLeads]

    if (selectedCategory) {
      filtered = filtered.filter(lead => lead.majorCategory === selectedCategory)
    }

    if (selectedCity) {
      // Extract district name (part after hyphen)
      const districtMatch = selectedCity.match(/-(.+)$/i)
      const districtName = districtMatch ? districtMatch[1] : null

      filtered = filtered.filter(lead => {
        if (!lead.townCity) return false

        const leadCity = lead.townCity.toUpperCase()
        const filterCity = selectedCity.toUpperCase()

        // Exact match
        if (leadCity === filterCity) return true

        // If district exists, match any city ending with "-[district]"
        if (districtName) {
          const districtPattern = new RegExp(`-${districtName}$`, 'i')
          return districtPattern.test(lead.townCity)
        }

        return false
      })

      // Sort: exact matches first, then district matches
      filtered.sort((a, b) => {
        const aExact = a.townCity && a.townCity.toUpperCase() === selectedCity.toUpperCase()
        const bExact = b.townCity && b.townCity.toUpperCase() === selectedCity.toUpperCase()

        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1
        return 0
      })
    }

    setFilteredBuyLeads(filtered)
  }, [approvedBuyLeads, selectedCategory, selectedCity])

  const fetchApprovedBuyLeads = async () => {
    try {
      setLoadingLeads(true)
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'
      const response = await fetch(`${BACKEND_URL}/api/buy-lead/approved`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        setApprovedBuyLeads(data.data)
        setFilteredBuyLeads(data.data)
      }
    } catch (error) {
      console.error('Error fetching approved buy leads:', error)
      toast.error('Failed to load buy leads')
    } finally {
      setLoadingLeads(false)
    }
  }

  const handleClearFilters = () => {
    setSelectedCategory('')
    setSelectedCity('')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)

    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes
    const timeString = `${displayHours}:${displayMinutes} ${ampm}`

    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const year = date.getFullYear()

    return `${day} ${month} ${year} at ${timeString}`
  }

  const handleShare = async (lead, index) => {
    const shareText = `Buy Lead #${index + 1}

Buyer: ${lead.name}
City: ${lead.townCity}
Product Required: ${lead.itemRequired}
Category: ${lead.majorCategory} - ${lead.minorCategory}
Budget: ${lead.priceRange}
Requirements: ${lead.qualityQuantityDesc}
Delivery Address: ${lead.deliveryAddress}

Contact: ${lead.mobileNo}

Posted on: ${formatDate(lead.createdAt)}

View more leads at: ${window.location.origin}/buy-leads`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Buy Lead - ${lead.itemRequired}`,
          text: shareText,
        })
        toast.success('Shared successfully!')
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error)
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText)
        toast.success('Lead details copied to clipboard!')
      } catch (error) {
        console.error('Error copying to clipboard:', error)
        toast.error('Failed to copy to clipboard')
      }
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50'>
      {/* Header */}
      <div className='bg-white shadow-md sticky top-0 z-40 border-b border-indigo-200'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between max-w-6xl mx-auto'>
            <div className='flex items-center gap-3'>
              <button
                onClick={() => navigate(-1)}
                className='text-gray-500 hover:text-gray-700 transition bg-gray-100 rounded-full p-2 hover:bg-gray-200'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
              </button>
              <h1 className='text-2xl md:text-3xl font-bold text-indigo-800 flex items-center gap-2'>
                <svg className='w-7 h-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
                </svg>
                Buy Offers
              </h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className='hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2 rounded-lg font-bold hover:from-indigo-700 hover:to-indigo-800 transition shadow-md'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
              </svg>
              Home
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className='bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-200'>
        <div className='container mx-auto px-4 py-3 md:py-4'>
          <div className='w-full md:w-[90%] mx-auto'>
            <div className='flex flex-row gap-2 md:gap-3 items-end'>
              {/* Category Filter */}
              <div className='flex-1'>
                <label className='block text-[10px] md:text-xs font-semibold text-indigo-700 mb-1 md:mb-1.5'>Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className='w-full px-2 md:px-3 py-2 md:py-2.5 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs md:text-sm bg-white'
                >
                  <option value=''>All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div className='flex-1'>
                <label className='block text-[10px] md:text-xs font-semibold text-indigo-700 mb-1 md:mb-1.5'>City</label>
                <CityDropdown
                  value={selectedCity}
                  onChange={setSelectedCity}
                  placeholder='All Cities'
                  darkMode={false}
                />
              </div>

              {/* Clear Filters Button */}
              {(selectedCategory || selectedCity) && (
                <div className='flex items-end'>
                  <button
                    onClick={handleClearFilters}
                    className='px-3 md:px-4 py-2 md:py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all shadow-md text-xs md:text-sm flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap'
                    title='Clear Filters'
                  >
                    <svg className='w-3 h-3 md:w-4 md:h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                    <span className='hidden md:inline'>Clear</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='container mx-auto px-4 py-4 md:py-6'>
        <div className='w-full md:w-[90%] mx-auto'>
          {loadingLeads ? (
            <div className='flex items-center justify-center h-96'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4'></div>
                <p className='text-gray-600'>Loading buy offers...</p>
              </div>
            </div>
          ) : filteredBuyLeads.length === 0 ? (
            <div className='flex items-center justify-center h-96 bg-white rounded-2xl shadow-lg'>
              <div className='text-center'>
                <svg className='w-16 h-16 text-gray-400 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
                </svg>
                <p className='text-gray-600 font-medium'>
                  {approvedBuyLeads.length === 0 ? 'No buy offers available yet' : 'No buy offers match your filters'}
                </p>
                <p className='text-gray-500 text-sm mt-2'>
                  {approvedBuyLeads.length === 0 ? 'Check back later for new buyer requirements' : 'Try adjusting your filters to see more results'}
                </p>
              </div>
            </div>
          ) : (
            <>
              <p className='text-sm md:text-base text-gray-600 mb-3 md:mb-4'>
                Showing {filteredBuyLeads.length} of {approvedBuyLeads.length} approved buyer requirement{approvedBuyLeads.length !== 1 ? 's' : ''}
              </p>
              <div className='space-y-3 md:space-y-2.5'>
                {filteredBuyLeads.map((lead, index) => (
                  <div
                    key={lead._id}
                    className='bg-gradient-to-br from-white to-indigo-50 p-3 md:p-3 rounded-xl border-2 border-indigo-200 hover:border-indigo-400 shadow-md hover:shadow-lg transition-all'
                  >
                    {/* Header with Call and Share Buttons */}
                    <div className='flex items-center justify-between mb-2 md:mb-2 pb-2 border-b border-indigo-100'>
                      <div className='flex items-center gap-2'>
                        <div className='bg-gradient-to-br from-indigo-500 to-blue-600 text-white w-9 h-9 rounded-lg flex items-center justify-center font-bold shadow-md'>
                          #{index + 1}
                        </div>
                        <div>
                          <p className='text-xs text-indigo-600 font-semibold'>BUY REQUEST</p>
                          <p className='text-[10px] text-gray-500'>Posted by buyer</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => handleShare(lead, index)}
                          className='flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-md active:shadow-sm active:scale-95 transition-all'
                          title='Share this lead'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' />
                          </svg>
                          <span>SHARE</span>
                        </button>
                        <a
                          href={`tel:${lead.mobileNo}`}
                          className='flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-md active:shadow-sm active:scale-95 transition-all'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                          </svg>
                          <span>CALL</span>
                        </a>
                      </div>
                    </div>

                    {/* Posted On */}
                    {lead.createdAt && (
                      <div className='mb-2 bg-indigo-50 px-2 py-1 md:py-1.5 rounded-lg border border-indigo-200'>
                        <div className='flex items-center gap-1.5'>
                          <svg className='w-3.5 h-3.5 text-indigo-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                          </svg>
                          <span className='text-[10px] font-bold text-indigo-600 uppercase'>Posted on:</span>
                          <span className='text-xs font-semibold text-gray-700'>{formatDate(lead.createdAt)}</span>
                        </div>
                      </div>
                    )}

                    {/* Structured Details Grid */}
                    <div className='space-y-1.5'>
                      {/* Grid Layout for Basic Info - 2 columns on mobile, 3 on desktop */}
                      <div className='grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1'>
                        {/* Buyer Name */}
                        <div className='flex items-center gap-1.5'>
                          <span className='text-[10px] font-bold text-gray-500 uppercase'>Name:</span>
                          <span className='text-xs md:text-sm font-bold text-gray-900 truncate'>{lead.name}</span>
                        </div>

                        {/* Buyer City */}
                        <div className='flex items-center gap-1.5'>
                          <span className='text-[10px] font-bold text-gray-500 uppercase'>City:</span>
                          <span className='text-xs md:text-sm font-semibold text-indigo-700 truncate'>{lead.townCity}</span>
                        </div>

                        {/* Mobile */}
                        <div className='flex items-center gap-1.5 col-span-2 md:col-span-1'>
                          <span className='text-[10px] font-bold text-gray-500 uppercase'>Mobile:</span>
                          <a href={`tel:${lead.mobileNo}`} className='text-xs md:text-sm font-bold text-blue-600'>{lead.mobileNo}</a>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className='border-t border-indigo-100 my-1'></div>

                      {/* Grid Layout for Product Info - 2 columns on mobile, 4 on desktop */}
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-1'>
                        {/* Product Required */}
                        <div className='flex items-center gap-1.5 col-span-2'>
                          <span className='text-[10px] font-bold text-gray-500 uppercase'>Product:</span>
                          <span className='text-xs md:text-sm font-bold text-gray-900 truncate'>{lead.itemRequired}</span>
                        </div>

                        {/* Category */}
                        <div className='flex items-center gap-1.5'>
                          <span className='text-[10px] font-bold text-gray-500 uppercase'>Category:</span>
                          <span className='text-xs md:text-sm font-semibold text-purple-700 truncate'>{lead.majorCategory}</span>
                        </div>

                        {/* Sub Category */}
                        <div className='flex items-center gap-1.5'>
                          <span className='text-[10px] font-bold text-gray-500 uppercase'>Sub:</span>
                          <span className='text-xs md:text-sm font-semibold text-purple-600 truncate'>{lead.minorCategory}</span>
                        </div>

                        {/* Expected Price */}
                        {lead.priceRange && (
                          <div className='flex items-center gap-1.5 col-span-2 md:col-span-4'>
                            <span className='text-[10px] font-bold text-gray-500 uppercase'>Budget:</span>
                            <span className='text-xs md:text-sm font-bold text-green-600'>💰 {lead.priceRange}</span>
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div className='border-t border-indigo-100 my-1'></div>

                      {/* Requirements and Address in Grid - 1 column mobile, 2 columns desktop */}
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                        {/* Requirements */}
                        <div className='bg-blue-50 p-2 rounded-lg'>
                          <p className='text-[10px] font-bold text-blue-600 uppercase mb-0.5'>Requirements</p>
                          <p className='text-xs md:text-sm text-gray-700 leading-tight line-clamp-2'>{lead.qualityQuantityDesc}</p>
                        </div>

                        {/* Delivery Address */}
                        <div className='bg-orange-50 p-2 rounded-lg'>
                          <p className='text-[10px] font-bold text-orange-600 uppercase mb-0.5'>Delivery Address</p>
                          <p className='text-xs md:text-sm text-gray-700 leading-tight line-clamp-2'>{lead.deliveryAddress}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BuyLeads
