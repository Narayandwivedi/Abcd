import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-gray-800 text-white mt-auto'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div>
            <h3 className='text-xl font-bold mb-4'>ABCD</h3>
            <p className='text-gray-400 text-sm'>
              Your trusted platform for all your needs. Building better solutions for tomorrow.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Quick Links</h4>
            <ul className='space-y-2'>
              <li>
                <Link to='/' className='text-gray-400 hover:text-white transition'>Home</Link>
              </li>
              <li>
                <Link to='/about' className='text-gray-400 hover:text-white transition'>About</Link>
              </li>
              <li>
                <Link to='/services' className='text-gray-400 hover:text-white transition'>Services</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
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
            <h4 className='text-lg font-semibold mb-4'>Contact</h4>
            <ul className='space-y-2 text-gray-400 text-sm'>
              <li>Email: info@abcd.com</li>
              <li>Phone: +1 234 567 890</li>
              <li>Address: 123 Main St, City</li>
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
