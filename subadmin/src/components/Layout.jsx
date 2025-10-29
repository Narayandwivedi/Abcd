import { useState } from 'react'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className='lg:ml-64 min-h-screen'>
        {/* Top Bar */}
        <header className='bg-white border-b border-gray-200 sticky top-0 z-30'>
          <div className='flex items-center justify-between px-4 py-4'>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className='lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <svg className='w-6 h-6 text-gray-700' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>

            {/* Logo for Mobile */}
            <div className='lg:hidden flex items-center gap-2'>
              <div className='w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center'>
                <span className='text-lg font-black text-white'>S</span>
              </div>
              <span className='font-bold text-gray-800'>Sub Admin</span>
            </div>

            {/* Right Side - Desktop Title */}
            <div className='hidden lg:block'>
              <h2 className='text-xl font-bold text-gray-800'>Sub Admin Panel</h2>
            </div>

            {/* Placeholder for mobile */}
            <div className='lg:hidden w-8'></div>
          </div>
        </header>

        {/* Page Content */}
        <main className='p-0'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
