import { useState, useEffect } from 'react'
import { FileText, CheckCircle, XCircle, Clock, Eye } from 'lucide-react'
import axios from 'axios'
import ApplicationModal from '../components/ApplicationModal'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

const Vendors = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTab, setFilterTab] = useState('all') // all, with_app, no_app, verified, pending
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    withApplication: 0,
    noApplication: 0
  })

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${BACKEND_URL}/api/admin/vendor/vendors`, {
        withCredentials: true
      })

      if (response.data.success) {
        setVendors(response.data.vendors)

        // Calculate stats
        const total = response.data.total
        const verified = response.data.vendors.filter(v => v.isVerified).length
        const pending = response.data.vendors.filter(v => v.application?.applicationStatus === 'pending').length
        const withApplication = response.data.vendors.filter(v => v.isBusinessApplicationSubmitted).length
        const noApplication = response.data.vendors.filter(v => !v.isBusinessApplicationSubmitted).length

        setStats({ total, verified, pending, withApplication, noApplication })
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewApplication = (vendor) => {
    setSelectedVendor(vendor)
    setShowModal(true)
  }

  const handleApprove = async (vendorId) => {
    try {
      setActionLoading(true)
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/vendor/vendors/${vendorId}/approve`,
        { adminComments: 'Approved by admin' },
        { withCredentials: true }
      )

      if (response.data.success) {
        alert('Vendor approved successfully!')
        setShowModal(false)
        fetchVendors()
      }
    } catch (error) {
      console.error('Approval failed:', error)
      alert('Failed to approve vendor: ' + (error.response?.data?.message || 'Unknown error'))
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (vendorId, reason) => {
    try {
      setActionLoading(true)
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/vendor/vendors/${vendorId}/reject`,
        { rejectionReason: reason, adminComments: '' },
        { withCredentials: true }
      )

      if (response.data.success) {
        alert('Vendor application rejected')
        setShowModal(false)
        fetchVendors()
      }
    } catch (error) {
      console.error('Rejection failed:', error)
      alert('Failed to reject vendor: ' + (error.response?.data?.message || 'Unknown error'))
    } finally {
      setActionLoading(false)
    }
  }

  const filteredVendors = vendors
    .filter(vendor => {
      // Filter by tab
      if (filterTab === 'with_app') return vendor.isBusinessApplicationSubmitted
      if (filterTab === 'no_app') return !vendor.isBusinessApplicationSubmitted
      if (filterTab === 'verified') return vendor.isVerified
      if (filterTab === 'pending') return vendor.application?.applicationStatus === 'pending'
      return true // 'all'
    })
    .filter(vendor => {
      // Filter by search term
      return vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.application?.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.application?.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
    })

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-black text-gray-800 mb-2'>Vendors Management</h1>
          <p className='text-gray-600'>Manage all platform vendors</p>
        </div>
        <button className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg'>
          + Add Vendor
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4 mb-8'>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Total Vendors</div>
          <div className='text-3xl font-black text-purple-600'>{stats.total}</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Verified</div>
          <div className='text-3xl font-black text-green-600'>{stats.verified}</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Pending</div>
          <div className='text-3xl font-black text-orange-600'>{stats.pending}</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>With App</div>
          <div className='text-3xl font-black text-blue-600'>{stats.withApplication}</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>No App</div>
          <div className='text-3xl font-black text-red-600'>{stats.noApplication}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className='mb-6 flex gap-2 flex-wrap'>
        <button
          onClick={() => setFilterTab('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterTab === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilterTab('no_app')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterTab === 'no_app'
              ? 'bg-red-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          No Application ({stats.noApplication})
        </button>
        <button
          onClick={() => setFilterTab('pending')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterTab === 'pending'
              ? 'bg-orange-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Pending ({stats.pending})
        </button>
        <button
          onClick={() => setFilterTab('verified')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterTab === 'verified'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Verified ({stats.verified})
        </button>
        <button
          onClick={() => setFilterTab('with_app')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterTab === 'with_app'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          With Application ({stats.withApplication})
        </button>
      </div>

      {/* Vendors Table */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
        <div className='p-6 border-b border-gray-200'>
          <input
            type='text'
            placeholder='Search by email, business name, or owner...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Email</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Business Name</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Category</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Application</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Status</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Joined</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {loading ? (
                <tr>
                  <td colSpan='7' className='px-6 py-12 text-center text-gray-500'>
                    Loading vendors...
                  </td>
                </tr>
              ) : filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan='7' className='px-6 py-12 text-center text-gray-500'>
                    No vendors found
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => (
                  <tr key={vendor._id} className='hover:bg-gray-50 transition'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold'>
                          {vendor.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className='font-semibold text-gray-800'>{vendor.email}</div>
                          <div className='text-xs text-gray-500'>{vendor.mobile || 'No mobile'}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-gray-800 font-medium'>{vendor.application?.businessName || 'Not submitted'}</div>
                      <div className='text-sm text-gray-500'>{vendor.application?.ownerName || '-'}</div>
                    </td>
                    <td className='px-6 py-4'>
                      {vendor.application?.businessCategory ? (
                        <span className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold'>
                          {vendor.application.businessCategory}
                        </span>
                      ) : (
                        <span className='text-gray-400 text-sm'>-</span>
                      )}
                    </td>
                    <td className='px-6 py-4'>
                      {vendor.isBusinessApplicationSubmitted ? (
                        <button
                          onClick={() => handleViewApplication(vendor)}
                          className='inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition'
                        >
                          <FileText className='w-4 h-4' />
                          View
                        </button>
                      ) : (
                        <span className='inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-semibold'>
                          <XCircle className='w-3 h-3' />
                          Not Submitted
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4'>
                      {vendor.isVerified ? (
                        <span className='inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold'>
                          <CheckCircle className='w-3 h-3' />
                          Verified
                        </span>
                      ) : vendor.application?.applicationStatus === 'rejected' ? (
                        <span className='inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold'>
                          <XCircle className='w-3 h-3' />
                          Rejected
                        </span>
                      ) : vendor.application?.applicationStatus === 'pending' ? (
                        <span className='inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold'>
                          <Clock className='w-3 h-3' />
                          Pending
                        </span>
                      ) : (
                        <span className='px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold'>
                          No App
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4 text-gray-600 text-sm'>
                      {new Date(vendor.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        {vendor.application && ['pending', 'under_review'].includes(vendor.application.applicationStatus) && (
                          <button
                            onClick={() => {
                              if (window.confirm('Quick approve this vendor?')) {
                                handleApprove(vendor._id)
                              }
                            }}
                            disabled={actionLoading}
                            className='inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200 transition disabled:opacity-50'
                          >
                            <CheckCircle className='w-3 h-3' />
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        vendor={selectedVendor}
        application={selectedVendor?.application}
        onApprove={handleApprove}
        onReject={handleReject}
        loading={actionLoading}
      />
    </div>
  )
}

export default Vendors
