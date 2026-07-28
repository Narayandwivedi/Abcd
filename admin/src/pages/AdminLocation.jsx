import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Phone, MapPin, FileText, UserCheck, Calendar, ShieldCheck, ShieldAlert, ShieldX, Download, FileDown } from 'lucide-react'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar', 'Chandigarh', 'Dadra & Nagar Haveli',
  'Daman & Diu', 'Delhi', 'Jammu & Kashmir', 'Ladakh',
  'Lakshadweep', 'Puducherry',
]

const AdminLocation = () => {
  const [locationList, setLocationList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, approved: 0, pending: 0, rejected: 0 })
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [formData, setFormData] = useState({
    village: '', tehsil: '', city: '', district: '', state: '', pincode: '',
  })

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  useEffect(() => { fetchLocations() }, [])

  const fetchLocations = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/admin/location-census`, {
        method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        setLocationList(data.data)
        setStats({ total: data.total, active: data.active, inactive: data.inactive, approved: data.approved, pending: data.pending, rejected: data.rejected })
      }
    } catch (error) {
      toast.error('Failed to fetch location records')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    if (!formData.village.trim()) { toast.warning('Village is required'); return }
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/location-census/${selectedLocation._id}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Location updated successfully!')
        setShowEditModal(false)
        setSelectedLocation(null)
        fetchLocations()
      } else {
        toast.error(data.message || 'Failed to update location')
      }
    } catch (error) {
      toast.error('Failed to update location')
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/location-census/${id}`, {
        method: 'DELETE', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Location deleted successfully!')
        fetchLocations()
      } else {
        toast.error(data.message || 'Failed to delete location')
      }
    } catch (error) {
      toast.error('Failed to delete location')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/location-census/${id}/toggle-status`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        toast.success(`Location ${data.data.isActive ? 'activated' : 'deactivated'} successfully!`)
        fetchLocations()
      } else {
        toast.error(data.message || 'Failed to toggle status')
      }
    } catch (error) {
      toast.error('Failed to toggle status')
    }
  }

  const handleSetVerificationStatus = async (id, status) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/location-census/${id}/verification-status`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await response.json()
      if (data.success) {
        const messages = { approved: 'Location approved!', rejected: 'Location rejected', pending: 'Location marked as pending' }
        toast.success(messages[status])
        fetchLocations()
      } else {
        toast.error(data.message || 'Failed to update verification status')
      }
    } catch (error) {
      toast.error('Failed to update verification status')
    }
  }

  const openEditModal = (location) => {
    setSelectedLocation(location)
    setFormData({
      village: location.village || '',
      tehsil: location.tehsil || '',
      city: location.city || '',
      district: location.district || '',
      state: location.state || '',
      pincode: location.pincode || '',
    })
    setShowEditModal(true)
  }

  const cityOptions = [...new Set(locationList.map(s => s.city).filter(Boolean))].sort()

  const filteredList = locationList.filter(s => {
    const matchesSearch = s.village?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tehsil?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || s.verificationStatus === statusFilter
    const matchesCity = cityFilter === 'all' || s.city === cityFilter
    return matchesSearch && matchesStatus && matchesCity
  })

  const handleExportExcel = () => {
    if (filteredList.length === 0) { toast.warning('No records to export'); return }
    const rows = filteredList.map((loc) => ({
      'Village': loc.village || '',
      'Tehsil': loc.tehsil || '',
      'City': loc.city || '',
      'District': loc.district || '',
      'State': loc.state || '',
      'Pincode': loc.pincode || '',
      'Status': loc.isActive ? 'Active' : 'Inactive',
      'Verification': loc.verificationStatus || '',
      'Submitted By': loc.submittedBy || '',
      'Submitted By Mobile': loc.submittedByMobile || '',
      'Created At': loc.createdAt ? new Date(loc.createdAt).toLocaleDateString('en-IN') : '',
    }))
    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Location Census')
    XLSX.writeFile(workbook, `Location_Census_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const handleExportPDF = () => {
    if (filteredList.length === 0) { toast.warning('No records to export'); return }
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    doc.setFontSize(16)
    doc.text('Location Census Report', pageWidth / 2, 30, { align: 'center' })
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')} | Total Records: ${filteredList.length}`, pageWidth / 2, 46, { align: 'center' })
    const head = [['#', 'Village', 'Tehsil', 'City', 'District', 'State', 'Pincode', 'Status', 'Verification']]
    const body = filteredList.map((loc, idx) => [
      idx + 1,
      loc.village || '-',
      loc.tehsil || '-',
      loc.city || '-',
      loc.district || '-',
      loc.state || '-',
      loc.pincode || '-',
      loc.isActive ? 'Active' : 'Inactive',
      loc.verificationStatus || '-',
    ])
    autoTable(doc, {
      head, body,
      startY: 58,
      margin: { top: 40, left: 20, right: 20, bottom: 20 },
      styles: { fontSize: 7, cellPadding: 4, overflow: 'linebreak', valign: 'middle' },
      headStyles: { fillColor: [234, 88, 12], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [255, 247, 237] },
    })
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(120)
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10, { align: 'right' })
    }
    doc.save(`Location_Census_${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  return (
    <div className='p-3 md:p-6'>
      <div className='mb-4 md:mb-6 flex items-start justify-between gap-3'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>Location Census</h1>
          <p className='text-sm md:text-base text-gray-600'>Manage all Location records</p>
        </div>
        <div className='shrink-0 flex items-center gap-2'>
          <button onClick={handleExportExcel} className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-md'>
            <Download size={16} /> Export Excel
          </button>
          <button onClick={handleExportPDF} className='flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-md'>
            <FileDown size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className='grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 mb-4 md:mb-6'>
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-xs md:text-sm font-semibold opacity-90'>Total</div>
          <div className='text-2xl md:text-3xl font-bold mt-1'>{stats.total}</div>
        </div>
        <div className='bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-xs md:text-sm font-semibold opacity-90'>Active</div>
          <div className='text-2xl md:text-3xl font-bold mt-1'>{stats.active}</div>
        </div>
        <div className='bg-gradient-to-br from-gray-500 to-gray-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-xs md:text-sm font-semibold opacity-90'>Inactive</div>
          <div className='text-2xl md:text-3xl font-bold mt-1'>{stats.inactive}</div>
        </div>
        <div className='bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-xs md:text-sm font-semibold opacity-90'>Approved</div>
          <div className='text-2xl md:text-3xl font-bold mt-1'>{stats.approved}</div>
        </div>
        <div className='bg-gradient-to-br from-amber-500 to-amber-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-xs md:text-sm font-semibold opacity-90'>Pending</div>
          <div className='text-2xl md:text-3xl font-bold mt-1'>{stats.pending}</div>
        </div>
        <div className='bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-xs md:text-sm font-semibold opacity-90'>Rejected</div>
          <div className='text-2xl md:text-3xl font-bold mt-1'>{stats.rejected}</div>
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-md p-4 mb-4 flex flex-col sm:flex-row gap-3'>
        <input type='text' placeholder='Search by village, city or tehsil...' value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}
          className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-48'>
          <option value='all'>All Cities</option>
          {cityOptions.map(city => <option key={city} value={city}>{city}</option>)}
        </select>
        <div className='flex items-center gap-1.5 sm:w-auto overflow-x-auto'>
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'approved', label: 'Approved' },
            { key: 'rejected', label: 'Rejected' },
          ].map((opt) => (
            <button key={opt.key} onClick={() => setStatusFilter(opt.key)}
              className={`shrink-0 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${statusFilter === opt.key ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className='bg-white rounded-xl shadow-md py-12 flex items-center justify-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          <span className='ml-3 text-gray-500'>Loading...</span>
        </div>
      ) : filteredList.length === 0 ? (
        <div className='bg-white rounded-xl shadow-md py-12 text-center text-gray-500'>
          {searchTerm ? 'No records found matching your search' : 'No location records available'}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
          {filteredList.map((loc) => {
            const createdDate = loc.createdAt
              ? new Date(loc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : null
            return (
              <div key={loc._id} className='bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300'>
                <div className='relative px-5 py-4 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 text-white'>
                  <div className='flex items-start justify-between gap-2'>
                    <div className='min-w-0'>
                      <h3 className='font-bold text-lg leading-tight truncate'>{loc.village || loc.city}</h3>
                      {loc.tehsil && <p className='text-xs text-orange-100 mt-1'>Tehsil: {loc.tehsil}</p>}
                    </div>
                    <button onClick={() => handleToggleStatus(loc._id)}
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition ${loc.isActive ? 'bg-green-400/90 text-green-900 hover:bg-green-300' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                      {loc.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <div className='flex items-center gap-3 mt-3 text-xs text-orange-50'>
                    {createdDate && <span className='flex items-center gap-1'><Calendar size={12} /> {createdDate}</span>}
                  </div>
                </div>

                <div className={`px-5 py-2.5 flex flex-col gap-2 border-b ${loc.verificationStatus === 'approved' ? 'bg-emerald-50 border-emerald-100'
                  : loc.verificationStatus === 'rejected' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold ${loc.verificationStatus === 'approved' ? 'text-emerald-700'
                    : loc.verificationStatus === 'rejected' ? 'text-red-700' : 'text-amber-700'}`}>
                    {loc.verificationStatus === 'approved' ? <ShieldCheck size={14} />
                      : loc.verificationStatus === 'rejected' ? <ShieldX size={14} /> : <ShieldAlert size={14} />}
                    {loc.verificationStatus === 'approved' ? 'Verified & Approved'
                      : loc.verificationStatus === 'rejected' ? 'Rejected' : 'Pending Verification'}
                  </span>
                  <div className='flex items-center gap-1.5'>
                    <button onClick={() => handleSetVerificationStatus(loc._id, 'approved')}
                      disabled={loc.verificationStatus === 'approved'}
                      className='flex-1 px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-40 disabled:cursor-not-allowed'>Approve</button>
                    <button onClick={() => handleSetVerificationStatus(loc._id, 'pending')}
                      disabled={loc.verificationStatus === 'pending'}
                      className='flex-1 px-2 py-1 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition disabled:opacity-40 disabled:cursor-not-allowed'>Pending</button>
                    <button onClick={() => handleSetVerificationStatus(loc._id, 'rejected')}
                      disabled={loc.verificationStatus === 'rejected'}
                      className='flex-1 px-2 py-1 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed'>Reject</button>
                  </div>
                </div>

                <div className='p-5 flex-1 flex flex-col gap-3.5 text-sm'>
                  <div className='flex items-start gap-1.5 text-gray-600'>
                    <MapPin size={14} className='text-orange-500 mt-0.5 shrink-0' />
                    <div>
                      <div className='font-semibold text-gray-800'>{loc.village || '—'}</div>
                      <div className='text-gray-500'>
                        {[loc.city, loc.district, loc.state].filter(Boolean).join(', ') || '—'}
                        {loc.pincode ? ` - ${loc.pincode}` : ''}
                      </div>
                    </div>
                  </div>

                  {(loc.submittedBy || loc.submittedByMobile) && (
                    <div className='mt-auto pt-3 border-t border-dashed border-gray-200 flex items-center gap-2 text-xs text-gray-500'>
                      <UserCheck size={14} className='text-emerald-500 shrink-0' />
                      <span>
                        <span className='font-semibold text-gray-600'>Submitted by:</span>{' '}
                        {loc.submittedBy || '—'}
                        {loc.submittedByMobile && <span className='text-gray-400'> · {loc.submittedByMobile}</span>}
                      </span>
                    </div>
                  )}
                </div>

                <div className='px-5 py-3 border-t border-gray-100 flex items-center gap-2'>
                  <button onClick={() => openEditModal(loc)}
                    className='flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition'>Edit</button>
                  <button onClick={() => handleDelete(loc._id, loc.village || loc.city)}
                    className='flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition'>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showEditModal && (
        <div className='fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 pt-8 overflow-y-auto'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8'>
            <div className='flex items-center justify-between mb-4 sticky top-0 bg-white'>
              <h2 className='text-xl font-bold text-gray-800'>Edit Location</h2>
              <button onClick={() => setShowEditModal(false)} className='text-gray-400 hover:text-gray-600 transition'>
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEdit} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>Village *</label>
                  <input type='text' value={formData.village} onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' required />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>Tehsil</label>
                  <input type='text' value={formData.tehsil} onChange={(e) => setFormData({ ...formData, tehsil: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>City *</label>
                  <input type='text' value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' required />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>District</label>
                  <input type='text' value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>State</label>
                  <select value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                    <option value=''>Select State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>Pincode</label>
                  <input type='text' value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>
              </div>
              <div className='flex gap-3 pt-2'>
                <button type='button' onClick={() => setShowEditModal(false)}
                  className='flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition'>Cancel</button>
                <button type='submit'
                  className='flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition shadow-md'>Update Location</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLocation
