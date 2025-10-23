import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { demoVendors } from '../data/demoVendors'

const AdDetail = () => {
  const { type, id } = useParams()
  const navigate = useNavigate()

  // Define ad and deal images (same as in Home.jsx)
  const adImages = [
    '/ad1.webp',
    '/ad2.webp',
    '/ad3.webp',
    '/ad4.webp',
    '/ad5.webp',
    '/ad6.webp',
    '/ad7.webp',
    '/ad8.webp',
    '/ad9.webp',
    '/ad10.webp',
    '/ad11.webp',
    '/ad12.webp',
    '/ad13.webp',
    '/ad14.webp',
    '/ad15.webp',
    '/ad16.webp'
  ]

  const dealImages = [
    '/hot deals/deal1.jpg',
    '/hot deals/deal2.jpg',
    '/hot deals/deal3.jpg',
    '/hot deals/deal4.jpg',
    '/hot deals/deal5.jpg',
    '/hot deals/deal6.jpg',
    '/hot deals/deal7.jpg',
    '/hot deals/deal8.jpg',
    '/hot deals/deal9.png',
    '/hot deals/deal10.png',
  ]

  // Get the image based on type and id
  const imageArray = type === 'ad' ? adImages : dealImages
  const imageIndex = parseInt(id) - 1
  const image = imageArray[imageIndex]

  // Get a random vendor from the demo vendors for display
  const getRandomVendor = () => {
    const categories = Object.keys(demoVendors)
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    const vendorsInCategory = demoVendors[randomCategory]
    return vendorsInCategory[Math.floor(Math.random() * vendorsInCategory.length)]
  }

  const vendor = getRandomVendor()

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className='min-h-screen bg-gray-50 pb-20 md:pb-4'>
      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-4 shadow-md'>
        <div className='container mx-auto max-w-4xl flex items-center gap-3'>
          <button
            onClick={handleBack}
            className='hover:bg-white/20 p-2 rounded-full transition-all'
            aria-label='Go back'
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
            </svg>
          </button>
          <h1 className='text-2xl font-bold'>
            {type === 'ad' ? 'Advertisement Details' : 'Hot Deal Details'}
          </h1>
        </div>
      </div>

      <div className='container mx-auto px-4 py-6 max-w-4xl'>
        {/* Image Section */}
        <div className='bg-white rounded-xl shadow-lg overflow-hidden mb-6'>
          <div className='bg-gradient-to-r from-blue-50 to-purple-50 p-6'>
            <div className='flex items-center justify-center bg-white rounded-lg shadow-md p-4 min-h-[300px] md:min-h-[400px]'>
              <img
                src={image}
                alt={type === 'ad' ? `Advertisement ${id}` : `Hot Deal ${id}`}
                className='max-w-full max-h-[300px] md:max-h-[400px] object-contain'
              />
            </div>
          </div>
        </div>

        {/* Vendor Details Section */}
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4'>
            <h2 className='text-xl font-bold flex items-center gap-2'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
              </svg>
              Vendor Information
            </h2>
          </div>

          <div className='p-6 space-y-4'>
            {/* Business Name */}
            <div className='flex items-start gap-3 pb-4 border-b border-gray-200'>
              <div className='bg-blue-100 p-3 rounded-lg'>
                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                </svg>
              </div>
              <div className='flex-1'>
                <p className='text-sm text-gray-500 font-medium'>Business Name</p>
                <p className='text-lg font-bold text-gray-800'>{vendor.businessName}</p>
              </div>
            </div>

            {/* Owner Name */}
            <div className='flex items-start gap-3 pb-4 border-b border-gray-200'>
              <div className='bg-green-100 p-3 rounded-lg'>
                <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                </svg>
              </div>
              <div className='flex-1'>
                <p className='text-sm text-gray-500 font-medium'>Owner Name</p>
                <p className='text-lg font-bold text-gray-800'>{vendor.ownerName}</p>
              </div>
            </div>

            {/* Category */}
            <div className='flex items-start gap-3 pb-4 border-b border-gray-200'>
              <div className='bg-purple-100 p-3 rounded-lg'>
                <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
                </svg>
              </div>
              <div className='flex-1'>
                <p className='text-sm text-gray-500 font-medium'>Category</p>
                <p className='text-lg font-bold text-gray-800'>{vendor.category}</p>
              </div>
            </div>

            {/* Address */}
            <div className='flex items-start gap-3 pb-4 border-b border-gray-200'>
              <div className='bg-orange-100 p-3 rounded-lg'>
                <svg className='w-6 h-6 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
              </div>
              <div className='flex-1'>
                <p className='text-sm text-gray-500 font-medium'>Address</p>
                <p className='text-lg font-bold text-gray-800'>{vendor.address}</p>
              </div>
            </div>

            {/* Mobile */}
            <div className='flex items-start gap-3'>
              <div className='bg-red-100 p-3 rounded-lg'>
                <svg className='w-6 h-6 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                </svg>
              </div>
              <div className='flex-1'>
                <p className='text-sm text-gray-500 font-medium'>Contact Number</p>
                <p className='text-lg font-bold text-gray-800'>{vendor.mobile}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3'>
            <a
              href={`tel:${vendor.mobile}`}
              className='flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-md flex items-center justify-center gap-2'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
              </svg>
              Call Now
            </a>
            <a
              href={`https://wa.me/91${vendor.mobile}`}
              target='_blank'
              rel='noopener noreferrer'
              className='flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md flex items-center justify-center gap-2'
            >
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>

        {/* Info Note */}
        <div className='mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg'>
          <div className='flex items-start gap-3'>
            <svg className='w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            <div>
              <p className='text-sm text-blue-800 font-medium'>Demo Vendor Information</p>
              <p className='text-xs text-blue-600 mt-1'>
                This is sample vendor information for demonstration purposes. Actual vendor details will be displayed when this feature goes live.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdDetail
