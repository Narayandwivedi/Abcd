import { useState, useEffect } from 'react'
import MultiCategorySelector from '../components/MultiCategorySelector'
import { useAdminAuth } from '../context/AdminAuthContext'

const Vendors = () => {
  const { hasPermission } = useAdminAuth()
  const createEmptyOwner = () => ({ name: '', photo: null, previewUrl: '' })
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
  const [activeTab, setActiveTab] = useState('approved') // approved, applications
  const [applications, setApplications] = useState([])
  const [loadingApplications, setLoadingApplications] = useState(false)
  const [applicationFilterStatus, setApplicationFilterStatus] = useState('pending') // pending, rejected, approved
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    owners: [createEmptyOwner()],
    businessName: '',
    mobile: '',
    email: '',
    gstPan: '',
    address: '',
    state: '',
    district: '',
    city: '',
    websiteUrl: '',
    referralId: '',
    membershipType: '',
    businessCategories: [],
    membershipFees: '',
    utrNumber: '',
    paymentScreenshot: null,
    password: '',
    applicationNumber: ''
  })
  const [previewPaymentScreenshot, setPreviewPaymentScreenshot] = useState(null)
  const [creating, setCreating] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    owners: [createEmptyOwner()],
    businessName: '',
    mobile: '',
    email: '',
    gstPan: '',
    address: '',
    state: '',
    district: '',
    city: '',
    websiteUrl: '',
    referralId: '',
    membershipType: '',
    businessCategories: [],
    membershipFees: '',
    utrNumber: '',
    paymentScreenshot: null,
    password: '',
    applicationNumber: ''
  })
  const [previewEditPaymentScreenshot, setPreviewEditPaymentScreenshot] = useState(null)
  const [editing, setEditing] = useState(false)
  const [createStates, setCreateStates] = useState([])
  const [createDistricts, setCreateDistricts] = useState([])
  const [createCities, setCreateCities] = useState([])
  const [editStates, setEditStates] = useState([])
  const [editDistricts, setEditDistricts] = useState([])
  const [editCities, setEditCities] = useState([])

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  const toAbsoluteFileUrl = (filePath) => {
    if (!filePath || typeof filePath !== 'string') return null
    if (/^https?:\/\//i.test(filePath)) return filePath
    if (filePath.startsWith('/')) return `${BACKEND_URL}${filePath}`
    return `${BACKEND_URL}/${filePath}`
  }

  const normalizeVendors = (vendorList = []) => {
    return vendorList.map((vendor) => {
      const owners = Array.isArray(vendor.owners)
        ? vendor.owners.filter((owner) => owner && typeof owner.name === 'string' && owner.name.trim())
        : []

      const ownerNames = owners.map((owner) => owner.name.trim())
      if (ownerNames.length === 0 && vendor.ownerName) {
        ownerNames.push(vendor.ownerName)
      }

      return {
        ...vendor,
        owners,
        ownerNames,
        ownerNamesText: ownerNames.join(', ')
      }
    })
  }

  const getVendorPrimaryPhoto = (vendor) => {
    if (vendor?.passportPhoto) return vendor.passportPhoto
    if (Array.isArray(vendor?.owners) && vendor.owners[0]?.photo) return vendor.owners[0].photo
    return null
  }

  const getOwnerSummary = (vendor) => {
    if (!vendor?.ownerNames?.length) return 'N/A'
    if (vendor.ownerNames.length === 1) return vendor.ownerNames[0]
    return `${vendor.ownerNames[0]} +${vendor.ownerNames.length - 1}`
  }

  const addCreateOwner = () => {
    setCreateForm((prev) => {
      if (prev.owners.length >= 10) {
        alert('Maximum 10 owners allowed')
        return prev
      }
      return { ...prev, owners: [...prev.owners, createEmptyOwner()] }
    })
  }

  const removeCreateOwner = (index) => {
    setCreateForm((prev) => {
      if (prev.owners.length <= 1) return prev
      const removedOwner = prev.owners[index]
      if (removedOwner?.previewUrl) URL.revokeObjectURL(removedOwner.previewUrl)
      return { ...prev, owners: prev.owners.filter((_, i) => i !== index) }
    })
  }

  const handleCreateOwnerNameChange = (index, value) => {
    setCreateForm((prev) => ({
      ...prev,
      owners: prev.owners.map((owner, i) => (i === index ? { ...owner, name: value } : owner))
    }))
  }

  const handleCreateOwnerPhotoChange = (index, e) => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image (JPG, PNG, or WebP)')
      e.target.value = ''
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Photo size should be less than 10MB')
      e.target.value = ''
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setCreateForm((prev) => ({
      ...prev,
      owners: prev.owners.map((owner, i) => {
        if (i !== index) return owner
        if (owner.previewUrl) URL.revokeObjectURL(owner.previewUrl)
        return { ...owner, photo: file, previewUrl }
      })
    }))
  }

  const handleCreatePaymentScreenshotChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid payment screenshot (JPG, PNG, or WebP)')
      e.target.value = ''
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Payment screenshot size should be less than 10MB')
      e.target.value = ''
      return
    }

    setCreateForm((prev) => ({ ...prev, paymentScreenshot: file }))
    const reader = new FileReader()
    reader.onloadend = () => setPreviewPaymentScreenshot(reader.result)
    reader.readAsDataURL(file)
  }

  const addEditOwner = () => {
    setEditForm((prev) => {
      if (prev.owners.length >= 10) {
        alert('Maximum 10 owners allowed')
        return prev
      }
      return { ...prev, owners: [...prev.owners, createEmptyOwner()] }
    })
  }

  const removeEditOwner = (index) => {
    setEditForm((prev) => {
      if (prev.owners.length <= 1) return prev
      const removedOwner = prev.owners[index]
      if (removedOwner?.previewUrl && removedOwner.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(removedOwner.previewUrl)
      }
      return { ...prev, owners: prev.owners.filter((_, i) => i !== index) }
    })
  }

  const handleEditOwnerNameChange = (index, value) => {
    setEditForm((prev) => ({
      ...prev,
      owners: prev.owners.map((owner, i) => (i === index ? { ...owner, name: value } : owner))
    }))
  }

  const handleEditOwnerPhotoChange = (index, e) => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image (JPG, PNG, or WebP)')
      e.target.value = ''
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Photo size should be less than 10MB')
      e.target.value = ''
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setEditForm((prev) => ({
      ...prev,
      owners: prev.owners.map((owner, i) => {
        if (i !== index) return owner
        if (owner.previewUrl && owner.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(owner.previewUrl)
        }
        return { ...owner, photo: file, previewUrl }
      })
    }))
  }

  const handleEditPaymentScreenshotChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid payment screenshot (JPG, PNG, or WebP)')
      e.target.value = ''
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB')
      e.target.value = ''
      return
    }

    setEditForm((prev) => ({ ...prev, paymentScreenshot: file }))
    const reader = new FileReader()
    reader.onloadend = () => setPreviewEditPaymentScreenshot(reader.result)
    reader.readAsDataURL(file)
  }

  const resetCreateForm = () => {
    setCreateForm({
      owners: [createEmptyOwner()],
      businessName: '',
      mobile: '',
      email: '',
      gstPan: '',
      address: '',
      state: '',
      district: '',
      city: '',
      websiteUrl: '',
      referralId: '',
      membershipType: '',
      businessCategories: [],
      membershipFees: '',
      utrNumber: '',
      paymentScreenshot: null,
      password: ''
    })
    setPreviewPaymentScreenshot(null)
  }

  // Debug logging for createForm
  useEffect(() => {
    console.log('Vendors - createForm changed:', createForm)
  }, [createForm])

  // Fetch all vendors
  useEffect(() => {
    fetchVendors()
    fetchApplications()
    fetchCreateStates()
    fetchEditStates()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoadingApplications(true)
      const response = await fetch(`${BACKEND_URL}/api/vendor-application/all`, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setApplications(data.applications)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoadingApplications(false)
    }
  }

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
        const normalizedVendors = normalizeVendors(data.vendors || [])
        setVendors(normalizedVendors)
        calculateStats(normalizedVendors)
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
    if (!createForm.businessName || !createForm.mobile || !createForm.state || !createForm.district || !createForm.city || createForm.businessCategories.length === 0 || !createForm.membershipFees) {
      alert('Please fill all required fields including state, district, city, and at least one category and subcategory')
      return
    }

    if (createForm.mobile.length !== 10) {
      alert('Mobile number must be exactly 10 digits')
      return
    }

    const hasInvalidOwners = createForm.owners.some((owner) => !owner.name?.trim())
    if (hasInvalidOwners) {
      alert('Please add owner name for all owners')
      return
    }

    const hasEmptyCategory = createForm.businessCategories.some(item => !item.category?.trim() || !item.subCategories || item.subCategories.length === 0)
    if (hasEmptyCategory) {
      alert('Please fill in both category and select at least one subcategory for all entries')
      return
    }

    if (createForm.utrNumber && !/^\d{12}$/.test((createForm.utrNumber || '').trim())) {
      alert('Please enter a valid 12-digit UTR number')
      return
    }

    try {
      setCreating(true)
      const formData = new FormData()
      const ownersPayload = createForm.owners.map((owner) => ({ name: owner.name.trim() }))

      formData.append('ownerName', ownersPayload[0]?.name || '')
      formData.append('owners', JSON.stringify(ownersPayload))
      formData.append('businessName', createForm.businessName)
      formData.append('mobile', createForm.mobile)
      formData.append('state', createForm.state)
      formData.append('district', createForm.district)
      formData.append('city', createForm.city)
      formData.append('businessCategories', JSON.stringify(createForm.businessCategories))
      formData.append('membershipFees', createForm.membershipFees)
      if (createForm.email) formData.append('email', createForm.email)
      if (createForm.websiteUrl) formData.append('websiteUrl', createForm.websiteUrl)
      if (createForm.gstPan) formData.append('gstPan', createForm.gstPan)
      if (createForm.address) formData.append('address', createForm.address)
      if (createForm.referralId) formData.append('referralId', createForm.referralId)
      if (createForm.membershipType) formData.append('membershipType', createForm.membershipType)
      if (createForm.utrNumber?.trim()) formData.append('utrNumber', createForm.utrNumber.trim())
      if (createForm.password) formData.append('password', createForm.password)
      if (createForm.paymentScreenshot) formData.append('paymentScreenshot', createForm.paymentScreenshot)
      if (createForm.applicationNumber) formData.append('applicationNumber', createForm.applicationNumber)
      createForm.owners.forEach((owner) => {
        if (owner.photo) formData.append('ownerPhotos', owner.photo)
      })

      const response = await fetch(`${BACKEND_URL}/api/admin/vendors`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const data = await response.json()

      if (data.success) {
        alert('Vendor created successfully!')
        setShowCreateModal(false)
        resetCreateForm()
        fetchVendors()
        fetchApplications()
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
    
    // Normalize owners for edit form
    const normalizedOwners = (vendor.owners && vendor.owners.length > 0) 
      ? vendor.owners.map(o => ({ 
          name: o.name, 
          photo: null, 
          previewUrl: o.photo ? toAbsoluteFileUrl(o.photo) : '' 
        }))
      : [{ name: vendor.ownerName || '', photo: null, previewUrl: '' }]

    setEditForm({
      owners: normalizedOwners,
      businessName: vendor.businessName || '',
      mobile: vendor.mobile || '',
      email: vendor.email || '',
      gstPan: vendor.gstPan || '',
      address: vendor.address || '',
      state: vendor.state || '',
      district: vendor.district || '',
      city: vendor.city || '',
      websiteUrl: vendor.websiteUrl?.replace(/^https?:\/\//i, '') || '',
      referralId: vendor.referralId || '',
      membershipType: vendor.membershipType || '',
      businessCategories: vendor.businessCategories || [],
      membershipFees: vendor.membershipFees || '',
      utrNumber: vendor.utrNumber || '',
      paymentScreenshot: null,
      password: ''
    })
    
    // Set preview for payment screenshot if exists
    if (vendor.paymentScreenshot) {
      setPreviewEditPaymentScreenshot(toAbsoluteFileUrl(vendor.paymentScreenshot))
    } else {
      setPreviewEditPaymentScreenshot(null)
    }
    
    setShowEditModal(true)
  }

  // Handle edit vendor
  const handleEditVendor = async () => {
    const hasEmptyCategory = editForm.businessCategories.some(item => !item.category?.trim() || !item.subCategories || item.subCategories.length === 0)
    if (hasEmptyCategory || editForm.businessCategories.length === 0) {
      alert('Please fill all required fields including state, district, city, and at least one category and subcategory')
      return
    }

    if (editForm.mobile.toString().length !== 10) {
      alert('Mobile number must be exactly 10 digits')
      return
    }

    try {
      setEditing(true)
      const formData = new FormData()
      const ownersPayload = editForm.owners.map((owner) => ({ name: owner.name.trim() }))

      formData.append('owners', JSON.stringify(ownersPayload))
      formData.append('ownerName', ownersPayload[0]?.name || '')
      formData.append('businessName', editForm.businessName)
      formData.append('mobile', editForm.mobile)
      formData.append('state', editForm.state)
      formData.append('district', editForm.district)
      formData.append('city', editForm.city)
      formData.append('businessCategories', JSON.stringify(editForm.businessCategories))
      formData.append('membershipFees', editForm.membershipFees)
      if (editForm.email) formData.append('email', editForm.email)
      if (editForm.gstPan) formData.append('gstPan', editForm.gstPan)
      if (editForm.address) formData.append('address', editForm.address)
      if (editForm.websiteUrl) formData.append('websiteUrl', editForm.websiteUrl)
      if (editForm.referralId) formData.append('referralId', editForm.referralId)
      if (editForm.membershipType) formData.append('membershipType', editForm.membershipType)
      if (editForm.utrNumber) formData.append('utrNumber', editForm.utrNumber)
      if (editForm.password) formData.append('password', editForm.password)
      if (editForm.paymentScreenshot) formData.append('paymentScreenshot', editForm.paymentScreenshot)
      
      editForm.owners.forEach((owner) => {
        if (owner.photo) formData.append('ownerPhotos', owner.photo)
      })

      const response = await fetch(`${BACKEND_URL}/api/admin/vendors/${selectedVendor._id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
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

  // Reject application (temporary registration)
  const handleRejectApplication = async (applicationId, businessName) => {
    if (!window.confirm(`Are you sure you want to reject the application from "${businessName}"?`)) return

    try {
      const response = await fetch(`${BACKEND_URL}/api/vendor-application/${applicationId}/reject`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        alert('Application rejected successfully!')
        fetchApplications()
      } else {
        alert(data.message || 'Failed to reject application')
      }
    } catch (error) {
      console.error('Error rejecting application:', error)
      alert('Failed to reject application')
    }
  }

  // Filter vendors based on search and status
  const filteredVendors = vendors.filter(vendor => {
    // Search filter
    const matchesSearch = vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.ownerNamesText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.mobile?.toString().includes(searchTerm)

    if (activeTab === 'approved') {
      return matchesSearch && vendor.paymentVerified
    }

    return matchesSearch
  })

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.whatsappNumber?.toString().includes(searchTerm) ||
      app.city?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = (app.status || 'pending') === applicationFilterStatus;
    
    return matchesSearch && matchesStatus;
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

      {/* Tab Navigation */}
      <div className='flex gap-4 mb-6 border-b border-gray-200'>
        <button
          onClick={() => setActiveTab('approved')}
          className={`pb-3 px-2 font-bold text-lg transition-all ${
            activeTab === 'approved'
              ? 'text-blue-600 border-b-4 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All Vendors
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-2 font-bold text-lg transition-all ${
            activeTab === 'applications'
              ? 'text-blue-600 border-b-4 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Vendor Applications
        </button>
      </div>      {/* Vendors Table Container */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
          {/* Search Bar & Filters */}
          <div className='flex flex-col md:flex-row gap-4 items-center'>
            <div className='relative flex-1 w-full'>
              <input
                type='text'
                placeholder={`Search ${activeTab === 'approved' ? 'vendors' : 'applications'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <svg className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </div>
            {activeTab === 'applications' && (
              <div className='flex bg-gray-100 p-1 rounded-xl w-full md:w-auto'>
                <button
                  onClick={() => setApplicationFilterStatus('pending')}
                  className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${applicationFilterStatus === 'pending' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setApplicationFilterStatus('rejected')}
                  className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${applicationFilterStatus === 'rejected' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Rejected
                </button>
                <button
                  onClick={() => setApplicationFilterStatus('approved')}
                  className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${applicationFilterStatus === 'approved' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Approved
                </button>
              </div>
            )}
          </div>

        {loading || loadingApplications ? (
          <div className='p-12 text-center text-gray-500'>Loading...</div>
        ) : (activeTab === 'approved' ? filteredVendors : filteredApplications).length === 0 ? (
          <div className='p-12 text-center text-gray-500'>No {activeTab === 'approved' ? 'vendors' : 'applications'} found</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className='hidden md:block overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                      {activeTab === 'approved' ? 'Vendor Details' : 'Applicant Details'}
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Contact</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>
                      {activeTab === 'approved' ? 'Category' : 'Membership'}
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Payment</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Status</th>
                    <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {activeTab === 'approved' ? (
                    filteredVendors.map((vendor) => (
                      <tr key={vendor._id} className='hover:bg-gray-50 transition'>
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-3'>
                            {getVendorPrimaryPhoto(vendor) ? (
                              <img
                                src={toAbsoluteFileUrl(getVendorPrimaryPhoto(vendor))}
                                alt={vendor.businessName}
                                onClick={() => handlePhotoClick(toAbsoluteFileUrl(getVendorPrimaryPhoto(vendor)))}
                                className='w-12 h-12 rounded-full object-cover border-2 border-gray-200 cursor-pointer hover:opacity-80 transition'
                              />
                            ) : (
                              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold'>
                                {vendor.businessName?.[0]?.toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className='font-semibold text-gray-800'>{vendor.businessName}</div>
                              {vendor.activeCertificate?.certificateNumber && (
                                <div className='text-[10px] text-purple-600 font-bold uppercase'>{vendor.activeCertificate.certificateNumber}</div>
                              )}
                              <div className='text-xs text-gray-500'>Owner: {vendor.ownerName}</div>
                              <div className='text-xs text-gray-500'>{vendor.city}, {vendor.state}</div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <a href={`tel:${vendor.mobile}`} className='text-blue-600 hover:text-blue-800 font-medium text-sm'>
                            {vendor.mobile}
                          </a>
                          <div className='text-xs text-gray-500'>{vendor.email}</div>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex flex-col gap-1'>
                            {vendor.businessCategories?.slice(0, 2).map((bc, idx) => (
                              <div key={idx} className='flex flex-col'>
                                <span className='text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded w-fit mb-0.5'>
                                  {bc.category}
                                </span>
                                <div className='flex flex-wrap gap-1'>
                                  {bc.subCategories?.map((sc, sidx) => (
                                    <span key={sidx} className='text-[9px] text-gray-500 bg-gray-50 px-1 rounded'>
                                      {sc.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                            {vendor.businessCategories?.length > 2 && <span className='text-[10px] text-gray-400'>+{vendor.businessCategories.length - 2} more categories</span>}
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='text-xs'>
                            <div className='font-bold'>₹{vendor.membershipFees}</div>
                            <div className='text-gray-500'>UTR: {vendor.utrNumber || 'N/A'}</div>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <span className='px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase'>
                            Approved
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex gap-2'>
                            {vendor.activeCertificate?.downloadLink && (
                              <a
                                href={toAbsoluteFileUrl(vendor.activeCertificate.downloadLink)}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition'
                                title='View Certificate'
                              >
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                                </svg>
                              </a>
                            )}
                            <button onClick={() => openEditModal(vendor)} className='p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition'>
                              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'/></svg>
                            </button>
                            {hasPermission('canDeleteVendors') && (
                              <button onClick={() => handleDeleteVendor(vendor._id, vendor.businessName)} className='p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition'>
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'/></svg>
                              </button>
                            )}
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
                              {app.businessName?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className='font-semibold text-gray-800'>{app.businessName}</div>
                              <div className='text-[10px] text-indigo-600 font-bold uppercase'>{app.applicationNumber}</div>
                              <div className='text-xs text-gray-500'>Owner: {app.ownerName}</div>
                              <div className='text-xs text-gray-500'>City: {app.city}</div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <a href={`tel:${app.whatsappNumber}`} className='text-blue-600 hover:text-blue-800 font-medium text-sm'>
                            {app.whatsappNumber}
                          </a>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='text-xs font-bold text-indigo-600'>
                            {app.membershipType}
                            <div className='text-gray-500 font-normal'>₹{app.membershipAmount}</div>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='text-xs'>
                            {app.utrNumber ? <div>UTR: {app.utrNumber}</div> : <div className='text-blue-600 italic'>Screenshot Attached</div>}
                            {app.paymentScreenshot && (
                              <a href={`${BACKEND_URL}/${app.paymentScreenshot}`} target='_blank' className='text-blue-600 hover:underline'>View Receipt</a>
                            )}
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${app.status === 'rejected' ? 'bg-red-100 text-red-700' : (app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}`}>
                            {app.status === 'rejected' ? 'Rejected' : (app.status === 'approved' ? 'Approved' : 'Pending Approval')}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex gap-2'>
                            {(!app.status || app.status === 'pending') && (
                              <button
                                onClick={() => {
                                  // Auto-fill form fields for creation
                                  setCreateForm(prev => ({
                                    ...prev,
                                    applicationNumber: app.applicationNumber,
                                    businessName: app.businessName,
                                    mobile: app.whatsappNumber,
                                    city: app.city,
                                    membershipType: app.membershipType,
                                    membershipFees: app.membershipAmount,
                                    utrNumber: app.utrNumber,
                                    referralId: app.referralCode,
                                    owners: [{ name: app.ownerName, photo: null, previewUrl: '' }]
                                  }));
                                  setShowCreateModal(true);
                                }}
                                className='px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-md'
                              >
                                Process
                              </button>
                            )}
                            {(!app.status || app.status === 'pending') && (
                              <button
                                onClick={() => handleRejectApplication(app._id, app.businessName)}
                                className='px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition'
                              >
                                Reject
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

            {/* Mobile Card View */}
            <div className='md:hidden space-y-4 p-4'>
              {(activeTab === 'approved' ? filteredVendors : filteredApplications).map((item) => (
                <div key={item._id} className='bg-white rounded-2xl shadow-lg border border-gray-100 p-4'>
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold'>
                      {item.businessName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className='font-bold text-gray-900'>{item.businessName}</h3>
                      {item.activeCertificate?.certificateNumber && (
                        <p className='text-[10px] text-purple-600 font-bold uppercase'>{item.activeCertificate.certificateNumber}</p>
                      )}
                      <p className='text-xs text-gray-500'>{item.ownerName}</p>
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
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${activeTab === 'approved' ? 'bg-green-100 text-green-700' : (item.status === 'rejected' ? 'bg-red-100 text-red-700' : (item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'))}`}>
                      {activeTab === 'approved' ? 'Approved' : (item.status === 'rejected' ? 'Rejected' : (item.status === 'approved' ? 'Approved' : 'Pending'))}
                    </span>
                    <div className='flex gap-4 items-center'>
                      {activeTab === 'approved' && item.activeCertificate?.downloadLink && (
                        <a
                          href={toAbsoluteFileUrl(item.activeCertificate.downloadLink)}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-purple-600 text-xs font-bold'
                        >
                          View Certificate
                        </a>
                      )}
                      {activeTab === 'approved' ? (
                        <button
                          onClick={() => openEditModal(item)}
                          className='text-blue-600 text-xs font-bold'
                        >
                          Edit Details
                        </button>
                      ) : (
                        (!item.status || item.status === 'pending') && (
                          <div className='flex gap-3'>
                            <button
                              onClick={() => {
                                setCreateForm(prev => ({
                                  ...prev,
                                  applicationNumber: item.applicationNumber,
                                  businessName: item.businessName,
                                  mobile: item.whatsappNumber,
                                  city: item.city,
                                  membershipType: item.membershipType,
                                  membershipFees: item.membershipAmount,
                                  utrNumber: item.utrNumber,
                                  referralId: item.referralCode,
                                  owners: [{ name: item.ownerName, photo: null, previewUrl: '' }]
                                }));
                                setShowCreateModal(true);
                              }}
                              className='text-blue-600 text-xs font-bold'
                            >
                              Process
                            </button>
                            <button
                              onClick={() => handleRejectApplication(item._id, item.businessName)}
                              className='text-red-600 text-xs font-bold'
                            >
                              Reject
                            </button>
                          </div>
                        )
                      )}
                    </div>
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
              <div className='bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-4 space-y-4'>
                <h3 className='text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide'>Basic Details</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Business Name <span className='text-red-500'>*</span></label>
                    <input
                      type='text'
                      value={createForm.businessName}
                      onChange={(e) => setCreateForm({ ...createForm, businessName: e.target.value })}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>WhatsApp No. <span className='text-red-500'>*</span></label>
                    <input
                      type='tel'
                      maxLength={10}
                      value={createForm.mobile}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                        setCreateForm({ ...createForm, mobile: val })
                      }}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>GSTN Details / PAN No.</label>
                    <input
                      type='text'
                      value={createForm.gstPan}
                      onChange={(e) => setCreateForm({ ...createForm, gstPan: e.target.value })}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Email</label>
                    <input
                      type='email'
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                </div>

                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <label className='block text-xs md:text-sm font-medium text-gray-700'>Owners <span className='text-red-500'>*</span></label>
                    <button
                      type='button'
                      onClick={addCreateOwner}
                      className='px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition'
                    >
                      + Add Owner
                    </button>
                  </div>

                  {createForm.owners.map((owner, index) => (
                    <div key={`create-owner-${index}`} className='border border-gray-200 rounded-xl p-3 bg-white space-y-3'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div>
                          <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Owner Name {index + 1} <span className='text-red-500'>*</span></label>
                          <input
                            type='text'
                            value={owner.name}
                            onChange={(e) => handleCreateOwnerNameChange(index, e.target.value)}
                            className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                          />
                        </div>
                        <div>
                          <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Owner Photo {index + 1}</label>
                          <input
                            type='file'
                            accept='image/jpeg,image/jpg,image/png,image/webp'
                            onChange={(e) => handleCreateOwnerPhotoChange(index, e)}
                            className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
                          />
                        </div>
                      </div>

                      <div className='flex items-start justify-between'>
                        {owner.previewUrl ? (
                          <img src={owner.previewUrl} alt={`Owner ${index + 1}`} className='w-20 h-20 object-cover rounded-lg border border-gray-300' />
                        ) : <div />}
                        {createForm.owners.length > 1 && (
                          <button
                            type='button'
                            onClick={() => removeCreateOwner(index)}
                            className='px-3 py-1 text-xs font-semibold text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition'
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-4 space-y-4'>
                <h3 className='text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide'>Business Setup</h3>
                <MultiCategorySelector
                  value={createForm.businessCategories}
                  onChange={(businessCategories) => setCreateForm({ ...createForm, businessCategories })}
                  required
                />

                <div>
                  <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Address</label>
                  <textarea
                    rows='2'
                    value={createForm.address}
                    onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                    className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

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

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Website If Any</label>
                    <div className='flex items-center rounded-xl border-2 border-gray-200 bg-white overflow-hidden'>
                      <span className='px-3 text-xs text-gray-500'>https://</span>
                      <input
                        type='text'
                        value={createForm.websiteUrl}
                        onChange={(e) => setCreateForm({ ...createForm, websiteUrl: e.target.value.replace(/^https?:\/\//i, '') })}
                        className='w-full px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='yourbusiness.com'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Referral ID</label>
                    <input
                      type='text'
                      value={createForm.referralId}
                      onChange={(e) => setCreateForm({ ...createForm, referralId: e.target.value })}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div className='md:col-span-2'>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-2'>Membership Type</label>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                      {['Gold', 'Diamond', 'Platinum', 'Charted'].map((type) => (
                        <label key={type} className='flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white cursor-pointer'>
                          <input
                            type='checkbox'
                            checked={createForm.membershipType === type}
                            onChange={() => {
                              const membershipFeeMap = { Gold: '5000', Diamond: '10000', Platinum: '25000', Charted: '0' }
                              const selectedValue = createForm.membershipType === type ? '' : type
                              setCreateForm({
                                ...createForm,
                                membershipType: selectedValue,
                                membershipFees: selectedValue ? membershipFeeMap[selectedValue] : ''
                              })
                            }}
                          />
                          <span className='text-xs md:text-sm font-semibold'>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

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
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>UTR Number</label>
                    <input
                      type='text'
                      maxLength={12}
                      value={createForm.utrNumber}
                      onChange={(e) => setCreateForm({ ...createForm, utrNumber: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
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

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Payment Screenshot</label>
                    <input
                      type='file'
                      accept='image/jpeg,image/jpg,image/png,image/webp'
                      onChange={handleCreatePaymentScreenshotChange}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
                    />
                  </div>
                </div>

                {previewPaymentScreenshot && (
                  <div className='mt-2 relative'>
                    <img src={previewPaymentScreenshot} alt='Payment screenshot preview' className='w-full h-32 object-cover rounded-xl border border-gray-300' />
                    <button
                      type='button'
                      onClick={() => {
                        setCreateForm({ ...createForm, paymentScreenshot: null })
                        setPreviewPaymentScreenshot(null)
                      }}
                      className='absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs'
                    >
                      x
                    </button>
                  </div>
                )}
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
          <div className='bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200'>
            <div className='px-4 md:px-6 py-4 md:py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50'>
              <h2 className='text-xl md:text-2xl font-black text-gray-800'>Edit Vendor</h2>
              <p className='text-xs md:text-sm text-gray-600 mt-1'>Modify details for {selectedVendor.businessName}</p>
            </div>

            <div className='p-4 md:p-6 space-y-4 md:space-y-5'>
              <div className='bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-4 space-y-4'>
                <h3 className='text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide'>Basic Details</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Business Name <span className='text-red-500'>*</span></label>
                    <input
                      type='text'
                      value={editForm.businessName}
                      onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>WhatsApp No. <span className='text-red-500'>*</span></label>
                    <input
                      type='tel'
                      maxLength={10}
                      value={editForm.mobile}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                        setEditForm({ ...editForm, mobile: val })
                      }}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>GSTN Details / PAN No.</label>
                    <input
                      type='text'
                      value={editForm.gstPan}
                      onChange={(e) => setEditForm({ ...editForm, gstPan: e.target.value })}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Email</label>
                    <input
                      type='email'
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                </div>

                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <label className='block text-xs md:text-sm font-medium text-gray-700'>Owners <span className='text-red-500'>*</span></label>
                    <button
                      type='button'
                      onClick={addEditOwner}
                      className='px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition'
                    >
                      + Add Owner
                    </button>
                  </div>

                  {editForm.owners.map((owner, index) => (
                    <div key={`edit-owner-${index}`} className='border border-gray-200 rounded-xl p-3 bg-white space-y-3'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div>
                          <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Owner Name {index + 1} <span className='text-red-500'>*</span></label>
                          <input
                            type='text'
                            value={owner.name}
                            onChange={(e) => handleEditOwnerNameChange(index, e.target.value)}
                            className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                          />
                        </div>
                        <div>
                          <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Owner Photo {index + 1}</label>
                          <input
                            type='file'
                            accept='image/jpeg,image/jpg,image/png,image/webp'
                            onChange={(e) => handleEditOwnerPhotoChange(index, e)}
                            className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
                          />
                        </div>
                      </div>

                      <div className='flex items-start justify-between'>
                        {owner.previewUrl ? (
                          <img src={owner.previewUrl} alt={`Owner ${index + 1}`} className='w-20 h-20 object-cover rounded-lg border border-gray-300' />
                        ) : <div />}
                        {editForm.owners.length > 1 && (
                          <button
                            type='button'
                            onClick={() => removeEditOwner(index)}
                            className='px-3 py-1 text-xs font-semibold text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition'
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-4 space-y-4'>
                <h3 className='text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide'>Business Setup</h3>
                <MultiCategorySelector
                  value={editForm.businessCategories}
                  onChange={(businessCategories) => setEditForm({ ...editForm, businessCategories })}
                  required
                />

                <div>
                  <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Address</label>
                  <textarea
                    rows='2'
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>State <span className='text-red-500'>*</span></label>
                    <select
                      value={editForm.state}
                      onChange={(e) => setEditForm({ ...editForm, state: e.target.value, district: '', city: '' })}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm bg-white'
                    >
                      <option value=''>Select State</option>
                      {editStates.map(state => (
                        <option key={state} value={state}>{state.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>District <span className='text-red-500'>*</span></label>
                    <select
                      value={editForm.district}
                      onChange={(e) => setEditForm({ ...editForm, district: e.target.value, city: '' })}
                      disabled={!editForm.state || editDistricts.length === 0}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm bg-white disabled:opacity-50'
                    >
                      <option value=''>Select District</option>
                      {editDistricts.map(district => (
                        <option key={district} value={district}>{district.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>City <span className='text-red-500'>*</span></label>
                    <select
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      disabled={!editForm.district || editCities.length === 0}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm bg-white disabled:opacity-50'
                    >
                      <option value=''>Select City</option>
                      {editCities.map(city => (
                        <option key={city} value={city}>{city.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Website If Any</label>
                    <div className='flex items-center rounded-xl border-2 border-gray-200 bg-white overflow-hidden'>
                      <span className='px-3 text-xs text-gray-500'>https://</span>
                      <input
                        type='text'
                        value={editForm.websiteUrl}
                        onChange={(e) => setEditForm({ ...editForm, websiteUrl: e.target.value.replace(/^https?:\/\//i, '') })}
                        className='w-full px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='yourbusiness.com'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Referral ID</label>
                    <input
                      type='text'
                      value={editForm.referralId}
                      onChange={(e) => setEditForm({ ...editForm, referralId: e.target.value })}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div className='md:col-span-2'>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-2'>Membership Type</label>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                      {['Gold', 'Diamond', 'Platinum', 'Charted'].map((type) => (
                        <label key={type} className='flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white cursor-pointer'>
                          <input
                            type='checkbox'
                            checked={editForm.membershipType === type}
                            onChange={() => {
                              const membershipFeeMap = { Gold: '5000', Diamond: '10000', Platinum: '25000', Charted: '0' }
                              const selectedValue = editForm.membershipType === type ? '' : type
                              setEditForm({
                                ...editForm,
                                membershipType: selectedValue,
                                membershipFees: selectedValue ? (editForm.membershipType === type ? editForm.membershipFees : membershipFeeMap[selectedValue]) : ''
                              })
                            }}
                          />
                          <span className='text-xs md:text-sm font-semibold'>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Membership Fees (Rs.) <span className='text-red-500'>*</span></label>
                    <input
                      type='number'
                      value={editForm.membershipFees}
                      onChange={(e) => setEditForm({...editForm, membershipFees: e.target.value})}
                      min='1'
                      placeholder='Enter amount'
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>UTR Number</label>
                    <input
                      type='text'
                      maxLength={12}
                      value={editForm.utrNumber}
                      onChange={(e) => setEditForm({ ...editForm, utrNumber: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Password (min 6 chars)</label>
                    <input
                      type='text'
                      value={editForm.password}
                      onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='Leave blank to keep current'
                    />
                  </div>

                  <div>
                    <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>Payment Screenshot</label>
                    <input
                      type='file'
                      accept='image/jpeg,image/jpg,image/png,image/webp'
                      onChange={handleEditPaymentScreenshotChange}
                      className='w-full px-3 md:px-4 py-2 md:py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
                    />
                  </div>
                </div>

                {previewEditPaymentScreenshot && (
                  <div className='mt-2 relative'>
                    <img src={previewEditPaymentScreenshot} alt='Payment screenshot preview' className='w-full h-32 object-cover rounded-xl border border-gray-300' />
                    <button
                      type='button'
                      onClick={() => {
                        setEditForm({ ...editForm, paymentScreenshot: null })
                        setPreviewEditPaymentScreenshot(null)
                      }}
                      className='absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs'
                    >
                      x
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className='flex gap-2 md:gap-3 p-4 md:p-6 pt-3 md:pt-4 border-t border-gray-200 bg-white'>
              <button
                onClick={handleEditVendor}
                disabled={editing}
                className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 md:py-3 text-sm md:text-base rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 shadow-md'
              >
                {editing ? 'Updating...' : 'Update Vendor'}
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedVendor(null)
                }}
                className='flex-1 bg-gray-100 border border-gray-300 text-gray-700 py-2.5 md:py-3 text-sm md:text-base rounded-xl font-bold hover:bg-gray-200 transition'
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
