import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Phone, Mail, MapPin, Users, FileText, UserCheck, Calendar, ShieldCheck, ShieldAlert, ShieldX, Download, FileDown, LayoutGrid, Table, Eye } from 'lucide-react'

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

const emptyLeader = () => ({ designation: '', name: '', mobile: '' })

const AdminSamajCensus = () => {
  const [samajList, setSamajList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [viewMode, setViewMode] = useState('table')
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, approved: 0, pending: 0, rejected: 0 })
  const [showEditModal, setShowEditModal] = useState(false)
  const [viewSamaj, setViewSamaj] = useState(null)
  const [stateList, setStateList] = useState([])
  const [districtList, setDistrictList] = useState([])
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [formData, setFormData] = useState({
    samajName: '', officeAddress: '', mobile: '', email: '',
    state: '', district: '', block: '', villageOrCity: '', city: '', pincode: '',
    leaders: [emptyLeader()], remarks: '',
    submittedBy: '', submittedByMobile: '',
  })

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  useEffect(() => { fetchSamaj() }, [])

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/cities/states`)
      .then(res => res.json())
      .then(data => { if (data.success && data.states?.length > 0) setStateList(data.states) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!formData.state) {
      setDistrictList([])
      return
    }
    setLoadingDistricts(true)
    fetch(`${BACKEND_URL}/api/cities/districts/${encodeURIComponent(formData.state)}`)
      .then(res => res.json())
      .then(data => { if (data.success) setDistrictList(data.districts || []) })
      .catch(() => setDistrictList([]))
      .finally(() => setLoadingDistricts(false))
  }, [formData.state])

  const fetchSamaj = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/admin/samaj-census`, {
        method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        setSamajList(data.data)
        setStats({ total: data.total, active: data.active, inactive: data.inactive, approved: data.approved, pending: data.pending, rejected: data.rejected })
      }
    } catch (error) {
      toast.error('Failed to fetch samaj records')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    if (!formData.samajName.trim()) { toast.warning('Samaj name is required'); return }
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/samaj-census/${selectedSamaj._id}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Samaj updated successfully!')
        setShowEditModal(false)
        setSelectedSamaj(null)
        fetchSamaj()
      } else {
        toast.error(data.message || 'Failed to update samaj')
      }
    } catch (error) {
      toast.error('Failed to update samaj')
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/samaj-census/${id}`, {
        method: 'DELETE', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Samaj deleted successfully!')
        fetchSamaj()
      } else {
        toast.error(data.message || 'Failed to delete samaj')
      }
    } catch (error) {
      toast.error('Failed to delete samaj')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/samaj-census/${id}/toggle-status`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        toast.success(`Samaj ${data.data.isActive ? 'activated' : 'deactivated'} successfully!`)
        fetchSamaj()
      } else {
        toast.error(data.message || 'Failed to toggle status')
      }
    } catch (error) {
      toast.error('Failed to toggle status')
    }
  }

  const handleSetVerificationStatus = async (id, status) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/samaj-census/${id}/verification-status`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await response.json()
      if (data.success) {
        const messages = { approved: 'Samaj approved!', rejected: 'Samaj rejected', pending: 'Samaj marked as pending' }
        toast.success(messages[status])
        fetchSamaj()
      } else {
        toast.error(data.message || 'Failed to update verification status')
      }
    } catch (error) {
      toast.error('Failed to update verification status')
    }
  }

  const openEditModal = (samaj) => {
    setSelectedSamaj(samaj)
    setFormData({
      samajName: samaj.samajName || '',
      officeAddress: samaj.officeAddress || '',
      mobile: samaj.mobile || '',
      email: samaj.email || '',
      state: samaj.state || '',
      district: samaj.district || '',
      block: samaj.block || '',
      villageOrCity: samaj.villageOrCity || samaj.city || '',
      city: samaj.villageOrCity || samaj.city || '',
      pincode: samaj.pincode || '',
      leaders: samaj.leaders && samaj.leaders.length > 0
        ? samaj.leaders.map(l => ({ designation: l.designation || '', name: l.name || '', mobile: l.mobile || '' }))
        : [emptyLeader()],
      remarks: samaj.remarks || '',
      submittedBy: samaj.submittedBy || '',
      submittedByMobile: samaj.submittedByMobile || '',
    })
    setShowEditModal(true)
  }

  const handleLeaderChange = (index, field, value) => {
    const updated = [...formData.leaders]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, leaders: updated })
  }

  const addLeader = () => {
    setFormData({ ...formData, leaders: [...formData.leaders, emptyLeader()] })
  }

  const removeLeader = (index) => {
    setFormData({ ...formData, leaders: formData.leaders.filter((_, i) => i !== index) })
  }

  const cityOptions = [...new Set(samajList.map(s => s.city).filter(Boolean))].sort()

  const filteredList = samajList.filter(s => {
    const matchesSearch = s.samajName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.mobile?.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || s.verificationStatus === statusFilter
    const matchesCity = cityFilter === 'all' || s.city === cityFilter
    return matchesSearch && matchesStatus && matchesCity
  })

  const handleExportExcel = () => {
    if (filteredList.length === 0) { toast.warning('No records to export'); return }

    const rows = filteredList.map((samaj) => {
      const leadersText = samaj.leaders?.length
        ? samaj.leaders.map(l => `${l.name || ''} (${l.designation || '-'}${l.mobile ? `, ${l.mobile}` : ''})`).join('; ')
        : ''
      return {
        'Samaj Name': samaj.samajName || '',
        'Mobile': samaj.mobile || '',
        'Email': samaj.email || '',
        'Office Address': samaj.officeAddress || '',
        'State': samaj.state || '',
        'District': samaj.district || '',
        'Block/Tehsil': samaj.block || '',
        'Village / Town / City': samaj.villageOrCity || samaj.city || '',
        'Pincode': samaj.pincode || '',
        'Leader Count': samaj.leaders?.length || 0,
        'Leaders': leadersText,
        'Status': samaj.isActive ? 'Active' : 'Inactive',
        'Verification': samaj.verificationStatus || '',
        'Remarks': samaj.remarks || '',
        'Submitted By': samaj.submittedBy || '',
        'Submitted By Mobile': samaj.submittedByMobile || '',
        'Created At': samaj.createdAt ? new Date(samaj.createdAt).toLocaleDateString('en-IN') : '',
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Samaj Census')
    XLSX.writeFile(workbook, `Samaj_Census_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const handleExportPDF = () => {
    if (filteredList.length === 0) { toast.warning('No records to export'); return }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()

    doc.setFontSize(16)
    doc.text('Samaj Census Report', pageWidth / 2, 30, { align: 'center' })
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')} | Total Records: ${filteredList.length}`, pageWidth / 2, 46, { align: 'center' })

    const head = [['#', 'Samaj Name', 'Mobile', 'Email', 'Address', 'State', 'District', 'Block/Tehsil', 'Village/City', 'Pincode', 'Leaders', 'Status', 'Verification']]
    const body = filteredList.map((samaj, idx) => {
      const leadersText = samaj.leaders?.length
        ? samaj.leaders.map(l => `${l.name || ''} (${l.designation || '-'})`).join(', ')
        : '-'
      return [
        idx + 1,
        samaj.samajName || '-',
        samaj.mobile || '-',
        samaj.email || '-',
        samaj.officeAddress || '-',
        samaj.state || '-',
        samaj.district || '-',
        samaj.block || '-',
        samaj.villageOrCity || samaj.city || '-',
        samaj.pincode || '-',
        leadersText,
        samaj.isActive ? 'Active' : 'Inactive',
        samaj.verificationStatus || '-',
      ]
    })

    autoTable(doc, {
      head, body,
      startY: 58,
      margin: { top: 40, left: 20, right: 20, bottom: 20 },
      styles: { fontSize: 7, cellPadding: 4, overflow: 'linebreak', valign: 'middle' },
      headStyles: { fillColor: [234, 88, 12], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [255, 247, 237] },
      columnStyles: {
        0: { cellWidth: 20 },
        3: { cellWidth: 90 },
        4: { cellWidth: 90 },
        9: { cellWidth: 110 },
      },
    })

    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(120)
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10, { align: 'right' })
    }

    doc.save(`Samaj_Census_${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  return (
    <div className='p-3 md:p-6'>
      <div className='mb-4 md:mb-6 flex items-start justify-between gap-3'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>Samaj Census</h1>
          <p className='text-sm md:text-base text-gray-600'>Manage all Samaj records</p>
        </div>
        <div className='shrink-0 flex items-center gap-2'>
          <button
            onClick={handleExportExcel}
            className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-md'
          >
            <Download size={16} /> Export Excel
          </button>
          <button
            onClick={handleExportPDF}
            className='flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-md'
          >
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
        <input
          type='text'
          placeholder='Search by name, city or mobile...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-48'
        >
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
            <button
              key={opt.key}
              onClick={() => setStatusFilter(opt.key)}
              className={`shrink-0 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                statusFilter === opt.key
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className='flex items-center gap-1 bg-gray-100 rounded-xl p-1 shrink-0'>
          <button
            onClick={() => setViewMode('card')}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${viewMode === 'card' ? 'bg-white text-orange-600 shadow' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <LayoutGrid size={15} /> Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${viewMode === 'table' ? 'bg-white text-orange-600 shadow' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <Table size={15} /> Table
          </button>
        </div>
      </div>

      {loading ? (
        <div className='bg-white rounded-xl shadow-md py-12 flex items-center justify-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          <span className='ml-3 text-gray-500'>Loading...</span>
        </div>
      ) : filteredList.length === 0 ? (
        <div className='bg-white rounded-xl shadow-md py-12 text-center text-gray-500'>
          {searchTerm ? 'No records found matching your search' : 'No samaj records available'}
        </div>
      ) : viewMode === 'table' ? (
        <div className='bg-white rounded-xl shadow-md overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm text-left'>
              <thead className='bg-gray-50 text-xs uppercase tracking-wider text-gray-500'>
                <tr>
                  <th className='px-4 py-3 font-semibold'>#</th>
                  <th className='px-4 py-3 font-semibold'>Samaj</th>
                  <th className='px-4 py-3 font-semibold'>Address</th>
                  <th className='px-4 py-3 font-semibold'>Leaders</th>
                  <th className='px-4 py-3 font-semibold'>Remarks</th>
                  <th className='px-4 py-3 font-semibold'>Verification</th>
                  <th className='px-4 py-3 font-semibold'>Status</th>
                  <th className='px-4 py-3 font-semibold'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {filteredList.map((samaj, idx) => (
                  <tr key={samaj._id} className='hover:bg-gray-50 align-top'>
                    <td className='px-4 py-3 text-gray-500'>{idx + 1}</td>
                    <td className='px-4 py-3'>
                      <div className='font-bold text-gray-800'>{samaj.samajName || '—'}</div>
                      <div className='text-xs text-gray-500 flex items-center gap-1 mt-0.5'><Phone size={11} /> {samaj.mobile || '—'}</div>
                      {samaj.email && <div className='text-xs text-gray-500 flex items-center gap-1 mt-0.5'><Mail size={11} /> {samaj.email}</div>}
                      {(samaj.submittedBy || samaj.submittedByMobile) && (
                        <div className='text-[11px] text-gray-400 mt-1'>By: {samaj.submittedBy || '—'}{samaj.submittedByMobile ? ` · ${samaj.submittedByMobile}` : ''}</div>
                      )}
                    </td>
                    <td className='px-4 py-3 text-xs text-gray-600 max-w-[240px]'>
                      {samaj.officeAddress && <div className='font-medium text-gray-700'>{samaj.officeAddress}</div>}
                      <div className='text-gray-500'>
                        {[samaj.villageOrCity, samaj.block, samaj.district, samaj.state, samaj.pincode ? `Pin: ${samaj.pincode}` : ''].filter(Boolean).join(', ') || '—'}
                      </div>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='text-xs font-semibold text-orange-600 mb-1 flex items-center gap-1'><Users size={12} /> {samaj.leaders?.length || 0} leader{samaj.leaders?.length !== 1 ? 's' : ''}</div>
                      {samaj.leaders?.length > 0 ? (
                        <div className='flex flex-col gap-1.5 min-w-[220px]'>
                          {samaj.leaders.map((l, i) => (
                            <div key={i} className='bg-gray-50 border border-gray-100 rounded-lg px-3 py-2'>
                              <div className='flex items-center justify-between gap-2'>
                                <span className='font-semibold text-gray-800 text-xs'>{l.name || '—'}</span>
                                <span className='shrink-0 text-[10px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full'>{l.designation || '—'}</span>
                              </div>
                              {l.mobile && <div className='text-[11px] text-gray-500 mt-1 flex items-center gap-1'><Phone size={10} /> {l.mobile}</div>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className='text-xs text-gray-400 italic'>No leaders added</p>
                      )}
                    </td>
                    <td className='px-4 py-3 text-xs text-gray-500 max-w-[160px]'>{samaj.remarks || '—'}</td>
                    <td className='px-4 py-3'>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold ${
                        samaj.verificationStatus === 'approved' ? 'bg-emerald-50 text-emerald-700'
                          : samaj.verificationStatus === 'rejected' ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {samaj.verificationStatus === 'approved' ? <ShieldCheck size={12} />
                          : samaj.verificationStatus === 'rejected' ? <ShieldX size={12} />
                          : <ShieldAlert size={12} />}
                        {samaj.verificationStatus === 'approved' ? 'Approved' : samaj.verificationStatus === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </td>
                    <td className='px-4 py-3'>
                      <button onClick={() => handleToggleStatus(samaj._id)} className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                        samaj.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>{samaj.isActive ? 'Active' : 'Inactive'}</button>
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap'>
                      <button onClick={() => setViewSamaj(samaj)} title='View Details' className='inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-500 hover:bg-gray-600 text-white text-xs font-semibold transition'><Eye size={12} /> View</button>
                      <button onClick={() => openEditModal(samaj)} className='inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition ml-1'>Edit</button>
                      <button onClick={() => handleDelete(samaj._id, samaj.samajName)} className='inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition ml-1'>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
          {filteredList.map((samaj) => {
            const createdDate = samaj.createdAt
              ? new Date(samaj.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : null
            return (
              <div key={samaj._id} className='bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300'>
                <div className='relative px-5 py-4 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 text-white'>
                  <div className='flex items-start justify-between gap-2'>
                    <div className='min-w-0'>
                      <h3 className='font-bold text-lg leading-tight truncate'>{samaj.samajName}</h3>
                      {samaj.email && (
                        <p className='text-xs text-orange-100 mt-1 flex items-center gap-1 truncate'>
                          <Mail size={12} /> {samaj.email}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleStatus(samaj._id)}
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition ${
                        samaj.isActive ? 'bg-green-400/90 text-green-900 hover:bg-green-300' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {samaj.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <div className='flex items-center gap-3 mt-3 text-xs text-orange-50'>
                    <span className='flex items-center gap-1'><Users size={12} /> {samaj.leaders?.length || 0} leader{samaj.leaders?.length !== 1 ? 's' : ''}</span>
                    {createdDate && <span className='flex items-center gap-1'><Calendar size={12} /> {createdDate}</span>}
                  </div>
                </div>

                <div className={`px-5 py-2.5 flex flex-col gap-2 border-b ${
                  samaj.verificationStatus === 'approved' ? 'bg-emerald-50 border-emerald-100'
                    : samaj.verificationStatus === 'rejected' ? 'bg-red-50 border-red-100'
                    : 'bg-amber-50 border-amber-100'
                }`}>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold ${
                    samaj.verificationStatus === 'approved' ? 'text-emerald-700'
                      : samaj.verificationStatus === 'rejected' ? 'text-red-700'
                      : 'text-amber-700'
                  }`}>
                    {samaj.verificationStatus === 'approved' ? <ShieldCheck size={14} />
                      : samaj.verificationStatus === 'rejected' ? <ShieldX size={14} />
                      : <ShieldAlert size={14} />}
                    {samaj.verificationStatus === 'approved' ? 'Verified & Approved'
                      : samaj.verificationStatus === 'rejected' ? 'Rejected'
                      : 'Pending Verification'}
                  </span>
                  <div className='flex items-center gap-1.5'>
                    <button
                      onClick={() => handleSetVerificationStatus(samaj._id, 'approved')}
                      disabled={samaj.verificationStatus === 'approved'}
                      className='flex-1 px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-40 disabled:cursor-not-allowed'
                    >Approve</button>
                    <button
                      onClick={() => handleSetVerificationStatus(samaj._id, 'pending')}
                      disabled={samaj.verificationStatus === 'pending'}
                      className='flex-1 px-2 py-1 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition disabled:opacity-40 disabled:cursor-not-allowed'
                    >Pending</button>
                    <button
                      onClick={() => handleSetVerificationStatus(samaj._id, 'rejected')}
                      disabled={samaj.verificationStatus === 'rejected'}
                      className='flex-1 px-2 py-1 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed'
                    >Reject</button>
                  </div>
                </div>

                <div className='p-5 flex-1 flex flex-col gap-3.5 text-sm'>
                  <div className='flex flex-wrap gap-x-5 gap-y-1.5 text-gray-600'>
                    <span className='flex items-center gap-1.5'><Phone size={13} className='text-orange-500' /> {samaj.mobile || '—'}</span>
                    {samaj.pincode && <span className='text-gray-500'>Pin: {samaj.pincode}</span>}
                  </div>

                  <div className='flex items-start gap-1.5 text-gray-600'>
                    <MapPin size={14} className='text-orange-500 mt-0.5 shrink-0' />
                    <div>
                      {samaj.officeAddress && <div>{samaj.officeAddress}</div>}
                      <div className='text-gray-500'>{[samaj.city, samaj.district, samaj.state].filter(Boolean).join(', ') || '—'}</div>
                    </div>
                  </div>

                  {samaj.remarks && (
                    <div className='flex items-start gap-1.5 text-gray-600'>
                      <FileText size={14} className='text-orange-500 mt-0.5 shrink-0' />
                      <span>{samaj.remarks}</span>
                    </div>
                  )}

                  <div>
                    <p className='font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5'>
                      <Users size={13} /> Leaders ({samaj.leaders?.length || 0})
                    </p>
                    {samaj.leaders?.length > 0 ? (
                      <div className='flex flex-col gap-1.5'>
                        {samaj.leaders.map((l, idx) => (
                          <div key={idx} className='bg-gray-50 border border-gray-100 rounded-lg px-3 py-2'>
                            <div className='flex items-center justify-between'>
                              <span className='font-semibold text-gray-800'>{l.name || '—'}</span>
                              <span className='text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full'>{l.designation || '—'}</span>
                            </div>
                            {l.mobile && <div className='text-xs text-gray-500 mt-1 flex items-center gap-1'><Phone size={10} /> {l.mobile}</div>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className='text-xs text-gray-400 italic'>No leaders added</p>
                    )}
                  </div>

                  {(samaj.submittedBy || samaj.submittedByMobile) && (
                    <div className='mt-auto pt-3 border-t border-dashed border-gray-200 flex items-center gap-2 text-xs text-gray-500'>
                      <UserCheck size={14} className='text-emerald-500 shrink-0' />
                      <span>
                        <span className='font-semibold text-gray-600'>Submitted by:</span>{' '}
                        {samaj.submittedBy || '—'}
                        {samaj.submittedByMobile && <span className='text-gray-400'> · {samaj.submittedByMobile}</span>}
                      </span>
                    </div>
                  )}
                </div>

                <div className='px-5 py-3 border-t border-gray-100 flex items-center gap-2'>
                  <button
                    onClick={() => setViewSamaj(samaj)}
                    className='flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition'
                  >View</button>
                  <button
                    onClick={() => openEditModal(samaj)}
                    className='flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition'
                  >Edit</button>
                  <button
                    onClick={() => handleDelete(samaj._id, samaj.samajName)}
                    className='flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition'
                  >Delete</button>
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
              <h2 className='text-xl font-bold text-gray-800'>Edit Samaj</h2>
              <button onClick={() => setShowEditModal(false)} className='text-gray-400 hover:text-gray-600 transition'>
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEdit} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>Samaj Name *</label>
                  <input type='text' value={formData.samajName} onChange={(e) => setFormData({ ...formData, samajName: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' required />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>Mobile</label>
                  <input type='text' value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>Email</label>
                  <input type='email' value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>Pincode</label>
                  <input type='text' value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-1'>Office Address</label>
                <textarea value={formData.officeAddress} onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y' rows='2' />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>State</label>
                  <select value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value, district: '' })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                    <option value=''>-- Select State --</option>
                    {stateList.map(s => <option key={s} value={s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}>{s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>District</label>
                  <select value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    disabled={!formData.state || loadingDistricts}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'>
                    <option value=''>{!formData.state ? '-- Select State First --' : loadingDistricts ? 'Loading...' : '-- Select District --'}</option>
                    {districtList.map(d => <option key={d} value={d.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}>{d.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>Block/Tehsil</label>
                  <input type='text' value={formData.block} onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter Block/Tehsil' />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>Village / Town / City</label>
                  <input type='text' value={formData.villageOrCity} onChange={(e) => setFormData({ ...formData, villageOrCity: e.target.value, city: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Enter Village / Town / City' />
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='block text-sm font-semibold text-gray-700'>Samaj Leaders</label>
                  <button type='button' onClick={addLeader} className='text-blue-600 hover:text-blue-800 text-sm font-semibold'>+ Add Leader</button>
                </div>
                {formData.leaders.map((leader, idx) => (
                  <div key={idx} className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-2 p-3 bg-gray-50 rounded-lg'>
                    <input type='text' placeholder='Designation' value={leader.designation}
                      onChange={(e) => handleLeaderChange(idx, 'designation', e.target.value)}
                      className='px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm' />
                    <input type='text' placeholder='Name' value={leader.name}
                      onChange={(e) => handleLeaderChange(idx, 'name', e.target.value)}
                      className='px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm' />
                    <div className='flex gap-2'>
                      <input type='text' placeholder='Mobile' value={leader.mobile}
                        onChange={(e) => handleLeaderChange(idx, 'mobile', e.target.value)}
                        className='flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm' />
                      {formData.leaders.length > 1 && (
                        <button type='button' onClick={() => removeLeader(idx)} className='text-red-500 hover:text-red-700 px-2 text-sm'>✕</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-1'>Remarks</label>
                <textarea value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y' rows='2' />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4'>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>Submitted By</label>
                  <input type='text' value={formData.submittedBy} onChange={(e) => setFormData({ ...formData, submittedBy: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>Submitted By Mobile</label>
                  <input type='text' value={formData.submittedByMobile} onChange={(e) => setFormData({ ...formData, submittedByMobile: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>
              </div>

              <div className='flex gap-3 pt-2'>
                <button type='button' onClick={() => setShowEditModal(false)}
                  className='flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition'>Cancel</button>
                <button type='submit'
                  className='flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition shadow-md'>Update Samaj</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewSamaj && (
        <div className='fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 pt-8 overflow-y-auto'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8'>
            <div className='flex items-center justify-between gap-3 px-6 py-4 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 text-white rounded-t-2xl sticky top-0'>
              <div className='min-w-0'>
                <h2 className='text-xl font-bold truncate'>{viewSamaj.samajName || 'Samaj Details'}</h2>
                <div className='flex items-center gap-2 mt-1 text-xs text-orange-100'>
                  <span className={`px-2 py-0.5 rounded-full font-semibold ${viewSamaj.isActive ? 'bg-green-400/90 text-green-900' : 'bg-white/20'}`}>{viewSamaj.isActive ? 'Active' : 'Inactive'}</span>
                  <span className='capitalize'>{viewSamaj.verificationStatus || 'pending'}</span>
                  <span className='flex items-center gap-1'><Users size={11} /> {viewSamaj.leaders?.length || 0} leader{viewSamaj.leaders?.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <button onClick={() => setViewSamaj(null)} className='shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition'>
                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            <div className='p-6 space-y-5'>
              <div>
                <h3 className='text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5'><Phone size={14} className='text-orange-500' /> Contact</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 bg-gray-50 border border-gray-100 rounded-xl p-4'>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Mobile</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewSamaj.mobile || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Email</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewSamaj.email || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Pincode</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewSamaj.pincode || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Registered</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewSamaj.createdAt ? new Date(viewSamaj.createdAt).toLocaleDateString('en-IN') : '—'}</span></div>
                </div>
              </div>

              <div>
                <h3 className='text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5'><MapPin size={14} className='text-orange-500' /> Address</h3>
                <div className='bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-700'>
                  {viewSamaj.officeAddress && <div className='font-medium'>{viewSamaj.officeAddress}</div>}
                  <div className='text-gray-500 mt-0.5'>
                    {[viewSamaj.villageOrCity, viewSamaj.block, viewSamaj.district, viewSamaj.state].filter(Boolean).join(', ') || '—'}
                  </div>
                  {viewSamaj.remarks && <div className='mt-2 pt-2 border-t border-gray-200 flex items-start gap-1.5 text-gray-600'><FileText size={14} className='text-orange-500 mt-0.5 shrink-0' /> <span>{viewSamaj.remarks}</span></div>}
                </div>
              </div>

              <div>
                <h3 className='text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5'><Users size={14} className='text-orange-500' /> Samaj Leaders ({viewSamaj.leaders?.length || 0})</h3>
                {viewSamaj.leaders?.length > 0 ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {viewSamaj.leaders.map((l, idx) => (
                      <div key={idx} className='border border-gray-100 rounded-xl p-4 bg-gray-50'>
                        <div className='flex items-start justify-between gap-2'>
                          <span className='font-bold text-gray-800'>{l.name || '—'}</span>
                          <span className='shrink-0 text-[11px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full'>{l.designation || '—'}</span>
                        </div>
                        {l.mobile && <div className='mt-2 flex items-center gap-1 text-xs text-gray-600'><Phone size={11} className='text-gray-400' /> {l.mobile}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-gray-400 italic bg-gray-50 rounded-xl p-4'>No leaders added</p>
                )}
              </div>

              {(viewSamaj.submittedBy || viewSamaj.submittedByMobile) && (
                <div className='flex items-center gap-2 text-sm text-gray-600 pt-3 border-t border-gray-100'>
                  <UserCheck size={16} className='text-emerald-500 shrink-0' />
                  <span>
                    <span className='font-semibold text-gray-700'>Submitted by:</span> {viewSamaj.submittedBy || '—'}
                    {viewSamaj.submittedByMobile && <span className='text-gray-400'> · {viewSamaj.submittedByMobile}</span>}
                  </span>
                </div>
              )}
            </div>

            <div className='px-6 py-4 border-t border-gray-100 flex justify-end'>
              <button onClick={() => setViewSamaj(null)} className='px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition'>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSamajCensus
