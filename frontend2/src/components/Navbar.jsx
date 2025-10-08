import { Link } from 'react-router-dom'
import Logo from './Logo'

const Navbar = () => {
  return (
    <nav className='bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 shadow-md sticky top-0 z-50 border-b-2 border-purple-200'>
      <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
        {/* Logo */}
        <Logo />

        {/* Navigation Links */}
        <div className='hidden md:flex items-center gap-6'>
          <Link to='/' className='relative text-gray-700 font-semibold hover:text-purple-600 transition-colors group px-3 py-2'>
            Home
            <span className='absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300 rounded-full'></span>
          </Link>
          <Link to='/about' className='relative text-gray-700 font-semibold hover:text-purple-600 transition-colors group px-3 py-2'>
            About
            <span className='absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300 rounded-full'></span>
          </Link>
          <Link to='/services' className='relative text-gray-700 font-semibold hover:text-purple-600 transition-colors group px-3 py-2'>
            Services
            <span className='absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300 rounded-full'></span>
          </Link>
          <Link to='/contact' className='relative text-gray-700 font-semibold hover:text-purple-600 transition-colors group px-3 py-2'>
            Contact
            <span className='absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300 rounded-full'></span>
          </Link>
          <Link to='/login' className='bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-7 py-2.5 rounded-full font-bold hover:from-purple-700 hover:via-pink-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-110'>
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className='md:hidden text-purple-600 hover:text-pink-600 transition-colors'>
          <svg className='w-7 h-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M4 6h16M4 12h16M4 18h16' />
          </svg>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
