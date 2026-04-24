import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-gray-800 text-white mt-auto mb-10 md:mb-24'>
      <div className='container mx-auto px-4 py-4 md:py-8'>
        <div className='grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8'>
          <div className='hidden md:block'>
            <h3 className='text-xl font-bold mb-4'>ABCD</h3>
            <p className='text-gray-400 text-sm'>
              Your trusted platform for all your needs. Building better solutions for tomorrow.
            </p>
          </div>

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

          <div>
            <h4 className='text-sm md:text-lg font-semibold mb-2 md:mb-4'>Address</h4>
            <div className='space-y-1 md:space-y-2 text-gray-400 text-[10px] md:text-sm'>
              <p>Agrawal Business and Community Development (ABCD)</p>
              <p>Hanuman Market, Ramsagar Para,</p>
              <p className='font-bold text-yellow-400'>RAIPUR (CG) 492001</p>
            </div>

            <div className='hidden md:flex mt-6 flex-col gap-4 max-w-xs'>
              <Link to='/signup' className='block'>
                <div className='relative bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-3 rounded-xl font-bold text-center shadow-lg animate-pulse hover:scale-[1.02] transition-transform'>
                  <p className='text-sm leading-tight'>Join as Buyer</p>
                  <p className='text-xl font-extrabold'>@Rs 499/year</p>
                </div>
              </Link>

              <a
                href='https://vendor.abcdvyapar.com/signup'
                target='_blank'
                rel='noopener noreferrer'
                className='block'
              >
                <div className='relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-xl font-bold text-center shadow-lg animate-pulse hover:scale-[1.02] transition-transform'>
                  <p className='text-sm leading-tight'>Join as Vendor</p>
                  <p className='text-xl font-extrabold'>Register Now</p>
                </div>
              </a>
            </div>
          </div>

          <div>
            <h4 className='text-sm md:text-lg font-semibold mb-2 md:mb-4'>Contact</h4>
            <div className='space-y-1 md:space-y-2 text-gray-400 text-[10px] md:text-sm'>
              <p>
                Tele: <a href='tel:07713562323' className='hover:text-white transition underline'>0771-3562323</a>
              </p>
              <p>
                Mob: <a href='tel:+919993961778' className='hover:text-white transition underline'>+91 9993961778</a>
              </p>
              <p>
                Email: <a href='mailto:cgpasabcd@gmail.com' className='hover:text-white transition underline'>cgpasabcd@gmail.com</a>
              </p>
            </div>
          </div>
        </div>

        <div className='mt-6 flex flex-col gap-3 max-w-xs mx-auto md:hidden'>
          <Link to='/signup' className='block'>
            <div className='relative bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-3 py-2 rounded-lg font-bold text-center shadow-lg animate-pulse hover:scale-[1.02] transition-transform'>
              <p className='text-[11px] leading-tight'>Join as Buyer</p>
              <p className='text-sm font-extrabold'>@Rs 499/year</p>
            </div>
          </Link>

          <a
            href='https://vendor.abcdvyapar.com/signup'
            target='_blank'
            rel='noopener noreferrer'
            className='block'
          >
            <div className='relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg font-bold text-center shadow-lg animate-pulse hover:scale-[1.02] transition-transform'>
              <p className='text-[11px] leading-tight'>Join as Vendor</p>
              <p className='text-sm font-extrabold'>Register Now</p>
            </div>
          </a>
        </div>

        <div className='border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm'>
          <p>&copy; {new Date().getFullYear()} ABCD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
