import { useState } from 'react'

const SubAdmin = () => {
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedSubAdmin, setSelectedSubAdmin] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Demo sub-admin data
  const [subAdmins, setSubAdmins] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@abcd.com',
      mobile: '9876543210',
      role: 'User Manager',
      status: 'active',
      createdDate: '2024-01-15',
      lastLogin: '2024-03-10',
      permissions: {
        users: { view: true, create: true, edit: true, delete: false },
        vendors: { view: true, create: false, edit: false, delete: false },
        reports: { view: true, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false }
      }
    },
    {
      id: 2,
      name: 'Priya Agarwal',
      email: 'priya.agarwal@abcd.com',
      mobile: '9876543211',
      role: 'Vendor Manager',
      status: 'active',
      createdDate: '2024-02-01',
      lastLogin: '2024-03-11',
      permissions: {
        users: { view: true, create: false, edit: false, delete: false },
        vendors: { view: true, create: true, edit: true, delete: true },
        reports: { view: true, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false }
      }
    },
    {
      id: 3,
      name: 'Amit Kumar',
      email: 'amit.kumar@abcd.com',
      mobile: '9876543212',
      role: 'Report Analyst',
      status: 'active',
      createdDate: '2024-02-15',
      lastLogin: '2024-03-09',
      permissions: {
        users: { view: true, create: false, edit: false, delete: false },
        vendors: { view: true, create: false, edit: false, delete: false },
        reports: { view: true, create: true, edit: true, delete: false },
        settings: { view: false, create: false, edit: false, delete: false }
      }
    },
    {
      id: 4,
      name: 'Sneha Verma',
      email: 'sneha.verma@abcd.com',
      mobile: '9876543213',
      role: 'Support Admin',
      status: 'inactive',
      createdDate: '2024-01-20',
      lastLogin: '2024-02-28',
      permissions: {
        users: { view: true, create: true, edit: true, delete: false },
        vendors: { view: true, create: false, edit: true, delete: false },
        reports: { view: true, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false }
      }
    },
    {
      id: 5,
      name: 'Vikash Singh',
      email: 'vikash.singh@abcd.com',
      mobile: '9876543214',
      role: 'Full Access Admin',
      status: 'active',
      createdDate: '2024-01-10',
      lastLogin: '2024-03-11',
      permissions: {
        users: { view: true, create: true, edit: true, delete: true },
        vendors: { view: true, create: true, edit: true, delete: true },
        reports: { view: true, create: true, edit: true, delete: true },
        settings: { view: true, create: true, edit: true, delete: false }
      }
    }
  ])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: '',
    status: 'active',
    permissions: {
      users: { view: false, create: false, edit: false, delete: false },
      vendors: { view: false, create: false, edit: false, delete: false },
      reports: { view: false, create: false, edit: false, delete: false },
      settings: { view: false, create: false, edit: false, delete: false }
    }
  })

  // Stats
  const stats = {
    total: subAdmins.length,
    active: subAdmins.filter(sa => sa.status === 'active').length,
    inactive: subAdmins.filter(sa => sa.status === 'inactive').length
  }

  // Open modal for adding new sub-admin
  const handleAddNew = () => {
    setIsEdit(false)
    setSelectedSubAdmin(null)
    setFormData({
      name: '',
      email: '',
      mobile: '',
      role: '',
      status: 'active',
      permissions: {
        users: { view: false, create: false, edit: false, delete: false },
        vendors: { view: false, create: false, edit: false, delete: false },
        reports: { view: false, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false }
      }
    })
    setShowModal(true)
  }

  // Open modal for editing sub-admin
  const handleEdit = (subAdmin) => {
    setIsEdit(true)
    setSelectedSubAdmin(subAdmin)
    setFormData({
      name: subAdmin.name,
      email: subAdmin.email,
      mobile: subAdmin.mobile,
      role: subAdmin.role,
      status: subAdmin.status,
      permissions: { ...subAdmin.permissions }
    })
    setShowModal(true)
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle permission toggle
  const handlePermissionToggle = (module, permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module],
          [permission]: !prev.permissions[module][permission]
        }
      }
    }))
  }

  // Handle select all permissions for a module
  const handleSelectAllModule = (module) => {
    const allSelected = Object.values(formData.permissions[module]).every(val => val)
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          view: !allSelected,
          create: !allSelected,
          edit: !allSelected,
          delete: !allSelected
        }
      }
    }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.mobile || !formData.role) {
      alert('Please fill all required fields')
      return
    }

    if (isEdit) {
      // Update existing sub-admin
      setSubAdmins(prev => prev.map(sa =>
        sa.id === selectedSubAdmin.id
          ? { ...sa, ...formData }
          : sa
      ))
      alert('Sub-admin updated successfully!')
    } else {
      // Add new sub-admin
      const newSubAdmin = {
        ...formData,
        id: subAdmins.length + 1,
        createdDate: new Date().toISOString().split('T')[0],
        lastLogin: '-'
      }
      setSubAdmins(prev => [...prev, newSubAdmin])
      alert('Sub-admin added successfully!')
    }

    setShowModal(false)
  }

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this sub-admin?')) {
      setSubAdmins(prev => prev.filter(sa => sa.id !== id))
      alert('Sub-admin deleted successfully!')
    }
  }

  // Toggle status
  const toggleStatus = (id) => {
    setSubAdmins(prev => prev.map(sa =>
      sa.id === id
        ? { ...sa, status: sa.status === 'active' ? 'inactive' : 'active' }
        : sa
    ))
  }

  // Filter sub-admins based on search
  const filteredSubAdmins = subAdmins.filter(sa =>
    sa.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sa.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sa.mobile?.includes(searchTerm) ||
    sa.role?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Permission badge component
  const PermissionBadge = ({ permissions }) => {
    const totalPerms = Object.values(permissions).reduce((acc, module) =>
      acc + Object.values(module).filter(Boolean).length, 0
    )
    return (
      <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold'>
        {totalPerms} Permissions
      </span>
    )
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
            placeholder='Search sub-admins by name, email, mobile, or role...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Desktop Table View */}
        <div className='hidden md:block overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Sub Admin</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Contact</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Role</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Permissions</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Status</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Last Login</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {filteredSubAdmins.map((subAdmin) => (
                <tr key={subAdmin.id} className='hover:bg-gray-50 transition'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg'>
                        {subAdmin.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className='font-semibold text-gray-800'>{subAdmin.name}</div>
                        <div className='text-xs text-gray-500'>ID: {subAdmin.id}</div>
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
                    <span className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold'>
                      {subAdmin.role}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <PermissionBadge permissions={subAdmin.permissions} />
                  </td>
                  <td className='px-6 py-4'>
                    <button
                      onClick={() => toggleStatus(subAdmin.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        subAdmin.status === 'active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {subAdmin.status === 'active' ? '✓ Active' : '✗ Inactive'}
                    </button>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm text-gray-600'>{subAdmin.lastLogin}</div>
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
                        onClick={() => handleDelete(subAdmin.id)}
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
            <div key={subAdmin.id} className='p-4 hover:bg-gray-50 transition'>
              <div className='flex items-start gap-3 mb-3'>
                <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg'>
                  {subAdmin.name[0].toUpperCase()}
                </div>
                <div className='flex-1'>
                  <div className='font-bold text-gray-800'>{subAdmin.name}</div>
                  <div className='text-xs text-gray-500 mb-1'>ID: {subAdmin.id}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    subAdmin.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {subAdmin.status}
                  </span>
                </div>
              </div>

              <div className='space-y-2 mb-3'>
                <div className='text-sm text-gray-600'>{subAdmin.email}</div>
                <div className='text-sm text-blue-600 font-medium'>{subAdmin.mobile}</div>
                <div className='flex items-center gap-2'>
                  <span className='px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold'>
                    {subAdmin.role}
                  </span>
                  <PermissionBadge permissions={subAdmin.permissions} />
                </div>
                <div className='text-xs text-gray-500'>Last Login: {subAdmin.lastLogin}</div>
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
                  onClick={() => handleDelete(subAdmin.id)}
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
                    name='name'
                    value={formData.name}
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

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Role *</label>
                  <input
                    type='text'
                    name='role'
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder='e.g. User Manager, Vendor Manager'
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>Status *</label>
                  <select
                    name='status'
                    value={formData.status}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  >
                    <option value='active'>Active</option>
                    <option value='inactive'>Inactive</option>
                  </select>
                </div>
              </div>

              {/* Permissions Section */}
              <div className='mb-6'>
                <h3 className='text-lg font-bold text-gray-800 mb-4'>Permissions</h3>
                <div className='space-y-4'>
                  {Object.entries(formData.permissions).map(([module, perms]) => (
                    <div key={module} className='border border-gray-200 rounded-xl p-4'>
                      <div className='flex items-center justify-between mb-3'>
                        <h4 className='font-semibold text-gray-700 capitalize'>{module}</h4>
                        <button
                          type='button'
                          onClick={() => handleSelectAllModule(module)}
                          className='text-sm text-blue-600 hover:text-blue-800 font-medium'
                        >
                          {Object.values(perms).every(v => v) ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                        {Object.entries(perms).map(([permission, value]) => (
                          <label key={permission} className='flex items-center gap-2 cursor-pointer'>
                            <input
                              type='checkbox'
                              checked={value}
                              onChange={() => handlePermissionToggle(module, permission)}
                              className='w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
                            />
                            <span className='text-sm text-gray-700 capitalize'>{permission}</span>
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
    </div>
  )
}

export default SubAdmin
