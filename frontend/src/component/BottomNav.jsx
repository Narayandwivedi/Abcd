import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const BottomNav = () => {
  const { isAuthenticated } = useContext(AppContext)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50'>
      <div className='flex justify-around items-center py-2'>
        {/* Home */}
        <Link
          to='/'
          className={`flex flex-col items-center justify-center px-4 py-2 transition-colors ${
            isActive('/') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
          </svg>
          <span className='text-xs mt-1'>Home</span>
        </Link>

        {/* Join as Vendor - Center Button (Highlighted) */}
        <a
          href='http://localhost:5174'
          target='_blank'
          rel='noopener noreferrer'
          className='flex flex-col items-center justify-center px-4 py-2 -mt-4'
        >
          <div className='bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-3 shadow-lg'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
          </div>
          <span className='text-xs mt-1 text-blue-600 font-semibold'>Join Vendor</span>
        </a>

        {/* Profile / Login */}
        {isAuthenticated ? (
          <Link
            to='/profile'
            className={`flex flex-col items-center justify-center px-4 py-2 transition-colors ${
              isActive('/profile') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
            </svg>
            <span className='text-xs mt-1'>Profile</span>
          </Link>
        ) : (
          <Link
            to='/login'
            className={`flex flex-col items-center justify-center px-4 py-2 transition-colors ${
              isActive('/login') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' />
            </svg>
            <span className='text-xs mt-1'>Login</span>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default BottomNav
