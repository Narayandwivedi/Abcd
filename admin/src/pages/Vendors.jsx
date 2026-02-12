import { useState, useEffect } from 'react'
import MultiCategorySelector from '../components/MultiCategorySelector'

const Vendors = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, pending, approved, rejected
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    ownerName: '',
    businessName: '',
    mobile: '',
    email: '',
    state: '',
    district: '',
    city: '',
    businessCategories: [],
    membershipFees: '',
    password: ''
  })
  const [creating, setCreating] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    ownerName: '',
    businessName: '',
    mobile: '',
    email: '',
    state: '',
    district: '',
    city: '',
    businessCategories: [],
    membershipFees: ''
  })
  const [editing, setEditing] = useState(false)
  const [createStates, setCreateStates] = useState([])
  const [createDistricts, setCreateDistricts] = useState([])
  const [createCities, setCreateCities] = useState([])
  const [editStates, setEditStates] = useState([])
  const [editDistricts, setEditDistricts] = useState([])
  const [editCities, setEditCities] = useState([])

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  // Debug logging for createForm
  useEffect(() => {
    console.log('Vendors - createForm changed:', createForm)
  }, [createForm])

  // Fetch all vendors
  useEffect(() => {
    fetchVendors()
    fetchCreateStates()
    fetchEditStates()
  }, [])

  useEffect(() => {
    if (!createForm.state) {
      setCreateDistricts([])
      setCreateCities([])
      return
    }
    fetchCreateDistricts(createForm.state)
  }, [createForm.state])

  useEffect(() => {
    if (!createForm.district) {
      setCreateCities([])
      return
    }
    fetchCreateCities(createForm.district)
  }, [createForm.district])

  useEffect(() => {
    if (!editForm.state) {
      setEditDistricts([])
      setEditCities([])
      return
    }
    fetchEditDistricts(editForm.state)
  }, [editForm.state])

  useEffect(() => {
    if (!editForm.district) {
      setEditCities([])
      return
    }
    fetchEditCities(editForm.district)
  }, [editForm.district])

  const fetchCreateStates = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/cities/states`)
      const data = await response.json()
      if (data.success) setCreateStates(data.states)
    } catch (error) {
      console.error('Error fetching create states:', error)
    }
  }

  const fetchCreateDistricts = async (state) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/cities/districts/${encodeURIComponent(state)}`)
      const data = await response.json()
      if (data.success) setCreateDistricts(data.districts)
    } catch (error) {
      console.error('Error fetching create districts:', error)
    }
  }

  const fetchCreateCities = async (district) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/cities/district/${encodeURIComponent(district)}`)
      const data = await response.json()
      if (data.success) setCreateCities(data.cities)
    } catch (error) {
      console.error('Error fetching create cities:', error)
    }
  }

  const fetchEditStates = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/cities/states`)
      const data = await response.json()
      if (data.success) setEditStates(data.states)
    } catch (error) {
      console.error('Error fetching edit states:', error)
    }
  }

  const fetchEditDistricts = async (state) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/cities/districts/${encodeURIComponent(state)}`)
      const data = await response.json()
      if (data.success) setEditDistricts(data.districts)
    } catch (error) {
      console.error('Error fetching edit districts:', error)
    }
  }

  const fetchEditCities = async (district) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/cities/district/${encodeURIComponent(district)}`)
      const data = await response.json()
      if (data.success) setEditCities(data.cities)
    } catch (error) {
      console.error('Error fetching edit cities:', error)
    }
  }

  const fetchVendors = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/admin/vendors`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        setVendors(data.vendors)
        calculateStats(data.vendors)
      }
    } catch (error) {
      console.error('Error fetching vendors:', error)
      alert('Failed to fetch vendors')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (vendorList) => {
    const total = vendorList.length
    const pending = vendorList.filter(v => !v.paymentVerified && !v.isRejected).length
    const approved = vendorList.filter(v => v.paymentVerified).length
    const rejected = vendorList.filter(v => v.isRejected).length

    setStats({ total, pending, approved, rejected })
  }

  // Approve vendor
  const handleApprove = async (vendorId) => {
    if (!window.confirm('Are you sure you want to approve this vendor?')) return

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/vendors/${vendorId}/approve`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        alert('Vendor approved successfully!')
        fetchVendors()
      } else {
        alert(data.message || 'Failed to approve vendor')
      }
    } catch (error) {
      console.error('Error approving vendor:', error)
      alert('Failed to approve vendor')
    }
  }

  // Set password modal
  const openPasswordModal = (vendor) => {
    setSelectedVendor(vendor)
    setNewPassword('')
    setShowPasswordModal(true)
  }

  const handleSetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/vendors/${selectedVendor._id}/set-password`, {
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
        fetchVendors()
      } else {
        alert(data.message || 'Failed to set password')
      }
    } catch (error) {
      console.error('Error setting password:', error)
      alert('Failed to set password')
    }
  }

  // Handle photo click
  const handlePhotoClick = (photoUrl) => {
    setSelectedPhoto(photoUrl)
    setShowPhotoModal(true)
  }

  // Send WhatsApp message
  const sendWhatsAppMessage = (vendor) => {
    if (!vendor.activeCertificate?.certificateNumber || !vendor.activeCertificate?.downloadLink) {
      alert('Certificate not generated yet. Please approve the vendor first.')
      return
    }

    const certificateUrl = `${BACKEND_URL}${vendor.activeCertificate?.downloadLink}`
    const message = `Congratulations! 🎉

