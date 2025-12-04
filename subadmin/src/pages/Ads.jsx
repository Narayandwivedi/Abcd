import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import api from '../config/axios'

const Ads = () => {
  const [ads, setAds] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTab, setFilterTab] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAd, setSelectedAd] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    vendorId: '',
    title: '',
    description: '',
    link: '',
    displayOrder: 0,
    adImg: null
  })
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, visible: 0, active: 0 })

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  useEffect(() => {
    fetchAds()
    fetchVendors()
  }, [])

  const fetchAds = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/subadmin/ads')

      if (response.data.success) {
        setAds(response.data.ads)
        calculateStats(response.data.ads)
      } else {
        toast.error(response.data.message || 'Failed to fetch ads')
      }
    } catch (error) {
      console.error('Error fetching ads:', error)
      if (error.response?.status === 403) {
        toast.error('You do not have permission to view ads')
      } else {
        toast.error('Failed to fetch ads')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchVendors = async () => {
    try {
      const response = await api.get('/api/admin/users')

      if (response.data.success) {
        setVendors(response.data.users.filter(u => u.paymentVerified))
      }
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  const calculateStats = (adList) => {
    const total = adList.length
    const approved = adList.filter(a => a.isApproved).length
    const pending = adList.filter(a => !a.isApproved).length
    const visible = adList.filter(a => a.isVisible).length
    const active = adList.filter(a => a.isApproved && a.isVisible).length

    setStats({ total, approved, pending, visible, active })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      setFormData({ ...formData, adImg: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddAd = async (e) => {
    e.preventDefault()

    if (!formData.adImg) {
      toast.warning('Ad image is required')
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('adImg', formData.adImg)
      if (formData.vendorId) formDataToSend.append('vendorId', formData.vendorId)
      if (formData.title) formDataToSend.append('title', formData.title)
      if (formData.description) formDataToSend.append('description', formData.description)
      if (formData.link) formDataToSend.append('link', formData.link)
      formDataToSend.append('displayOrder', formData.displayOrder)

      const response = await api.post('/api/subadmin/ads', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        toast.success('Ad created successfully!')
        setShowAddModal(false)
        resetForm()
        fetchAds()
      } else {
        toast.error(response.data.message || 'Failed to create ad')
      }
    } catch (error) {
      console.error('Error creating ad:', error)
      if (error.response?.status === 403) {
        toast.error('You do not have permission to create ads')
      } else {
        toast.error('Failed to create ad')
      }
    }
  }

  const handleEditAd = async (e) => {
    e.preventDefault()

    try {
      const formDataToSend = new FormData()
      if (formData.adImg) formDataToSend.append('adImg', formData.adImg)
      if (formData.vendorId) formDataToSend.append('vendorId', formData.vendorId)
      if (formData.title) formDataToSend.append('title', formData.title)
      if (formData.description) formDataToSend.append('description', formData.description)
      if (formData.link) formDataToSend.append('link', formData.link)
      formDataToSend.append('displayOrder', formData.displayOrder)

      const response = await api.put(`/api/subadmin/ads/${selectedAd._id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        toast.success('Ad updated successfully!')
        setShowEditModal(false)
        resetForm()
        fetchAds()
      } else {
        toast.error(response.data.message || 'Failed to update ad')
      }
    } catch (error) {
      console.error('Error updating ad:', error)
      if (error.response?.status === 403) {
        toast.error('You do not have permission to edit ads')
      } else {
        toast.error('Failed to update ad')
      }
    }
  }

  const handleDeleteAd = async (adId) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return

    try {
      const response = await api.delete(`/api/subadmin/ads/${adId}`)

      if (response.data.success) {
        toast.success('Ad deleted successfully!')
        fetchAds()
      } else {
        toast.error(response.data.message || 'Failed to delete ad')
      }
    } catch (error) {
      console.error('Error deleting ad:', error)
      if (error.response?.status === 403) {
        toast.error('You do not have permission to delete ads')
      } else {
        toast.error('Failed to delete ad')
      }
    }
  }

  const handleToggleApproval = async (adId) => {
    try {
      const response = await api.patch(`/api/subadmin/ads/${adId}/toggle-approval`)

      if (response.data.success) {
        toast.success(response.data.message)
        fetchAds()
      } else {
        toast.error(response.data.message || 'Failed to toggle approval')
      }
    } catch (error) {
      console.error('Error toggling approval:', error)
      if (error.response?.status === 403) {
        toast.error('You do not have permission to approve ads')
      } else {
        toast.error('Failed to toggle approval')
      }
    }
  }

  const handleToggleVisibility = async (adId) => {
    try {
      const response = await api.patch(`/api/subadmin/ads/${adId}/toggle-visibility`)

      if (response.data.success) {
        toast.success(response.data.message)
        fetchAds()
      } else {
        toast.error(response.data.message || 'Failed to toggle visibility')
      }
    } catch (error) {
      console.error('Error toggling visibility:', error)
      if (error.response?.status === 403) {
        toast.error('You do not have permission to edit ads')
      } else {
        toast.error('Failed to toggle visibility')
      }
    }
  }

  const openEditModal = (ad) => {
    setSelectedAd(ad)
    setFormData({
      vendorId: ad.vendorId?._id || '',
      title: ad.title || '',
      description: ad.description || '',
      link: ad.link || '',
      displayOrder: ad.displayOrder || 0,
      adImg: null
    })
    setImagePreview(`${BACKEND_URL}${ad.adImg}`)
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      vendorId: '',
      title: '',
      description: '',
      link: '',
      displayOrder: 0,
      adImg: null
    })
    setImagePreview(null)
    setSelectedAd(null)
  }

  const filteredAds = ads
    .filter(ad => {
      if (filterTab === 'active') {
        return ad.isApproved && ad.isVisible
      }
      return true
    })
    .filter(ad => {
      if (!searchTerm) return true

      return (
        ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.vendorId?.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
    .sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder
      }
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  return (
    <div className='p-3 md:p-6'>
      {/* Header */}
      <div className='mb-4 md:mb-6'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>Ads Management</h1>
        <p className='text-sm md:text-base text-gray-600'>Manage advertisements on the frontend</p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-4 md:mb-6'>
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-2xl md:text-3xl font-bold'>{stats.total}</div>
          <div className='text-xs md:text-sm text-blue-100'>Total Ads</div>
        </div>
        <div className='bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-2xl md:text-3xl font-bold'>{stats.active}</div>
          <div className='text-xs md:text-sm text-emerald-100'>Active Ads</div>
        </div>
        <div className='bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-2xl md:text-3xl font-bold'>{stats.approved}</div>
          <div className='text-xs md:text-sm text-green-100'>Approved</div>
        </div>
        <div className='bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-2xl md:text-3xl font-bold'>{stats.pending}</div>
          <div className='text-xs md:text-sm text-yellow-100'>Pending</div>
        </div>
        <div className='bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-2xl md:text-3xl font-bold'>{stats.visible}</div>
          <div className='text-xs md:text-sm text-purple-100'>Visible</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className='bg-white rounded-xl shadow-md p-4 mb-4'>
        <div className='flex gap-2 mb-4'>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filterTab === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Ads ({stats.total})
          </button>
          <button
            onClick={() => setFilterTab('active')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filterTab === 'active'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active Ads ({stats.active})
          </button>
        </div>
        <div className='flex flex-col md:flex-row gap-3 md:gap-4'>
          <input
            type='text'
            placeholder='Search ads...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button
            onClick={() => setShowAddModal(true)}
            className='bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md'
          >
            + Add New Ad
          </button>
        </div>
      </div>

      {/* Results Count */}
      {!loading && filteredAds.length > 0 && (
        <div className='mb-4 text-sm text-gray-600'>
          Showing <span className='font-semibold text-gray-800'>{filteredAds.length}</span> ad(s)
        </div>
      )}

      {/* Ads Grid */}
      {loading ? (
        <div className='bg-white rounded-xl shadow-md p-12 text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600'></div>
          <p className='mt-4 text-gray-600'>Loading ads...</p>
        </div>
      ) : filteredAds.length === 0 ? (
        <div className='bg-white rounded-xl shadow-md p-12 text-center'>
          <div className='text-6xl mb-4'>📢</div>
          <p className='text-xl font-semibold text-gray-800 mb-2'>No ads found</p>
          <p className='text-gray-500 mb-4'>
            {filterTab === 'active'
              ? 'There are no active ads. Upload an ad and make sure it is approved and visible.'
              : 'Get started by creating your first ad!'
            }
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className='bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md inline-flex items-center gap-2'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            Create First Ad
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
          {filteredAds.map((ad) => (
            <div key={ad._id} className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-400'>
              {/* Ad Image */}
              <div className='relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2'>
                <img
                  src={`${BACKEND_URL}${ad.adImg}`}
                  alt={ad.title || 'Advertisement'}
                  className='w-full h-full object-contain'
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = '/placeholder-ad.png'
                  }}
                />
                <div className='absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg'>
                  #{ad.displayOrder}
                </div>
                <div className='absolute top-2 right-2 flex flex-col gap-1'>
                  {ad.isApproved && ad.isVisible && (
                    <span className='bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg'>
                      ✓ Active
                    </span>
                  )}
                </div>
              </div>

              {/* Ad Details */}
              <div className='p-4'>
                <div className='mb-3'>
                  <h3 className='font-bold text-gray-900 mb-1 text-lg'>{ad.title || 'Untitled Ad'}</h3>
                  <p className='text-sm text-gray-600 line-clamp-2'>{ad.description || 'No description'}</p>
                </div>

                {ad.link && (
                  <div className='mb-3'>
                    <a
                      href={ad.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-xs text-blue-600 hover:underline truncate block'
                    >
                      🔗 {ad.link}
                    </a>
                  </div>
                )}

                {ad.vendorId && (
                  <div className='mb-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100'>
                    <p className='text-xs text-gray-600 mb-1'>Vendor:</p>
                    <p className='text-sm font-semibold text-blue-700'>{ad.vendorId.businessName}</p>
                  </div>
                )}

                <div className='mb-3 flex items-center gap-2 text-xs text-gray-500'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                  </svg>
                  {new Date(ad.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>

                <div className='flex flex-wrap gap-2 mb-4'>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${ad.isApproved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {ad.isApproved ? '✓ Approved' : '⏳ Pending'}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${ad.isVisible ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                    {ad.isVisible ? '👁 Visible' : '🙈 Hidden'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className='space-y-2'>
                  <div className='grid grid-cols-2 gap-2'>
                    <button
                      onClick={() => openEditModal(ad)}
                      className='flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAd(ad._id)}
                      className='flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-xs font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-md'
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                      </svg>
                      Delete
                    </button>
                  </div>

                  <div className='grid grid-cols-2 gap-2'>
                    <button
                      onClick={() => handleToggleApproval(ad._id)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        ad.isApproved
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {ad.isApproved ? '✗ Unapprove' : '✓ Approve'}
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(ad._id)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        ad.isVisible
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {ad.isVisible ? '🙈 Hide' : '👁 Show'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <h2 className='text-2xl font-bold text-gray-800 mb-4'>Add New Ad</h2>
              <form onSubmit={handleAddAd} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Ad Image *</label>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    required
                  />
                  {imagePreview && (
                    <div className='mt-2 border rounded-lg p-2'>
                      <img src={imagePreview} alt='Preview' className='w-full h-48 object-contain' />
                    </div>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Vendor (Optional)</label>
                  <select
                    value={formData.vendorId}
                    onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value=''>No Vendor</option>
                    {vendors.map((vendor) => (
                      <option key={vendor._id} value={vendor._id}>
                        {vendor.businessName} - {vendor.ownerName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Title (Optional)</label>
                  <input
                    type='text'
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows='3'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  ></textarea>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Link (Optional)</label>
                  <input
                    type='url'
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Display Order</label>
                  <input
                    type='number'
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  <p className='text-xs text-gray-500 mt-1'>Lower numbers appear first</p>
                </div>

                <div className='flex gap-3 pt-4'>
                  <button
                    type='submit'
                    className='flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold'
                  >
                    Create Ad
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setShowAddModal(false)
                      resetForm()
                    }}
                    className='flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-semibold'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <h2 className='text-2xl font-bold text-gray-800 mb-4'>Edit Ad</h2>
              <form onSubmit={handleEditAd} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Ad Image</label>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  {imagePreview && (
                    <div className='mt-2 border rounded-lg p-2'>
                      <img src={imagePreview} alt='Preview' className='w-full h-48 object-contain' />
                    </div>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Vendor (Optional)</label>
                  <select
                    value={formData.vendorId}
                    onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value=''>No Vendor</option>
                    {vendors.map((vendor) => (
                      <option key={vendor._id} value={vendor._id}>
                        {vendor.businessName} - {vendor.ownerName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Title (Optional)</label>
                  <input
                    type='text'
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows='3'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  ></textarea>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Link (Optional)</label>
                  <input
                    type='url'
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Display Order</label>
                  <input
                    type='number'
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  <p className='text-xs text-gray-500 mt-1'>Lower numbers appear first</p>
                </div>

                <div className='flex gap-3 pt-4'>
                  <button
                    type='submit'
                    className='flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold'
                  >
                    Update Ad
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setShowEditModal(false)
                      resetForm()
                    }}
                    className='flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-semibold'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Ads
