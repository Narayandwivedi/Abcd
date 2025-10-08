import React from 'react'
import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <Link to='/' className='flex items-center gap-3 group'>
      {/* Logo Icon with Gradient */}
      <div className='relative'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl blur-sm group-hover:blur-md transition-all duration-300 opacity-30'></div>
        <div className='relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl p-3 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105'>
          <svg className='w-10 h-10 text-white' viewBox='0 0 24 24' fill='currentColor'>
            <path d='M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 3.6v7.22c0 4.54-3.07 8.78-7 9.93V4.18l-1 .45v15.3c-3.93-1.15-7-5.39-7-9.93V7.78l8-3.6z'/>
            <path d='M7 10l5 3 5-3v5l-5 3-5-3v-5z' opacity='0.6'/>
          </svg>
        </div>
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
