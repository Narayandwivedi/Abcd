import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()

  const menuItems = [
    {
      name: 'Dashboard',
      icon: '📊',
      path: '/dashboard',
      description: 'Overview & Analytics'
    },
    {
      name: 'Products',
      icon: '📦',
      path: '/products',
      description: 'Manage Products'
    },
    {
      name: 'Add Product',
      icon: '➕',
      path: '/add-product',
      description: 'Add New Product'
    },
    {
      name: 'Orders',
      icon: '🛒',
      path: '/orders',
      description: 'Customer Orders'
    },
    {
      name: 'Payments',
      icon: '💳',
      path: '/payments',
      description: 'Payment History'
    },
    {
      name: 'Reports',
      icon: '📈',
      path: '/reports',
      description: 'Sales & Analytics'
    },
    {
      name: 'Settings',
      icon: '⚙️',
      path: '/settings',
      description: 'Business Settings'
    }
  ]

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
      <div className={`fixed left-0 top-0 h-full bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 text-white transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 w-64 shadow-2xl`}>

        {/* Logo */}
        <div className="p-6 border-b border-purple-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-black text-white">V</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-pink-200">
                  ABCD
                </h1>
                <p className="text-xs text-purple-300 font-medium">
                  Vendor Panel
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
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-200px)]">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-indigo-600/30 to-pink-600/30 border border-indigo-400/40 shadow-lg'
                  : 'hover:bg-white/10 hover:border border-transparent hover:border-indigo-400/20'
              }`}
            >
              <span className={`text-xl ${isActive(item.path) ? 'text-indigo-300' : 'text-purple-200 group-hover:text-indigo-300'}`}>
                {item.icon}
              </span>
              <div className="flex-1">
                <div className={`font-semibold ${isActive(item.path) ? 'text-indigo-100' : 'text-purple-100 group-hover:text-white'}`}>
                  {item.name}
                </div>
                <div className={`text-xs ${isActive(item.path) ? 'text-indigo-300' : 'text-purple-400 group-hover:text-indigo-300'}`}>
                  {item.description}
                </div>
              </div>
              {isActive(item.path) && (
                <div className="ml-auto w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-700/30 bg-purple-900/50">
          <div className="flex items-center space-x-3 px-4 py-3 bg-black/20 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              V
            </div>
            <div>
              <div className="font-semibold text-purple-100">Vendor Name</div>
              <div className="text-xs text-purple-300">Vendor</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
