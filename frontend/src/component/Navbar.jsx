import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

const Navbar = () => {
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
          <Link to='/login' className='bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:scale-105'>
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className='md:hidden text-gray-700 hover:text-blue-600 transition-colors'>
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
          </svg>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
