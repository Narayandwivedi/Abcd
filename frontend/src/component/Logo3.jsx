import React from 'react'

const Logo = () => {
  return (
    <div className='inline-block'>
      {/* Premium Logo Design */}
      <div className='relative'>
        {/* Main Container */}
        <div className='relative bg-white rounded-xl shadow-lg p-2 sm:p-3'>
            <div className='flex items-center gap-3'>

              {/* Left Side - Logo Image in Shield Shape */}
              <div className='relative'>
                <div className='relative w-14 h-16 sm:w-16 sm:h-20'>
                  {/* Shield Background */}
                  <svg className='absolute inset-0 w-full h-full' viewBox='0 0 100 120' fill='none'>
                    <path 
                      d='M50 5 L90 25 L90 75 Q90 100 50 115 Q10 100 10 75 L10 25 Z' 
                      fill='url(#shieldGradient)'
                      stroke='url(#borderGradient)'
                      strokeWidth='2'
                    />
                    <defs>
                      <linearGradient id='shieldGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                        <stop offset='0%' stopColor='#FEF3C7' />
                        <stop offset='100%' stopColor='#FED7AA' />
                      </linearGradient>
                      <linearGradient id='borderGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                        <stop offset='0%' stopColor='#EA580C' />
                        <stop offset='50%' stopColor='#DC2626' />
                        <stop offset='100%' stopColor='#EA580C' />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Logo Image */}
                  <div className='absolute inset-0 flex items-center justify-center p-1.5'>
                    <img
                      src='/abcd logo3.png'
                      alt='ABCD Logo'
                      className='w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-lg'
                    />
                  </div>

                  {/* Crown Icon on Top */}
                  <div className='absolute -top-1.5 left-1/2 transform -translate-x-1/2'>
                    <svg className='w-4 h-4 text-yellow-500 drop-shadow-md' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M12 6L9 9l3-8 3 8zm0 0l-3 3h6zm-3 3v10l3-3 3 3V9z'/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Text Content */}
              <div className='flex-1'>
                {/* ABCD with Modern Typography */}
                <div className='relative mb-1'>
                  <div className='flex items-center gap-1.5'>
                    <h1 className='text-2xl sm:text-3xl font-black tracking-tight'>
                      <span className='text-orange-600'>A</span>
                      <span className='text-red-600'>B</span>
                      <span className='text-blue-600'>C</span>
                      <span className='text-green-600'>D</span>
                    </h1>
                    <div className='flex flex-col gap-0.5'>
                      <div className='h-0.5 w-4 bg-gradient-to-r from-orange-500 to-red-500'></div>
                      <div className='h-0.5 w-3 bg-gradient-to-r from-blue-500 to-green-500'></div>
                    </div>
                  </div>
                </div>

                {/* Organization Full Name */}
                <div className='bg-gradient-to-r from-gray-900 to-gray-800 text-white px-2 py-1 rounded-md'>
                  <div className='text-[9px] sm:text-[10px] font-bold tracking-wide leading-tight'>
                    <div>AGRAWAL BUSINESS &</div>
                    <div>COMMUNITY DEVELOPMENT</div>
                  </div>
                </div>

                {/* Bottom Info Bar */}
                <div className='mt-1 flex items-center gap-1.5'>
                  <div className='flex gap-0.5'>
                    <div className='w-1 h-1 bg-orange-500 rounded-full animate-pulse'></div>
                    <div className='w-1 h-1 bg-white border border-gray-400 rounded-full animate-pulse' style={{animationDelay: '0.2s'}}></div>
                    <div className='w-1 h-1 bg-green-600 rounded-full animate-pulse' style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <span className='text-[8px] font-semibold text-gray-600 uppercase tracking-wider'>
                    Empowering Growth & Unity
                  </span>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Logo