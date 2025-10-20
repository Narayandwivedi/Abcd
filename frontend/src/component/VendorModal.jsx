import React from 'react'

const VendorModal = ({ isOpen, onClose, category, vendors }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4' onClick={onClose}>
      <div className='bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl' onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex justify-between items-center'>
          <h2 className='text-xl md:text-2xl font-bold'>{category} Vendors</h2>
          <button
            onClick={onClose}
            className='text-white hover:bg-white/20 rounded-full p-2 transition-colors'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto max-h-[calc(90vh-80px)]'>
          {vendors && vendors.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className='bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-400 transform hover:-translate-y-1'
                >
                  {/* Business Name */}
                  <div className='flex items-start mb-3'>
                    <div className='bg-blue-500 text-white rounded-full p-2 mr-3 flex-shrink-0'>
                      <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                      </svg>
                    </div>
                    <div>
                      <h3 className='text-lg font-bold text-gray-800'>{vendor.businessName}</h3>
                      <p className='text-sm text-gray-600'>Owner: {vendor.ownerName}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className='flex items-start mb-3'>
                    <svg className='w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                    </svg>
                    <p className='text-sm text-gray-700'>{vendor.address}</p>
                  </div>

                  {/* Contact */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <svg className='w-5 h-5 text-blue-600 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                      </svg>
                      <p className='text-sm font-medium text-gray-700'>{vendor.mobile}</p>
                    </div>
                    <a
                      href={`tel:${vendor.mobile}`}
                      className='bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition-colors'
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>No vendors available in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VendorModal
