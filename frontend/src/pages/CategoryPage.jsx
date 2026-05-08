import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

const CategoryPage = () => {
  const { categorySlug } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [vendors, setVendors] = useState([])
  const [category, setCategory] = useState(null)
  const [offers, setOffers] = useState([])
  const [selectedOfferDetails, setSelectedOfferDetails] = useState(null)

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  const toSlug = (text) => {
    if (!text) return ''
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  }

  const getVendorUrl = (vendor) => {
    const state = toSlug(vendor.state)
    const district = toSlug(vendor.district || vendor.city)
    const city = toSlug(vendor.city)
    const slug = vendor.slug || toSlug(vendor.businessName)
    return `/${state}/${district}/${city}/${slug}`
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${BACKEND_URL}/api/categories/slug/${categorySlug}/vendors`)
        const data = await response.json()
        if (data.success) {
          setVendors(data.vendors)
          setCategory(data.category)
          setOffers(data.offers || [])
        }
      } catch (error) {
        console.error('Error fetching vendors:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [categorySlug, BACKEND_URL])

  const handleCall = (mobile) => {
    window.location.href = `tel:${mobile}`
  }

  const handleWhatsApp = (mobile, businessName) => {
    const message = encodeURIComponent(`Hello ${businessName}, I found your contact on ABCD Vyapar.`)
    window.open(`https://wa.me/91${mobile}?text=${message}`, '_blank')
  }

  return (
    <div className='min-h-screen bg-gray-50 pb-20 md:pb-8'>
      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white sticky top-0 z-40 transition-all duration-300 shadow-lg text-center'>
        <div className='container mx-auto px-4 py-3 md:py-6'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => navigate('/')}
              className='bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-300 hover:scale-110'
            >
              <svg className='w-5 h-5 md:w-6 md:h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>
            <div className='text-left'>
              <h1 className='text-xl md:text-3xl font-bold tracking-tight'>
                {category ? category.name : categorySlug?.charAt(0).toUpperCase() + categorySlug?.slice(1)}
              </h1>
              <p className='text-xs md:text-base text-blue-100 font-medium'>
                {loading ? 'Searching...' : `${vendors.length} Verified Vendors Available`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-6'>
        {loading ? (
          /* Loading Skeletons */
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className='bg-white rounded-2xl p-4 shadow-sm animate-pulse'>
                <div className='flex gap-4 mb-4'>
                  <div className='w-16 h-16 bg-gray-200 rounded-xl'></div>
                  <div className='flex-1'>
                    <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                    <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                  </div>
                </div>
                <div className='h-10 bg-gray-100 rounded-lg'></div>
              </div>
            ))}
          </div>
        ) : vendors.length > 0 ? (
          /* Vendor Grid */
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn'>
            {vendors.map((vendor) => {
              const vendorOffer = offers.find(o => o.vendorId === vendor._id);
              return (
                <div key={vendor._id} className='flex flex-col group'>
                  <Link
                    to={getVendorUrl(vendor)}
                    className='bg-white rounded-t-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 block z-10'
                  >
                    <div className='p-5'>
                      <div className='flex items-start gap-4'>
                        <div className='relative'>
                          <div className='w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center overflow-hidden border border-blue-50 group-hover:scale-105 transition-transform duration-500'>
                            {vendor.passportPhoto ? (
                              <img
                                src={`${BACKEND_URL}/${vendor.passportPhoto}`}
                                alt={vendor.businessName}
                                className='w-full h-full object-cover'
                              />
                            ) : (
                              <div className='text-2xl md:text-3xl font-bold text-blue-300'>
                                {vendor.businessName.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className='absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-white'>
                            <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 20 20'>
                              <path d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' />
                            </svg>
                          </div>
                        </div>

                        <div className='flex-1 overflow-hidden ml-1'>
                          <h3 className='text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate'>
                            {vendor.businessName}
                          </h3>
                          <p className='text-xs text-gray-600 font-medium mb-1 truncate'>{vendor.ownerName}</p>
                          <div className='flex items-center gap-1.5 text-xs text-gray-500 mb-0.5'>
                            <svg className='w-3.5 h-3.5 text-blue-500 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                            </svg>
                            <span className='truncate font-semibold text-gray-700'>
                              {[vendor.city, vendor.district, vendor.state].filter(Boolean).join(', ')}
                            </span>
                          </div>
                          {vendor.address && (
                            <p className='text-[10px] text-gray-500 line-clamp-2 leading-tight' title={vendor.address}>
                              {vendor.address}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className='mt-4 grid grid-cols-2 gap-3'>
                        <button
                          onClick={(e) => { e.preventDefault(); handleCall(vendor.mobile) }}
                          className='flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                          </svg>
                          Call
                        </button>
                        <button
                          onClick={(e) => { e.preventDefault(); handleWhatsApp(vendor.mobile, vendor.businessName) }}
                          className='flex items-center justify-center gap-2 bg-green-50 hover:bg-green-600 text-green-600 hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300'
                        >
                          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                            <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.001 20c-1.85 0-3.61-.477-5.138-1.325l-.369-.204-3.813.999 1.018-3.715-.224-.356C2.622 13.882 2 12.012 2 10 2 4.477 6.477 0 12 0s10 4.477 10 10-4.477 10-10 10z' />
                          </svg>
                          Chat
                        </button>
                      </div>

                      {/* Integrated Offer Strips (Indented) */}
                      {offers.filter(o => o.vendorId === vendor._id).length > 0 && (
                        <div className='mt-3 -mx-2 flex flex-col gap-1.5'>
                          {offers.filter(o => o.vendorId === vendor._id).map((vendorOffer, idx) => {
                            const palettes = [
                              'linear-gradient(to right, #4f46e5, #2563eb)', // Blue/Indigo
                              'linear-gradient(to right, #e11d48, #be123c)', // Rose/Crimson
                              'linear-gradient(to right, #059669, #047857)', // Emerald/Green
                              'linear-gradient(to right, #d97706, #b45309)', // Amber/Orange
                            ];
                            const palette = palettes[idx % palettes.length];

                            return (
                              <div
                                key={vendorOffer._id}
                                className='relative py-1.5 px-3 rounded-xl animate-fadeIn flex items-center justify-between gap-3 border border-white/10 shadow-sm'
                                style={{ background: palette }}
                              >
                                <div className='flex items-center gap-2 overflow-hidden text-left'>
                                  <div className='bg-white/20 p-1 rounded-md'>
                                    <svg className='w-2.5 h-2.5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' />
                                    </svg>
                                  </div>
                                  <span className='text-[9px] md:text-[10px] font-semibold text-white uppercase tracking-tight truncate'>
                                    {vendorOffer.title}
                                  </span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedOfferDetails(vendorOffer);
                                  }}
                                  className='flex-shrink-0 bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-lg text-[8px] font-bold border border-white/20 transition-colors whitespace-nowrap'
                                >
                                  DETAILS
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </Link>
                  {offers.filter(o => o.vendorId === vendor._id).length === 0 && <div className='h-4'></div>}
                </div>
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <div className='text-center py-20'>
            <div className='bg-white rounded-3xl shadow-xl p-12 max-w-sm mx-auto border border-gray-100 hover:shadow-2xl transition-shadow duration-500'>
              <div className='text-7xl mb-6'>🏭</div>
              <h2 className='text-2xl font-bold text-gray-800 mb-3'>Coming Soon!</h2>
              <p className='text-gray-500 leading-relaxed px-4'>
                We're currently onboarding top vendors in this category. Stay tuned!
              </p>
              <button
                onClick={() => navigate('/')}
                className='mt-8 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300'
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Offer Details Modal */}
        {selectedOfferDetails && (
          <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn'>
            <div className='bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp'>
              <div className='bg-gradient-to-r from-indigo-600 to-blue-700 p-5 sm:p-8 text-white relative'>
                <div className='flex justify-between items-start mb-3'>
                  <div className='pr-8'>
                    <h3 className='text-lg sm:text-2xl font-black leading-tight tracking-tight'>
                      {selectedOfferDetails.title}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedOfferDetails(null)}
                    className='absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
                <div className='inline-flex items-center gap-2 bg-yellow-400 text-indigo-900 px-3 py-1 rounded-xl text-[12px] sm:text-base font-black shadow-lg animate-bounce-subtle'>
                  <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M12.75 3.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM12.75 18.75a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5zM18.75 12.75a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM3.75 12.75a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM16.945 16.945a.75.75 0 001.06 0l1.06-1.06a.75.75 0 00-1.06-1.06l-1.06 1.06a.75.75 0 000 1.06zM5.055 5.055a.75.75 0 001.06 0l1.06-1.06a.75.75 0 00-1.06-1.06L5.055 4a.75.75 0 000 1.06zM16.945 5.055a.75.75 0 000 1.06l1.06 1.06a.75.75 0 101.06-1.06l-1.06-1.06a.75.75 0 00-1.06 0zM5.055 16.945a.75.75 0 000 1.06l1.06 1.06a.75.75 0 101.06-1.06l-1.06-1.06a.75.75 0 00-1.06 0z' />
                  </svg>
                  {selectedOfferDetails.discountPercentage}% OFF
                </div>
              </div>

              <div className='p-5 sm:p-10 pb-8 sm:pb-12 bg-white'>
                <div className='space-y-5'>
                  <div>
                    <p className='text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1.5'>Offer Description</p>
                    <p className='text-gray-700 leading-relaxed font-medium text-[14px] sm:text-lg'>
                      {selectedOfferDetails.description}
                    </p>
                  </div>

                  <div className='h-px bg-gray-100'></div>
                  
                  <p className='text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest'>
                    Tap anywhere outside to close
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage
