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
      {/* Testing Strip with Moving Text */}
      <div className='bg-yellow-400 py-1 overflow-hidden relative'>
        <div className='animate-marquee whitespace-nowrap text-xs md:text-sm font-semibold text-gray-800'>
          <span className='inline-block px-4'>This website is under testing and will be live sooner</span>
          <span className='inline-block px-4'>This website is under testing and will be live sooner</span>
          <span className='inline-block px-4'>This website is under testing and will be live sooner</span>
          <span className='inline-block px-4'>This website is under testing and will be live sooner</span>
        </div>
      </div>

      <div className='container mx-auto px-3 md:px-4 py-1.5 md:py-2 flex justify-between items-center'>
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
          <Link to='/blog' className='text-gray-700 font-medium hover:text-blue-600 transition-colors relative group'>
            Blog
            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300'></span>
          </Link>
          <Link to='/gallery' className='text-gray-700 font-medium hover:text-blue-600 transition-colors relative group'>
            Gallery
            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300'></span>
          </Link>
          <Link to='/contact' className='text-gray-700 font-medium hover:text-blue-600 transition-colors relative group'>
            Contact
            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300'></span>
          </Link>
          <Link to='/vouchers' className='text-gray-700 font-medium hover:text-blue-600 transition-colors relative group'>
            Vouchers
            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300'></span>
          </Link>

          {/* Desktop Contact Icons - Stacked Vertically */}
          <div className='flex flex-col gap-2'>
            {/* WhatsApp Button */}
            <a
              href='https://wa.me/917000484146'
              target='_blank'
              rel='noopener noreferrer'
              className='bg-green-500 hover:bg-green-600 text-white rounded-full p-2 transition-all shadow-md hover:shadow-lg'
              aria-label='Contact on WhatsApp'
            >
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'/>
              </svg>
            </a>

            {/* Phone Button */}
            <a
              href='tel:+917000484146'
              className='bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-all shadow-md hover:shadow-lg'
              aria-label='Call us'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile Contact Icons and Menu Buttons */}
        <div className='md:hidden flex items-center gap-4'>
          {/* Contact Icons - Stacked Vertically */}
          <div className='flex flex-col gap-2.5'>
            {/* WhatsApp Button */}
            <a
              href='https://wa.me/917000484146'
              target='_blank'
              rel='noopener noreferrer'
              className='bg-green-500 hover:bg-green-600 text-white rounded-full p-1.5 transition-all shadow-md'
              aria-label='Contact on WhatsApp'
            >
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'/>
              </svg>
            </a>

            {/* Phone Button */}
            <a
              href='tel:+917000484146'
              className='bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 transition-all shadow-md'
              aria-label='Call us'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
              </svg>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className='text-gray-700 hover:text-blue-600 transition-colors p-1'
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
              to='/blog'
              onClick={() => setShowMobileMenu(false)}
              className='block text-gray-700 font-medium hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors'
            >
              Blog
            </Link>
            <Link
              to='/gallery'
              onClick={() => setShowMobileMenu(false)}
              className='block text-gray-700 font-medium hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors'
            >
              Gallery
            </Link>
            <Link
              to='/contact'
              onClick={() => setShowMobileMenu(false)}
              className='block text-gray-700 font-medium hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors'
            >
              Contact
            </Link>
            <Link
              to='/vouchers'
              onClick={() => setShowMobileMenu(false)}
              className='block text-gray-700 font-medium hover:text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors'
            >
              Vouchers
            </Link>

            {/* Mobile Auth Section - Hidden, using bottom nav instead */}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
