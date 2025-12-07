import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import axios from 'axios'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { subAdmin, setSubAdmin } = useApp()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/subadmin/logout`, {}, {
        withCredentials: true
      })
      setSubAdmin(null)
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Logout anyway on client side
      setSubAdmin(null)
      navigate('/login')
    }
  }

  // Filter menu items based on permissions
  const getMenuItems = () => {
    const items = []

    // Dashboard - always visible
    items.push({
      name: 'Dashboard',
      icon: '📊',
      path: '/',
      description: 'Overview'
    })

    // Users menu - show only if has any user permission
    if (subAdmin?.permissions?.canViewUsers) {
      items.push({
        name: 'Users',
        icon: '👥',
        path: '/users',
        description: 'Manage Users'
      })
    }

    // Vendors menu - show only if has any vendor permission
    if (subAdmin?.permissions?.canViewVendors) {
      items.push({
        name: 'Vendors',
        icon: '🏪',
        path: '/vendors',
        description: 'Manage Vendors'
      })
    }

    // Ads menu - show only if has ad view permission
    if (subAdmin?.permissions?.canViewAds) {
      items.push({
        name: 'Ads',
        icon: '📢',
        path: '/ads',
        description: 'Manage Ads'
      })
    }

    return items
  }

  const menuItems = getMenuItems()
  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 w-64 shadow-2xl`}>

        {/* Logo */}
        <div className="p-6 border-b border-purple-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-black text-white">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-blue-200">
                  ABCD
                </h1>
                <p className="text-xs text-purple-300 font-medium">
                  Sub Admin Panel
                </p>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-purple-300 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Close Sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-280px)]">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-400/40 shadow-lg'
                    : 'hover:bg-white/10 hover:border border-transparent hover:border-purple-400/20'
                }`}
              >
                <span className={`text-xl ${isActive(item.path) ? 'text-purple-300' : 'text-purple-200 group-hover:text-purple-300'}`}>
                  {item.icon}
                </span>
                <div className="flex-1">
                  <div className={`font-semibold ${isActive(item.path) ? 'text-purple-100' : 'text-purple-100 group-hover:text-white'}`}>
                    {item.name}
                  </div>
                  <div className={`text-xs ${isActive(item.path) ? 'text-purple-300' : 'text-purple-400 group-hover:text-purple-300'}`}>
                    {item.description}
                  </div>
                </div>
                {isActive(item.path) && (
                  <div className="ml-auto w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                )}
              </Link>
            ))
          ) : (
            <div className="px-4 py-8 text-center">
              <div className="mb-4 text-purple-300 text-4xl">🔒</div>
              <p className="text-purple-200 text-sm mb-2 font-semibold">No Access Granted</p>
              <p className="text-purple-400 text-xs">
                Contact your administrator to get permissions
              </p>
            </div>
          )}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-700/30 bg-purple-900/50 space-y-2">
          {/* User Info */}
          <div className="flex items-center space-x-3 px-4 py-3 bg-black/20 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {subAdmin?.fullName?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-purple-100 text-sm truncate">{subAdmin?.fullName || 'Sub Admin'}</div>
              <div className="text-xs text-purple-300">Sub Administrator</div>
            </div>
          </div>

          {/* Logout Button */}
          {!showLogoutConfirm ? (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white rounded-xl transition-all duration-200 border border-red-400/20 hover:border-red-400/40"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-semibold text-sm">Logout</span>
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-purple-200 text-center">Are you sure?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleLogout}
                  className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition"
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Sidebar
