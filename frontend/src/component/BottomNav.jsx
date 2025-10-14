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
    <>
      <nav className='md:hidden fixed left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50' style={{ bottom: '56px' }}>
        <div className='flex justify-around items-center py-1 gap-6 px-4'>
        {/* Home */}
        <Link
          to='/'
          className={`flex flex-col items-center justify-center px-1 py-0.5 transition-colors ${
            isActive('/') ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            isActive('/') ? 'bg-blue-50' : ''
          }`}>
            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
            </svg>
          </div>
          <span className='text-[9px] mt-0.5'>Home</span>
        </Link>

        {/* Vendor Group */}
        <div className='flex gap-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg px-4 py-0.5 border border-purple-200'>
          {/* Join as Vendor */}
          <a
            href='https://vendor.abcdvyapar.com/register'
            target='_blank'
            rel='noopener noreferrer'
            className='flex flex-col items-center justify-center px-1 py-0.5 transition-colors'
          >
            <div className='w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-sm'>
              <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' />
              </svg>
            </div>
            <span className='text-[8px] mt-0.5 leading-tight text-center font-medium text-purple-700'>Join<br/>Vendor</span>
          </a>

          {/* Login as Vendor */}
          <a
            href='https://vendor.abcdvyapar.com/login'
            target='_blank'
            rel='noopener noreferrer'
            className='flex flex-col items-center justify-center px-1 py-0.5 transition-colors'
          >
            <div className='w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-sm'>
              <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' />
              </svg>
            </div>
            <span className='text-[8px] mt-0.5 leading-tight text-center font-medium text-indigo-700'>Login<br/>Vendor</span>
          </a>
        </div>

        {/* Buyer Group */}
        <div className='flex gap-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg px-4 py-0.5 border border-orange-200'>
          {/* Join as Buyer */}
          <Link
            to='/register'
            className='flex flex-col items-center justify-center px-1 py-0.5 transition-colors'
          >
            <div className={`w-6 h-6 rounded-md flex items-center justify-center shadow-sm ${
              isActive('/register')
                ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white'
                : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
            }`}>
              <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' />
              </svg>
            </div>
            <span className={`text-[8px] mt-0.5 leading-tight text-center font-medium ${isActive('/register') ? 'text-orange-700' : 'text-orange-600'}`}>Join<br/>Buyer</span>
          </Link>

          {/* Login as Buyer */}
          <Link
            to='/login'
            className='flex flex-col items-center justify-center px-1 py-0.5 transition-colors'
          >
            <div className={`w-6 h-6 rounded-md flex items-center justify-center shadow-sm ${
              isActive('/login')
                ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
                : 'bg-gradient-to-br from-amber-500 to-amber-600 text-white'
            }`}>
              <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' />
              </svg>
            </div>
            <span className={`text-[8px] mt-0.5 leading-tight text-center font-medium ${isActive('/login') ? 'text-amber-700' : 'text-amber-600'}`}>Login<br/>Buyer</span>
          </Link>
        </div>
      </div>
    </nav>

    {/* Black Strip Below Bottom Nav - Mobile Only */}
    <div className='md:hidden fixed left-0 right-0 bg-black text-white text-center py-1.5 z-40 h-7' style={{ bottom: '28px' }}>
      <p className='text-[10px] font-medium leading-4'>
        Welcome to ABCD Vyapar with 15000+ verified buyers
      </p>
    </div>

    {/* Gray Strip at Very Bottom - Mobile Only */}
    <div className='md:hidden fixed bottom-0 left-0 right-0 bg-slate-700 text-white text-center py-1.5 z-40 h-7'>
      <p className='text-[10px] font-medium leading-4'>
        Empowering growth & empowering unity
      </p>
    </div>
    </>
  )
}

export default BottomNav
