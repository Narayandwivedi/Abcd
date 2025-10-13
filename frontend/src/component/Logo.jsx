import React from 'react'
import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <Link to='/' className='flex items-center gap-3 sm:gap-4 group'>
      {/* Logo Image - Enhanced */}
      <div className='relative flex-shrink-0 self-center'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-400 to-red-400 rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300'></div>
        <img
          src='/abcd logo3.png'
          alt='ABCD Logo'
          className='relative w-14 h-14 sm:w-16 sm:h-16 object-contain transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 drop-shadow-lg'
        />
      </div>

      {/* Logo Text - Enhanced */}
      <div className='flex flex-col gap-1.5 justify-center'>
        {/* Full Form with Enhanced Glossy Red Background */}
        <div className='relative bg-gradient-to-br from-red-600 via-red-500 to-red-700 px-4 py-2.5 rounded-xl shadow-lg overflow-hidden group-hover:shadow-xl transition-all duration-300'>
          {/* Glossy overlay effect */}
          <div className='absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50'></div>

          {/* Shine effect on hover */}
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out'></div>

          <div className='relative text-xs sm:text-sm font-black text-white tracking-wide leading-tight'>
            <div className='drop-shadow-md'>AGRAWAL BUSINESS &</div>
            <div className='drop-shadow-md'>COMMUNITY DEVELOPMENT</div>
          </div>
        </div>

        {/* Enhanced Tagline */}
        <div className='flex items-center gap-1.5 px-1'>
          <div className='h-px w-2 bg-gradient-to-r from-transparent to-gray-400'></div>
          <span className='text-[10px] text-gray-600 font-bold tracking-widest uppercase whitespace-nowrap'>
            Empowering Growth & Unity
          </span>
          <div className='h-px flex-1 bg-gradient-to-r from-gray-400 to-transparent'></div>
        </div>
      </div>
    </Link>
  )
}

export default Logo
