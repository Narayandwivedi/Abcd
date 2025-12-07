import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import axios from 'axios'

const Vendors = () => {
  const { subAdmin } = useApp()
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${BACKEND_URL}/api/admin/vendors`, {
        withCredentials: true
      })
      if (response.data.success) {
        setVendors(response.data.vendors)
      }
    } catch (error) {
      console.error('Error fetching vendors:', error)
      alert('Failed to fetch vendors')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (vendorId) => {
    if (!subAdmin?.permissions?.canApproveVendors) {
      alert('You do not have permission to approve vendors')
      return
    }

    if (!window.confirm('Are you sure you want to approve this vendor?')) return

    try {
      const response = await axios.put(`${BACKEND_URL}/api/admin/vendors/${vendorId}/approve`, {}, {
        withCredentials: true
      })
      if (response.data.success) {
        alert('Vendor approved successfully!')
        fetchVendors()
      } else {
        alert(response.data.message || 'Failed to approve vendor')
      }
    } catch (error) {
      console.error('Error approving vendor:', error)
      alert(error.response?.data?.message || 'Failed to approve vendor')
    }
  }

  // Filter vendors based on search
  const filteredVendors = vendors.filter(vendor =>
    vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.mobile?.toString().includes(searchTerm) ||
    vendor.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate stats
  const stats = {
    total: vendors.length,
    pending: vendors.filter(v => !v.isVerified).length,
    verified: vendors.filter(v => v.isVerified).length,
    active: vendors.filter(v => v.isActive).length
  }

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-2xl md:text-3xl font-black text-gray-800 mb-1 md:mb-2'>Vendor Management</h1>
        <p className='text-sm md:text-base text-gray-600'>View and manage vendor applications</p>
      </div>

      {/* Permission Notice */}
      <div className='mb-6 bg-purple-50 border border-purple-200 rounded-xl p-4'>
        <h3 className='text-sm font-semibold text-purple-900 mb-2'>Your Permissions:</h3>
        <div className='flex flex-wrap gap-2'>
          {subAdmin?.permissions?.canViewVendors && (
            <span className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold'>
              ✓ View Vendors
            </span>
          )}
          {subAdmin?.permissions?.canEditVendors && (
            <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold'>
              ✓ Edit Vendors
            </span>
          )}
          {subAdmin?.permissions?.canDeleteVendors && (
            <span className='px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold'>
              ✓ Delete Vendors
            </span>
          )}
          {subAdmin?.permissions?.canApproveVendors && (
            <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold'>
              ✓ Approve Vendors
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Total Vendors</div>
          <div className='text-3xl font-black text-blue-600'>{stats.total}</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-yellow-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Pending</div>
          <div className='text-3xl font-black text-yellow-600'>{stats.pending}</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-green-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Verified</div>
          <div className='text-3xl font-black text-green-600'>{stats.verified}</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-purple-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Active</div>
          <div className='text-3xl font-black text-purple-600'>{stats.active}</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8'>
        <div className='p-6 border-b border-gray-200'>
          <input
            type='text'
            placeholder='Search vendors by business name, owner, mobile, or category...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
        </div>

        {loading ? (
          <div className='p-12 text-center text-gray-500'>
            <div className='w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
            <p>Loading vendors...</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className='p-12 text-center text-gray-500'>No vendors found</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className='hidden md:block overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Business Details</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Owner</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Category</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Status</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor._id} className='hover:bg-gray-50 transition'>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold'>
                            {vendor.businessName?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className='font-semibold text-gray-800'>{vendor.businessName}</div>
                            <div className='text-xs text-gray-500'>{vendor.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='space-y-1'>
                          <div className='text-sm text-gray-800'>{vendor.ownerName}</div>
                          <div className='text-sm text-blue-600 font-medium'>{vendor.mobile}</div>
                          {vendor.email && (
                            <div className='text-xs text-gray-600'>{vendor.email}</div>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='space-y-1'>
                          <span className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold block w-fit'>
                            {vendor.category}
                          </span>
                          {vendor.subCategory && (
                            <span className='text-xs text-gray-500'>{vendor.subCategory}</span>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='space-y-1'>
                          {vendor.isVerified ? (
                            <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold block w-fit'>
                              ✓ Verified
                            </span>
                          ) : (
                            <span className='px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold block w-fit'>
                              ⏳ Pending
                            </span>
                          )}
                          {vendor.isActive ? (
                            <span className='px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold block w-fit'>
                              Active
                            </span>
                          ) : (
                            <span className='px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold block w-fit'>
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          {!vendor.isVerified && subAdmin?.permissions?.canApproveVendors && (
                            <button
                              onClick={() => handleApprove(vendor._id)}
                              className='px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200 transition'
                            >
                              Approve
                            </button>
                          )}
                          {!subAdmin?.permissions?.canApproveVendors && !vendor.isVerified && (
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
              {filteredVendors.map((vendor) => (
                <div key={vendor._id} className='p-4 hover:bg-gray-50 transition'>
                  <div className='flex items-start gap-3 mb-3'>
                    <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold'>
                      {vendor.businessName?.[0]?.toUpperCase()}
                    </div>
                    <div className='flex-1'>
                      <div className='font-bold text-gray-800'>{vendor.businessName}</div>
                      <div className='text-xs text-gray-500 mb-1'>{vendor.ownerName}</div>
                      <div className='text-sm text-blue-600 font-medium'>{vendor.mobile}</div>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 mb-3 flex-wrap'>
                    <span className='px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold'>
                      {vendor.category}
                    </span>
                    {vendor.isVerified ? (
                      <span className='px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold'>
                        Verified
                      </span>
                    ) : (
                      <span className='px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold'>
                        Pending
                      </span>
                    )}
                    {vendor.isActive ? (
                      <span className='px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold'>
                        Active
                      </span>
                    ) : (
                      <span className='px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold'>
                        Inactive
                      </span>
                    )}
                  </div>
                  {!vendor.isVerified && subAdmin?.permissions?.canApproveVendors && (
                    <button
                      onClick={() => handleApprove(vendor._id)}
                      className='w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition'
                    >
                      Approve Vendor
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

export default Vendors
