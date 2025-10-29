import { useState, useEffect } from 'react'

const SubAdmin = () => {
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedSubAdmin, setSelectedSubAdmin] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [subAdmins, setSubAdmins] = useState([])
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    isActive: true,
    permissions: {
      canViewUsers: false,
      canEditUsers: false,
      canDeleteUsers: false,
      canApproveUsers: false,
      canViewVendors: false,
      canEditVendors: false,
      canDeleteVendors: false,
      canApproveVendors: false,
      canManageContent: false,
      canViewSettings: false,
      canEditSettings: false
    }
  })

  // Stats
  const stats = {
    total: subAdmins.length,
    active: subAdmins.filter(sa => sa.isActive).length,
    inactive: subAdmins.filter(sa => !sa.isActive).length
  }

  // Fetch all sub-admins
  useEffect(() => {
    fetchSubAdmins()
  }, [])

  const fetchSubAdmins = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/admin/subadmins`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        setSubAdmins(data.subAdmins)
      } else {
        alert(data.message || 'Failed to fetch sub-admins')
      }
    } catch (error) {
      console.error('Error fetching sub-admins:', error)
      alert('Failed to fetch sub-admins')
    } finally {
      setLoading(false)
    }
  }

  // Open modal for adding new sub-admin
  const handleAddNew = () => {
    setIsEdit(false)
    setSelectedSubAdmin(null)
    setFormData({
      fullName: '',
      email: '',
      mobile: '',
      password: '',
      isActive: true,
      permissions: {
        canViewUsers: false,
        canEditUsers: false,
        canDeleteUsers: false,
        canApproveUsers: false,
        canViewVendors: false,
        canEditVendors: false,
        canDeleteVendors: false,
        canApproveVendors: false,
        canManageContent: false,
        canViewSettings: false,
        canEditSettings: false
      }
    })
    setShowModal(true)
  }

  // Open modal for editing sub-admin
  const handleEdit = (subAdmin) => {
    setIsEdit(true)
    setSelectedSubAdmin(subAdmin)
    setFormData({
      fullName: subAdmin.fullName,
      email: subAdmin.email,
      mobile: subAdmin.mobile,
      password: '',
      isActive: subAdmin.isActive,
      permissions: { ...subAdmin.permissions }
    })
    setShowModal(true)
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Handle permission toggle
  const handlePermissionToggle = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }))
  }

  // Handle select all permissions
  const handleSelectAll = () => {
    const allSelected = Object.values(formData.permissions).every(val => val)
    const newPermissions = {}
    Object.keys(formData.permissions).forEach(key => {
      newPermissions[key] = !allSelected
    })
    setFormData(prev => ({
      ...prev,
      permissions: newPermissions
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.fullName || !formData.email || !formData.mobile) {
      alert('Please fill all required fields')
      return
    }

    if (!isEdit && (!formData.password || formData.password.length < 6)) {
      alert('Password must be at least 6 characters')
      return
    }

    try {
      const url = isEdit
        ? `${BACKEND_URL}/api/admin/subadmins/${selectedSubAdmin._id}`
        : `${BACKEND_URL}/api/admin/subadmins`

      const body = isEdit
        ? {
            fullName: formData.fullName,
            email: formData.email,
            mobile: formData.mobile,
            permissions: formData.permissions,
            isActive: formData.isActive
          }
        : formData

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (data.success) {
        alert(isEdit ? 'Sub-admin updated successfully!' : 'Sub-admin created successfully!')
        setShowModal(false)
        fetchSubAdmins()
      } else {
        alert(data.message || 'Failed to save sub-admin')
      }
    } catch (error) {
      console.error('Error saving sub-admin:', error)
      alert('Failed to save sub-admin')
    }
  }

  // Handle delete
  const handleDelete = async (subAdminId) => {
    if (!window.confirm('Are you sure you want to delete this sub-admin?')) return

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/subadmins/${subAdminId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        alert('Sub-admin deleted successfully!')
        fetchSubAdmins()
      } else {
        alert(data.message || 'Failed to delete sub-admin')
      }
    } catch (error) {
      console.error('Error deleting sub-admin:', error)
      alert('Failed to delete sub-admin')
    }
  }

  // Toggle status
  const toggleStatus = async (subAdminId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/subadmins/${subAdminId}/toggle-status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        alert(data.message)
        fetchSubAdmins()
      } else {
        alert(data.message || 'Failed to toggle status')
      }
    } catch (error) {
      console.error('Error toggling status:', error)
      alert('Failed to toggle status')
    }
  }

  // Open password modal
  const openPasswordModal = (subAdmin) => {
    setSelectedSubAdmin(subAdmin)
    setNewPassword('')
    setShowPasswordModal(true)
  }

  // Change password
  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/subadmins/${selectedSubAdmin._id}/password`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword })
      })

      const data = await response.json()

      if (data.success) {
        alert('Password changed successfully!')
        setShowPasswordModal(false)
        setNewPassword('')
      } else {
        alert(data.message || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Failed to change password')
    }
  }

  // Filter sub-admins based on search
  const filteredSubAdmins = subAdmins.filter(sa =>
    sa.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sa.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sa.mobile?.includes(searchTerm)
  )

  // Permission badge component
  const PermissionBadge = ({ permissions }) => {
    const totalPerms = Object.values(permissions).filter(Boolean).length
    return (
      <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold'>
        {totalPerms} Permissions
      </span>
    )
  }

  // Permission groups for better organization
  const permissionGroups = {
    'User Management': [
      { key: 'canViewUsers', label: 'View Users' },
      { key: 'canEditUsers', label: 'Edit Users' },
      { key: 'canDeleteUsers', label: 'Delete Users' },
      { key: 'canApproveUsers', label: 'Approve Users' }
    ],
    'Vendor Management': [
      { key: 'canViewVendors', label: 'View Vendors' },
      { key: 'canEditVendors', label: 'Edit Vendors' },
      { key: 'canDeleteVendors', label: 'Delete Vendors' },
      { key: 'canApproveVendors', label: 'Approve Vendors' }
    ],
    'Content & Settings': [
      { key: 'canManageContent', label: 'Manage Content' },
      { key: 'canViewSettings', label: 'View Settings' },
      { key: 'canEditSettings', label: 'Edit Settings' }
    ]
  }

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl md:text-3xl font-black text-gray-800 mb-1 md:mb-2'>Sub Admin Management</h1>
          <p className='text-sm md:text-base text-gray-600'>Manage sub-administrators and their permissions</p>
        </div>
        <button
          onClick={handleAddNew}
          className='flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition shadow-lg'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
          </svg>
          Add Sub Admin
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Total Sub Admins</div>
          <div className='text-3xl font-black text-blue-600'>{stats.total}</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-green-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Active</div>
          <div className='text-3xl font-black text-green-600'>{stats.active}</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-red-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Inactive</div>
          <div className='text-3xl font-black text-red-600'>{stats.inactive}</div>
        </div>
      </div>

      {/* Sub Admins Table */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
        <div className='p-6 border-b border-gray-200'>
          <input
            type='text'
            placeholder='Search sub-admins by name, email, or mobile...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {loading ? (
          <div className='p-12 text-center text-gray-500'>Loading sub-admins...</div>
        ) : filteredSubAdmins.length === 0 ? (
          <div className='p-12 text-center text-gray-500'>No sub-admins found</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className='hidden md:block overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Sub Admin</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Contact</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Permissions</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Status</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Last Login</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {filteredSubAdmins.map((subAdmin) => (
                    <tr key={subAdmin._id} className='hover:bg-gray-50 transition'>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg'>
                            {subAdmin.fullName[0].toUpperCase()}
                          </div>
                          <div>
                            <div className='font-semibold text-gray-800'>{subAdmin.fullName}</div>
                            <div className='text-xs text-gray-500'>ID: {subAdmin._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='space-y-1'>
                          <div className='text-sm text-gray-800'>{subAdmin.email}</div>
                          <div className='text-sm text-blue-600 font-medium'>{subAdmin.mobile}</div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <PermissionBadge permissions={subAdmin.permissions} />
                      </td>
                      <td className='px-6 py-4'>
                        <button
                          onClick={() => toggleStatus(subAdmin._id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                            subAdmin.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {subAdmin.isActive ? '✓ Active' : '✗ Inactive'}
                        </button>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='text-sm text-gray-600'>
                          {subAdmin.lastLogin ? new Date(subAdmin.lastLogin).toLocaleDateString() : 'Never'}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <button
                            onClick={() => handleEdit(subAdmin)}
                            className='p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition'
                            title='Edit Sub Admin'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                            </svg>
                          </button>
                          <button
                            onClick={() => openPasswordModal(subAdmin)}
                            className='p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition'
                            title='Change Password'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(subAdmin._id)}
                            className='p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition'
                            title='Delete Sub Admin'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className='md:hidden divide-y divide-gray-200'>
              {filteredSubAdmins.map((subAdmin) => (
                <div key={subAdmin._id} className='p-4 hover:bg-gray-50 transition'>
                  <div className='flex items-start gap-3 mb-3'>
                    <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg'>
                      {subAdmin.fullName[0].toUpperCase()}
                    </div>
                    <div className='flex-1'>
                      <div className='font-bold text-gray-800'>{subAdmin.fullName}</div>
                      <div className='text-xs text-gray-500 mb-1'>ID: {subAdmin._id.slice(-6)}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        subAdmin.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {subAdmin.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className='space-y-2 mb-3'>
                    <div className='text-sm text-gray-600'>{subAdmin.email}</div>
                    <div className='text-sm text-blue-600 font-medium'>{subAdmin.mobile}</div>
                    <div className='flex items-center gap-2'>
                      <PermissionBadge permissions={subAdmin.permissions} />
                    </div>
                    <div className='text-xs text-gray-500'>
                      Last Login: {subAdmin.lastLogin ? new Date(subAdmin.lastLogin).toLocaleDateString() : 'Never'}
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() => handleEdit(subAdmin)}
                      className='flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-semibold'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => openPasswordModal(subAdmin)}
                      className='flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition text-sm font-semibold'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' />
                      </svg>
                      Password
                    </button>
                    <button
                      onClick={() => handleDelete(subAdmin._id)}
                      className='flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-semibold'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto'>
          <div className='bg-white rounded-2xl p-6 max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
              {isEdit ? 'Edit Sub Admin' : 'Add New Sub Admin'}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Basic Details */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Full Name *</label>
                  <input
                    type='text'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder='Enter full name'
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Email *</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder='Enter email'
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Mobile Number *</label>
                  <input
                    type='tel'
                    name='mobile'
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder='Enter mobile number'
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>

                {!isEdit && (
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-2'>Password *</label>
                    <input
                      type='password'
                      name='password'
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder='Enter password (min 6 characters)'
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>
                )}

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Status</label>
                  <div className='flex items-center gap-4 mt-3'>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        name='isActive'
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className='w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
                      />
                      <span className='text-sm text-gray-700 font-medium'>Active</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Permissions Section */}
              <div className='mb-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-bold text-gray-800'>Permissions</h3>
                  <button
                    type='button'
                    onClick={handleSelectAll}
                    className='text-sm text-blue-600 hover:text-blue-800 font-medium'
                  >
                    {Object.values(formData.permissions).every(v => v) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className='space-y-4'>
                  {Object.entries(permissionGroups).map(([groupName, permissions]) => (
                    <div key={groupName} className='border border-gray-200 rounded-xl p-4'>
                      <h4 className='font-semibold text-gray-700 mb-3'>{groupName}</h4>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        {permissions.map(({ key, label }) => (
                          <label key={key} className='flex items-center gap-2 cursor-pointer'>
                            <input
                              type='checkbox'
                              checked={formData.permissions[key]}
                              onChange={() => handlePermissionToggle(key)}
                              className='w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
                            />
                            <span className='text-sm text-gray-700'>{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3'>
                <button
                  type='submit'
                  className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition'
                >
                  {isEdit ? 'Update Sub Admin' : 'Create Sub Admin'}
                </button>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && selectedSubAdmin && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl p-6 max-w-md w-full'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>Change Password</h2>
            <p className='text-gray-600 mb-4'>
              Changing password for: <strong>{selectedSubAdmin.fullName}</strong>
            </p>
            <input
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='Enter new password (min 6 characters)'
              className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4'
            />
            <div className='flex gap-3'>
              <button
                onClick={handleChangePassword}
                className='flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition'
              >
                Change Password
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

export default SubAdmin
