import React from 'react'

const Logo = () => {
  return (
    <div className='group cursor-pointer inline-flex items-center'>
      {/* Modern Integrated Logo Design */}
      <div className='flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'>
        
        {/* Logo Image with Modern Frame */}
        <div className='relative'>
          {/* Circular Badge Style */}
          <div className='relative w-16 h-16 sm:w-20 sm:h-20'>
            {/* Orange Ring */}
            <div className='absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-full p-[2px]'>
              {/* White Inner Ring */}
              <div className='w-full h-full bg-white rounded-full p-[2px]'>
                {/* Blue Inner Ring */}
                <div className='w-full h-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-full p-[2px]'>
                  {/* Image Container */}
                  <div className='w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden'>
                    <img
                      src='/abcd logo3.png'
                      alt='ABCD Logo'
                      className='w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem] object-contain group-hover:scale-110 transition-transform duration-300'
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className='absolute -top-1 -right-1 bg-green-600 text-white text-[8px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md'>
              ✓
            </div>
          </div>
        </div>
        
        {/* Text Content */}
        <div className='flex flex-col'>
          {/* Main Brand Name */}
          <div className='flex items-baseline gap-2'>
            <span className='text-3xl sm:text-4xl font-black text-gray-900'>ABCD</span>
            <div className='flex gap-0.5 mb-2'>
              <div className='w-1 h-1 bg-orange-500 rounded-full'></div>
              <div className='w-1 h-1 bg-white border border-gray-400 rounded-full'></div>
              <div className='w-1 h-1 bg-green-600 rounded-full'></div>
            </div>
          </div>
          
          {/* Full Name - Styled */}
          <div className='space-y-0'>
            <div className='text-[11px] sm:text-xs font-bold text-gray-700 leading-tight tracking-wide'>
              AGRAWAL BUSINESS &
            </div>
            <div className='text-[11px] sm:text-xs font-bold text-gray-700 leading-tight tracking-wide'>
              COMMUNITY DEVELOPMENT
            </div>
          </div>
          
          {/* Bottom Tagline */}
          <div className='mt-1.5 text-[9px] font-semibold text-orange-600 uppercase tracking-widest'>
            Empowering • Growing • Unity
          </div>
        </div>
      </div>
    </div>
  )
}

export default Logo