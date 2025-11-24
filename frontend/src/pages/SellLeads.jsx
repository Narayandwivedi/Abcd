import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import CityDropdown from '../component/CityDropdown'

const SellLeads = () => {
  const navigate = useNavigate()
  const [approvedSellLeads, setApprovedSellLeads] = useState([])
  const [filteredSellLeads, setFilteredSellLeads] = useState([])
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

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
    fetchApprovedSellLeads()
  }, [])

  // Filter leads when city or category filter changes
  useEffect(() => {
    let filtered = [...approvedSellLeads]

    if (selectedCategory) {
      filtered = filtered.filter(lead => {
        // Check if lead has a category field, otherwise match against product/service name
        return lead.category === selectedCategory ||
               lead.majorCategory === selectedCategory ||
               (lead.productServiceOffered && lead.productServiceOffered.toLowerCase().includes(selectedCategory.toLowerCase()))
      })
    }

    if (selectedCity) {
      // Extract district name (part after hyphen)
      const districtMatch = selectedCity.match(/-(.+)$/i)
      const districtName = districtMatch ? districtMatch[1] : null

      filtered = filtered.filter(lead => {
        if (!lead.vendorLocation) return false

        const leadCity = lead.vendorLocation.toUpperCase()
        const filterCity = selectedCity.toUpperCase()

        // Exact match
        if (leadCity === filterCity) return true

        // If district exists, match any city ending with "-[district]"
        if (districtName) {
          const districtPattern = new RegExp(`-${districtName}$`, 'i')
          return districtPattern.test(lead.vendorLocation)
        }

        return false
      })

      // Sort: exact matches first, then district matches
      filtered.sort((a, b) => {
        const aExact = a.vendorLocation && a.vendorLocation.toUpperCase() === selectedCity.toUpperCase()
        const bExact = b.vendorLocation && b.vendorLocation.toUpperCase() === selectedCity.toUpperCase()

        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1
        return 0
      })
    }

    setFilteredSellLeads(filtered)
  }, [approvedSellLeads, selectedCategory, selectedCity])

  const fetchApprovedSellLeads = async () => {
    try {
      setLoadingLeads(true)
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'
      const response = await fetch(`${BACKEND_URL}/api/sell-lead/approved`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        setApprovedSellLeads(data.data)
        setFilteredSellLeads(data.data)
      }
    } catch (error) {
      console.error('Error fetching approved sell leads:', error)
      toast.error('Failed to load sell leads')
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
    const mrp = parseInt(lead.mrpListPrice.replace(/[^0-9]/g, ''))
    const offerPrice = parseInt(lead.specialOfferPrice.replace(/[^0-9]/g, ''))
    const savings = mrp - offerPrice

    const shareText = `Sell Offer #${index + 1}

Vendor: ${lead.vendorName}
Location: ${lead.vendorLocation}
Product: ${lead.productServiceOffered}
Brand: ${lead.brand}${lead.modelDetail ? `\nModel: ${lead.modelDetail}` : ''}

💰 Pricing:
MRP: ${lead.mrpListPrice}
Special Offer: ${lead.specialOfferPrice}
${savings > 0 ? `You Save: ₹${savings}` : 'Best Price Available'}

Stock: ${lead.stockQtyAvailable}
Valid Till: ${lead.validity}

Contact: ${lead.mobileNo}

Posted on: ${formatDate(lead.createdAt)}

View more offers at: ${window.location.origin}/sell-leads`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Sell Offer - ${lead.productServiceOffered}`,
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
        toast.success('Offer details copied to clipboard!')
      } catch (error) {
        console.error('Error copying to clipboard:', error)
        toast.error('Failed to copy to clipboard')
      }
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50'>
      {/* Header */}
      <div className='bg-white shadow-md sticky top-0 z-40 border-b border-orange-200'>
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
              <h1 className='text-2xl md:text-3xl font-bold text-orange-800 flex items-center gap-2'>
                <svg className='w-7 h-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                Sell Offers
              </h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className='hidden md:flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-2 rounded-lg font-bold hover:from-orange-700 hover:to-orange-800 transition shadow-md'
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
      <div className='bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-200'>
        <div className='container mx-auto px-4 py-3 md:py-4'>
          <div className='w-full md:w-[90%] mx-auto'>
            <div className='flex flex-row gap-2 md:gap-3 items-end'>
              {/* Category Filter */}
              <div className='flex-1'>
                <label className='block text-[10px] md:text-xs font-semibold text-orange-700 mb-1 md:mb-1.5'>Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className='w-full px-2 md:px-3 py-2 md:py-2.5 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xs md:text-sm bg-white'
                >
                  <option value=''>All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div className='flex-1'>
                <label className='block text-[10px] md:text-xs font-semibold text-orange-700 mb-1 md:mb-1.5'>City</label>
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
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4'></div>
                <p className='text-gray-600'>Loading sell offers...</p>
              </div>
            </div>
          ) : filteredSellLeads.length === 0 ? (
            <div className='flex items-center justify-center h-96 bg-white rounded-2xl shadow-lg'>
              <div className='text-center'>
                <svg className='w-16 h-16 text-gray-400 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
                </svg>
                <p className='text-gray-600 font-medium'>
                  {approvedSellLeads.length === 0 ? 'No sell offers available yet' : 'No sell offers match your filters'}
                </p>
                <p className='text-gray-500 text-sm mt-2'>
                  {approvedSellLeads.length === 0 ? 'Check back later for new seller offers' : 'Try adjusting your filters to see more results'}
                </p>
              </div>
            </div>
          ) : (
            <>
              <p className='text-sm md:text-base text-gray-600 mb-3 md:mb-4'>
                Showing {filteredSellLeads.length} of {approvedSellLeads.length} approved seller offer{approvedSellLeads.length !== 1 ? 's' : ''}
              </p>
              <div className='space-y-3 md:space-y-2.5'>
                {filteredSellLeads.map((lead, index) => (
                  <div
                    key={lead._id}
                    className='bg-gradient-to-br from-white to-orange-50 p-3 md:p-3 rounded-xl border-2 border-orange-200 hover:border-orange-400 shadow-md hover:shadow-lg transition-all'
                  >
                    {/* Header with Call and Share Buttons */}
                    <div className='flex items-center justify-between mb-2 md:mb-2 pb-2 border-b border-orange-100'>
                      <div className='flex items-center gap-2'>
                        <div className='bg-gradient-to-br from-orange-500 to-red-600 text-white w-9 h-9 rounded-lg flex items-center justify-center font-bold shadow-md'>
                          #{index + 1}
                        </div>
                        <div>
                          <p className='text-xs text-orange-600 font-semibold'>SELL OFFER</p>
                          <p className='text-[10px] text-gray-500'>Posted by seller</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => handleShare(lead, index)}
                          className='flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-md active:shadow-sm active:scale-95 transition-all'
                          title='Share this offer'
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
                      <div className='mb-2 bg-orange-50 px-2 py-1 md:py-1.5 rounded-lg border border-orange-200'>
                        <div className='flex items-center gap-1.5'>
                          <svg className='w-3.5 h-3.5 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                          </svg>
                          <span className='text-[10px] font-bold text-orange-600 uppercase'>Posted on:</span>
                          <span className='text-xs font-semibold text-gray-700'>{formatDate(lead.createdAt)}</span>
                        </div>
                      </div>
                    )}

                    {/* Structured Details Grid */}
                    <div className='space-y-1.5'>
                      {/* Grid Layout for Basic Info - 2 columns on mobile, 3 on desktop */}
                      <div className='grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1'>
                        {/* Vendor Name */}
                        <div className='flex items-center gap-1.5'>
                          <span className='text-[10px] font-bold text-gray-500 uppercase'>Vendor:</span>
                          <span className='text-xs md:text-sm font-bold text-gray-900 truncate'>{lead.vendorName}</span>
                        </div>

                        {/* Vendor Location */}
                        <div className='flex items-center gap-1.5'>
                          <span className='text-[10px] font-bold text-gray-500 uppercase'>Location:</span>
                          <span className='text-xs md:text-sm font-semibold text-orange-700 truncate'>{lead.vendorLocation}</span>
                        </div>

                        {/* Mobile */}
                        <div className='flex items-center gap-1.5 col-span-2 md:col-span-1'>
                          <span className='text-[10px] font-bold text-gray-500 uppercase'>Mobile:</span>
                          <a href={`tel:${lead.mobileNo}`} className='text-xs md:text-sm font-bold text-blue-600'>{lead.mobileNo}</a>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className='border-t border-orange-100 my-1'></div>

                      {/* Grid Layout for Product Info - 2 columns on mobile, 3 on desktop */}
                      <div className='grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1'>
                        {/* Product/Service */}
                        <div className='flex items-center gap-1.5 col-span-2'>
                          <span className='text-[10px] font-bold text-gray-500 uppercase'>Product:</span>
                          <span className='text-xs md:text-sm font-bold text-gray-900 truncate'>{lead.productServiceOffered}</span>
                        </div>

                        {/* Brand */}
                        <div className='flex items-center gap-1.5'>
                          <span className='text-[10px] font-bold text-gray-500 uppercase'>Brand:</span>
                          <span className='text-xs md:text-sm font-semibold text-purple-700 truncate'>🏷️ {lead.brand}</span>
                        </div>

                        {/* Model */}
                        {lead.modelDetail && (
                          <div className='flex items-center gap-1.5 col-span-2 md:col-span-3'>
                            <span className='text-[10px] font-bold text-gray-500 uppercase'>Model:</span>
                            <span className='text-xs md:text-sm font-semibold text-purple-600 truncate'>{lead.modelDetail}</span>
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div className='border-t border-orange-100 my-1'></div>

                      {/* Pricing and Stock/Validity in Grid - Desktop: 2 columns */}
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                        {/* Pricing Box */}
                        <div className='bg-gradient-to-r from-red-50 via-amber-50 to-green-50 p-2 rounded-lg border-2 border-orange-200'>
                          <div className='flex items-center justify-between mb-1'>
                            <div>
                              <p className='text-[10px] font-bold text-gray-500 uppercase'>MRP</p>
                              <p className='text-xs md:text-sm font-bold text-red-600 line-through'>{lead.mrpListPrice}</p>
                            </div>
                            <div className='text-right'>
                              <p className='text-[10px] font-bold text-gray-500 uppercase'>Offer</p>
                              <p className='text-sm md:text-base font-bold text-green-600'>{lead.specialOfferPrice}</p>
                            </div>
                          </div>
                          <div className='pt-1 border-t border-orange-200 flex items-center justify-between'>
                            <span className='text-[10px] text-gray-600 font-semibold'>💰 You Save</span>
                            <span className='text-xs md:text-sm font-bold text-green-600'>
                              {parseInt(lead.mrpListPrice.replace(/[^0-9]/g, '')) - parseInt(lead.specialOfferPrice.replace(/[^0-9]/g, '')) > 0
                                ? '₹' + (parseInt(lead.mrpListPrice.replace(/[^0-9]/g, '')) - parseInt(lead.specialOfferPrice.replace(/[^0-9]/g, '')))
                                : 'Best Price'}
                            </span>
                          </div>
                        </div>

                        {/* Stock & Validity */}
                        <div className='grid grid-cols-2 gap-2'>
                          <div className='bg-blue-50 p-2 rounded-lg border border-blue-200'>
                            <p className='text-[10px] font-bold text-blue-600 uppercase mb-0.5'>Stock</p>
                            <p className='text-xs md:text-sm font-bold text-gray-900 line-clamp-1'>{lead.stockQtyAvailable}</p>
                          </div>
                          <div className='bg-yellow-50 p-2 rounded-lg border border-yellow-200'>
                            <p className='text-[10px] font-bold text-yellow-600 uppercase mb-0.5'>Valid Till</p>
                            <p className='text-[10px] md:text-xs font-bold text-gray-900 line-clamp-2'>{lead.validity}</p>
                          </div>
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

export default SellLeads
