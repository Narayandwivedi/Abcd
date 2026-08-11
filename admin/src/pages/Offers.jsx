import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAdminAuth } from '../context/AdminAuthContext'

const Offers = () => {
  const { hasPermission } = useAdminAuth()
  const [offers, setOffers] = useState([])
  const [vendors, setVendors] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [vendorSearchTerm, setVendorSearchTerm] = useState('')
  const [showVendorDropdown, setShowVendorDropdown] = useState(false)

  const [formData, setFormData] = useState({
    vendorId: '',
    categoryId: '',
    title: '',
    description: '',
    discountPercentage: '',
    displayOrder: 0,
    expiryDate: '',
    offerImage: null
  })

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  useEffect(() => {
    fetchOffers()
    fetchVendors()
    fetchCategories()
  }, [])

  const fetchOffers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/admin/offers`, {
        method: 'GET',
        credentials: 'include',
      })
      const data = await response.json()
      if (data.success) {
        setOffers(data.offers)
      } else {
        toast.error(data.message || 'Failed to fetch offers')
      }
    } catch (error) {
      console.error('Error fetching offers:', error)
      toast.error('Failed to fetch offers')
    } finally {
      setLoading(false)
    }
  }

  const fetchVendors = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/vendors`, {
        method: 'GET',
        credentials: 'include',
      })
      const data = await response.json()
      if (data.success) {
        setVendors(data.vendors.filter(v => v.paymentVerified))
      }
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/categories`, {
        method: 'GET',
        credentials: 'include',
      })
      const data = await response.json()
      if (data.success) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      setFormData({ ...formData, offerImage: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddOffer = async (e) => {
    e.preventDefault()

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('offerImage', formData.offerImage)
      formDataToSend.append('vendorId', formData.vendorId)
      formDataToSend.append('categoryId', formData.categoryId)
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('discountPercentage', formData.discountPercentage)
      formDataToSend.append('displayOrder', formData.displayOrder)
      if (formData.expiryDate) formDataToSend.append('expiryDate', formData.expiryDate)

      const response = await fetch(`${BACKEND_URL}/api/admin/offers`, {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      })
      const data = await response.json()

      if (data.success) {
        toast.success('Offer created successfully!')
        setShowAddModal(false)
        resetForm()
        fetchOffers()
      } else {
        toast.error(data.message || 'Failed to create offer')
      }
    } catch (error) {
      console.error('Error creating offer:', error)
      toast.error('Failed to create offer')
    }
  }

  const handleEditOffer = async (e) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      if (formData.offerImage) formDataToSend.append('offerImage', formData.offerImage)
      formDataToSend.append('vendorId', formData.vendorId)
      formDataToSend.append('categoryId', formData.categoryId)
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('discountPercentage', formData.discountPercentage)
      formDataToSend.append('displayOrder', formData.displayOrder)
      formDataToSend.append('expiryDate', formData.expiryDate || '')

      const response = await fetch(`${BACKEND_URL}/api/admin/offers/${selectedOffer._id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formDataToSend,
      })
      const data = await response.json()

      if (data.success) {
        toast.success('Offer updated successfully!')
        setShowEditModal(false)
        resetForm()
        fetchOffers()
      } else {
        toast.error(data.message || 'Failed to update offer')
      }
    } catch (error) {
      console.error('Error updating offer:', error)
      toast.error('Failed to update offer')
    }
  }

  const handleDeleteOffer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/offers/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Offer deleted successfully')
        fetchOffers()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to delete offer')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/offers/${id}/toggle-status`, {
        method: 'PATCH',
        credentials: 'include',
      })
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
        fetchOffers()
      }
    } catch (error) {
      toast.error('Failed to toggle status')
    }
  }

  const openEditModal = (offer) => {
    setSelectedOffer(offer)
    setFormData({
      vendorId: offer.vendorId?._id || '',
      categoryId: offer.categoryId?._id || '',
      title: offer.title || '',
      description: offer.description || '',
      discountPercentage: offer.discountPercentage || '',
      displayOrder: offer.displayOrder || 0,
      expiryDate: offer.expiryDate ? new Date(offer.expiryDate).toISOString().split('T')[0] : '',
      offerImage: null
    })
    setImagePreview(offer.offerImage ? `${BACKEND_URL}${offer.offerImage}` : null)
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      vendorId: '',
      categoryId: '',
      title: '',
      description: '',
      discountPercentage: '',
      displayOrder: 0,
      expiryDate: '',
      offerImage: null
    })
    setImagePreview(null)
    setSelectedOffer(null)
    setVendorSearchTerm('')
    setShowVendorDropdown(false)
  }

  // Reset category if not valid for selected vendor
  useEffect(() => {
    if (formData.vendorId && formData.categoryId) {
      const selectedVendor = vendors.find(v => v._id === formData.vendorId)
      const currentCategory = categories.find(c => c._id === formData.categoryId)
      
      if (selectedVendor && currentCategory) {
        const isValid = selectedVendor.businessCategories?.some(bc => bc.category === currentCategory.name)
        if (!isValid) {
          setFormData(prev => ({ ...prev, categoryId: '' }))
        }
      }
    }
  }, [formData.vendorId, vendors, categories])

  const filteredVendors = vendors.filter(vendor =>
    vendor.businessName.toLowerCase().includes(vendorSearchTerm.toLowerCase()) ||
    vendor.ownerName.toLowerCase().includes(vendorSearchTerm.toLowerCase())
  )

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.vendorId?.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter categories based on selected vendor
  const availableCategories = formData.vendorId 
    ? categories.filter(c => {
        const selectedVendor = vendors.find(v => v._id === formData.vendorId)
        return selectedVendor?.businessCategories?.some(bc => bc.category === c.name)
      })
    : []

  return (
    <div className='p-4 md:p-6'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Offers & Discounts</h1>
          <p className='text-gray-600'>Manage promotional deals and vendor discounts</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold'
        >
          + Add New Offer
        </button>
      </div>

      {/* Search Bar */}
      <div className='mb-6'>
        <input
          type='text'
          placeholder='Search offers by title or vendor...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
        />
      </div>

      {/* Offers Table */}
      <div className='bg-white rounded-xl shadow-md overflow-hidden overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead className='bg-gray-50 border-b'>
            <tr>
              <th className='p-4 font-bold text-gray-700'>Image</th>
              <th className='p-4 font-bold text-gray-700'>Offer Details</th>
              <th className='p-4 font-bold text-gray-700'>Vendor</th>
              <th className='p-4 font-bold text-gray-700'>Category</th>
              <th className='p-4 font-bold text-gray-700'>Discount</th>
              <th className='p-4 font-bold text-gray-700'>Status</th>
              <th className='p-4 font-bold text-gray-700 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="p-10 text-center text-gray-500">Loading offers...</td></tr>
            ) : filteredOffers.length === 0 ? (
              <tr><td colSpan="7" className="p-10 text-center text-gray-500">No offers found</td></tr>
            ) : filteredOffers.map((offer) => (
              <tr key={offer._id} className='border-b hover:bg-gray-50 transition'>
                <td className='p-4'>
                  {offer.offerImage ? (
                    <img src={`${BACKEND_URL}${offer.offerImage}`} alt='' className='w-16 h-12 object-cover rounded shadow-sm' />
                  ) : (
                    <div className='w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-400 font-bold'>NO IMG</div>
                  )}
                </td>
                <td className='p-4'>
                  <div className='font-bold text-gray-900'>{offer.title}</div>
                  <div className='text-xs text-gray-500 line-clamp-1' title={offer.description}>{offer.description}</div>
                </td>
                <td className='p-4'>
                  <div className='text-sm font-semibold text-blue-600'>{offer.vendorId?.businessName}</div>
                  <div className='text-xs text-gray-500'>{offer.vendorId?.ownerName}</div>
                </td>
                <td className='p-4'>
                  <span className='px-2 py-1 bg-gray-100 rounded text-xs font-medium'>{offer.categoryId?.name}</span>
                </td>
                <td className='p-4 font-bold text-green-600'>{offer.discountPercentage}% OFF</td>
                <td className='p-4'>
                  <button
                    onClick={() => handleToggleStatus(offer._id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${offer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className='p-4'>
                  <div className='flex justify-center gap-2'>
                    <button onClick={() => openEditModal(offer)} className='p-2 text-blue-600 hover:bg-blue-50 rounded transition'>
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' strokeWidth='2' /></svg>
                    </button>
                    <button onClick={() => handleDeleteOffer(offer._id)} className='p-2 text-red-600 hover:bg-red-50 rounded transition'>
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' strokeWidth='2' /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6'>
            <h2 className='text-2xl font-bold mb-6'>{showAddModal ? 'Add New Offer' : 'Edit Offer'}</h2>
            <form onSubmit={showAddModal ? handleAddOffer : handleEditOffer} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='relative'>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Vendor *</label>
                  <div
                    onClick={() => setShowVendorDropdown(!showVendorDropdown)}
                    className='w-full px-4 py-2 border rounded-lg cursor-pointer bg-white'
                  >
                    {formData.vendorId ? vendors.find(v => v._id === formData.vendorId)?.businessName : 'Select Vendor'}
                  </div>
                  {showVendorDropdown && (
                    <div className='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto p-2'>
                      <input
                        type='text' placeholder='Search vendor...'
                        value={vendorSearchTerm} onChange={(e) => setVendorSearchTerm(e.target.value)}
                        className='w-full px-3 py-1 border rounded mb-2 text-sm'
                      />
                      {filteredVendors.map(v => (
                        <div key={v._id} onClick={() => { setFormData({ ...formData, vendorId: v._id }); setShowVendorDropdown(false); }} className='p-2 hover:bg-gray-100 cursor-pointer text-sm'>
                          {v.businessName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className='w-full px-4 py-2 border rounded-lg outline-none disabled:bg-gray-50'
                    required
                    disabled={!formData.vendorId}
                  >
                    <option value="">{formData.vendorId ? 'Select Category' : 'Please select a vendor first'}</option>
                    {availableCategories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Title *</label>
                <input
                  type='text' value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder='eg: 10% discount on medicine'
                  className='w-full px-4 py-2 border rounded-lg' required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='enter full detail of discount'
                  className='w-full px-4 py-2 border rounded-lg' rows="2" required
                ></textarea>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Discount Percentage (%) *</label>
                  <input
                    type='number' value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    placeholder='eg: 10'
                    className='w-full px-4 py-2 border rounded-lg' required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Expiry Date (Optional)</label>
                  <input
                    type='date' value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className='w-full px-4 py-2 border rounded-lg'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Offer Image (Optional)</label>
                <div className='relative group'>
                  <label 
                    htmlFor='offerImage'
                    className='flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all duration-300 overflow-hidden'
                  >
                    {imagePreview ? (
                      <div className='relative w-full h-full group'>
                        <img src={imagePreview} className='w-full h-full object-contain p-2' alt='Preview' />
                        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                          <div className='flex flex-col items-center text-white'>
                            <svg className='w-5 h-5 mb-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' />
                            </svg>
                            <span className='text-[10px] font-bold'>Change</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className='flex items-center gap-3 py-2'>
                        <div className='w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
                          <svg className='w-4 h-4 text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' />
                          </svg>
                        </div>
                        <div className='text-left'>
                          <p className='text-xs text-gray-700 font-bold'>Click to upload image</p>
                          <p className='text-[10px] text-gray-500'>PNG, JPG or WebP (Max 5MB)</p>
                        </div>
                      </div>
                    )}
                    <input 
                      id='offerImage'
                      type='file' 
                      accept='image/*' 
                      onChange={handleImageChange} 
                      className='hidden' 
                    />
                  </label>
                </div>
              </div>

              <div className='flex gap-3 pt-4'>
                <button type='submit' className='flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold'>
                  {showAddModal ? 'Create Offer' : 'Save Changes'}
                </button>
                <button type='button' onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }} className='flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-bold'>
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

export default Offers
