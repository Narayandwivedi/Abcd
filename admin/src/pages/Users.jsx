import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, pending, approved, rejected
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
    address: '',
    relativeName: '',
    relationship: '',
    passportPhoto: null,
    utrNumber: '',
    referredBy: '',
    city: ''
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
    address: '',
    relativeName: '',
    relationship: 'S/O',
    passportPhoto: null,
    referredBy: '',
    password: '',
    city: ''
  })
  const [creating, setCreating] = useState(false)
  const [activeTab, setActiveTab] = useState('approved') // approved, applications
  const [applications, setApplications] = useState([])
  const [loadingApplications, setLoadingApplications] = useState(false)

  const [createStates, setCreateStates] = useState([])
  const [createDistricts, setCreateDistricts] = useState([])
  const [createCities, setCreateCities] = useState([])
  const [createSelectedState, setCreateSelectedState] = useState('')
  const [createSelectedDistrict, setCreateSelectedDistrict] = useState('')
  const [createSelectedCity, setCreateSelectedCity] = useState('')

  // State for Edit Modal Location Dropdowns
  const [editStates, setEditStates] = useState([])
  const [editDistricts, setEditDistricts] = useState([])
  const [editCities, setEditCities] = useState([])
  const [editSelectedState, setEditSelectedState] = useState('')
  const [editSelectedDistrict, setEditSelectedDistrict] = useState('')
  const [editSelectedCity, setEditSelectedCity] = useState('')

  // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  // Fetch all users
  useEffect(() => {
    fetchUsers()
    fetchApplications()
    fetchCreateStates() // for create modal
    fetchEditStates() // for edit modal
  }, [])

  // Fetch states for create modal
  const fetchCreateStates = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/cities/states`)
      const data = await response.json()
      if (data.success) {
        setCreateStates(data.states)
      }
    } catch (error) {
      console.error('Error fetching create states:', error)
    }
  }

  useEffect(() => {
    if (createSelectedState) {
      const fetchDistricts = async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/api/cities/districts/${createSelectedState}`)
          const data = await response.json()
          if (data.success) {
            setCreateDistricts(data.districts)
          }
        } catch (error) {
          console.error('Error fetching create districts:', error)
        }
      }
      fetchDistricts()
    }
  }, [createSelectedState, BACKEND_URL])

  useEffect(() => {
    if (createSelectedDistrict) {
      const fetchCities = async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/api/cities/district/${createSelectedDistrict}`)
          const data = await response.json()
          if (data.success) {
            setCreateCities(data.cities)
          }
        } catch (error) {
          console.error('Error fetching create cities:', error)
        }
      }
      fetchCities()
    }
  }, [createSelectedDistrict, BACKEND_URL])

  // Fetch states for edit modal
  const fetchEditStates = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/cities/states`)
      const data = await response.json()
      if (data.success) {
        setEditStates(data.states)
      }
    } catch (error) {
      console.error('Error fetching edit states:', error)
    }
  }

  // Fetch districts for edit modal when editSelectedState changes
  useEffect(() => {
    if (editSelectedState) {
      const fetchDistricts = async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/api/cities/districts/${editSelectedState}`)
          const data = await response.json()
          if (data.success) {
            setEditDistricts(data.districts)
          }
        } catch (error) {
          console.error('Error fetching edit districts:', error)
        }
      }
      fetchDistricts()
    }
  }, [editSelectedState, BACKEND_URL])

  // Fetch cities for edit modal when editSelectedDistrict changes
  useEffect(() => {
    if (editSelectedDistrict) {
      const fetchCities = async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/api/cities/district/${editSelectedDistrict}`)
          const data = await response.json()
          if (data.success) {
            setEditCities(data.cities)
          }
        } catch (error) {
          console.error('Error fetching edit cities:', error)
        }
      }
      fetchCities()
    }
  }, [editSelectedDistrict, BACKEND_URL])

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

  const fetchApplications = async () => {
    try {
      setLoadingApplications(true)
      const response = await fetch(`${BACKEND_URL}/api/user-application/all`, {
        method: 'GET',
        credentials: 'include',
      })
      const data = await response.json()
      if (data.success) {
        setApplications(data.data)
      }
    } catch (error) {
      console.error('Error fetching user applications:', error)
    } finally {
      setLoadingApplications(false)
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

  // Reject user
  const handleReject = async (userId, fullName) => {
    const reason = window.prompt(`Enter rejection reason for "${fullName}":`)
    if (!reason || reason.trim() === '') return

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${userId}/reject`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: reason.trim() }),
      })
      const data = await response.json()

      if (data.success) {
        toast.success('User application rejected successfully!', { autoClose: 800 })
        fetchUsers()
      } else {
        toast.error(data.message || 'Failed to reject user', { autoClose: 800 })
      }
    } catch (error) {
      console.error('Error rejecting user:', error)
      toast.error('Failed to reject user', { autoClose: 800 })
    }
  }

  // Toggle user active status
  const handleToggleStatus = async (userId, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate'
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${userId}/toggle-status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        toast.success(data.message, { autoClose: 800 })
        fetchUsers()
      } else {
        toast.error(data.message || 'Failed to toggle user status', { autoClose: 800 })
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
      toast.error('Failed to toggle user status', { autoClose: 800 })
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
    // Open WhatsApp app (mobile) or WhatsApp Web (desktop) automatically
    const whatsappUrl = `https://api.whatsapp.com/send?phone=91${user.mobile}&text=${encodedMessage}`

    window.open(whatsappUrl, '_blank')
  }

  // Open edit modal
  const openEditModal = async (user) => {
    setSelectedUser(user)
    setEditFormData({
      fullName: user.fullName || '',
      mobile: user.mobile || '',
      email: user.email || '',
      gotra: user.gotra || '',
      address: user.address || '',
      relativeName: user.relativeName || '',
      relationship: user.relationship || 'S/O',
      passportPhoto: null,
      utrNumber: user.utrNumber || '',
      referredBy: user.referredBy || ''
    })

    const state = user.state?.toLowerCase() || '';
    const district = user.district?.toLowerCase() || '';
    const city = user.city?.toLowerCase() || '';

    setEditSelectedState(state);
    setEditSelectedDistrict(district);
    setEditSelectedCity(city);

    if (state) {
      const response = await fetch(`${BACKEND_URL}/api/cities/districts/${state}`);
      const data = await response.json();
      if (data.success) {
        setEditDistricts(data.districts);
      }
    } else {
      setEditDistricts([]);
    }

    if (district) {
      const response = await fetch(`${BACKEND_URL}/api/cities/district/${district}`);
      const data = await response.json();
      if (data.success) {
        setEditCities(data.cities);
      }
    } else {
      setEditCities([]);
    }

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
    const code = value.toUpperCase().slice(0, 8)
    setEditFormData(prev => ({ ...prev, referredBy: code }))

    if (code.length === 8) {
      const referralRegex = /^[A-Za-z]{2}[0-9]{6}$/
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

    // Validate referral code format if provided (2 letters + 6 digits = 8 chars)
    if (editFormData.referredBy && editFormData.referredBy.trim()) {
      const referralRegex = /^[A-Za-z]{2}[0-9]{6}$/
      if (!referralRegex.test(editFormData.referredBy.trim())) {
        toast.warning('Referral code must be 2 letters followed by 6 digits (e.g., CG000006)', { autoClose: 2000 })
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
        address: editFormData.address,
        relativeName: editFormData.relativeName,
        relationship: editFormData.relationship,
        utrNumber: editFormData.utrNumber,
        referredBy: editFormData.referredBy,
        state: editSelectedState,
        district: editSelectedDistrict,
        city: editFormData.city || editSelectedCity
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

  // Filter users based on search and tab
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile?.toString().includes(searchTerm)

    if (activeTab === 'approved') {
      return matchesSearch && user.paymentVerified
    }

    return matchesSearch
  })

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.whatsappNumber?.toString().includes(searchTerm) ||
      app.city?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

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

    if (!createSelectedCity && !createFormData.city) {
      toast.warning('Please select a city or enter it manually', { autoClose: 800 })
      return
    }

    if (!createFormData.passportPhoto) {
      toast.warning('Passport photo is required', { autoClose: 800 })
      return
    }

    if (createFormData.referredBy && !/^[A-Za-z]{2}[0-9]{6}$/.test(createFormData.referredBy.trim())) {
      toast.warning('Referral code must be 2 letters followed by 6 digits (e.g., CG000006)', { autoClose: 2000 })
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
      formData.append('state', createSelectedState)
      formData.append('district', createSelectedDistrict)
      formData.append('city', createFormData.city || createSelectedCity)

      // Add optional fields if provided
      if (createFormData.email) formData.append('email', createFormData.email)
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
          address: '',
          relativeName: '',
          relationship: 'S/O',
          passportPhoto: null,
          referredBy: '',
          password: '',
          city: ''
        })
        setCreateSelectedState('')
        setCreateSelectedDistrict('')
        setCreateSelectedCity('')
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

      {/* Tabs */}
      <div className='flex gap-4 mb-6 border-b border-gray-200'>
        <button
          onClick={() => setActiveTab('approved')}
          className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'approved' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All Users
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 ${
            activeTab === 'applications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          User Applications
        </button>
      </div>

      {/* Users Table Container */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
        <div className='p-6 border-b border-gray-200'>
          {/* Search Bar */}
          <input
            type='text'
            placeholder={`Search ${activeTab === 'approved' ? 'users' : 'applications'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {loading || loadingApplications ? (
          <div className='p-12 text-center text-gray-500'>Loading...</div>
        ) : (activeTab === 'approved' ? filteredUsers : filteredApplications).length === 0 ? (
          <div className='p-12 text-center text-gray-500'>No {activeTab === 'approved' ? 'users' : 'applications'} found</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className='hidden md:block overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                      {activeTab === 'approved' ? 'User Details' : 'Applicant Details'}
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Contact</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Location</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Payment</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Status</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {activeTab === 'approved' ? (
                    filteredUsers.map((user) => (
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
                              {user.activeCertificate?.certificateNumber && (
                                <div className='text-xs text-blue-600 font-semibold mt-1'>Cert: {user.activeCertificate.certificateNumber}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <a href={`tel:${user.mobile}`} className='text-blue-600 hover:text-blue-800 font-medium text-sm'>{user.mobile}</a>
                          <div className='text-xs text-gray-500'>{user.email}</div>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='text-xs text-gray-600'>
                            <div>{user.city}</div>
                            <div className='text-gray-400'>{user.state}</div>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='text-xs'>
                            {user.utrNumber && <div className='font-bold'>UTR: {user.utrNumber}</div>}
                            {user.paymentScreenshot && (
                              <a href={`${BACKEND_URL}/${user.paymentScreenshot}`} target='_blank' className='text-blue-600 hover:underline'>View Receipt</a>
                            )}
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <span className='px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase'>Approved</span>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex gap-2'>
                            <button onClick={() => openEditModal(user)} className='p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition'>
                              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'/></svg>
                            </button>
                            <button onClick={() => handleDeleteUser(user._id, user.fullName)} className='p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition'>
                              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    filteredApplications.map((app) => (
                      <tr key={app._id} className='hover:bg-gray-50 transition'>
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-3'>
                            <div className='w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold'>
                              {app.fullName?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className='font-semibold text-gray-800'>{app.fullName}</div>
                              <div className='text-xs text-gray-500'>City: {app.city}</div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <a href={`tel:${app.whatsappNumber}`} className='text-blue-600 hover:text-blue-800 font-medium text-sm'>{app.whatsappNumber}</a>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='text-xs text-gray-600'>{app.city}</div>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='text-xs'>
                            {app.utrNumber ? <div>UTR: {app.utrNumber}</div> : <div className='text-blue-600 italic'>Screenshot Attached</div>}
                            {app.paymentScreenshot && (
                              <a href={`${BACKEND_URL}/${app.paymentScreenshot}`} target='_blank' className='text-blue-600 hover:underline text-[10px]'>View Receipt</a>
                            )}
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <span className='px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold uppercase'>Pending Approval</span>
                        </td>
                        <td className='px-6 py-4'>
                          <button
                            onClick={() => {
                              setCreateFormData(prev => ({
                                ...prev,
                                fullName: app.fullName,
                                mobile: app.whatsappNumber,
                                city: app.city,
                                referredBy: app.referralCode,
                                utrNumber: app.utrNumber,
                                city: app.city,
                              }));
                              setShowCreateModal(true);
                            }}
                            className='px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-md'
                          >
                            Process
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className='md:hidden space-y-4 p-4'>
              {(activeTab === 'approved' ? filteredUsers : filteredApplications).map((item) => (
                <div key={item._id} className='bg-white rounded-2xl shadow-lg border border-gray-100 p-4'>
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold'>
                      {item.fullName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className='font-bold text-gray-900'>{item.fullName}</h3>
                      <p className='text-xs text-gray-500'>{item.city}</p>
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-4 text-xs mb-4'>
                    <div>
                      <p className='text-gray-500'>Mobile</p>
                      <p className='font-semibold'>{item.mobile || item.whatsappNumber}</p>
                    </div>
                    <div>
                      <p className='text-gray-500'>City</p>
                      <p className='font-semibold'>{item.city}</p>
                    </div>
                  </div>
                  <div className='flex justify-between items-center pt-3 border-t border-gray-100'>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${activeTab === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {activeTab === 'approved' ? 'Approved' : 'Pending'}
                    </span>
                    <button
                      onClick={() => {
                        if (activeTab === 'approved') {
                          openEditModal(item)
                        } else {
                          setCreateFormData(prev => ({
                            ...prev,
                            fullName: item.fullName,
                            mobile: item.whatsappNumber,
                            city: item.city,
                            referredBy: item.referralCode,
                            utrNumber: item.utrNumber,
                          }));
                          setShowCreateModal(true);
                        }
                      }}
                      className='text-blue-600 text-xs font-bold'
                    >
                      {activeTab === 'approved' ? 'Edit Details' : 'Process Application'}
                    </button>
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

                  {/* City */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>City *</label>
                    <input
                      type='text'
                      name='city'
                      value={editFormData.city}
                      onChange={handleEditFormChange}
                      placeholder='Enter city'
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

                  {/* State Dropdown */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>State</label>
                    <select
                      value={editSelectedState}
                      onChange={(e) => {
                        setEditSelectedState(e.target.value)
                        setEditSelectedDistrict('')
                        setEditSelectedCity('')
                        setEditDistricts([])
                        setEditCities([])
                      }}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white'
                    >
                      <option value=''>Select State</option>
                      {editStates.map(state => (
                        <option key={state} value={state}>{state.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  {/* District Dropdown */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>District</label>
                    <select
                      value={editSelectedDistrict}
                      onChange={(e) => {
                        setEditSelectedDistrict(e.target.value)
                        setEditSelectedCity('')
                        setEditCities([])
                      }}
                      disabled={!editSelectedState || editDistricts.length === 0}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:opacity-50'
                    >
                      <option value=''>Select District</option>
                      {editDistricts.map(district => (
                        <option key={district} value={district}>{district.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  {/* City Dropdown */}
                  <div>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>City</label>
                    <select
                      value={editSelectedCity}
                      onChange={(e) => setEditSelectedCity(e.target.value)}
                      disabled={!editSelectedDistrict || editCities.length === 0}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:opacity-50'
                    >
                      <option value=''>Select City</option>
                      {editCities.map(city => (
                        <option key={city} value={city}>{city.toUpperCase()}</option>
                      ))}
                    </select>
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
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Referred By (e.g., CG000006)</label>
                    <input
                      type='text'
                      name='referredBy'
                      value={editFormData.referredBy}
                      onChange={(e) => handleReferralChange(e.target.value)}
                      maxLength={8}
                      placeholder='e.g., CG000006'
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

                  {/* State Dropdown */}
                  <div className='md:col-span-1'>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>State *</label>
                    <select
                      value={createSelectedState}
                      onChange={(e) => {
                        setCreateSelectedState(e.target.value)
                        setCreateSelectedDistrict('')
                        setCreateSelectedCity('')
                        setCreateDistricts([])
                        setCreateCities([])
                      }}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white'
                      required
                    >
                      <option value=''>Select State</option>
                      {createStates.map(state => (
                        <option key={state} value={state}>{state.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  {/* District Dropdown */}
                  <div className='md:col-span-1'>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>District *</label>
                    <select
                      value={createSelectedDistrict}
                      onChange={(e) => {
                        setCreateSelectedDistrict(e.target.value)
                        setCreateSelectedCity('')
                        setCreateCities([])
                      }}
                      disabled={!createSelectedState || createDistricts.length === 0}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:opacity-50'
                      required
                    >
                      <option value=''>Select District</option>
                      {createDistricts.map(district => (
                        <option key={district} value={district}>{district.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  {/* Manual City Input */}
                  <div className='md:col-span-1'>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>City (Manual) *</label>
                    <input
                      type='text'
                      name='city'
                      value={createFormData.city}
                      onChange={handleCreateFormChange}
                      placeholder='Or enter city manually'
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                    />
                  </div>

                  {/* City Dropdown */}
                  <div className='md:col-span-1'>
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>City *</label>
                    <select
                      value={createSelectedCity}
                      onChange={(e) => setCreateSelectedCity(e.target.value)}
                      disabled={!createSelectedDistrict || createCities.length === 0}
                      className='w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white disabled:opacity-50'
                      required
                    >
                      <option value=''>Select City</option>
                      {createCities.map(city => (
                        <option key={city} value={city}>{city.toUpperCase()}</option>
                      ))}
                    </select>
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
                    <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1.5'>Referred By (e.g., CG000006)</label>
                    <input
                      type='text'
                      name='referredBy'
                      value={createFormData.referredBy}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase().slice(0, 8)
                        setCreateFormData(prev => ({ ...prev, referredBy: val }))
                      }}
                      maxLength={8}
                      placeholder='e.g., CG000006'
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
