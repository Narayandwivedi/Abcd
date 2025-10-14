import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-gray-800 text-white mt-auto mb-10 md:mb-0'>
      <div className='container mx-auto px-4 py-4 md:py-8'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8'>
          {/* Company Info - Hidden on Mobile */}
          <div className='hidden md:block'>
            <h3 className='text-xl font-bold mb-4'>ABCD</h3>
            <p className='text-gray-400 text-sm'>
              Your trusted platform for all your needs. Building better solutions for tomorrow.
            </p>
          </div>

          {/* Links Section - Mobile: Combined, Desktop: Quick Links */}
          <div>
            <h4 className='text-sm md:text-lg font-semibold mb-2 md:mb-4'>Links</h4>
            <ul className='space-y-1 md:space-y-2 text-xs md:text-base'>
              <li>
                <Link to='/' className='text-gray-400 hover:text-white transition'>Home</Link>
              </li>
              <li>
                <Link to='/terms' className='text-gray-400 hover:text-white transition'>Terms & Conditions</Link>
              </li>
              <li>
                <Link to='/privacy' className='text-gray-400 hover:text-white transition'>Privacy Policy</Link>
              </li>
              <li className='hidden md:block'>
                <Link to='/about' className='text-gray-400 hover:text-white transition'>About</Link>
              </li>
              <li className='hidden md:block'>
                <Link to='/services' className='text-gray-400 hover:text-white transition'>Services</Link>
              </li>
            </ul>
          </div>

          {/* Legal - Desktop Only */}
          <div className='hidden md:block'>
            <h4 className='text-lg font-semibold mb-4'>Legal</h4>
            <ul className='space-y-2'>
              <li>
                <Link to='/terms' className='text-gray-400 hover:text-white transition'>Terms & Conditions</Link>
              </li>
              <li>
                <Link to='/privacy' className='text-gray-400 hover:text-white transition'>Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className='text-sm md:text-lg font-semibold mb-2 md:mb-4'>Contact</h4>
            <ul className='space-y-1 md:space-y-2 text-gray-400 text-[10px] md:text-sm'>
              <li>Email: cgpasabcd@gmail.com</li>
              <li>Tele: 0771-3562323</li>
              <li>Mob: +91 9993961778</li>
              <li>Address: Hanuman Market, Ramsagar Para,<br/><span className='font-bold text-yellow-400'>RAIPUR (CG)</span> <span className='font-bold text-yellow-400'>492001</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm'>
          <p>&copy; {new Date().getFullYear()} ABCD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
