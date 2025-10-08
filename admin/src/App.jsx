import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Vendors from './pages/Vendors'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Categories from './pages/Categories'
import Payments from './pages/Payments'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <Router>
      <div className='min-h-screen bg-gray-50'>
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main Content */}
        <div className='lg:ml-64 min-h-screen'>
          {/* Top Header */}
          <header className='bg-white shadow-md sticky top-0 z-30 border-b border-gray-200'>
            <div className='p-4 flex items-center justify-between'>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className='lg:hidden text-gray-700 hover:text-blue-600 p-2 hover:bg-gray-100 rounded-lg transition'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                </svg>
              </button>

              <div className='flex items-center gap-4 ml-auto'>
                <button className='relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition'>
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
                  </svg>
                  <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
                </button>

                <div className='flex items-center gap-3 px-3 py-2 bg-gray-100 rounded-xl'>
                  <div className='w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md'>
                    LA
                  </div>
                  <div className='hidden md:block'>
                    <div className='text-sm font-semibold text-gray-800'>Lalit Agrawal</div>
                    <div className='text-xs text-gray-600'>Super Admin</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/users' element={<Users />} />
              <Route path='/vendors' element={<Vendors />} />
              <Route path='/products' element={<Products />} />
              <Route path='/orders' element={<Orders />} />
              <Route path='/categories' element={<Categories />} />
              <Route path='/payments' element={<Payments />} />
              <Route path='/reports' element={<Reports />} />
              <Route path='/settings' element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
