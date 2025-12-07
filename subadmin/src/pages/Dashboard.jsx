import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import axios from 'axios'

const Dashboard = () => {
  const { subAdmin } = useApp()
  const [users, setUsers] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'
  const hasUserPermission = subAdmin?.permissions?.canViewUsers
  const hasVendorPermission = subAdmin?.permissions?.canViewVendors

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch users if has permission
      if (hasUserPermission) {
        const userResponse = await axios.get(`${BACKEND_URL}/api/admin/users`, {
          withCredentials: true
        })
        if (userResponse.data.success) {
          setUsers(userResponse.data.users)
        }
      }

      // Fetch vendors if has permission
      if (hasVendorPermission) {
        const vendorResponse = await axios.get(`${BACKEND_URL}/api/admin/vendors`, {
          withCredentials: true
        })
        if (vendorResponse.data.success) {
          setVendors(vendorResponse.data.vendors)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate user statistics
  const userStats = {
    total: users.length,
    approved: users.filter(u => u.paymentVerified).length,
    pending: users.filter(u => !u.paymentVerified && !u.isRejected).length,
    rejected: users.filter(u => u.isRejected).length
  }

  // Calculate vendor statistics
  const vendorStats = {
    total: vendors.length,
    verified: vendors.filter(v => v.isVerified).length,
    pending: vendors.filter(v => !v.isVerified).length,
    active: vendors.filter(v => v.isActive).length
  }

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-2xl md:text-3xl font-black text-gray-800 mb-1 md:mb-2'>Dashboard</h1>
        <p className='text-sm md:text-base text-gray-600'>Welcome back, {subAdmin?.fullName}</p>
      </div>

      {loading ? (
        <div className='flex items-center justify-center py-20'>
          <div className='text-center'>
            <div className='w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <div className='space-y-8'>
          {/* User Statistics - Show if has user permission */}
          {hasUserPermission && (
            <div>
              <h2 className='text-lg md:text-xl font-bold text-gray-800 mb-4'>User Statistics</h2>
              <div className='grid grid-cols-2 gap-3 md:gap-6 max-w-4xl'>
                {/* Total Users Card */}
                <div className='bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-lg border border-gray-200'>
                  <div className='flex items-center justify-between mb-2 md:mb-4'>
                    <div className='w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center'>
                      <svg className='w-4 h-4 md:w-6 md:h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />
                      </svg>
                    </div>
                  </div>
                  <div className='text-gray-600 text-xs md:text-sm font-medium mb-1 md:mb-2'>Total Users</div>
                  <div className='text-2xl md:text-4xl font-black text-blue-600'>{userStats.total}</div>
                </div>

                {/* Approved Users Card */}
                <div className='bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-lg border border-green-200'>
                  <div className='flex items-center justify-between mb-2 md:mb-4'>
                    <div className='w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-lg md:rounded-xl flex items-center justify-center'>
                      <svg className='w-4 h-4 md:w-6 md:h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                    </div>
                  </div>
                  <div className='text-gray-600 text-xs md:text-sm font-medium mb-1 md:mb-2'>Approved Users</div>
                  <div className='text-2xl md:text-4xl font-black text-green-600'>{userStats.approved}</div>
                </div>

                {/* Pending Users Card */}
                <div className='bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-lg border border-yellow-200'>
                  <div className='flex items-center justify-between mb-2 md:mb-4'>
                    <div className='w-8 h-8 md:w-12 md:h-12 bg-yellow-100 rounded-lg md:rounded-xl flex items-center justify-center'>
                      <svg className='w-4 h-4 md:w-6 md:h-6 text-yellow-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                    </div>
                  </div>
                  <div className='text-gray-600 text-xs md:text-sm font-medium mb-1 md:mb-2'>Pending Users</div>
                  <div className='text-2xl md:text-4xl font-black text-yellow-600'>{userStats.pending}</div>
                </div>

                {/* Rejected Users Card */}
                <div className='bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-lg border border-red-200'>
                  <div className='flex items-center justify-between mb-2 md:mb-4'>
                    <div className='w-8 h-8 md:w-12 md:h-12 bg-red-100 rounded-lg md:rounded-xl flex items-center justify-center'>
                      <svg className='w-4 h-4 md:w-6 md:h-6 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                    </div>
                  </div>
                  <div className='text-gray-600 text-xs md:text-sm font-medium mb-1 md:mb-2'>Rejected Users</div>
                  <div className='text-2xl md:text-4xl font-black text-red-600'>{userStats.rejected}</div>
                </div>
              </div>
            </div>
          )}

          {/* Vendor Statistics - Show if has vendor permission */}
          {hasVendorPermission && (
            <div>
              <h2 className='text-lg md:text-xl font-bold text-gray-800 mb-4'>Vendor Statistics</h2>
              <div className='grid grid-cols-2 gap-3 md:gap-6 max-w-4xl'>
                {/* Total Vendors Card */}
                <div className='bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-lg border border-gray-200'>
                  <div className='flex items-center justify-between mb-2 md:mb-4'>
                    <div className='w-8 h-8 md:w-12 md:h-12 bg-indigo-100 rounded-lg md:rounded-xl flex items-center justify-center'>
                      <svg className='w-4 h-4 md:w-6 md:h-6 text-indigo-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                      </svg>
                    </div>
                  </div>
                  <div className='text-gray-600 text-xs md:text-sm font-medium mb-1 md:mb-2'>Total Vendors</div>
                  <div className='text-2xl md:text-4xl font-black text-indigo-600'>{vendorStats.total}</div>
                </div>

                {/* Verified Vendors Card */}
                <div className='bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-lg border border-green-200'>
                  <div className='flex items-center justify-between mb-2 md:mb-4'>
                    <div className='w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-lg md:rounded-xl flex items-center justify-center'>
                      <svg className='w-4 h-4 md:w-6 md:h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' />
                      </svg>
                    </div>
                  </div>
                  <div className='text-gray-600 text-xs md:text-sm font-medium mb-1 md:mb-2'>Verified Vendors</div>
                  <div className='text-2xl md:text-4xl font-black text-green-600'>{vendorStats.verified}</div>
                </div>

                {/* Pending Vendors Card */}
                <div className='bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-lg border border-yellow-200'>
                  <div className='flex items-center justify-between mb-2 md:mb-4'>
                    <div className='w-8 h-8 md:w-12 md:h-12 bg-yellow-100 rounded-lg md:rounded-xl flex items-center justify-center'>
                      <svg className='w-4 h-4 md:w-6 md:h-6 text-yellow-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                    </div>
                  </div>
                  <div className='text-gray-600 text-xs md:text-sm font-medium mb-1 md:mb-2'>Pending Vendors</div>
                  <div className='text-2xl md:text-4xl font-black text-yellow-600'>{vendorStats.pending}</div>
                </div>

                {/* Active Vendors Card */}
                <div className='bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-lg border border-purple-200'>
                  <div className='flex items-center justify-between mb-2 md:mb-4'>
                    <div className='w-8 h-8 md:w-12 md:h-12 bg-purple-100 rounded-lg md:rounded-xl flex items-center justify-center'>
                      <svg className='w-4 h-4 md:w-6 md:h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                      </svg>
                    </div>
                  </div>
                  <div className='text-gray-600 text-xs md:text-sm font-medium mb-1 md:mb-2'>Active Vendors</div>
                  <div className='text-2xl md:text-4xl font-black text-purple-600'>{vendorStats.active}</div>
                </div>
              </div>
            </div>
          )}

          {/* No permissions message */}
          {!hasUserPermission && !hasVendorPermission && (
            <div className='text-center py-20'>
              <div className='mb-4 text-gray-300 text-6xl'>🔒</div>
              <h3 className='text-xl font-bold text-gray-800 mb-2'>No Access</h3>
              <p className='text-gray-600'>You don't have permission to view any data. Please contact your administrator.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard
