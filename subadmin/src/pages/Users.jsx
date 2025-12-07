import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Users = () => {
  const { subAdmin } = useApp()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${BACKEND_URL}/api/admin/users`, {
        withCredentials: true
      })
      if (response.data.success) {
        setUsers(response.data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId) => {
    if (!subAdmin?.permissions?.canApproveUsers) {
      toast.error('You do not have permission to approve users')
      return
    }

    if (!window.confirm('Are you sure you want to approve this user?')) return

    try {
      const response = await axios.put(`${BACKEND_URL}/api/admin/users/${userId}/approve`, {}, {
        withCredentials: true
      })
      if (response.data.success) {
        toast.success('User approved successfully!')
        fetchUsers()
      } else {
        toast.error(response.data.message || 'Failed to approve user')
      }
    } catch (error) {
      console.error('Error approving user:', error)
      toast.error(error.response?.data?.message || 'Failed to approve user')
    }
  }

  const handlePhotoClick = (photoUrl) => {
    setSelectedPhoto(photoUrl)
    setShowPhotoModal(true)
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
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8'>
        <div className='bg-white rounded-xl p-3 md:p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-xs md:text-sm font-medium mb-1 md:mb-2'>Total Users</div>
          <div className='text-xl md:text-3xl font-black text-blue-600'>{stats.total}</div>
        </div>
        <div className='bg-white rounded-xl p-3 md:p-6 shadow-lg border border-yellow-200'>
          <div className='text-gray-600 text-xs md:text-sm font-medium mb-1 md:mb-2'>Pending</div>
          <div className='text-xl md:text-3xl font-black text-yellow-600'>{stats.pending}</div>
        </div>
        <div className='bg-white rounded-xl p-3 md:p-6 shadow-lg border border-green-200'>
          <div className='text-gray-600 text-xs md:text-sm font-medium mb-1 md:mb-2'>Approved</div>
          <div className='text-xl md:text-3xl font-black text-green-600'>{stats.approved}</div>
        </div>
        <div className='bg-white rounded-xl p-3 md:p-6 shadow-lg border border-red-200'>
          <div className='text-gray-600 text-xs md:text-sm font-medium mb-1 md:mb-2'>Rejected</div>
          <div className='text-xl md:text-3xl font-black text-red-600'>{stats.rejected}</div>
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
          <div className='p-4 md:p-6'>
            {/* Card Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
              {filteredUsers.map((user) => (
                <div key={user._id} className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300'>
                  {/* Card Header with Gradient Background */}
                  <div className='bg-gradient-to-r- from-purple-50 via-blue-50 to-pink-50 p-4'>
                    <div className='flex items-start gap-3'>
                      {/* Profile Photo with Ring */}
                      <div className='flex flex-col items-center gap-2'>
                        <div className='relative shrink-0'>
                          {user.passportPhoto ? (
                            <img
                              src={`${BACKEND_URL}/${user.passportPhoto}`}
                              alt={user.fullName}
                              onClick={() => handlePhotoClick(`${BACKEND_URL}/${user.passportPhoto}`)}
                              className='w-16 h-16 rounded-full object-cover border-4 border-white shadow-md cursor-pointer hover:scale-105 transition-transform duration-200'
                            />
                          ) : (
                            <div className='w-16 h-16 bg-gradient-to-br- from-purple-500 via-blue-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md border-4 border-white'>
                              {user.fullName?.[0]?.toUpperCase()}
                            </div>
                          )}
                          {/* Status Indicator Dot */}
                          {user.paymentVerified && (
                            <div className='absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-md flex items-center justify-center'>
                              <svg className='w-3 h-3 text-white' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                              </svg>
                            </div>
                          )}
                        </div>
                        {/* Download Icon */}
                        {user.passportPhoto && (
                          <a
                            href={`${BACKEND_URL}/${user.passportPhoto}`}
                            download={`${user.fullName}_photo.jpg`}
                            className='w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all shadow-md hover:shadow-lg'
                            title='Download Photo'
                          >
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
                            </svg>
                          </a>
                        )}
                      </div>

                      {/* User Info */}
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-bold text-gray-900 text-sm leading-tight mb-0.5'>{user.fullName}</h3>
                        <p className='text-xs text-gray-600 mb-0.5'>
                          <span className='font-medium'>{user.relationship || 'S/O'}</span> {user.relativeName}
                        </p>
                        {user.activeCertificate?.certificateNumber && (
                          <div className='inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold mb-0.5 whitespace-nowrap'>
                            <svg className='w-3 h-3 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                              <path fillRule='evenodd' d='M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z' clipRule='evenodd' />
                            </svg>
                            <span className='whitespace-nowrap'>{user.activeCertificate.certificateNumber}</span>
                          </div>
                        )}
                        <div className='flex items-start gap-1 text-xs text-gray-500'>
                          <svg className='w-3 h-3 shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                          </svg>
                          <span className='text-left break-words'>{user.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className='p-4 space-y-3'>
                    {/* Contact Info */}
                    <div className='flex items-center justify-between gap-2 bg-gray-50 rounded-xl p-3'>
                      <a href={`tel:${user.mobile}`} className='flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-xs group'>
                        <div className='p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition'>
                          <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                          </svg>
                        </div>
                        <span className='whitespace-nowrap'>{user.mobile}</span>
                      </a>
                      {user.email && (
                        <a href={`mailto:${user.email}`} className='text-gray-600 hover:text-gray-800 text-xs truncate'>
                          {user.email}
                        </a>
                      )}
                    </div>

                    {/* Gotra & Status Row */}
                    <div className='flex items-center justify-between gap-2'>
                      <div className='flex items-center gap-1.5 bg-purple-50 px-2.5 py-2 rounded-xl'>
                        <svg className='w-3.5 h-3.5 text-purple-600' fill='currentColor' viewBox='0 0 20 20'>
                          <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
                        </svg>
                        <span className='text-xs font-semibold text-purple-700'>{user.gotra}</span>
                      </div>

                      {/* Status Badge */}
                      {user.paymentVerified ? (
                        <div className='flex items-center gap-1.5 px-2.5 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-semibold'>
                          <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                          Approved
                        </div>
                      ) : user.isRejected ? (
                        <div className='flex items-center gap-1.5 px-2.5 py-2 bg-red-50 text-red-700 rounded-xl text-xs font-semibold'>
                          <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                          Rejected
                        </div>
                      ) : (
                        <div className='flex items-center gap-1.5 px-2.5 py-2 bg-yellow-50 text-yellow-700 rounded-xl text-xs font-semibold'>
                          <div className='w-2 h-2 bg-yellow-500 rounded-full animate-pulse'></div>
                          Pending
                        </div>
                      )}
                    </div>

                    {/* Payment Info */}
                    {user.utrNumber && (
                      <div className='flex items-center gap-1.5 bg-orange-50 px-2.5 py-2 rounded-xl'>
                        <svg className='w-3.5 h-3.5 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                        </svg>
                        <span className='text-xs font-semibold text-orange-700'>UTR: {user.utrNumber}</span>
                      </div>
                    )}

                    {/* Created Date */}
                    {user.createdAt && (
                      <div className='flex items-center gap-2 text-xs text-gray-500'>
                        <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        <span>
                          {new Date(user.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className='flex items-center gap-2 p-4 bg-gray-50 border-t border-gray-100 flex-wrap'>
                    {/* Call */}
                    <a
                      href={`tel:${user.mobile}`}
                      className='flex items-center gap-1.5 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-sm hover:shadow-md text-xs font-semibold'
                    >
                      <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                      </svg>
                      Call
                    </a>

                    {/* Certificate */}
                    {user.paymentVerified && user.activeCertificate?.downloadLink && !user.activeCertificate?.pdfDeleted && (
                      <a
                        href={`${BACKEND_URL}${user.activeCertificate.downloadLink}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-sm hover:shadow-md text-xs font-semibold'
                      >
                        <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                        </svg>
                        Cert
                      </a>
                    )}

                    {/* Approve */}
                    {!user.paymentVerified && !user.isRejected && subAdmin?.permissions?.canApproveUsers && (
                      <button
                        onClick={() => handleApprove(user._id)}
                        className='flex-1 px-3 py-2 bg-gradient-to-r- from-purple-600 to-blue-700 text-white rounded-lg text-xs font-bold hover:from-purple-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg whitespace-nowrap'
                      >
                        Approve Now
                      </button>
                    )}

                    {!subAdmin?.permissions?.canApproveUsers && !user.paymentVerified && !user.isRejected && (
                      <span className='flex-1 text-center text-xs text-gray-500 italic'>No approval permission</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {showPhotoModal && selectedPhoto && (
        <div
          className='fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4'
          onClick={() => setShowPhotoModal(false)}
        >
          <div className='relative max-w-4xl w-full'>
            <button
              onClick={() => setShowPhotoModal(false)}
              className='absolute -top-12 right-0 text-white hover:text-gray-300 transition'
            >
              <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
            <img
              src={selectedPhoto}
              alt='User Photo'
              className='w-full h-auto max-h-[90vh] object-contain rounded-lg'
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
