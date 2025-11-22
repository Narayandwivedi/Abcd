import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    gotra: '',
    city: '',
    address: '',
    relativeName: '',
    relationship: '',
    passportPhoto: null,
    utrNumber: '',
    referredBy: ''
  })
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })
  const [referralStatus, setReferralStatus] = useState({ valid: null, name: '', city: '' })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    gotra: '',
    city: '',
    address: '',
    relativeName: '',
    relationship: 'S/O',
    passportPhoto: null,
    referredBy: '',
    password: ''
  })
  const [creating, setCreating] = useState(false)

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
        toast.success('User approved successfully!', { autoClose: 800 })
        fetchUsers()
      } else {
        toast.error(data.message || 'Failed to approve user', { autoClose: 800 })
      }
    } catch (error) {
      console.error('Error approving user:', error)
      toast.error('Failed to approve user', { autoClose: 800 })
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
      toast.warning('Password must be at least 6 characters', { autoClose: 800 })
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
        toast.success('Password set successfully!', { autoClose: 800 })
        setShowPasswordModal(false)
        setNewPassword('')
        fetchUsers()
      } else {
        toast.error(data.message || 'Failed to set password', { autoClose: 800 })
      }
    } catch (error) {
      console.error('Error setting password:', error)
      toast.error('Failed to set password', { autoClose: 800 })
    }
  }

  // Handle photo click
  const handlePhotoClick = (photoUrl) => {
    setSelectedPhoto(photoUrl)
    setShowPhotoModal(true)
  }

  // Send WhatsApp message
  const sendWhatsAppMessage = (user) => {
    if (!user.activeCertificate || !user.activeCertificate.certificateNumber || !user.activeCertificate.downloadLink) {
      toast.warning('Certificate not generated yet. Please approve the user first.', { autoClose: 800 })
      return
    }

    const certificateUrl = `${BACKEND_URL}${user.activeCertificate.downloadLink}`
    const message = `Congratulations! 🎉

You are now an approved member of ABCD (Agrawal Business and Community Development).

Your Certificate Number: ${user.activeCertificate.certificateNumber}

You can view and download your certificate here:
${certificateUrl}

Welcome to the ABCD family!

Best regards,
ABCD Team`

    const encodedMessage = encodeURIComponent(message)
    // Force WhatsApp Web instead of app
    const whatsappUrl = `https://web.whatsapp.com/send?phone=91${user.mobile}&text=${encodedMessage}`

    window.open(whatsappUrl, '_blank')
  }

  // Open edit modal
  const openEditModal = (user) => {
    setSelectedUser(user)
    setEditFormData({
      fullName: user.fullName || '',
      mobile: user.mobile || '',
      email: user.email || '',
      gotra: user.gotra || '',
      city: user.city || '',
      address: user.address || '',
      relativeName: user.relativeName || '',
      relationship: user.relationship || 'S/O',
      passportPhoto: null,
      utrNumber: user.utrNumber || '',
      referredBy: user.referredBy || ''
    })
    setShowEditModal(true)
    setReferralStatus({ valid: null, name: '', city: '' })
  }

  // Handle edit form input change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle file upload for edit
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditFormData(prev => ({
        ...prev,
        passportPhoto: file
      }))
    }
  }

  // Validate referral code for edit form
  const handleReferralChange = async (value) => {
    const code = value.toUpperCase().slice(0, 7)
    setEditFormData(prev => ({ ...prev, referredBy: code }))

    if (code.length === 7) {
      const referralRegex = /^[A-Za-z]{2}[0-9]{5}$/
      if (referralRegex.test(code)) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/auth/validate-referral/${code}`)
          const data = await response.json()
          if (data.success) {
            setReferralStatus({ valid: true, name: data.fullName, city: data.city })
          } else {
            setReferralStatus({ valid: false, name: '', city: '' })
          }
        } catch (error) {
          setReferralStatus({ valid: false, name: '', city: '' })
        }
      } else {
        setReferralStatus({ valid: false, name: '', city: '' })
      }
    } else {
      setReferralStatus({ valid: null, name: '', city: '' })
    }
  }

  // Submit edit user
  const handleEditUser = async () => {
    if (!editFormData.fullName || !editFormData.mobile) {
      toast.warning('Name and mobile are required', { autoClose: 800 })
      return
    }

    // Validate referral code format if provided (2 letters + 5 digits = 7 chars)
    if (editFormData.referredBy && editFormData.referredBy.trim()) {
      const referralRegex = /^[A-Za-z]{2}[0-9]{5}$/
      if (!referralRegex.test(editFormData.referredBy.trim())) {
        toast.warning('Referral code must be 2 letters followed by 5 digits (e.g., CG00006)', { autoClose: 2000 })
        return
      }
    }

    try {
      // If there's a new photo, upload it first
      let photoPath = null
      if (editFormData.passportPhoto) {
        const formData = new FormData()
        formData.append('passportPhoto', editFormData.passportPhoto)

        const uploadResponse = await fetch(`${BACKEND_URL}/api/user/upload-photo`, {
          method: 'POST',
          body: formData
        })
        const uploadData = await uploadResponse.json()

        if (uploadData.success) {
          photoPath = uploadData.passportPhoto
        }
      }

      // Prepare update data
      const updateData = {
        fullName: editFormData.fullName,
        mobile: editFormData.mobile,
        email: editFormData.email,
        gotra: editFormData.gotra,
        city: editFormData.city,
        address: editFormData.address,
        relativeName: editFormData.relativeName,
        relationship: editFormData.relationship,
        utrNumber: editFormData.utrNumber,
        referredBy: editFormData.referredBy
      }

      // Add photo path if uploaded
      if (photoPath) {
        updateData.passportPhoto = photoPath
      }

      const response = await fetch(`${BACKEND_URL}/api/admin/users/${selectedUser._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })
      const data = await response.json()

      if (data.success) {
        toast.success('User updated successfully!', { autoClose: 800 })
        setShowEditModal(false)
        fetchUsers()
      } else {
        toast.error(data.message || 'Failed to update user', { autoClose: 800 })
      }
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user', { autoClose: 800 })
    }
  }

  // Delete user
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone and will delete all associated data including certificates and photos.`)) {
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = await response.json()

      if (data.success) {
        toast.success('User deleted successfully!', { autoClose: 800 })
        fetchUsers()
      } else {
        toast.error(data.message || 'Failed to delete user', { autoClose: 800 })
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user', { autoClose: 800 })
    }
  }

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile?.toString().includes(searchTerm)
  )

  // Handle create form input change
  const handleCreateFormChange = (e) => {
    const { name, value } = e.target
    setCreateFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle file upload for create
  const handleCreateFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCreateFormData(prev => ({
        ...prev,
        passportPhoto: file
      }))
    }
  }

  // Submit create user
  const handleCreateUser = async () => {
    if (!createFormData.fullName || !createFormData.mobile || !createFormData.gotra || !createFormData.address || !createFormData.relativeName) {
      toast.warning('Please fill all required fields', { autoClose: 800 })
      return
    }

    if (!createFormData.passportPhoto) {
      toast.warning('Passport photo is required', { autoClose: 800 })
      return
    }

    try {
      setCreating(true)

      // Create FormData with all fields including file
      const formData = new FormData()
      formData.append('fullName', createFormData.fullName)
      formData.append('mobile', createFormData.mobile)
      formData.append('gotra', createFormData.gotra)
      formData.append('address', createFormData.address)
      formData.append('relativeName', createFormData.relativeName)
      formData.append('relationship', createFormData.relationship)
      formData.append('passportPhoto', createFormData.passportPhoto)

      // Add optional fields if provided
      if (createFormData.email) formData.append('email', createFormData.email)
      if (createFormData.city) formData.append('city', createFormData.city)
      if (createFormData.referredBy) formData.append('referredBy', createFormData.referredBy)
      if (createFormData.password) formData.append('password', createFormData.password)

      const response = await fetch(`${BACKEND_URL}/api/admin/users`, {
        method: 'POST',
        credentials: 'include',
        body: formData  // Don't set Content-Type header, browser will set it with boundary
      })
      const data = await response.json()

      if (data.success) {
        toast.success('User created successfully!', { autoClose: 800 })
        setShowCreateModal(false)
        setCreateFormData({
          fullName: '',
          mobile: '',
          email: '',
          gotra: '',
          city: '',
          address: '',
          relativeName: '',
          relationship: 'S/O',
          passportPhoto: null,
          referredBy: '',
          password: ''
        })
        fetchUsers()
      } else {
        toast.error(data.message || 'Failed to create user', { autoClose: 800 })
      }
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Failed to create user', { autoClose: 800 })
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl md:text-3xl font-black text-gray-800 mb-1 md:mb-2'>User Applications</h1>
          <p className='text-sm md:text-base text-gray-600'>Manage user registrations and approvals</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          <span className='hidden md:inline'>Create User</span>
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
          <>
            {/* Desktop Table View */}
            <div className='hidden md:block overflow-x-auto'>
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
                              onClick={() => handlePhotoClick(`${BACKEND_URL}/${user.passportPhoto}`)}
                              className='w-12 h-12 rounded-full object-cover border-2 border-gray-200 cursor-pointer hover:opacity-80 transition'
                            />
                          ) : (
                            <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold'>
                              {user.fullName?.[0]?.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className='font-semibold text-gray-800'>{user.fullName}</div>
                            <div className='text-xs text-gray-500'>{user.relationship || 'S/O'} {user.relativeName}</div>
                            <div className='text-xs text-gray-500'>{user.address}</div>
                            {user.activeCertificate?.certificateNumber && (
                              <div className='text-xs text-blue-600 font-semibold mt-1'>
                                Cert: {user.activeCertificate.certificateNumber}
                              </div>
                            )}
                            {user.createdAt && (
                              <div className='text-xs text-gray-500 mt-1'>
                                Created: {new Date(user.createdAt).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            )}
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
                        <div className='flex items-center gap-3 flex-wrap'>
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

                          {/* WhatsApp Button */}
                          {user.paymentVerified && user.activeCertificate?.downloadLink && (
                            <button
                              onClick={() => sendWhatsAppMessage(user)}
                              className='p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition'
                              title='Send WhatsApp'
                            >
                              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
                              </svg>
                            </button>
                          )}

                          {/* View Certificate PDF Button */}
                          {user.paymentVerified && user.activeCertificate?.downloadLink && !user.activeCertificate?.pdfDeleted && (
                            <a
                              href={`${BACKEND_URL}${user.activeCertificate.downloadLink}`}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition'
                              title='View Certificate PDF'
                            >
                              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' />
                              </svg>
                            </a>
                          )}

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

                          {/* Edit Button */}
                          <button
                            onClick={() => openEditModal(user)}
                            className='p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'
                            title='Edit User'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                            </svg>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteUser(user._id, user.fullName)}
                            className='p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition'
                            title='Delete User'
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
            <div className='md:hidden space-y-4 p-4'>
              {filteredUsers.map((user) => (
                <div key={user._id} className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300'>
                  {/* Card Header with Gradient Background */}
                  <div className='bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-4'>
                    <div className='flex items-start gap-3'>
                      {/* Profile Photo with Ring */}
                      <div className='relative flex-shrink-0'>
                        {user.passportPhoto ? (
                          <img
                            src={`${BACKEND_URL}/${user.passportPhoto}`}
                            alt={user.fullName}
                            onClick={() => handlePhotoClick(`${BACKEND_URL}/${user.passportPhoto}`)}
                            className='w-16 h-16 rounded-full object-cover border-4 border-white shadow-md cursor-pointer hover:scale-105 transition-transform duration-200'
                          />
                        ) : (
                          <div className='w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md border-4 border-white'>
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

                      {/* User Info */}
                      <div className='flex-1 min-w-0'>
                        {/* Name and Action Buttons Row */}
                        <div className='flex items-center justify-between gap-2 mb-0.5'>
                          <h3 className='font-bold text-gray-900 text-xs leading-tight'>{user.fullName}</h3>
                          <div className='flex gap-1 flex-shrink-0'>
                            <button
                              onClick={() => openEditModal(user)}
                              className='p-1.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 shadow-sm border border-blue-200 transition-all duration-200 hover:shadow-md'
                              title='Edit User'
                            >
                              <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id, user.fullName)}
                              className='p-1.5 bg-white text-red-600 rounded-lg hover:bg-red-50 shadow-sm border border-red-200 transition-all duration-200 hover:shadow-md'
                              title='Delete User'
                            >
                              <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className='text-xs text-gray-600 mb-0.5'>
                          <span className='font-medium'>{user.relationship || 'S/O'}</span> {user.relativeName}
                        </p>
                        {user.activeCertificate?.certificateNumber && (
                          <div className='inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold mb-0.5 whitespace-nowrap'>
                            <svg className='w-3 h-3 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                              <path fillRule='evenodd' d='M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z' clipRule='evenodd' />
                            </svg>
                            <span className='whitespace-nowrap'>{user.activeCertificate.certificateNumber}</span>
                          </div>
                        )}
                        <div className='flex items-start gap-1 text-xs text-gray-500'>
                          <svg className='w-3 h-3 flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
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

                    {/* Gotra & Payment Row */}
                    <div className='flex items-center justify-between gap-2'>
                      <div className='flex items-center gap-1.5 bg-purple-50 px-2.5 py-2 rounded-xl'>
                        <svg className='w-3.5 h-3.5 text-purple-600' fill='currentColor' viewBox='0 0 20 20'>
                          <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
                        </svg>
                        <span className='text-xs font-semibold text-purple-700'>{user.gotra}</span>
                      </div>

                      {/* Payment Info or Status */}
                      {user.utrNumber ? (
                        <div className='flex items-center gap-1.5 bg-orange-50 px-2.5 py-2 rounded-xl'>
                          <svg className='w-3.5 h-3.5 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                          </svg>
                          <span className='text-xs font-semibold text-orange-700'>UTR: {user.utrNumber}</span>
                        </div>
                      ) : user.paymentScreenshot ? (
                        <a
                          href={`${BACKEND_URL}/${user.paymentScreenshot}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center gap-1.5 bg-orange-50 px-2.5 py-2 rounded-xl hover:bg-orange-100 transition'
                        >
                          <svg className='w-3.5 h-3.5 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                          </svg>
                          <span className='text-xs font-semibold text-orange-700'>Screenshot</span>
                        </a>
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

                    {/* Created Date */}
                    {user.createdAt && (
                      <div className='flex items-center gap-2 text-xs text-gray-500'>
                        <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        <span>
                          Created: {new Date(user.createdAt).toLocaleDateString('en-IN', {
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

                    {/* WhatsApp */}
                    {user.paymentVerified && user.activeCertificate?.downloadLink && (
                      <button
                        onClick={() => sendWhatsAppMessage(user)}
                        className='p-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-md'
                      >
                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                          <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
                        </svg>
                      </button>
                    )}

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

                    {/* Password */}
                    <button
                      onClick={() => openPasswordModal(user)}
                      className='flex items-center gap-1.5 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all shadow-sm hover:shadow-md text-xs font-semibold'
                    >
                      <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' />
                      </svg>
                      Pass
                    </button>

                    {/* Approve */}
                    {!user.paymentVerified && !user.isRejected && (
                      <button
                        onClick={() => handleApprove(user._id)}
                        className='flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg whitespace-nowrap'
                      >
                        Approve Now
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

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className='fixed inset-0 bg-black/50 z-50 overflow-y-auto'>
          <div className='min-h-screen px-3 py-4 md:p-4 flex items-start md:items-center justify-center'>
            <div className='bg-white rounded-2xl w-full max-w-2xl shadow-2xl'>
              {/* Modal Header - Sticky on mobile */}
              <div className='sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 p-4 md:p-6 z-10'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-800'>Edit User</h2>
                    <p className='text-sm text-gray-600 mt-1'>
                      Editing: <strong>{selectedUser.fullName}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className='p-2 hover:bg-gray-100 rounded-full transition'
                  >
                    <svg className='w-6 h-6 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body - Scrollable */}
              <div className='p-4 md:p-6 max-h-[70vh] md:max-h-[75vh] overflow-y-auto'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'>
                  {/* Full Name */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Full Name *</label>
                    <input
                      type='text'
                      name='fullName'
                      value={editFormData.fullName}
                      onChange={handleEditFormChange}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Mobile *</label>
                    <input
                      type='text'
                      name='mobile'
                      value={editFormData.mobile}
                      onChange={handleEditFormChange}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Email</label>
                    <input
                      type='email'
                      name='email'
                      value={editFormData.email}
                      onChange={handleEditFormChange}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>

                  {/* Gotra */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Gotra</label>
                    <select
                      name='gotra'
                      value={editFormData.gotra}
                      onChange={handleEditFormChange}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white'
                    >
                      <option value=''>Select Gotra</option>
                      <option value='Bansal'>Bansal</option>
                      <option value='Kuchhal'>Kuchhal</option>
                      <option value='Kansal'>Kansal</option>
                      <option value='Bindal'>Bindal</option>
                      <option value='Singhal'>Singhal</option>
                      <option value='Jindal'>Jindal</option>
                      <option value='Mittal'>Mittal</option>
                      <option value='Garg'>Garg</option>
                      <option value='Nangal'>Nangal</option>
                      <option value='Mangal'>Mangal</option>
                      <option value='Tayal'>Tayal</option>
                      <option value='Tingal'>Tingal</option>
                      <option value='Madhukul'>Madhukul</option>
                      <option value='Goyal'>Goyal</option>
                      <option value='Airan'>Airan</option>
                      <option value='Goyan'>Goyan</option>
                      <option value='Dharan'>Dharan</option>
                      <option value='Bhandal'>Bhandal</option>
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>City</label>
                    <input
                      type='text'
                      name='city'
                      value={editFormData.city}
                      onChange={handleEditFormChange}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>

                  {/* Relationship */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Relationship</label>
                    <select
                      name='relationship'
                      value={editFormData.relationship}
                      onChange={handleEditFormChange}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white'
                    >
                      <option value='S/O'>S/O (Son of)</option>
                      <option value='D/O'>D/O (Daughter of)</option>
                      <option value='W/O'>W/O (Wife of)</option>
                    </select>
                  </div>

                  {/* Relative Name */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Relative Name</label>
                    <input
                      type='text'
                      name='relativeName'
                      value={editFormData.relativeName}
                      onChange={handleEditFormChange}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>

                  {/* UTR Number */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>UTR Number</label>
                    <input
                      type='text'
                      name='utrNumber'
                      value={editFormData.utrNumber}
                      onChange={handleEditFormChange}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>

                  {/* Referred By */}
                  <div className='md:col-span-2'>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Referred By (e.g., CG00006)</label>
                    <input
                      type='text'
                      name='referredBy'
                      value={editFormData.referredBy}
                      onChange={(e) => handleReferralChange(e.target.value)}
                      maxLength={7}
                      placeholder='e.g., CG00006'
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                    {referralStatus.valid === true && (
                      <p className='text-green-600 text-xs mt-1'>{referralStatus.name} - {referralStatus.city}</p>
                    )}
                    {referralStatus.valid === false && (
                      <p className='text-red-600 text-xs mt-1'>Wrong referral code</p>
                    )}
                  </div>

                  {/* Address - Full Width */}
                  <div className='md:col-span-2'>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Address</label>
                    <textarea
                      name='address'
                      value={editFormData.address}
                      onChange={handleEditFormChange}
                      rows='2'
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>

                  {/* Passport Photo Upload */}
                  <div className='md:col-span-2'>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Update Passport Photo</label>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleFileChange}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                    {editFormData.passportPhoto && (
                      <p className='text-xs text-green-600 mt-2'>New photo selected: {editFormData.passportPhoto.name}</p>
                    )}
                    {selectedUser.passportPhoto && !editFormData.passportPhoto && (
                      <div className='mt-2'>
                        <p className='text-xs text-gray-600 mb-2'>Current photo:</p>
                        <img
                          src={`${BACKEND_URL}/${selectedUser.passportPhoto}`}
                          alt='Current'
                          className='w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover border-2 border-gray-200'
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer - Sticky on mobile */}
              <div className='sticky bottom-0 bg-white rounded-b-2xl border-t border-gray-100 p-4 md:p-6'>
                <div className='flex gap-3'>
                  <button
                    onClick={handleEditUser}
                    className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition text-sm md:text-base'
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className='flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition text-sm md:text-base'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className='fixed inset-0 bg-black/50 z-50 overflow-y-auto'>
          <div className='min-h-screen px-3 py-4 md:p-4 flex items-start md:items-center justify-center'>
            <div className='bg-white rounded-2xl w-full max-w-2xl shadow-2xl'>
              {/* Modal Header - Sticky on mobile */}
              <div className='sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 p-4 md:p-6 z-10'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-800'>Create New User</h2>
                    <p className='text-sm text-gray-600 mt-1'>Add a new user without payment requirement</p>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className='p-2 hover:bg-gray-100 rounded-full transition'
                  >
                    <svg className='w-6 h-6 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body - Scrollable */}
              <div className='p-4 md:p-6 max-h-[70vh] md:max-h-[75vh] overflow-y-auto'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'>
                  {/* Full Name */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Full Name *</label>
                    <input
                      type='text'
                      name='fullName'
                      value={createFormData.fullName}
                      onChange={handleCreateFormChange}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Mobile * (10 digits)</label>
                    <input
                      type='tel'
                      name='mobile'
                      maxLength={10}
                      value={createFormData.mobile}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                        setCreateFormData(prev => ({ ...prev, mobile: val }))
                      }}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Email</label>
                    <input
                      type='email'
                      name='email'
                      value={createFormData.email}
                      onChange={handleCreateFormChange}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>

                  {/* Gotra */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Gotra *</label>
                    <select
                      name='gotra'
                      value={createFormData.gotra}
                      onChange={handleCreateFormChange}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white'
                    >
                      <option value=''>Select Gotra</option>
                      <option value='Bansal'>Bansal</option>
                      <option value='Kuchhal'>Kuchhal</option>
                      <option value='Kansal'>Kansal</option>
                      <option value='Bindal'>Bindal</option>
                      <option value='Singhal'>Singhal</option>
                      <option value='Jindal'>Jindal</option>
                      <option value='Mittal'>Mittal</option>
                      <option value='Garg'>Garg</option>
                      <option value='Nangal'>Nangal</option>
                      <option value='Mangal'>Mangal</option>
                      <option value='Tayal'>Tayal</option>
                      <option value='Tingal'>Tingal</option>
                      <option value='Madhukul'>Madhukul</option>
                      <option value='Goyal'>Goyal</option>
                      <option value='Airan'>Airan</option>
                      <option value='Goyan'>Goyan</option>
                      <option value='Dharan'>Dharan</option>
                      <option value='Bhandal'>Bhandal</option>
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>City</label>
                    <input
                      type='text'
                      name='city'
                      value={createFormData.city}
                      onChange={handleCreateFormChange}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>

                  {/* Relationship */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Relationship *</label>
                    <select
                      name='relationship'
                      value={createFormData.relationship}
                      onChange={handleCreateFormChange}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white'
                    >
                      <option value='S/O'>S/O (Son of)</option>
                      <option value='D/O'>D/O (Daughter of)</option>
                      <option value='W/O'>W/O (Wife of)</option>
                    </select>
                  </div>

                  {/* Relative Name */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Relative Name *</label>
                    <input
                      type='text'
                      name='relativeName'
                      value={createFormData.relativeName}
                      onChange={handleCreateFormChange}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>

                  {/* Referred By */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Referred By (e.g., CG00006)</label>
                    <input
                      type='text'
                      name='referredBy'
                      value={createFormData.referredBy}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase().slice(0, 7)
                        setCreateFormData(prev => ({ ...prev, referredBy: val }))
                      }}
                      maxLength={7}
                      placeholder='e.g., CG00006'
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Password (min 6 chars)</label>
                    <input
                      type='text'
                      name='password'
                      value={createFormData.password}
                      onChange={handleCreateFormChange}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>

                  {/* Address - Full Width */}
                  <div className='md:col-span-2'>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Address *</label>
                    <textarea
                      name='address'
                      value={createFormData.address}
                      onChange={handleCreateFormChange}
                      rows='2'
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>

                  {/* Passport Photo Upload */}
                  <div className='md:col-span-2'>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Passport Photo *</label>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleCreateFileChange}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                    {createFormData.passportPhoto && (
                      <p className='text-xs text-green-600 mt-2'>Photo selected: {createFormData.passportPhoto.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer - Sticky on mobile */}
              <div className='sticky bottom-0 bg-white rounded-b-2xl border-t border-gray-100 p-4 md:p-6'>
                <div className='flex gap-3'>
                  <button
                    onClick={handleCreateUser}
                    disabled={creating}
                    className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition text-sm md:text-base disabled:opacity-50'
                  >
                    {creating ? 'Creating...' : 'Create User'}
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className='flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition text-sm md:text-base'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
