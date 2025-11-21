import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

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

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className='min-h-screen bg-gray-50 pb-20 md:pb-4'>
      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 shadow-md'>
        <div className='container mx-auto max-w-4xl flex items-center gap-3'>
          <button
            onClick={handleBack}
            className='hover:bg-white/20 p-1.5 rounded-full transition-all'
            aria-label='Go back'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
            </svg>
          </button>
          <h1 className='text-lg font-bold'>
            {type === 'ad' ? 'Advertisement Details' : 'Hot Deal Details'}
          </h1>
        </div>
      </div>

      <div className='container mx-auto px-4 py-3 max-w-4xl'>
        {/* Image Section */}
        <div className='bg-white rounded-xl shadow-lg overflow-hidden mb-4'>
          <div className='bg-gradient-to-r from-blue-50 to-purple-50 p-4'>
            <div className='flex items-center justify-center bg-white rounded-lg shadow-md p-4'>
              <img
                src={image}
                alt={type === 'ad' ? `Advertisement ${id}` : `Hot Deal ${id}`}
                className='max-w-full max-h-[300px] md:max-h-[400px] object-contain'
              />
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className='bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg'>
          <div className='flex items-start gap-3'>
            <svg className='w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            <div>
              <p className='text-sm text-blue-800 font-medium'>Advertisement</p>
              <p className='text-xs text-blue-600 mt-1'>
                Contact the advertiser for more details about this offer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdDetail
