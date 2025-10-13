import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import Logo3 from './Logo3'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AppContext)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      setShowProfileMenu(false)
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    }
  }

  return (
    <nav className='bg-white shadow-md md:shadow-lg sticky top-0 z-50 border-b border-gray-200'>
      <div className='container mx-auto px-3 md:px-4 py-1.5 md:py-3 flex justify-between items-center'>
        {/* Logo */}
        <Logo3 />

        {/* Navigation Links */}
        <div className='hidden md:flex items-center gap-8'>
          <Link to='/' className='text-gray-700 font-medium hover:text-blue-600 transition-colors relative group'>
            Home
            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300'></span>
          </Link>
          <Link to='/about' className='text-gray-700 font-medium hover:text-blue-600 transition-colors relative group'>
            About
            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300'></span>
          </Link>
          <Link to='/contact' className='text-gray-700 font-medium hover:text-blue-600 transition-colors relative group'>
            Contact
            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300'></span>
          </Link>

          {/* Conditional Login/Profile Button */}
          {isAuthenticated ? (
            <div className='relative'>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className='flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg'
              >
                <div className='w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold'>
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className='hidden lg:inline'>{user?.fullName?.split(' ')[0] || 'User'}</span>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className='absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50'>
                  <div className='px-4 py-3 border-b border-gray-200'>
                    <p className='font-semibold text-gray-800'>{user?.fullName}</p>
                    <p className='text-sm text-gray-500 truncate'>{user?.email}</p>
                  </div>
                  <Link
                    to='/profile'
                    onClick={() => setShowProfileMenu(false)}
                    className='block px-4 py-2.5 text-gray-700 hover:bg-blue-50 transition-colors'
                  >
                    <div className='flex items-center gap-3'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                      </svg>
                      My Profile
                    </div>
                  </Link>
                  <Link
                    to='/orders'
                    onClick={() => setShowProfileMenu(false)}
                    className='block px-4 py-2.5 text-gray-700 hover:bg-blue-50 transition-colors'
                  >
                    <div className='flex items-center gap-3'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                      </svg>
                      My Orders
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className='w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200 mt-1'
                  >
                    <div className='flex items-center gap-3'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                      </svg>
                      Logout
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to='/login' className='bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:scale-105'>
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className='md:hidden text-gray-700 hover:text-blue-600 transition-colors p-1'
        >
          {showMobileMenu ? (
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          ) : (
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className='md:hidden bg-white border-t border-gray-200 shadow-lg'>
          <div className='container mx-auto px-4 py-4 space-y-3'>
            <Link
              to='/'
              onClick={() => setShowMobileMenu(false)}
              className='block text-gray-700 font-medium hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors'
            >
              Home
            </Link>
            <Link
              to='/about'
              onClick={() => setShowMobileMenu(false)}
              className='block text-gray-700 font-medium hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors'
            >
              About
            </Link>
            <Link
              to='/contact'
              onClick={() => setShowMobileMenu(false)}
              className='block text-gray-700 font-medium hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors'
            >
              Contact
            </Link>

            {/* Mobile Auth Section - Hidden, using bottom nav instead */}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