You are now an approved ABCD Vendor.

Business: ${vendor.businessName}
Your Certificate Number: ${vendor.activeCertificate?.certificateNumber}

You can view and download your certificate here:
${certificateUrl}

Welcome to the ABCD Vendor Network!

Best regards,
ABCD Team`

    const encodedMessage = encodeURIComponent(message)
    // Open WhatsApp app (mobile) or WhatsApp Web (desktop) automatically
    const whatsappUrl = `https://api.whatsapp.com/send?phone=91${vendor.mobile}&text=${encodedMessage}`

    window.open(whatsappUrl, '_blank')
  }

  // Create vendor handler
  const handleCreateVendor = async () => {
    if (!createForm.ownerName || !createForm.businessName || !createForm.mobile || !createForm.state || !createForm.district || !createForm.city || createForm.businessCategories.length === 0 || !createForm.membershipFees) {
      alert('Please fill all required fields including state, district, city, and at least one category and subcategory')
      return
    }

    if (createForm.mobile.length !== 10) {
      alert('Mobile number must be exactly 10 digits')
      return
    }

    try {
      setCreating(true)
      const response = await fetch(`${BACKEND_URL}/api/admin/vendors`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
      })
      const data = await response.json()

      if (data.success) {
        alert('Vendor created successfully!')
        setShowCreateModal(false)
        setCreateForm({
          ownerName: '',
          businessName: '',
          mobile: '',
          email: '',
          state: '',
          district: '',
          city: '',
          businessCategories: [],
          membershipFees: '',
          password: ''
        })
        fetchVendors()
      } else {
        alert(data.message || 'Failed to create vendor')
      }
    } catch (error) {
      console.error('Error creating vendor:', error)
      alert('Failed to create vendor')
    } finally {
      setCreating(false)
    }
  }

  // Open edit modal with vendor data
  const openEditModal = (vendor) => {
    setSelectedVendor(vendor)
    setEditForm({
      ownerName: vendor.ownerName || '',
      businessName: vendor.businessName || '',
      mobile: vendor.mobile || '',
      email: vendor.email || '',
      state: vendor.state || '',
      district: vendor.district || '',
      city: vendor.city || '',
      businessCategories: vendor.businessCategories || [],
      membershipFees: vendor.membershipFees || ''
    })
    setShowEditModal(true)
  }

  // Handle edit vendor
  const handleEditVendor = async () => {
    if (!editForm.ownerName || !editForm.businessName || !editForm.mobile || !editForm.state || !editForm.district || !editForm.city || editForm.businessCategories.length === 0 || !editForm.membershipFees) {
      alert('Please fill all required fields including state, district, city, and at least one category and subcategory')
      return
    }

    if (editForm.mobile.toString().length !== 10) {
      alert('Mobile number must be exactly 10 digits')
      return
    }

    try {
      setEditing(true)
      const response = await fetch(`${BACKEND_URL}/api/admin/vendors/${selectedVendor._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })
      const data = await response.json()

      if (data.success) {
        alert('Vendor updated successfully!')
        setShowEditModal(false)
        setSelectedVendor(null)
        setEditForm({
          ownerName: '',
          businessName: '',
          mobile: '',
          email: '',
          state: '',
          district: '',
          city: '',
          businessCategories: [],
          membershipFees: ''
        })
        fetchVendors()
      } else {
        alert(data.message || 'Failed to update vendor')
      }
    } catch (error) {
      console.error('Error updating vendor:', error)
      alert('Failed to update vendor')
    } finally {
      setEditing(false)
    }
  }

  // Toggle vendor active status
  const handleToggleStatus = async (vendorId, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate'
    if (!window.confirm(`Are you sure you want to ${action} this vendor?`)) return

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/vendors/${vendorId}/toggle-status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        alert(data.message)
        fetchVendors()
      } else {
        alert(data.message || 'Failed to toggle vendor status')
      }
    } catch (error) {
      console.error('Error toggling vendor status:', error)
      alert('Failed to toggle vendor status')
    }
  }

  // Delete vendor
  const handleDeleteVendor = async (vendorId, businessName) => {
    if (!window.confirm(`Are you sure you want to DELETE "${businessName}"? This action cannot be undone!`)) return

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/vendors/${vendorId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        alert('Vendor deleted successfully!')
        fetchVendors()
      } else {
        alert(data.message || 'Failed to delete vendor')
      }
    } catch (error) {
      console.error('Error deleting vendor:', error)
      alert('Failed to delete vendor')
    }
  }

  // Reject vendor
  const handleReject = async (vendorId, businessName) => {
    const reason = window.prompt(`Enter rejection reason for "${businessName}":`)
    if (!reason || reason.trim() === '') return

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/vendors/${vendorId}/reject`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: reason.trim() }),
      })
      const data = await response.json()

      if (data.success) {
        alert('Vendor application rejected successfully!')
        fetchVendors()
      } else {
        alert(data.message || 'Failed to reject vendor')
      }
    } catch (error) {
      console.error('Error rejecting vendor:', error)
      alert('Failed to reject vendor')
    }
  }

  // Filter vendors based on search and status
  const filteredVendors = vendors.filter(vendor => {
    // Search filter
    const matchesSearch = vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.mobile?.toString().includes(searchTerm)

    // Status filter
    let matchesStatus = true
    if (filterStatus === 'pending') {
      matchesStatus = !vendor.paymentVerified && !vendor.isRejected
    } else if (filterStatus === 'approved') {
      matchesStatus = vendor.paymentVerified
    } else if (filterStatus === 'rejected') {
      matchesStatus = vendor.isRejected
    }

    return matchesSearch && matchesStatus
  })

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl md:text-3xl font-black text-gray-800 mb-1 md:mb-2'>Vendor Applications</h1>
          <p className='text-sm md:text-base text-gray-600'>Manage vendor registrations and approvals</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          <span className='hidden md:inline'>Create Vendor</span>
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8'>
        <div className='bg-white rounded-xl p-3 md:p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-xs md:text-sm font-medium mb-1 md:mb-2'>Total Applications</div>
          <div className='text-xl md:text-3xl font-black text-blue-600'>{stats.total}</div>
        </div>
        <div className='bg-white rounded-xl p-3 md:p-6 shadow-lg border border-yellow-200'>
          <div className='text-gray-600 text-xs md:text-sm font-medium mb-1 md:mb-2'>Pending Approval</div>
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

      {/* Vendors Table */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
        <div className='p-6 border-b border-gray-200 space-y-4'>
          {/* Filter Buttons */}
          <div className='flex flex-wrap gap-2'>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === 'pending'
                  ? 'bg-yellow-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === 'approved'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === 'rejected'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>

          {/* Search Bar */}
          <input
            type='text'
            placeholder='Search vendors by business name, owner, email, or mobile...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {loading ? (
          <div className='p-12 text-center text-gray-500'>Loading vendors...</div>
        ) : filteredVendors.length === 0 ? (
          <div className='p-12 text-center text-gray-500'>No vendors found</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className='hidden md:block overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Vendor Details</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Contact</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Category</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Payment</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Status</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor._id} className='hover:bg-gray-50 transition'>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          {vendor.passportPhoto ? (
                            <img
                              src={`${BACKEND_URL}/${vendor.passportPhoto}`}
                              alt={vendor.businessName}
                              onClick={() => handlePhotoClick(`${BACKEND_URL}/${vendor.passportPhoto}`)}
                              className='w-12 h-12 rounded-full object-cover border-2 border-gray-200 cursor-pointer hover:opacity-80 transition'
                            />
                          ) : (
                            <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold'>
                              {vendor.businessName?.[0]?.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className='font-semibold text-gray-800'>{vendor.businessName}</div>
                            <div className='text-xs text-gray-500'>Owner: {vendor.ownerName}</div>
                            <div className='text-xs text-gray-500'>
                              {vendor.city || 'N/A'}{vendor.state ? `, ${vendor.state}` : ''}
                            </div>
                            {vendor.activeCertificate?.certificateNumber && (
                              <div className='text-xs text-blue-600 font-semibold mt-1'>
                                Cert: {vendor.activeCertificate?.certificateNumber}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='space-y-1'>
                          <div className='flex items-center gap-2'>
                            <a
                              href={`tel:${vendor.mobile}`}
                              className='text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1'
                            >
                              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                              </svg>
                              {vendor.mobile}
                            </a>
                          </div>
                          {vendor.email && (
                            <div className='text-xs text-gray-600'>{vendor.email}</div>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='space-y-1'>
                          {vendor.businessCategories && vendor.businessCategories.length > 0 ? (
                            <div className='flex flex-wrap gap-1'>
                              {vendor.businessCategories.map((bc, idx) => (
                                <div key={idx} className='text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md'>
                                  <span className='font-semibold'>{bc.category}</span>
                                  <span className='mx-1'>→</span>
                                  <span>{bc.subCategory}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className='text-sm text-gray-500'>No categories</div>
                          )}
                          {vendor.membershipFees && (
                            <span className='inline-block px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold mt-1'>
                              ₹{vendor.membershipFees}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm'>
                          {vendor.utrNumber && (
                            <div className='text-gray-600'>UTR: {vendor.utrNumber}</div>
                          )}
                          {vendor.paymentScreenshot && (
                            <a
                              href={`${BACKEND_URL}/${vendor.paymentScreenshot}`}
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
                        {vendor.paymentVerified ? (
                          <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold'>
                            ✓ Approved
                          </span>
                        ) : vendor.isRejected ? (
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
                        <div className='flex items-center gap-3 flex-wrap'>
                          {/* Edit Button */}
                          <button
                            onClick={() => openEditModal(vendor)}
                            className='p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition'
                            title='Edit Vendor'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                            </svg>
                          </button>

                          {/* Call Button */}
                          <a
                            href={`tel:${vendor.mobile}`}
                            className='p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition'
                            title='Call Vendor'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                            </svg>
                          </a>

                          {/* WhatsApp Button */}
                          {vendor.paymentVerified && vendor.activeCertificate?.downloadLink && (
                            <button
                              onClick={() => sendWhatsAppMessage(vendor)}
                              className='p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition'
                              title='Send WhatsApp'
                            >
                              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
                              </svg>
                            </button>
                          )}

                          {/* View Certificate PDF Button */}
                          {vendor.paymentVerified && vendor.activeCertificate && vendor.activeCertificate.downloadLink && (
                            <a
                              href={`${BACKEND_URL}${vendor.activeCertificate.downloadLink}`}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition'
                              title={`View Certificate (${vendor.activeCertificate.certificateNumber})`}
                            >
                              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' />
                              </svg>
                            </a>
                          )}

                          {/* Set Password Button */}
                          <button
                            onClick={() => openPasswordModal(vendor)}
                            className='p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition'
                            title='Set Password'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' />
                            </svg>
                          </button>

                          {/* Approve Button - Show for pending OR rejected vendors */}
                          {!vendor.paymentVerified && (
                            <button
                              onClick={() => handleApprove(vendor._id)}
                              className='px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition'
                            >
                              {vendor.isRejected ? 'Re-Approve' : 'Approve'}
                            </button>
                          )}

                          {/* Reject Button - Only show for pending (not rejected) */}
                          {!vendor.paymentVerified && !vendor.isRejected && (
                            <button
                              onClick={() => handleReject(vendor._id, vendor.businessName)}
                              className='px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition'
                            >
                              Reject
                            </button>
                          )}

                          {/* Toggle Active/Inactive Button - Only show for approved vendors (not rejected) */}
                          {!vendor.isRejected && (
                            <button
                              onClick={() => handleToggleStatus(vendor._id, vendor.isActive)}
                              className={`p-2 rounded-lg transition ${
                                vendor.isActive
                                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                              title={vendor.isActive ? 'Deactivate Vendor' : 'Activate Vendor'}
                            >
                              {vendor.isActive ? (
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' />
                                </svg>
                              ) : (
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className='md:hidden space-y-4 p-4'>
              {filteredVendors.map((vendor) => (
                <div key={vendor._id} className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300'>
                  {/* Card Header with Gradient Background */}
                  <div className='bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-4'>
                    <div className='flex items-start gap-3'>
                      {/* Profile Photo with Ring */}
                      <div className='relative flex-shrink-0'>
                        {vendor.passportPhoto ? (
                          <img
                            src={`${BACKEND_URL}/${vendor.passportPhoto}`}
                            alt={vendor.businessName}
                            onClick={() => handlePhotoClick(`${BACKEND_URL}/${vendor.passportPhoto}`)}
                            className='w-16 h-16 rounded-full object-cover border-4 border-white shadow-md cursor-pointer hover:scale-105 transition-transform duration-200'
                          />
                        ) : (
                          <div className='w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md border-4 border-white'>
                            {vendor.businessName?.[0]?.toUpperCase()}
                          </div>
                        )}
                        {/* Status Indicator Dot */}
                        {vendor.paymentVerified && (
                          <div className='absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-md flex items-center justify-center'>
                            <svg className='w-3 h-3 text-white' fill='currentColor' viewBox='0 0 20 20'>
                              <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Vendor Info */}
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-bold text-gray-900 text-sm leading-tight mb-0.5'>{vendor.businessName}</h3>
                        <p className='text-xs text-gray-600 mb-0.5'>Owner: {vendor.ownerName}</p>
                        {vendor.activeCertificate?.certificateNumber && (
                          <div className='inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold mb-0.5'>
                            <svg className='w-3 h-3 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                              <path fillRule='evenodd' d='M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z' clipRule='evenodd' />
                            </svg>
                            <span>{vendor.activeCertificate?.certificateNumber}</span>
                          </div>
                        )}
                        <div className='flex items-start gap-1 text-xs text-gray-500'>
                          <svg className='w-3 h-3 flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                          </svg>
                          <span className='text-left break-words'>
                            {vendor.city || 'N/A'}{vendor.state ? `, ${vendor.state}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className='p-4 space-y-3'>
                    {/* Contact Info */}
                    <div className='flex items-center justify-between gap-2 bg-gray-50 rounded-xl p-3'>
                      <a href={`tel:${vendor.mobile}`} className='flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-xs group'>
                        <div className='p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition'>
                          <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                          </svg>
                        </div>
                        <span className='whitespace-nowrap'>{vendor.mobile}</span>
                      </a>
                      {vendor.email && (
                        <a href={`mailto:${vendor.email}`} className='text-gray-600 hover:text-gray-800 text-xs truncate'>
                          {vendor.email}
                        </a>
                      )}
                    </div>

                    {/* Categories Row */}
                    {vendor.businessCategories && vendor.businessCategories.length > 0 && (
                      <div className='flex flex-wrap gap-1.5'>
                        {vendor.businessCategories.slice(0, 2).map((bc, idx) => (
                          <div key={idx} className='flex items-center gap-1 bg-purple-50 px-2.5 py-1.5 rounded-lg'>
                            <svg className='w-3 h-3 text-purple-600' fill='currentColor' viewBox='0 0 20 20'>
                              <path d='M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' />
                            </svg>
                            <span className='text-xs font-semibold text-purple-700'>{bc.category}</span>
                            <span className='text-xs text-purple-500'>→</span>
                            <span className='text-xs text-purple-600'>{bc.subCategory}</span>
                          </div>
                        ))}
                        {vendor.businessCategories.length > 2 && (
                          <div className='flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium'>
                            +{vendor.businessCategories.length - 2} more
                          </div>
                        )}
                      </div>
                    )}

                    {/* Status Row */}
                    <div className='flex items-center justify-between gap-2 mt-2'>

                      {/* Status Badge */}
                      {vendor.paymentVerified ? (
                        <div className='flex items-center gap-1.5 px-2.5 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-semibold'>
                          <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                          Approved
                        </div>
                      ) : vendor.isRejected ? (
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

                    {/* Membership & Sub-Category */}
                    {vendor.membershipFees && (
                      <div className='flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-xl'>
                        <svg className='w-3.5 h-3.5 text-indigo-600' fill='currentColor' viewBox='0 0 20 20'>
                          <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
                        </svg>
                        <span className='text-xs font-medium text-indigo-700'>Membership: ₹{vendor.membershipFees}</span>
                      </div>
                    )}

                    {/* UTR Number */}
                    {vendor.utrNumber && (
                      <div className='flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-xl'>
                        <svg className='w-3.5 h-3.5 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                        </svg>
                        <span className='text-xs font-semibold text-orange-700'>UTR: {vendor.utrNumber}</span>
                      </div>
                    )}

                    {/* Created Date */}
                    {vendor.createdAt && (
                      <div className='flex items-center gap-2 text-xs text-gray-500'>
                        <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        <span>
                          Created: {new Date(vendor.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className='flex items-center gap-2 p-4 bg-gray-50 border-t border-gray-100 flex-wrap'>
                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(vendor)}
                      className='flex items-center gap-1.5 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-sm hover:shadow-md text-xs font-semibold'
                    >
                      <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                      </svg>
                      Edit
                    </button>

                    {/* Call */}
                    <a
                      href={`tel:${vendor.mobile}`}
                      className='flex items-center gap-1.5 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-sm hover:shadow-md text-xs font-semibold'
                    >
                      <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                      </svg>
                      Call
                    </a>

                    {/* WhatsApp */}
                    {vendor.paymentVerified && vendor.activeCertificate?.downloadLink && (
                      <button
                        onClick={() => sendWhatsAppMessage(vendor)}
                        className='p-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-md'
                      >
                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                          <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
                        </svg>
                      </button>
                    )}

                    {/* Certificate */}
                    {vendor.paymentVerified && vendor.activeCertificate?.downloadLink && (
                      <a
                        href={`${BACKEND_URL}${vendor.activeCertificate?.downloadLink}`}
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

                    {/* Password */}
                    <button
                      onClick={() => openPasswordModal(vendor)}
                      className='flex items-center gap-1.5 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all shadow-sm hover:shadow-md text-xs font-semibold'
                    >
                      <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' />
                      </svg>
                      Pass
                    </button>

                    {/* Approve - Show for pending OR rejected vendors */}
                    {!vendor.paymentVerified && (
                      <button
                        onClick={() => handleApprove(vendor._id)}
                        className='flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg whitespace-nowrap'
                      >
                        {vendor.isRejected ? 'Re-Approve' : 'Approve Now'}
                      </button>
                    )}

                    {/* Reject - Only show for pending (not rejected) */}
                    {!vendor.paymentVerified && !vendor.isRejected && (
                      <button
                        onClick={() => handleReject(vendor._id, vendor.businessName)}
                        className='flex-1 px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-xs font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg whitespace-nowrap'
                      >
                        Reject
                      </button>
                    )}

                    {/* Toggle Status - Only show for approved vendors (not rejected) */}
                    {!vendor.isRejected && (
                      <button
                        onClick={() => handleToggleStatus(vendor._id, vendor.isActive)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all shadow-sm hover:shadow-md text-xs font-semibold ${
                          vendor.isActive
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-gray-500 text-white hover:bg-gray-600'
                        }`}
                      >
                        {vendor.isActive ? (
                          <>
                            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 715.636 5.636m12.728 12.728L5.636 5.636' />
                            </svg>
                            Inactive
                          </>
                        ) : (
                          <>
                            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                            </svg>
                            Active
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Password Modal */}
      {showPasswordModal && selectedVendor && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl p-6 max-w-md w-full'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>Set Password</h2>
            <p className='text-gray-600 mb-4'>
              Setting password for: <strong>{selectedVendor.businessName}</strong>
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
              alt='Vendor Photo'
              className='w-full h-auto max-h-[90vh] object-contain rounded-lg'
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Create Vendor Modal */}
      {showCreateModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200'>
            <div className='px-4 md:px-6 py-4 md:py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50'>
              <h2 className='text-xl md:text-2xl font-black text-gray-800'>Create New Vendor</h2>
              <p className='text-xs md:text-sm text-gray-600 mt-1'>Fill all required details to create and approve vendor profile.</p>
            </div>

            <div className='p-4 md:p-6 space-y-4 md:space-y-5'>
              <div className='bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-4 space-y-3 md:space-y-4'>
                <h3 className='text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide'>Basic Details</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Owner Name <span className='text-red-500'>*</span></label>
                    <input
                      type='text'
                      value={createForm.ownerName}
                      onChange={(e) => setCreateForm({...createForm, ownerName: e.target.value})}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Business Name <span className='text-red-500'>*</span></label>
                    <input
                      type='text'
                      value={createForm.businessName}
                      onChange={(e) => setCreateForm({...createForm, businessName: e.target.value})}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Mobile (10 digits) <span className='text-red-500'>*</span></label>
                    <input
                      type='tel'
                      maxLength={10}
                      value={createForm.mobile}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                        setCreateForm({...createForm, mobile: val})
                      }}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Email</label>
                    <input
                      type='email'
                      value={createForm.email}
                      onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                </div>
              </div>

              <div className='bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-4 space-y-3 md:space-y-4'>
                <h3 className='text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide'>Location</h3>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>State <span className='text-red-500'>*</span></label>
                    <select
                      value={createForm.state}
                      onChange={(e) => setCreateForm({ ...createForm, state: e.target.value, district: '', city: '' })}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm bg-white'
                    >
                      <option value=''>Select State</option>
                      {createStates.map(state => (
                        <option key={state} value={state}>{state.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>District <span className='text-red-500'>*</span></label>
                    <select
                      value={createForm.district}
                      onChange={(e) => setCreateForm({ ...createForm, district: e.target.value, city: '' })}
                      disabled={!createForm.state || createDistricts.length === 0}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm bg-white disabled:opacity-50'
                    >
                      <option value=''>Select District</option>
                      {createDistricts.map(district => (
                        <option key={district} value={district}>{district.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>City <span className='text-red-500'>*</span></label>
                    <select
                      value={createForm.city}
                      onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                      disabled={!createForm.district || createCities.length === 0}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm bg-white disabled:opacity-50'
                    >
                      <option value=''>Select City</option>
                      {createCities.map(city => (
                        <option key={city} value={city}>{city.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className='bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-4 space-y-3 md:space-y-4'>
                <h3 className='text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide'>Business Setup</h3>
                <MultiCategorySelector
                  value={createForm.businessCategories}
                  onChange={(businessCategories) => setCreateForm({...createForm, businessCategories})}
                  required
                />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Membership Fees (Rs.) <span className='text-red-500'>*</span></label>
                    <input
                      type='number'
                      value={createForm.membershipFees}
                      onChange={(e) => setCreateForm({...createForm, membershipFees: e.target.value})}
                      min='1'
                      placeholder='Enter amount'
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Password (min 6 chars)</label>
                    <input
                      type='text'
                      value={createForm.password}
                      onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='flex gap-2 md:gap-3 p-4 md:p-6 pt-3 md:pt-4 border-t border-gray-200 bg-white'>
              <button
                onClick={handleCreateVendor}
                disabled={creating}
                className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 md:py-3 text-sm md:text-base rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 shadow-md'
              >
                {creating ? 'Creating...' : 'Create Vendor'}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className='flex-1 bg-gray-100 border border-gray-300 text-gray-700 py-2.5 md:py-3 text-sm md:text-base rounded-xl font-bold hover:bg-gray-200 transition'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vendor Modal */}
      {showEditModal && selectedVendor && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>Edit Vendor</h2>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Owner Name *</label>
                <input
                  type='text'
                  value={editForm.ownerName}
                  onChange={(e) => setEditForm({...editForm, ownerName: e.target.value})}
                  className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Business Name *</label>
                <input
                  type='text'
                  value={editForm.businessName}
                  onChange={(e) => setEditForm({...editForm, businessName: e.target.value})}
                  className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Mobile * (10 digits)</label>
                <input
                  type='tel'
                  maxLength={10}
                  value={editForm.mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                    setEditForm({...editForm, mobile: val})
                  }}
                  className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                <input
                  type='email'
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>State *</label>
                  <select
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value, district: '', city: '' })}
                    className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white'
                  >
                    <option value=''>Select State</option>
                    {editStates.map(state => (
                      <option key={state} value={state}>{state.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>District *</label>
                  <select
                    value={editForm.district}
                    onChange={(e) => setEditForm({ ...editForm, district: e.target.value, city: '' })}
                    disabled={!editForm.state || editDistricts.length === 0}
                    className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:opacity-50'
                  >
                    <option value=''>Select District</option>
                    {editDistricts.map(district => (
                      <option key={district} value={district}>{district.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>City *</label>
                  <select
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    disabled={!editForm.district || editCities.length === 0}
                    className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:opacity-50'
                  >
                    <option value=''>Select City</option>
                    {editCities.map(city => (
                      <option key={city} value={city}>{city.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              <MultiCategorySelector
                value={editForm.businessCategories}
                onChange={(businessCategories) => setEditForm({...editForm, businessCategories})}
                required
              />

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Membership Fees (Rs.) *</label>
                <input
                  type='number'
                  value={editForm.membershipFees}
                  onChange={(e) => setEditForm({...editForm, membershipFees: e.target.value})}
                  min='1'
                  placeholder='Enter amount e.g. 1000'
                  className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>

            <div className='flex gap-3 mt-6'>
              <button
                onClick={handleEditVendor}
                disabled={editing}
                className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50'
              >
                {editing ? 'Updating...' : 'Update Vendor'}
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedVendor(null)
                }}
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

export default Vendors
