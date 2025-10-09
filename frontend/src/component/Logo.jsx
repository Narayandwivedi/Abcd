import React from 'react'
import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <Link to='/' className='flex items-center gap-3 group'>
      {/* Logo Image */}
      <div className='relative'>
        <img
          src='/abcd logo3.png'
          alt='ABCD Logo'
          className='w-20 h-20 object-contain transition-all duration-300 transform group-hover:scale-110'
        />
      </div>

      {/* Logo Text */}
      <div className='flex flex-col leading-tight'>
        <div className='flex items-baseline gap-1'>
          <span className='text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 tracking-wide group-hover:from-blue-800 group-hover:via-blue-700 group-hover:to-blue-900 transition-all duration-300'
                style={{ letterSpacing: '2px' }}>
            ABCD
          </span>
          <span className='text-xs font-bold text-yellow-500 animate-pulse'>✦</span>
        </div>

        <div className='bg-gradient-to-r from-red-600 to-red-700 px-2 py-0.5 rounded-md shadow-sm mt-0.5'>
          <span className='text-[10px] font-bold text-white tracking-wide'>
            AGRAWAL BUSINESS
          </span>
        </div>

        <span className='text-[9px] text-gray-600 font-semibold mt-1 tracking-wider uppercase'>
          Empowering Growth & Unity
        </span>
      </div>
    </Link>
  )
}

export default Logo
