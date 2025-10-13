import React from 'react'

const Logo = () => {
  return (
    <div className='group cursor-pointer inline-block'>
      {/* Main Container with Premium Design */}
      <div className='relative flex items-center bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50'>
        
        {/* Animated Background Pattern */}
        <div className='absolute inset-0 opacity-5'>
          <div className='absolute inset-0 bg-gradient-to-br from-orange-500 via-transparent to-blue-500 rounded-2xl'></div>
        </div>
        
        {/* Left Section - Logo Image */}
        <div className='relative z-10 flex-shrink-0'>
          {/* Hexagonal Frame */}
          <div className='relative w-24 h-24 sm:w-28 sm:h-28'>
            {/* Outer Glow */}
            <div className='absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl rotate-45 opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-500'></div>
            
            {/* Main Image Container */}
            <div className='relative w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-2xl rotate-45 overflow-hidden shadow-xl group-hover:rotate-[50deg] transition-transform duration-500'>
              <div className='absolute inset-2 -rotate-45 flex items-center justify-center'>
                <img
                  src='/abcd logo3.png'
                  alt='ABCD Logo'
                  className='w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-md'
                />
              </div>
            </div>
            
            {/* Decorative Corners */}
            <div className='absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-md'></div>
            <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-md'></div>
          </div>
        </div>
        
        {/* Center Divider */}
        <div className='relative z-10 mx-4 h-20 flex flex-col justify-center gap-2'>
          <div className='w-px h-full bg-gradient-to-b from-transparent via-gray-300 to-transparent'></div>
        </div>
        
        {/* Right Section - Text Content */}
        <div className='relative z-10 flex flex-col justify-center'>
          {/* ABCD Big Letters */}
          <div className='relative'>
            <div className='absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 opacity-20 blur-lg group-hover:opacity-30 transition-opacity duration-300'></div>
            <h1 className='relative text-5xl sm:text-6xl font-black tracking-tight'>
              <span className='bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-clip-text text-transparent'>
                ABCD
              </span>
            </h1>
          </div>
          
          {/* Full Organization Name */}
          <div className='mt-2 space-y-0.5'>
            <div className='text-sm sm:text-base font-bold text-gray-800 tracking-wide'>
              AGRAWAL BUSINESS &
            </div>
            <div className='text-sm sm:text-base font-bold text-gray-800 tracking-wide'>
              COMMUNITY DEVELOPMENT
            </div>
          </div>
          
          {/* Tagline with Decorative Elements */}
          <div className='mt-3 flex items-center gap-2'>
            <div className='flex items-center gap-1'>
              <div className='w-8 h-px bg-gradient-to-r from-orange-500 to-transparent'></div>
              <div className='w-1.5 h-1.5 bg-orange-500 rounded-full'></div>
            </div>
            <span className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>
              Empowering Growth
            </span>
            <div className='flex items-center gap-1'>
              <div className='w-1.5 h-1.5 bg-blue-500 rounded-full'></div>
              <div className='w-8 h-px bg-gradient-to-l from-blue-500 to-transparent'></div>
            </div>
          </div>
        </div>
        
        {/* Bottom Accent Line */}
        <div className='absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50'></div>
      </div>
    </div>
  )
}

export default Logo