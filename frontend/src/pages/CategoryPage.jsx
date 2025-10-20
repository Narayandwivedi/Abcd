import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { demoVendors } from '../data/demoVendors'

const CategoryPage = () => {
  const { categoryName } = useParams()
  const navigate = useNavigate()
  const vendors = demoVendors[categoryName] || []

  // Category emoji mapping
  const categoryEmojis = {
    'Medicine': '💊',
    'Services': '🔧',
    'Foods': '🍔',
    'Beverages': '🍾',
    'Grocery': '🛒',
    'Electronics': '📱',
    'Fashion': '👗',
    'Home & Living': '🏠',
    'Beauty': '💄',
    'Books': '📚',
    'Sports': '⚽',
    'Toys': '🧸'
  }

  return (
    <div className='min-h-screen bg-gray-50 pb-20 md:pb-8'>
      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white sticky top-0 z-40'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => navigate('/')}
              className='bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>
            <div className='flex items-center gap-3'>
              <span className='text-4xl'>{categoryEmojis[categoryName]}</span>
              <div>
                <h1 className='text-2xl md:text-3xl font-bold'>{categoryName}</h1>
                <p className='text-sm md:text-base text-blue-100'>{vendors.length} Vendors Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className='container mx-auto px-4 py-6'>
        {vendors && vendors.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto'>
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className='bg-white p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-400 transform hover:-translate-y-1'
              >
                {/* Business Name Header */}
                <div className='flex items-start mb-4'>
                  <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-3 mr-4 flex-shrink-0 shadow-md'>
                    <svg className='w-7 h-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                    </svg>
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-xl md:text-2xl font-bold text-gray-800 mb-1'>{vendor.businessName}</h3>
                    <div className='flex items-center text-gray-600'>
                      <svg className='w-4 h-4 mr-1.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                      </svg>
                      <p className='text-sm md:text-base'>Owner: <span className='font-semibold'>{vendor.ownerName}</span></p>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className='bg-gray-50 rounded-xl p-4 mb-4'>
                  <div className='flex items-start'>
                    <svg className='w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                    </svg>
                    <div>
                      <p className='text-xs text-gray-500 mb-1'>Address</p>
                      <p className='text-sm md:text-base text-gray-700 font-medium'>{vendor.address}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Section */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div className='bg-blue-50 rounded-lg p-2 mr-3'>
                      <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                      </svg>
                    </div>
                    <div>
                      <p className='text-xs text-gray-500'>Contact</p>
                      <p className='text-sm md:text-base font-bold text-gray-800'>{vendor.mobile}</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${vendor.mobile}`}
                    className='bg-gradient-to-r from-green-500 to-green-600 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-xl text-sm md:text-base font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                    </svg>
                    Call Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-20'>
            <div className='bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto'>
              <div className='text-6xl mb-4'>😔</div>
              <h2 className='text-2xl font-bold text-gray-800 mb-2'>No Vendors Yet</h2>
              <p className='text-gray-600'>No vendors available in this category at the moment.</p>
              <button
                onClick={() => navigate('/')}
                className='mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors'
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage
