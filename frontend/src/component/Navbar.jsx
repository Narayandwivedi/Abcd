import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import Logo3 from './Logo3'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AppContext)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Show the install button
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
      setShowInstallButton(false)
      toast.success('App installed successfully!')
    } else {
      console.log('User dismissed the install prompt')
    }

    // Clear the deferredPrompt for the next time
    setDeferredPrompt(null)
  }

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

          {/* PWA Install Button */}
          {showInstallButton && (
            <button
              onClick={handleInstallClick}
              className='bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2'
              title='Install App'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
              </svg>
              Download App
            </button>
          )}

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

            {/* PWA Install Button for Mobile */}
            {showInstallButton && (
              <button
                onClick={() => {
                  handleInstallClick()
                  setShowMobileMenu(false)
                }}
                className='w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center justify-center gap-2 mt-2'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
                </svg>
                Download App
              </button>
            )}

            {/* Mobile Auth Section - Hidden, using bottom nav instead */}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
