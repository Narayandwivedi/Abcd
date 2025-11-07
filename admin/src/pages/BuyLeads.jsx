import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const BuyLeads = () => {
  const [buyLeads, setBuyLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  // Fetch all buy leads
  useEffect(() => {
    fetchBuyLeads()
    fetchStats()
  }, [statusFilter])

  const fetchBuyLeads = async () => {
    try {
      setLoading(true)
      const url = statusFilter === 'all'
        ? `${BACKEND_URL}/api/buy-lead/admin/all`
        : `${BACKEND_URL}/api/buy-lead/admin/all?status=${statusFilter}`

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        setBuyLeads(data.data)
      }
    } catch (error) {
      console.error('Error fetching buy leads:', error)
      toast.error('Failed to fetch buy leads')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/buy-lead/admin/stats`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Approve buy lead
  const handleApprove = async (leadId) => {
    if (!window.confirm('Are you sure you want to approve this buy lead?')) return

    try {
      const response = await fetch(`${BACKEND_URL}/api/buy-lead/admin/approve/${leadId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        toast.success('Buy lead approved successfully!')
        fetchBuyLeads()
        fetchStats()
        setShowDetailModal(false)
      } else {
        toast.error(data.message || 'Failed to approve buy lead')
      }
    } catch (error) {
      console.error('Error approving buy lead:', error)
      toast.error('Failed to approve buy lead')
    }
  }

  // Reject buy lead
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/buy-lead/admin/reject/${selectedLead._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason })
      })
      const data = await response.json()

      if (data.success) {
        toast.success('Buy lead rejected successfully!')
        fetchBuyLeads()
        fetchStats()
        setShowRejectModal(false)
        setShowDetailModal(false)
        setRejectionReason('')
      } else {
        toast.error(data.message || 'Failed to reject buy lead')
      }
    } catch (error) {
      console.error('Error rejecting buy lead:', error)
      toast.error('Failed to reject buy lead')
    }
  }

  // Delete buy lead
  const handleDelete = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this buy lead? This action cannot be undone.')) return

    try {
      const response = await fetch(`${BACKEND_URL}/api/buy-lead/admin/delete/${leadId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        toast.success('Buy lead deleted successfully!')
        fetchBuyLeads()
        fetchStats()
        setShowDetailModal(false)
      } else {
        toast.error(data.message || 'Failed to delete buy lead')
      }
    } catch (error) {
      console.error('Error deleting buy lead:', error)
      toast.error('Failed to delete buy lead')
    }
  }

  // Filter buy leads based on search term
  const filteredLeads = buyLeads.filter(lead => {
    const searchLower = searchTerm.toLowerCase()
    return (
      lead.name.toLowerCase().includes(searchLower) ||
      lead.itemRequired.toLowerCase().includes(searchLower) ||
      lead.mobileNo.includes(searchTerm) ||
      lead.townCity.toLowerCase().includes(searchLower) ||
      lead.majorCategory.toLowerCase().includes(searchLower)
    )
  })

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return badges[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl md:text-3xl font-black text-gray-800 mb-1 md:mb-2'>Buy Leads Management</h1>
          <p className='text-sm md:text-base text-gray-600'>Manage and approve buy lead requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6'>
        <div className='bg-white p-3 md:p-4 rounded-lg shadow-md'>
          <h3 className='text-gray-500 text-xs md:text-sm font-medium'>Total Leads</h3>
          <p className='text-xl md:text-2xl font-bold text-gray-800 mt-1'>{stats.total}</p>
        </div>
        <div className='bg-yellow-50 p-3 md:p-4 rounded-lg shadow-md border border-yellow-200'>
          <h3 className='text-yellow-700 text-xs md:text-sm font-medium'>Pending</h3>
          <p className='text-xl md:text-2xl font-bold text-yellow-800 mt-1'>{stats.pending}</p>
        </div>
        <div className='bg-green-50 p-3 md:p-4 rounded-lg shadow-md border border-green-200'>
          <h3 className='text-green-700 text-xs md:text-sm font-medium'>Approved</h3>
          <p className='text-xl md:text-2xl font-bold text-green-800 mt-1'>{stats.approved}</p>
        </div>
        <div className='bg-red-50 p-3 md:p-4 rounded-lg shadow-md border border-red-200'>
          <h3 className='text-red-700 text-xs md:text-sm font-medium'>Rejected</h3>
          <p className='text-xl md:text-2xl font-bold text-red-800 mt-1'>{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className='bg-white p-4 rounded-lg shadow-md mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <input
              type='text'
              placeholder='Search by name, item, mobile, city...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='all'>All Status</option>
              <option value='pending'>Pending</option>
              <option value='approved'>Approved</option>
              <option value='rejected'>Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Buy Leads Table - Desktop */}
      <div className='bg-white rounded-lg shadow-md overflow-hidden hidden md:block'>
        {loading ? (
          <div className='text-center py-12'>
            <p className='text-gray-500'>Loading buy leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500'>No buy leads found</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    User
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Item Required
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Category
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    City
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Date
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredLeads.map((lead) => (
                  <tr key={lead._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>{lead.name}</div>
                      <div className='text-sm text-gray-500'>{lead.mobileNo}</div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm text-gray-900'>{lead.itemRequired}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{lead.majorCategory}</div>
                      <div className='text-sm text-gray-500'>{lead.minorCategory}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {lead.townCity}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(lead.status)}`}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
                      <button
                        onClick={() => {
                          setSelectedLead(lead)
                          setShowDetailModal(true)
                        }}
                        className='text-blue-600 hover:text-blue-900'
                      >
                        View
                      </button>
                      {lead.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(lead._id)}
                            className='text-green-600 hover:text-green-900'
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLead(lead)
                              setShowRejectModal(true)
                            }}
                            className='text-red-600 hover:text-red-900'
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className='text-red-600 hover:text-red-900'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      {loading ? (
        <div className='md:hidden text-center py-12'>
          <p className='text-gray-500'>Loading buy leads...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className='md:hidden text-center py-12'>
          <p className='text-gray-500'>No buy leads found</p>
        </div>
      ) : (
        <div className='md:hidden space-y-4 p-4'>
          {filteredLeads.map((lead) => (
            <div key={lead._id} className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300'>
              {/* Card Header with Gradient Background */}
              <div className='bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-4'>
                <div className='flex items-start gap-3'>
                  {/* User Icon */}
                  <div className='relative flex-shrink-0'>
                    <div className='w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md border-4 border-white'>
                      {lead.name?.[0]?.toUpperCase()}
                    </div>
                    {/* Status Indicator Dot */}
                    {lead.status === 'approved' && (
                      <div className='absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-md flex items-center justify-center'>
                        <svg className='w-3 h-3 text-white' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                        </svg>
                      </div>
                    )}
                    {lead.status === 'rejected' && (
                      <div className='absolute bottom-0 right-0 w-5 h-5 bg-red-500 rounded-full border-3 border-white shadow-md flex items-center justify-center'>
                        <svg className='w-3 h-3 text-white' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Lead Info */}
                  <div className='flex-1 min-w-0'>
                    {/* Name and Action Buttons Row */}
                    <div className='flex items-center justify-between gap-2 mb-0.5'>
                      <h3 className='font-bold text-gray-900 text-xs leading-tight'>{lead.name}</h3>
                      <div className='flex gap-1 flex-shrink-0'>
                        <button
                          onClick={() => {
                            setSelectedLead(lead)
                            setShowDetailModal(true)
                          }}
                          className='p-1.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 shadow-sm border border-blue-200 transition-all duration-200 hover:shadow-md'
                          title='View Details'
                        >
                          <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className='p-1.5 bg-white text-red-600 rounded-lg hover:bg-red-50 shadow-sm border border-red-200 transition-all duration-200 hover:shadow-md'
                          title='Delete Lead'
                        >
                          <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Item Required */}
                    <div className='inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold mb-0.5 max-w-full'>
                      <svg className='w-3 h-3 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z' clipRule='evenodd' />
                      </svg>
                      <span className='truncate'>{lead.itemRequired}</span>
                    </div>

                    <div className='flex items-start gap-1 text-xs text-gray-500'>
                      <svg className='w-3 h-3 flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                      </svg>
                      <span className='text-left break-words'>{lead.townCity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className='p-4 space-y-3'>
                {/* Contact Info */}
                <div className='flex items-center justify-between gap-2 bg-gray-50 rounded-xl p-3'>
                  <a href={`tel:${lead.mobileNo}`} className='flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-xs group'>
                    <div className='p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition'>
                      <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                      </svg>
                    </div>
                    <span className='whitespace-nowrap'>{lead.mobileNo}</span>
                  </a>
                </div>

                {/* Category & Status Row */}
                <div className='flex items-center justify-between gap-2'>
                  <div className='flex items-center gap-1.5 bg-purple-50 px-2.5 py-2 rounded-xl'>
                    <svg className='w-3.5 h-3.5 text-purple-600' fill='currentColor' viewBox='0 0 20 20'>
                      <path d='M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' />
                    </svg>
                    <span className='text-xs font-semibold text-purple-700'>{lead.majorCategory}</span>
                  </div>

                  {/* Status Badge */}
                  {lead.status === 'approved' ? (
                    <div className='flex items-center gap-1.5 px-2.5 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-semibold'>
                      <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                      Approved
                    </div>
                  ) : lead.status === 'rejected' ? (
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

                {/* Price Range */}
                {lead.priceRange && (
                  <div className='flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-xl'>
                    <svg className='w-3.5 h-3.5 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    <span className='text-xs font-medium text-orange-700'>{lead.priceRange}</span>
                  </div>
                )}

                {/* Created Date */}
                {lead.createdAt && (
                  <div className='flex items-center gap-2 text-xs text-gray-500'>
                    <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    <span>
                      Created: {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className='p-4 bg-gray-50 border-t border-gray-100'>
                {lead.status === 'pending' ? (
                  /* Pending: Show Call, Approve, Reject in one row */
                  <div className='grid grid-cols-3 gap-2'>
                    <a
                      href={`tel:${lead.mobileNo}`}
                      className='flex items-center justify-center gap-1.5 px-2 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-sm hover:shadow-md text-xs font-semibold'
                    >
                      <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                      </svg>
                      Call
                    </a>
                    <button
                      onClick={() => handleApprove(lead._id)}
                      className='px-2 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg whitespace-nowrap'
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLead(lead)
                        setShowRejectModal(true)
                      }}
                      className='px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-sm hover:shadow-md text-xs font-semibold'
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  /* Approved/Rejected: Show only Call button centered */
                  <div className='flex justify-center'>
                    <a
                      href={`tel:${lead.mobileNo}`}
                      className='flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-sm hover:shadow-md text-xs font-semibold'
                    >
                      <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                      </svg>
                      Call
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedLead && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold text-gray-800'>Buy Lead Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Name</label>
                  <p className='mt-1 text-sm text-gray-900'>{selectedLead.name}</p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Mobile Number</label>
                  <p className='mt-1 text-sm text-gray-900'>{selectedLead.mobileNo}</p>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>City</label>
                  <p className='mt-1 text-sm text-gray-900'>{selectedLead.townCity}</p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Status</label>
                  <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(selectedLead.status)}`}>
                    {selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
                  </span>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Item Required</label>
                <p className='mt-1 text-sm text-gray-900'>{selectedLead.itemRequired}</p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Major Category</label>
                  <p className='mt-1 text-sm text-gray-900'>{selectedLead.majorCategory}</p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Minor Category</label>
                  <p className='mt-1 text-sm text-gray-900'>{selectedLead.minorCategory}</p>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Quality & Quantity Description</label>
                <p className='mt-1 text-sm text-gray-900 whitespace-pre-wrap'>{selectedLead.qualityQuantityDesc}</p>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Price Range</label>
                <p className='mt-1 text-sm text-gray-900'>{selectedLead.priceRange}</p>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700'>Delivery Address</label>
                <p className='mt-1 text-sm text-gray-900 whitespace-pre-wrap'>{selectedLead.deliveryAddress}</p>
              </div>

              {selectedLead.rejectionReason && (
                <div className='bg-red-50 p-3 rounded-lg'>
                  <label className='block text-sm font-medium text-red-700'>Rejection Reason</label>
                  <p className='mt-1 text-sm text-red-900'>{selectedLead.rejectionReason}</p>
                </div>
              )}

              <div className='grid grid-cols-2 gap-4 text-xs text-gray-500'>
                <div>
                  <label className='block font-medium'>Created At</label>
                  <p>{new Date(selectedLead.createdAt).toLocaleString()}</p>
                </div>
                {selectedLead.approvedAt && (
                  <div>
                    <label className='block font-medium'>Approved At</label>
                    <p>{new Date(selectedLead.approvedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            <div className='mt-6 flex gap-3 justify-end'>
              {selectedLead.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(selectedLead._id)}
                    className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false)
                      setShowRejectModal(true)
                    }}
                    className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedLead && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Reject Buy Lead</h2>
            <p className='text-sm text-gray-600 mb-4'>Please provide a reason for rejecting this buy lead:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
              rows='4'
              placeholder='Enter rejection reason...'
            />
            <div className='mt-4 flex gap-3 justify-end'>
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason('')
                }}
                className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400'
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BuyLeads
