import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import api from '../config/axios'

const Users = () => {
  const { subAdmin } = useApp()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/admin/users')
      if (response.data.success) {
        setUsers(response.data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      alert('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId) => {
    if (!subAdmin?.permissions?.canApproveUsers) {
      alert('You do not have permission to approve users')
      return
    }

    if (!window.confirm('Are you sure you want to approve this user?')) return

    try {
      const response = await api.put(`/api/admin/users/${userId}/approve`)
      if (response.data.success) {
        alert('User approved successfully!')
        fetchUsers()
      } else {
        alert(response.data.message || 'Failed to approve user')
      }
    } catch (error) {
      console.error('Error approving user:', error)
      alert(error.response?.data?.message || 'Failed to approve user')
    }
  }

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile?.toString().includes(searchTerm)
  )

  // Calculate stats
  const stats = {
    total: users.length,
    pending: users.filter(u => !u.paymentVerified && !u.isRejected).length,
    approved: users.filter(u => u.paymentVerified).length,
    rejected: users.filter(u => u.isRejected).length
  }

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-2xl md:text-3xl font-black text-gray-800 mb-1 md:mb-2'>User Management</h1>
        <p className='text-sm md:text-base text-gray-600'>View and manage user applications</p>
      </div>

      {/* Permission Notice */}
      <div className='mb-6 bg-purple-50 border border-purple-200 rounded-xl p-4'>
        <h3 className='text-sm font-semibold text-purple-900 mb-2'>Your Permissions:</h3>
        <div className='flex flex-wrap gap-2'>
          {subAdmin?.permissions?.canViewUsers && (
            <span className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold'>
              ✓ View Users
            </span>
          )}
          {subAdmin?.permissions?.canEditUsers && (
            <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold'>
              ✓ Edit Users
            </span>
          )}
          {subAdmin?.permissions?.canDeleteUsers && (
            <span className='px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold'>
              ✓ Delete Users
            </span>
          )}
          {subAdmin?.permissions?.canApproveUsers && (
            <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold'>
              ✓ Approve Users
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Total Users</div>
          <div className='text-3xl font-black text-blue-600'>{stats.total}</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-yellow-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Pending</div>
          <div className='text-3xl font-black text-yellow-600'>{stats.pending}</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-green-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Approved</div>
          <div className='text-3xl font-black text-green-600'>{stats.approved}</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-red-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Rejected</div>
          <div className='text-3xl font-black text-red-600'>{stats.rejected}</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8'>
        <div className='p-6 border-b border-gray-200'>
          <input
            type='text'
            placeholder='Search users by name, email, or mobile...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
        </div>

        {loading ? (
          <div className='p-12 text-center text-gray-500'>
            <div className='w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className='p-12 text-center text-gray-500'>No users found</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className='hidden md:block overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>User Details</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Contact</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Gotra</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Status</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className='hover:bg-gray-50 transition'>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold'>
                            {user.fullName?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className='font-semibold text-gray-800'>{user.fullName}</div>
                            <div className='text-xs text-gray-500'>Father: {user.fatherName}</div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='space-y-1'>
                          <div className='text-sm text-blue-600 font-medium'>{user.mobile}</div>
                          {user.email && (
                            <div className='text-xs text-gray-600'>{user.email}</div>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold'>
                          {user.gotra}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        {user.paymentVerified ? (
                          <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold'>
                            ✓ Approved
                          </span>
                        ) : user.isRejected ? (
                          <span className='px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold'>
                            ✗ Rejected
                          </span>
                        ) : (
                          <span className='px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold'>
                            ⏳ Pending
                          </span>
                        )}
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          {!user.paymentVerified && !user.isRejected && subAdmin?.permissions?.canApproveUsers && (
                            <button
                              onClick={() => handleApprove(user._id)}
                              className='px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200 transition'
                            >
                              Approve
                            </button>
                          )}
                          {!subAdmin?.permissions?.canApproveUsers && !user.paymentVerified && (
                            <span className='text-xs text-gray-500 italic'>No permission</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className='md:hidden divide-y divide-gray-200'>
              {filteredUsers.map((user) => (
                <div key={user._id} className='p-4 hover:bg-gray-50 transition'>
                  <div className='flex items-start gap-3 mb-3'>
                    <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold'>
                      {user.fullName?.[0]?.toUpperCase()}
                    </div>
                    <div className='flex-1'>
                      <div className='font-bold text-gray-800'>{user.fullName}</div>
                      <div className='text-xs text-gray-500'>Father: {user.fatherName}</div>
                      <div className='text-sm text-blue-600 font-medium mt-1'>{user.mobile}</div>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 mb-3'>
                    <span className='px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold'>
                      {user.gotra}
                    </span>
                    {user.paymentVerified ? (
                      <span className='px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold'>
                        Approved
                      </span>
                    ) : user.isRejected ? (
                      <span className='px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold'>
                        Rejected
                      </span>
                    ) : (
                      <span className='px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold'>
                        Pending
                      </span>
                    )}
                  </div>
                  {!user.paymentVerified && !user.isRejected && subAdmin?.permissions?.canApproveUsers && (
                    <button
                      onClick={() => handleApprove(user._id)}
                      className='w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition'
                    >
                      Approve User
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Users
