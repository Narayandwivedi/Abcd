import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const [vendorName] = useState('Vendor Store') // This would come from your auth context

  const handleLogout = () => {
    // Add your logout logic here
    navigate('/login')
  }

  const stats = [
    {
      title: 'Total Products',
      value: '24',
      change: '+12%',
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Pending Orders',
      value: '8',
      change: '+3',
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Total Revenue',
      value: '$12,450',
      change: '+23%',
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
        </svg>
      ),
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Customers',
      value: '156',
      change: '+18',
      icon: (
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600'
    }
  ]

  const quickActions = [
    {
      title: 'Add Product',
      description: 'List a new product',
      icon: (
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
        </svg>
      ),
      color: 'bg-green-500'
    },
    {
      title: 'View Orders',
      description: 'Manage your orders',
      icon: (
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
        </svg>
      ),
      color: 'bg-blue-500'
    },
    {
      title: 'Analytics',
      description: 'View performance',
      icon: (
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
        </svg>
      ),
      color: 'bg-purple-500'
    },
    {
      title: 'Settings',
      description: 'Store preferences',
      icon: (
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
        </svg>
      ),
      color: 'bg-gray-500'
    }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Header */}
      <header className='bg-white shadow-md border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-4'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl shadow-lg'>
                <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                </svg>
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-800'>Vendor Dashboard</h1>
                <p className='text-sm text-gray-600'>{vendorName}</p>
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <button className='p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition'>
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className='px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition shadow-md hover:shadow-lg'
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Welcome Banner */}
        <div className='bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl shadow-xl p-8 mb-8 text-white'>
          <h2 className='text-3xl font-bold mb-2'>Welcome Back! 👋</h2>
          <p className='text-green-100'>Here's what's happening with your store today.</p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {stats.map((stat, index) => (
            <div key={index} className='bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div className={`bg-gradient-to-br ${stat.color} text-white p-3 rounded-xl shadow-lg`}>
                  {stat.icon}
                </div>
                <span className='text-green-600 text-sm font-semibold bg-green-100 px-2 py-1 rounded-lg'>
                  {stat.change}
                </span>
              </div>
              <h3 className='text-gray-600 text-sm font-semibold mb-1'>{stat.title}</h3>
              <p className='text-3xl font-bold text-gray-800'>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className='grid lg:grid-cols-3 gap-6'>
          {/* Quick Actions */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-xl shadow-md p-6'>
              <h3 className='text-xl font-bold text-gray-800 mb-6'>Quick Actions</h3>
              <div className='grid md:grid-cols-2 gap-4'>
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className='flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-200 hover:border-gray-300 hover:shadow-md'
                  >
                    <div className={`${action.color} text-white p-3 rounded-lg`}>
                      {action.icon}
                    </div>
                    <div className='text-left'>
                      <h4 className='font-semibold text-gray-800'>{action.title}</h4>
                      <p className='text-sm text-gray-600'>{action.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-xl shadow-md p-6'>
              <h3 className='text-xl font-bold text-gray-800 mb-6'>Recent Activity</h3>
              <div className='space-y-4'>
                <div className='flex items-start space-x-3 pb-4 border-b border-gray-200'>
                  <div className='bg-green-100 p-2 rounded-lg'>
                    <svg className='w-5 h-5 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                    </svg>
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-semibold text-gray-800'>New Order Received</p>
                    <p className='text-xs text-gray-600'>Order #12345</p>
                    <p className='text-xs text-gray-500 mt-1'>5 minutes ago</p>
                  </div>
                </div>

                <div className='flex items-start space-x-3 pb-4 border-b border-gray-200'>
                  <div className='bg-blue-100 p-2 rounded-lg'>
                    <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
                    </svg>
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-semibold text-gray-800'>Product Updated</p>
                    <p className='text-xs text-gray-600'>Premium Widget</p>
                    <p className='text-xs text-gray-500 mt-1'>2 hours ago</p>
                  </div>
                </div>

                <div className='flex items-start space-x-3'>
                  <div className='bg-purple-100 p-2 rounded-lg'>
                    <svg className='w-5 h-5 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                    </svg>
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-semibold text-gray-800'>Review Received</p>
                    <p className='text-xs text-gray-600'>5 stars rating</p>
                    <p className='text-xs text-gray-500 mt-1'>1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
