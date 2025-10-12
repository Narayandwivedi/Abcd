import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const BottomNav = () => {
  const { user, isAuthenticated } = useContext(AppContext)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50'>
      <div className='flex justify-around items-center py-1.5'>
        {/* Home */}
        <Link
          to='/'
          className={`flex flex-col items-center justify-center px-3 py-1.5 transition-colors ${
            isActive('/') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isActive('/') ? 'bg-blue-50' : ''
          }`}>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
            </svg>
          </div>
          <span className='text-xs mt-0.5'>Home</span>
        </Link>

        {/* Join as Vendor */}
        <a
          href='https://vendor.abcdvyapar.com'
          target='_blank'
          rel='noopener noreferrer'
          className='flex flex-col items-center justify-center px-3 py-1.5 transition-colors text-blue-600'
        >
          <div className='w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-md'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
          </div>
          <span className='text-xs mt-0.5 font-semibold'>Join as Vendor</span>
        </a>

        {/* Profile / Login */}
        {isAuthenticated ? (
          <Link
            to='/profile'
            className='flex flex-col items-center justify-center px-3 py-1.5 transition-colors'
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              isActive('/profile')
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}>
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className={`text-xs mt-0.5 ${isActive('/profile') ? 'text-blue-600' : 'text-gray-600'}`}>
              Profile
            </span>
          </Link>
        ) : (
          <Link
            to='/login'
            className='flex flex-col items-center justify-center px-3 py-1.5 transition-colors'
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isActive('/login')
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' />
              </svg>
            </div>
            <span className={`text-xs mt-0.5 ${isActive('/login') ? 'text-blue-600' : 'text-gray-600'}`}>
              Login
            </span>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default BottomNav
