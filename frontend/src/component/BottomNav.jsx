import React, { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const BottomNav = () => {
  const { user, isAuthenticated, logout } = useContext(AppContext)
  const location = useLocation()
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    try {
      await logout()
      setShowProfileMenu(false)
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    }
  }

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

        {/* Join/Login as Vendor */}
        <a
          href='https://vendor.abcdvyapar.com'
          target='_blank'
          rel='noopener noreferrer'
          className='flex flex-col items-center justify-center px-2 py-1.5 transition-colors text-blue-600'
        >
          <div className='w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-md'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
          </div>
          <span className='text-[10px] mt-0.5 font-semibold leading-tight text-center'>Join/Login<br/>as Vendor</span>
        </a>

        {/* Profile / Login */}
        {isAuthenticated ? (
          <div className='relative flex flex-col items-center justify-center px-3 py-1.5'>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className='flex flex-col items-center transition-colors'
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                isActive('/profile') || showProfileMenu
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className={`text-xs mt-0.5 ${isActive('/profile') || showProfileMenu ? 'text-blue-600' : 'text-gray-600'}`}>
                Profile
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <>
                {/* Backdrop to close menu */}
                <div
                  className='fixed inset-0 z-40'
                  onClick={() => setShowProfileMenu(false)}
                ></div>

                {/* Menu */}
                <div className='absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50'>
                  <div className='px-4 py-3 border-b border-gray-200'>
                    <p className='font-semibold text-gray-800 text-sm'>{user?.fullName}</p>
                    <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
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
                      <span className='text-sm'>Manage Profile</span>
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
                      <span className='text-sm'>Orders</span>
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
                      <span className='text-sm'>Logout</span>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            to='/login'
            className='flex flex-col items-center justify-center px-2 py-1.5 transition-colors'
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
            <span className={`text-[10px] mt-0.5 leading-tight text-center ${isActive('/login') ? 'text-blue-600' : 'text-gray-600'}`}>
              Join/Login<br/>as Buyer
            </span>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default BottomNav
