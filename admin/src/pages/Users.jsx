import { useState, useEffect } from 'react'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })

  // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  // Fetch all users
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/admin/users`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        setUsers(data.users)
        calculateStats(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      alert('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (userList) => {
    const total = userList.length
    const pending = userList.filter(u => !u.paymentVerified && !u.isRejected).length
    const approved = userList.filter(u => u.paymentVerified).length
    const rejected = userList.filter(u => u.isRejected).length

    setStats({ total, pending, approved, rejected })
  }

  // Approve user
  const handleApprove = async (userId) => {
    if (!window.confirm('Are you sure you want to approve this user?')) return

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${userId}/approve`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        alert('User approved successfully!')
        fetchUsers()
      } else {
        alert(data.message || 'Failed to approve user')
      }
    } catch (error) {
      console.error('Error approving user:', error)
      alert('Failed to approve user')
    }
  }

  // Set password modal
  const openPasswordModal = (user) => {
    setSelectedUser(user)
    setNewPassword('')
    setShowPasswordModal(true)
  }

  const handleSetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${selectedUser._id}/set-password`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      })
      const data = await response.json()

      if (data.success) {
        alert('Password set successfully!')
        setShowPasswordModal(false)
        setNewPassword('')
        fetchUsers()
      } else {
        alert(data.message || 'Failed to set password')
      }
    } catch (error) {
      console.error('Error setting password:', error)
      alert('Failed to set password')
    }
  }

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile?.toString().includes(searchTerm)
  )

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-black text-gray-800 mb-2'>User Applications</h1>
          <p className='text-gray-600'>Manage user registrations and approvals</p>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Total Applications</div>
          <div className='text-3xl font-black text-blue-600'>{stats.total}</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-yellow-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Pending Approval</div>
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

      {/* Users Table */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
        <div className='p-6 border-b border-gray-200'>
          <input
            type='text'
            placeholder='Search users by name, email, or mobile...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {loading ? (
          <div className='p-12 text-center text-gray-500'>Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className='p-12 text-center text-gray-500'>No users found</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>User Details</th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Contact</th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Gotra</th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Payment</th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Status</th>
                  <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className='hover:bg-gray-50 transition'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        {user.passportPhoto ? (
                          <img
                            src={`${BACKEND_URL}/${user.passportPhoto}`}
                            alt={user.fullName}
                            className='w-12 h-12 rounded-full object-cover border-2 border-gray-200'
                          />
                        ) : (
                          <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold'>
                            {user.fullName?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className='font-semibold text-gray-800'>{user.fullName}</div>
                          <div className='text-xs text-gray-500'>Father: {user.fatherName}</div>
                          <div className='text-xs text-gray-500'>{user.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-2'>
                          <a
                            href={`tel:${user.mobile}`}
                            className='text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1'
                          >
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                            </svg>
                            {user.mobile}
                          </a>
                        </div>
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
                      <div className='text-sm'>
                        {user.utrNumber && (
                          <div className='text-gray-600'>UTR: {user.utrNumber}</div>
                        )}
                        {user.paymentScreenshot && (
                          <a
                            href={`${BACKEND_URL}/${user.paymentScreenshot}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:underline text-xs'
                          >
                            View Screenshot
                          </a>
                        )}
                      </div>
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
                        {/* Call Button */}
                        <a
                          href={`tel:${user.mobile}`}
                          className='p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition'
                          title='Call User'
                        >
                          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                          </svg>
                        </a>

                        {/* Set Password Button */}
                        <button
                          onClick={() => openPasswordModal(user)}
                          className='p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition'
                          title='Set Password'
                        >
                          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' />
                          </svg>
                        </button>

                        {/* Approve Button */}
                        {!user.paymentVerified && !user.isRejected && (
                          <button
                            onClick={() => handleApprove(user._id)}
                            className='px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition'
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Password Modal */}
      {showPasswordModal && selectedUser && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl p-6 max-w-md w-full'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>Set Password</h2>
            <p className='text-gray-600 mb-4'>
              Setting password for: <strong>{selectedUser.fullName}</strong>
            </p>
            <input
              type='text'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='Enter new password'
              className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4'
            />
            <div className='flex gap-3'>
              <button
                onClick={handleSetPassword}
                className='flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition'
              >
                Set Password
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className='flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
