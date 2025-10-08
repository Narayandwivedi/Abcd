import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 text-white mt-auto'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* About Section */}
          <div>
            <h3 className='text-2xl font-black mb-4 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent'>ABCD</h3>
            <p className='text-purple-200 text-sm leading-relaxed'>
              Agrawal Business & Community Development - Empowering businesses and strengthening communities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-lg font-bold mb-4 text-pink-300'>Quick Links</h4>
            <ul className='space-y-2'>
              <li><Link to='/' className='text-purple-200 hover:text-white transition-colors text-sm'>Home</Link></li>
              <li><Link to='/about' className='text-purple-200 hover:text-white transition-colors text-sm'>About Us</Link></li>
              <li><Link to='/services' className='text-purple-200 hover:text-white transition-colors text-sm'>Services</Link></li>
              <li><Link to='/contact' className='text-purple-200 hover:text-white transition-colors text-sm'>Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className='text-lg font-bold mb-4 text-pink-300'>Our Services</h4>
            <ul className='space-y-2 text-purple-200 text-sm'>
              <li>Business Consulting</li>
              <li>Community Programs</li>
              <li>Networking Events</li>
              <li>Training & Development</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className='text-lg font-bold mb-4 text-pink-300'>Get In Touch</h4>
            <ul className='space-y-2 text-purple-200 text-sm'>
              <li>Email: info@abcd.com</li>
              <li>Phone: +91 123 456 7890</li>
              <li>Location: India</li>
            </ul>
          </div>
        </div>

        <div className='border-t border-purple-700 mt-8 pt-6 text-center'>
          <p className='text-purple-300 text-sm'>
            &copy; 2025 ABCD Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
