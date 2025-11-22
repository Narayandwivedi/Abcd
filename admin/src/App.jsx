import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AdminAuthProvider } from './context/AdminAuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Vendors from './pages/Vendors'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Categories from './pages/Categories'
import Payments from './pages/Payments'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import SubAdmin from './pages/SubAdmin'
import BuyLeads from './pages/BuyLeads'
import SellLeads from './pages/SellLeads'
import Cities from './pages/Cities'
import { useAdminAuth } from './context/AdminAuthContext'

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { admin } = useAdminAuth()

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className='lg:ml-64 min-h-screen'>
        {/* Top Header */}
        <header className='bg-white shadow-md sticky top-0 z-30 border-b border-gray-200'>
          <div className='p-2 md:p-4 flex items-center justify-between'>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className='lg:hidden text-gray-700 hover:text-blue-600 p-2 hover:bg-gray-100 rounded-lg transition'
            >
              <svg className='w-5 h-5 md:w-6 md:h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/users'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Users />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/vendors'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Vendors />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/products'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Products />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/orders'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Orders />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/categories'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Categories />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/payments'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Payments />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/reports'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Reports />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/settings'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Settings />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/subadmin'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <SubAdmin />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/buy-leads'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <BuyLeads />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/sell-leads'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <SellLeads />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/cities'
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Cities />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={800}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AdminAuthProvider>
    </Router>
  )
}

export default App
