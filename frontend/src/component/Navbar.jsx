import React, { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import Logo from './Logo'

const Navbar = () => {
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Check if user is logged in on component mount and when route changes
  useEffect(() => {
    checkAuthStatus()

    // Listen for storage changes (e.g., when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'userData') {
        checkAuthStatus()
      }
    }

    // Listen for custom auth event (for same-tab login/logout)
    const handleAuthChange = () => {
      checkAuthStatus()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authChange', handleAuthChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authChange', handleAuthChange)
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Check localStorage first
      const storedUser = localStorage.getItem('userData')

      // If no stored user, set logged out state immediately
      if (!storedUser) {
        setIsLoggedIn(false)
        setUserData(null)
        return
      }

      // Parse and set stored user data
      const parsedUser = JSON.parse(storedUser)
      setUserData(parsedUser)
      setIsLoggedIn(true)

      // Verify with backend in the background
      const response = await fetch(`${backendUrl}/api/auth/status`, {
        method: 'GET',
        credentials: 'include',
      })
      const data = await response.json()

      if (data.isLoggedIn && data.user) {
        // Update with fresh data from backend
        setUserData(data.user)
        localStorage.setItem('userData', JSON.stringify(data.user))
      } else {
        // Session expired or invalid, clear everything
        setIsLoggedIn(false)
        setUserData(null)
        localStorage.removeItem('userData')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      // On error, keep the localStorage data if it exists
      const storedUser = localStorage.getItem('userData')
      if (storedUser) {
        setUserData(JSON.parse(storedUser))
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
        setUserData(null)
      }
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        toast.success('Logged out successfully')
        setIsLoggedIn(false)
        setUserData(null)
        localStorage.removeItem('userData')
        setShowProfileMenu(false)
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('authChange'))
        navigate('/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    }
  }

  return (
    <nav className='bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200'>
      <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
        {/* Logo */}
        <Logo />

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
          <Link to='/services' className='text-gray-700 font-medium hover:text-blue-600 transition-colors relative group'>
            Services
            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300'></span>
          </Link>

          {/* Conditional Login/Profile Button */}
          {isLoggedIn ? (
            <div className='relative'>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className='flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg'
              >
                <div className='w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold'>
                  {userData?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className='hidden lg:inline'>{userData?.fullName?.split(' ')[0] || 'User'}</span>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className='absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50'>
                  <div className='px-4 py-3 border-b border-gray-200'>
                    <p className='font-semibold text-gray-800'>{userData?.fullName}</p>
                    <p className='text-sm text-gray-500 truncate'>{userData?.email}</p>
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
          className='md:hidden text-gray-700 hover:text-blue-600 transition-colors'
        >
          {showMobileMenu ? (
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          ) : (
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
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
            <Link
              to='/services'
              onClick={() => setShowMobileMenu(false)}
              className='block text-gray-700 font-medium hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors'
            >
              Services
            </Link>

            {/* Mobile Auth Section */}
            {isLoggedIn ? (
              <div className='border-t border-gray-200 pt-3 mt-3'>
                <div className='px-3 py-2 mb-2'>
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold'>
                      {userData?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className='font-semibold text-gray-800'>{userData?.fullName}</p>
                      <p className='text-xs text-gray-500 truncate'>{userData?.email}</p>
                    </div>
                  </div>
                </div>
                <Link
                  to='/profile'
                  onClick={() => setShowMobileMenu(false)}
                  className='block text-gray-700 font-medium hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors'
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
                  onClick={() => setShowMobileMenu(false)}
                  className='block text-gray-700 font-medium hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors'
                >
                  <div className='flex items-center gap-3'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                    </svg>
                    My Orders
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setShowMobileMenu(false)
                  }}
                  className='w-full text-left text-red-600 font-medium py-2 px-3 rounded-lg hover:bg-red-50 transition-colors'
                >
                  <div className='flex items-center gap-3'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                    </svg>
                    Logout
                  </div>
                </button>
              </div>
            ) : (
              <div className='border-t border-gray-200 pt-3 mt-3 space-y-2'>
                <Link
                  to='/login'
                  onClick={() => setShowMobileMenu(false)}
                  className='block text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md'
                >
                  Login
                </Link>
                <Link
                  to='/signup'
                  onClick={() => setShowMobileMenu(false)}
                  className='block text-center bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all'
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
