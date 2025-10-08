import React, { useState } from 'react'

const DemoVideo = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='max-w-5xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h2 className='text-4xl font-bold text-gray-800 mb-4'>
            See How It Works
          </h2>
          <p className='text-gray-600 text-lg'>
            Watch our demo to learn how ABCD can transform your experience
          </p>
        </div>

        {/* Video Thumbnail */}
        <div
          className='relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer group'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Thumbnail Image/Gradient Background */}
          <div className='aspect-video bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center relative'>
            {/* Overlay */}
            <div className='absolute inset-0 bg-black opacity-30 group-hover:opacity-20 transition-opacity duration-300'></div>

            {/* Play Button */}
            <div className={`relative z-10 transform transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
              <div className='bg-white rounded-full p-6 shadow-lg'>
                <svg
                  className='w-16 h-16 text-blue-600'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M8 5v14l11-7z' />
                </svg>
              </div>
            </div>

            {/* Duration Badge */}
            <div className='absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-lg text-sm font-semibold'>
              3:45
            </div>

            {/* Title Overlay */}
            <div className='absolute bottom-4 left-4 text-white'>
              <h3 className='text-2xl font-bold drop-shadow-lg'>Product Demo</h3>
              <p className='text-sm opacity-90'>Introduction to ABCD Platform</p>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className='mt-6 text-center'>
          <p className='text-gray-600'>
            Click to watch our comprehensive product walkthrough
          </p>
        </div>
      </div>
    </div>
  )
}

export default DemoVideo
