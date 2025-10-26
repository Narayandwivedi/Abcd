import { useState, useEffect } from 'react'

const Vendors = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
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

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  // Fetch all vendors
  useEffect(() => {
    fetchVendors()
  }, [])

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
    if (!vendor.certificateNumber || !vendor.certificateDownloadLink) {
      alert('Certificate not generated yet. Please approve the vendor first.')
      return
    }

    const certificateUrl = `${BACKEND_URL}${vendor.certificateDownloadLink}`
    const message = `Congratulations! 🎉

You are now an approved ABCD Vendor.

Business: ${vendor.businessName}
Your Certificate Number: ${vendor.certificateNumber}

You can view and download your certificate here:
${certificateUrl}

Welcome to the ABCD Vendor Network!

Best regards,
ABCD Team`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://web.whatsapp.com/send?phone=91${vendor.mobile}&text=${encodedMessage}`

    window.open(whatsappUrl, '_blank')
  }

  // Filter vendors based on search
  const filteredVendors = vendors.filter(vendor =>
    vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.mobile?.toString().includes(searchTerm)
  )

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl md:text-3xl font-black text-gray-800 mb-1 md:mb-2'>Vendor Applications</h1>
          <p className='text-sm md:text-base text-gray-600'>Manage vendor registrations and approvals</p>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Total Applications</div>
          <div className='text-3xl font-black text-blue-600'>{stats.total}</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-yellow-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Pending Approval</div>
          <div className='text-3xl font-black text-yellow-600'>{stats.pending}</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-green-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Approved</div>
          <div className='text-3xl font-black text-green-600'>{stats.approved}</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-red-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Rejected</div>
          <div className='text-3xl font-black text-red-600'>{stats.rejected}</div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
        <div className='p-6 border-b border-gray-200'>
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
                            <div className='text-xs text-gray-500'>{vendor.city || 'N/A'}</div>
                            {vendor.certificateNumber && (
                              <div className='text-xs text-blue-600 font-semibold mt-1'>
                                Cert: {vendor.certificateNumber}
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
                          <div className='text-sm font-semibold text-gray-800'>{vendor.category || 'N/A'}</div>
                          <div className='text-xs text-gray-500'>{vendor.subCategory || 'N/A'}</div>
                          {vendor.membershipCategory && (
                            <span className='inline-block px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold mt-1'>
                              {vendor.membershipCategory}
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
                          {vendor.paymentVerified && vendor.certificateDownloadLink && (
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
                          {vendor.paymentVerified && vendor.certificateDownloadLink && (
                            <a
                              href={`${BACKEND_URL}${vendor.certificateDownloadLink}`}
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
                            onClick={() => openPasswordModal(vendor)}
                            className='p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition'
                            title='Set Password'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' />
                            </svg>
                          </button>

                          {/* Approve Button */}
                          {!vendor.paymentVerified && !vendor.isRejected && (
                            <button
                              onClick={() => handleApprove(vendor._id)}
                              className='px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition'
                            >
                              Approve
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
            <div className='md:hidden divide-y divide-gray-200'>
              {filteredVendors.map((vendor) => (
                <div key={vendor._id} className='p-3 hover:bg-gray-50 transition'>
                  {/* Vendor Header */}
                  <div className='flex flex-col items-center mb-2'>
                    {vendor.passportPhoto ? (
                      <img
                        src={`${BACKEND_URL}/${vendor.passportPhoto}`}
                        alt={vendor.businessName}
                        onClick={() => handlePhotoClick(`${BACKEND_URL}/${vendor.passportPhoto}`)}
                        className='w-12 h-12 rounded-full object-cover border-2 border-gray-200 cursor-pointer hover:opacity-80 transition'
                      />
                    ) : (
                      <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm'>
                        {vendor.businessName?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className='text-center mt-1'>
                      <div className='font-bold text-gray-800 text-sm'>{vendor.businessName}</div>
                      <div className='text-xs text-gray-600'>Owner: {vendor.ownerName}</div>
                      {vendor.certificateNumber && (
                        <div className='text-xs text-blue-600 font-semibold'>Cert: {vendor.certificateNumber}</div>
                      )}
                      <div className='text-xs text-gray-700 mt-1'>{vendor.city || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Vendor Details */}
                  <div className='space-y-1.5 mb-2'>

                    {/* Mobile and Email in same row */}
                    <div className='flex items-center justify-between gap-2 text-xs'>
                      <a href={`tel:${vendor.mobile}`} className='text-blue-600 hover:text-blue-800 hover:underline font-medium'>
                        {vendor.mobile}
                      </a>
                      {vendor.email && (
                        <a href={`mailto:${vendor.email}`} className='text-blue-600 hover:text-blue-800 hover:underline truncate'>
                          {vendor.email}
                        </a>
                      )}
                    </div>

                    {/* Category and Sub-Category */}
                    <div className='flex items-center justify-between gap-2 text-xs'>
                      <div className='text-gray-700'>
                        <span className='font-semibold'>Category:</span> {vendor.category || 'N/A'}
                      </div>
                      <div className='text-gray-700'>
                        <span className='font-semibold'>Sub:</span> {vendor.subCategory || 'N/A'}
                      </div>
                    </div>

                    {/* Membership Category and Status in same row */}
                    <div className='flex items-center justify-between gap-2'>
                      {vendor.membershipCategory && (
                        <div className='flex items-center gap-1'>
                          <span className='text-xs text-gray-500'>Membership:</span>
                          <span className='px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold'>
                            {vendor.membershipCategory}
                          </span>
                        </div>
                      )}
                      <div className='flex items-center gap-1'>
                        <span className='text-xs text-gray-500'>Status:</span>
                        {vendor.paymentVerified ? (
                          <span className='px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold'>
                            Approved
                          </span>
                        ) : vendor.isRejected ? (
                          <span className='px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold'>
                            Rejected
                          </span>
                        ) : (
                          <span className='px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold'>
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    {/* UTR and Payment Screenshot in same row */}
                    {(vendor.utrNumber || vendor.paymentScreenshot) && (
                      <div className='flex items-center justify-between gap-2 text-xs'>
                        {vendor.utrNumber && (
                          <div className='text-gray-700'>
                            <span className='text-gray-500'>UTR:</span> {vendor.utrNumber}
                          </div>
                        )}
                        {vendor.paymentScreenshot && (
                          <a
                            href={`${BACKEND_URL}/${vendor.paymentScreenshot}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:underline'
                          >
                            View Payment
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className='flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-gray-200'>
                    {/* Call Button */}
                    <a
                      href={`tel:${vendor.mobile}`}
                      className='flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition text-xs font-medium'
                      title='Call Vendor'
                    >
                      <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                      </svg>
                      Call
                    </a>

                    {/* WhatsApp Button */}
                    {vendor.paymentVerified && vendor.certificateDownloadLink && (
                      <button
                        onClick={() => sendWhatsAppMessage(vendor)}
                        className='p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition'
                        title='Send WhatsApp'
                      >
                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                          <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
                        </svg>
                      </button>
                    )}

                    {/* View Certificate PDF Button */}
                    {vendor.paymentVerified && vendor.certificateDownloadLink && (
                      <a
                        href={`${BACKEND_URL}${vendor.certificateDownloadLink}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition text-xs font-medium'
                        title='View Certificate PDF'
                      >
                        <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' />
                        </svg>
                        Cert
                      </a>
                    )}

                    {/* Set Password Button */}
                    <button
                      onClick={() => openPasswordModal(vendor)}
                      className='flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition text-xs font-medium'
                      title='Set Password'
                    >
                      <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' />
                      </svg>
                      Pass
                    </button>

                    {/* Approve Button */}
                    {!vendor.paymentVerified && !vendor.isRejected && (
                      <button
                        onClick={() => handleApprove(vendor._id)}
                        className='flex-1 px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700 transition'
                      >
                        Approve
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
    </div>
  )
}

export default Vendors
