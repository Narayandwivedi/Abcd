import React from 'react'
import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <Link to='/' className='inline-block cursor-pointer hover:opacity-90 transition-opacity'>
      {/* Premium Logo Design */}
      <div className='relative'>
        {/* Main Container */}
        <div className='relative bg-white rounded-lg md:rounded-xl shadow-md md:shadow-lg p-2 md:p-2'>
            <div className='flex items-center gap-2 md:gap-2'>

              {/* Left Side - Logo Image */}
              <div className='relative'>
                <div className='relative w-18 h-18 md:w-14 md:h-14'>
                  {/* Logo Image */}
                  <img
                    src='/abcd logo3.png'
                    alt='ABCD Logo'
                    className='w-full h-full object-contain drop-shadow-lg'
                  />
                </div>
              </div>

              {/* Right Side - Text Content */}
              <div className='flex-1'>
                {/* ABCD with Modern Typography */}
                <div className='relative mb-0.5 md:mb-0.5'>
                  <div className='flex items-center gap-1 md:gap-1'>
                    <h1 className='text-xl md:text-2xl font-black tracking-tight'>
                      <span className='text-orange-600'>A</span>
                      <span className='text-red-600'>B</span>
                      <span className='text-blue-600'>C</span>
                      <span className='text-green-600'>D</span>
                    </h1>
                    <div className='flex flex-col gap-0.5'>
                      <div className='h-0.5 w-3.5 md:w-3 bg-gradient-to-r from-orange-500 to-red-500'></div>
                      <div className='h-0.5 w-2.5 bg-gradient-to-r from-blue-500 to-green-500'></div>
                    </div>
                  </div>
                </div>

                {/* Organization Full Name */}
                <div className='bg-gradient-to-r from-gray-900 to-gray-800 text-white px-2 py-0.5 md:px-1.5 md:py-0.5 rounded md:rounded-md'>
                  <div className='text-[9px] md:text-[10px] font-bold tracking-wide leading-tight'>
                    <div>AGRAWAL BUSINESS &</div>
                    <div>COMMUNITY DEVELOPMENT</div>
                  </div>
                </div>

                {/* Bottom Info Bar - Hidden on mobile */}
                <div className='hidden md:flex mt-0.5 items-center gap-1'>
                  <div className='flex gap-0.5'>
                    <div className='w-1 h-1 bg-orange-500 rounded-full animate-pulse'></div>
                    <div className='w-1 h-1 bg-white border border-gray-400 rounded-full animate-pulse' style={{animationDelay: '0.2s'}}></div>
                    <div className='w-1 h-1 bg-green-600 rounded-full animate-pulse' style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <span className='text-[7px] font-semibold text-gray-600 uppercase tracking-wider'>
                    Empowering Growth & Unity
                  </span>
                </div>
              </div>
            </div>
        </div>
      </div>
    </Link>
  )
}

export default Logo