import React from 'react'

const Download = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='flex justify-center mb-6'>
            <div className='w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl'>
              <span className='text-5xl font-black text-white'>A</span>
            </div>
          </div>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            ABCD Vyapar
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Access ABCD Vyapar - Your Business Partner for Products and Services
          </p>
        </div>

        {/* Info Card */}
        <div className='bg-white rounded-2xl shadow-xl p-8 mb-8'>
          <div className='text-center'>
            <div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-10 h-10 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Access Our Platform</h2>
            <p className='text-gray-600 mb-4'>
              Use ABCD Vyapar directly from your browser for the best experience.
            </p>
            <a
              href='/'
              className='inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105'
            >
              Go to Home
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className='grid md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-xl shadow-lg p-6 text-center'>
            <div className='w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-7 h-7 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
              </svg>
            </div>
            <h3 className='font-bold text-gray-900 mb-2'>Fast & Lightweight</h3>
            <p className='text-gray-600 text-sm'>Quick loading times and smooth performance</p>
          </div>

          <div className='bg-white rounded-xl shadow-lg p-6 text-center'>
            <div className='w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-7 h-7 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
              </svg>
            </div>
            <h3 className='font-bold text-gray-900 mb-2'>Secure Platform</h3>
            <p className='text-gray-600 text-sm'>Your data is protected with enterprise-grade security</p>
          </div>

          <div className='bg-white rounded-xl shadow-lg p-6 text-center'>
            <div className='w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-7 h-7 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' />
              </svg>
            </div>
            <h3 className='font-bold text-gray-900 mb-2'>Mobile Friendly</h3>
            <p className='text-gray-600 text-sm'>Works perfectly on all devices and screen sizes</p>
          </div>
        </div>

        {/* How to Access Section */}
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>How to Access</h2>
          <div className='grid md:grid-cols-2 gap-8'>
            {/* Desktop Instructions */}
            <div>
              <h3 className='font-bold text-lg text-gray-900 mb-4 flex items-center gap-2'>
                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
                On Desktop
              </h3>
              <ol className='space-y-3 text-gray-600'>
                <li className='flex gap-3'>
                  <span className='font-bold text-blue-600'>1.</span>
                  <span>Open your web browser (Chrome, Firefox, Safari, Edge)</span>
                </li>
                <li className='flex gap-3'>
                  <span className='font-bold text-blue-600'>2.</span>
                  <span>Visit abcdvyapar.com</span>
                </li>
                <li className='flex gap-3'>
                  <span className='font-bold text-blue-600'>3.</span>
                  <span>Bookmark the page for quick access</span>
                </li>
                <li className='flex gap-3'>
                  <span className='font-bold text-blue-600'>4.</span>
                  <span>Start exploring products and services</span>
                </li>
              </ol>
            </div>

            {/* Mobile Instructions */}
            <div>
              <h3 className='font-bold text-lg text-gray-900 mb-4 flex items-center gap-2'>
                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' />
                </svg>
                On Mobile
              </h3>
              <ol className='space-y-3 text-gray-600'>
                <li className='flex gap-3'>
                  <span className='font-bold text-blue-600'>1.</span>
                  <span>Open your mobile browser</span>
                </li>
                <li className='flex gap-3'>
                  <span className='font-bold text-blue-600'>2.</span>
                  <span>Visit abcdvyapar.com</span>
                </li>
                <li className='flex gap-3'>
                  <span className='font-bold text-blue-600'>3.</span>
                  <span>Add to home screen for quick access</span>
                </li>
                <li className='flex gap-3'>
                  <span className='font-bold text-blue-600'>4.</span>
                  <span>Enjoy the mobile-optimized experience</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Download
