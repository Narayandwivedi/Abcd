import React from 'react'
import Logo from '../component/Logo'
import Logo2 from '../component/Logo2'
import Logo3 from '../component/Logo3'
import Logo4 from '../component/Logo4'

const LogoTest = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-4xl font-bold text-center mb-12 text-gray-800'>
          Logo Variations Test Page
        </h1>

        <div className='space-y-12'>
          {/* Logo 1 - Current/Main Logo */}
          <div className='bg-white rounded-2xl p-8 shadow-lg'>
            <h2 className='text-2xl font-bold mb-6 text-gray-700 border-b pb-3'>
              Logo 1 - Current Main Logo (Enhanced)
            </h2>
            <div className='flex items-center justify-center p-8 bg-gray-50 rounded-xl'>
              <Logo />
            </div>
          </div>

          {/* Logo 2 */}
          <div className='bg-white rounded-2xl p-8 shadow-lg'>
            <h2 className='text-2xl font-bold mb-6 text-gray-700 border-b pb-3'>
              Logo 2 - Modern Integrated Design
            </h2>
            <div className='flex items-center justify-center p-8 bg-gray-50 rounded-xl'>
              <Logo2 />
            </div>
          </div>

          {/* Logo 3 */}
          <div className='bg-white rounded-2xl p-8 shadow-lg'>
            <h2 className='text-2xl font-bold mb-6 text-gray-700 border-b pb-3'>
              Logo 3 - Premium Shield Design
            </h2>
            <div className='flex items-center justify-center p-8 bg-gray-50 rounded-xl'>
              <Logo3 />
            </div>
          </div>

          {/* Logo 4 */}
          <div className='bg-white rounded-2xl p-8 shadow-lg'>
            <h2 className='text-2xl font-bold mb-6 text-gray-700 border-b pb-3'>
              Logo 4 - Premium Hexagonal Design
            </h2>
            <div className='flex items-center justify-center p-8 bg-gray-50 rounded-xl'>
              <Logo4 />
            </div>
          </div>

          {/* Side by Side Comparison */}
          <div className='bg-white rounded-2xl p-8 shadow-lg'>
            <h2 className='text-2xl font-bold mb-6 text-gray-700 border-b pb-3'>
              Side by Side Comparison
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='flex items-center justify-center p-6 bg-gray-50 rounded-xl border-2 border-blue-200'>
                <div>
                  <p className='text-center text-sm font-semibold text-gray-600 mb-4'>Logo 1</p>
                  <Logo />
                </div>
              </div>
              <div className='flex items-center justify-center p-6 bg-gray-50 rounded-xl border-2 border-green-200'>
                <div>
                  <p className='text-center text-sm font-semibold text-gray-600 mb-4'>Logo 2</p>
                  <Logo2 />
                </div>
              </div>
              <div className='flex items-center justify-center p-6 bg-gray-50 rounded-xl border-2 border-orange-200'>
                <div>
                  <p className='text-center text-sm font-semibold text-gray-600 mb-4'>Logo 3</p>
                  <Logo3 />
                </div>
              </div>
              <div className='flex items-center justify-center p-6 bg-gray-50 rounded-xl border-2 border-purple-200'>
                <div>
                  <p className='text-center text-sm font-semibold text-gray-600 mb-4'>Logo 4</p>
                  <Logo4 />
                </div>
              </div>
            </div>
          </div>

          {/* Dark Background Test */}
          <div className='bg-gray-900 rounded-2xl p-8 shadow-lg'>
            <h2 className='text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-3'>
              Dark Background Test
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='flex items-center justify-center p-6 bg-gray-800 rounded-xl'>
                <Logo />
              </div>
              <div className='flex items-center justify-center p-6 bg-gray-800 rounded-xl'>
                <Logo2 />
              </div>
              <div className='flex items-center justify-center p-6 bg-gray-800 rounded-xl'>
                <Logo3 />
              </div>
              <div className='flex items-center justify-center p-6 bg-gray-800 rounded-xl'>
                <Logo4 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogoTest
