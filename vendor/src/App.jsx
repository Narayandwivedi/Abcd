import { useState, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppContextProvider, { AppContext } from './context/AppContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Register from './pages/Register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import AddProduct from './pages/AddProduct'
import Orders from './pages/Orders'
import Payments from './pages/Payments'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import './App.css'

// Layout wrapper for dashboard pages
function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { vendor } = useContext(AppContext)

  console.log('🏗️ DashboardLayout rendering with vendor:', vendor?.businessName || vendor?.email || 'null')

  return (
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
              className='lg:hidden text-gray-700 hover:text-indigo-600 p-2 hover:bg-gray-100 rounded-lg transition'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>

            <div className='flex items-center gap-4 ml-auto'>
              <button className='relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition'>
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
                </svg>
                <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
              </button>

              <div className='flex items-center gap-3 px-3 py-2 bg-gray-100 rounded-xl'>
                <div className='w-9 h-9 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-md'>
                  {vendor?.businessName?.charAt(0).toUpperCase() || 'V'}
                </div>
                <div className='hidden md:block'>
                  <div className='text-sm font-semibold text-gray-800'>{vendor?.businessName || 'Vendor'}</div>
                  <div className='text-xs text-gray-600'>{vendor?.ownerName || 'Owner'}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContextProvider>
        <Routes>
          {/* Public Routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/register' element={<Register />} />

          {/* Protected Dashboard Routes */}
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Home />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/products'
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Products />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/add-product'
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AddProduct />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/orders'
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Orders />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/payments'
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Payments />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/reports'
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Reports />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/settings'
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Toast Notification Container */}
        <ToastContainer
          position="top-right"
          autoClose={700}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </AppContextProvider>
    </Router>
  )
}

export default App
