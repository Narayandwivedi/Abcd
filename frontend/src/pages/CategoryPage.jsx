import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const CategoryPage = () => {
  const { categoryName } = useParams()
  const navigate = useNavigate()

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
            <div>
              <h1 className='text-2xl md:text-3xl font-bold'>{categoryName}</h1>
              <p className='text-sm md:text-base text-blue-100'>0 Vendors Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className='container mx-auto px-4 py-6'>
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
      </div>
    </div>
  )
}

export default CategoryPage
