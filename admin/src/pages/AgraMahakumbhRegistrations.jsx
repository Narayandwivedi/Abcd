import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
  BadgeCheck, BadgeX, Clock, Download, FileDown, Eye, Hash, CalendarDays,
  Phone, MapPin, User, Users, ShieldCheck, ShieldAlert, ShieldX, LayoutGrid, Table, Delete,
} from 'lucide-react'

const REGISTRATION_TYPE_LABELS = {
  'with-room-1-night': 'With Room – 1 Night',
  'with-room-2-nights': 'With Room – 2 Nights',
  'without-room': 'Without Room',
}

const formatRegType = (value) => REGISTRATION_TYPE_LABELS[value] || value || '—'

const formatFee = (value) => (value && value !== '' && value !== '0' ? `₹${value}` : '—')

const AgraMahakumbhRegistrations = () => {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('table')
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [viewReg, setViewReg] = useState(null)

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  const toAbsoluteUploadUrl = (value) => {
    if (typeof value !== 'string') return value
    const trimmed = value.trim()
    if (!trimmed || /^https?:\/\//i.test(trimmed)) return value
    const normalizedPath = trimmed.replace(/\\/g, '/').replace(/^\.?\//, '')
    if (normalizedPath.startsWith('upload/') || normalizedPath.startsWith('uploads/')) {
      return `${BACKEND_URL}/${normalizedPath}`
    }
    return value
  }

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/admin/agra-mahakumbh`, {
        method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        setRegistrations(data.data)
        setStats({ total: data.total, pending: data.pending, approved: data.approved, rejected: data.rejected })
      } else {
        toast.error(data.message || 'Failed to fetch registrations')
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
      toast.error('Failed to fetch registrations')
    } finally {
      setLoading(false)
    }
  }, [BACKEND_URL])

  useEffect(() => { fetchRegistrations() }, [fetchRegistrations])

  const handleSetStatus = async (id, status) => {
    let rejectionReason = ''
    if (status === 'rejected') {
      rejectionReason = window.prompt('Enter rejection reason (optional):') || ''
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/agra-mahakumbh/${id}/status`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason }),
      })
      const data = await response.json()
      if (data.success) {
        toast.success(status === 'approved' ? 'Registration approved!' : status === 'rejected' ? 'Registration rejected' : 'Registration marked pending')
        fetchRegistrations()
      } else {
        toast.error(data.message || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id, registrationNo) => {
    if (!window.confirm(`Are you sure you want to delete registration "${registrationNo}"?`)) return
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/agra-mahakumbh/${id}`, {
        method: 'DELETE', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Registration deleted successfully!')
        fetchRegistrations()
      } else {
        toast.error(data.message || 'Failed to delete registration')
      }
    } catch (error) {
      console.error('Error deleting registration:', error)
      toast.error('Failed to delete registration')
    }
  }

  const filteredList = registrations.filter((r) => {
    const matchesSearch = (r.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.mobileNo || '').includes(searchTerm) ||
      (r.registrationNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.utrNumber || '').includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleExportExcel = () => {
    if (filteredList.length === 0) { toast.warning('No records to export'); return }
    const rows = filteredList.map((r) => ({
      'Registration No': r.registrationNo || '',
      'Full Name': r.fullName || '',
      'Gender': r.gender || '',
      'Mobile No': r.mobileNo || '',
      'Date of Birth': r.dob || '',
      'Age': r.age || '',
      "Father's Name": r.fatherName || '',
      'Address': r.address || '',
      'Registration Type': formatRegType(r.registrationType),
      'Registration Fee': r.registrationFee || '',
      'UTR Number': r.utrNumber || '',
      'Travel Mode': r.travelMode || '',
      'Travel Detail': r.travelDetail || '',
      'Arrival Date': r.arrivalDate || '',
      'Arrival Time': r.arrivalTime || '',
      'Status': r.status || '',
      'Rejection Reason': r.rejectionReason || '',
      'Photo': toAbsoluteUploadUrl(r.photo),
      'Payment Screenshot': toAbsoluteUploadUrl(r.paymentScreenshot),
      'Submitted On': r.createdAt ? new Date(r.createdAt).toLocaleString('en-IN') : '',
    }))
    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Agra Mahakumbh 2026')
    XLSX.writeFile(workbook, `Agra_Mahakumbh_2026_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const handleExportPDF = () => {
    if (filteredList.length === 0) { toast.warning('No records to export'); return }
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()

    doc.setFontSize(16)
    doc.text('Agra Mahakumbh 2026 - Registrations', pageWidth / 2, 30, { align: 'center' })
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')} | Total Records: ${filteredList.length}`, pageWidth / 2, 46, { align: 'center' })

    const head = [['#', 'Reg No', 'Name', 'Mobile', 'Father', 'Address', 'Type', 'Fee', 'UTR', 'Travel', 'Arrival', 'Status']]
    const body = filteredList.map((r, idx) => [
      idx + 1,
      r.registrationNo || '-',
      r.fullName || '-',
      r.mobileNo || '-',
      r.fatherName || '-',
      r.address || '-',
      formatRegType(r.registrationType),
      r.registrationFee ? `₹${r.registrationFee}` : '-',
      r.utrNumber || '-',
      r.travelMode ? `${r.travelMode}${r.travelDetail ? `: ${r.travelDetail}` : ''}` : '-',
      r.arrivalDate ? `${r.arrivalDate}${r.arrivalTime ? ` ${r.arrivalTime}` : ''}` : '-',
      r.status || '-',
    ])

    autoTable(doc, {
      head, body,
      startY: 58,
      margin: { top: 40, left: 20, right: 20, bottom: 20 },
      styles: { fontSize: 7, cellPadding: 4, overflow: 'linebreak', valign: 'middle' },
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [237, 233, 254] },
      columnStyles: { 5: { cellWidth: 90 }, 9: { cellWidth: 80 } },
    })

    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(120)
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10, { align: 'right' })
    }

    doc.save(`Agra_Mahakumbh_2026_${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  const statusBadge = (status) => {
    if (status === 'approved') return <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700'><ShieldCheck size={12} /> Approved</span>
    if (status === 'rejected') return <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-700'><ShieldX size={12} /> Rejected</span>
    return <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700'><ShieldAlert size={12} /> Pending</span>
  }

  return (
    <div className='p-3 md:p-6'>
      <div className='mb-4 md:mb-6 flex items-start justify-between gap-3'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>Agra Mahakumbh 2026</h1>
          <p className='text-sm md:text-base text-gray-600'>All submitted registrations</p>
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

      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6'>
        <div className='bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-xs md:text-sm font-semibold opacity-90'>Total</div>
          <div className='text-2xl md:text-3xl font-bold mt-1'>{stats.total}</div>
        </div>
        <div className='bg-gradient-to-br from-amber-500 to-amber-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-xs md:text-sm font-semibold opacity-90'>Pending</div>
          <div className='text-2xl md:text-3xl font-bold mt-1'>{stats.pending}</div>
        </div>
        <div className='bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-xs md:text-sm font-semibold opacity-90'>Approved</div>
          <div className='text-2xl md:text-3xl font-bold mt-1'>{stats.approved}</div>
        </div>
        <div className='bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-xs md:text-sm font-semibold opacity-90'>Rejected</div>
          <div className='text-2xl md:text-3xl font-bold mt-1'>{stats.rejected}</div>
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-md p-4 mb-4 flex flex-col sm:flex-row gap-3'>
        <input
          type='text'
          placeholder='Search by name, mobile, registration no or UTR...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
        />
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
                statusFilter === opt.key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className='flex items-center gap-1 bg-gray-100 rounded-xl p-1 shrink-0'>
          <button
            onClick={() => setViewMode('card')}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${viewMode === 'card' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <LayoutGrid size={15} /> Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${viewMode === 'table' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <Table size={15} /> Table
          </button>
        </div>
      </div>

      {loading ? (
        <div className='bg-white rounded-xl shadow-md py-12 flex items-center justify-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
          <span className='ml-3 text-gray-500'>Loading...</span>
        </div>
      ) : filteredList.length === 0 ? (
        <div className='bg-white rounded-xl shadow-md py-12 text-center text-gray-500'>
          {searchTerm ? 'No registrations found matching your search' : 'No registrations submitted yet'}
        </div>
      ) : viewMode === 'table' ? (
        <div className='bg-white rounded-xl shadow-md overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm text-left'>
              <thead className='bg-gray-50 text-xs uppercase tracking-wider text-gray-500'>
                <tr>
                  <th className='px-4 py-3 font-semibold'>#</th>
                  <th className='px-4 py-3 font-semibold'>Registration</th>
                  <th className='px-4 py-3 font-semibold'>Contact</th>
                  <th className='px-4 py-3 font-semibold'>Address</th>
                  <th className='px-4 py-3 font-semibold'>Type</th>
                  <th className='px-4 py-3 font-semibold'>UTR</th>
                  <th className='px-4 py-3 font-semibold'>Status</th>
                  <th className='px-4 py-3 font-semibold'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {filteredList.map((r, idx) => (
                  <tr key={r._id} className='hover:bg-gray-50 align-top'>
                    <td className='px-4 py-3 text-gray-500'>{idx + 1}</td>
                    <td className='px-4 py-3'>
                      <div className='font-bold text-gray-800'>{r.fullName || '—'}</div>
                      <div className='text-xs text-indigo-600 font-semibold'>{r.registrationNo || ''}</div>
                      <div className='text-xs text-gray-500 mt-0.5'>{r.gender}{r.age ? ` · ${r.age} yrs` : ''}</div>
                    </td>
                    <td className='px-4 py-3 text-xs text-gray-600'>
                      <div className='flex items-center gap-1'><Phone size={11} className='text-gray-400' /> {r.mobileNo || '—'}</div>
                      {r.fatherName && <div className='mt-0.5'>Father: {r.fatherName}</div>}
                      <div className='text-gray-400 mt-1 flex items-center gap-1'><Hash size={10} /> UTR: {r.utrNumber || '—'}</div>
                    </td>
                    <td className='px-4 py-3 text-xs text-gray-600 max-w-[220px]'>
                      <span className='flex items-start gap-1'><MapPin size={11} className='text-gray-400 mt-0.5 shrink-0' /> {r.address || '—'}</span>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='text-xs font-semibold text-gray-700'>{formatRegType(r.registrationType)}</div>
                      <div className='text-xs font-bold text-indigo-600 mt-0.5'>{formatFee(r.registrationFee)}</div>
                    </td>
                    <td className='px-4 py-3 text-xs text-gray-600'>{r.utrNumber || '—'}</td>
                    <td className='px-4 py-3'>{statusBadge(r.status)}</td>
                    <td className='px-4 py-3 whitespace-nowrap'>
                      <button onClick={() => setViewReg(r)} title='View Details' className='inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-500 hover:bg-gray-600 text-white text-xs font-semibold transition'><Eye size={12} /> View</button>
                      <button onClick={() => handleDelete(r._id, r.registrationNo)} title='Delete' className='inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition ml-1'><Delete size={12} /> Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
          {filteredList.map((r) => (
            <div key={r._id} className='bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300'>
              <div className='px-5 py-4 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 text-white'>
                <div className='flex items-start justify-between gap-2'>
                  <div className='min-w-0'>
                    <h3 className='font-bold text-lg leading-tight truncate'>{r.fullName || '—'}</h3>
                    <p className='text-xs text-indigo-100 mt-0.5 font-semibold'>{r.registrationNo || ''}</p>
                  </div>
                  <span className='shrink-0 font-black text-lg'>{formatFee(r.registrationFee)}</span>
                </div>
                <div className='flex items-center gap-3 mt-2 text-xs text-indigo-100'>
                  <span className='flex items-center gap-1'><Phone size={11} /> {r.mobileNo || '—'}</span>
                  <span className='flex items-center gap-1'><CalendarDays size={11} /> {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : ''}</span>
                </div>
              </div>

              <div className={`px-5 py-2.5 flex flex-col gap-2 border-b ${
                r.status === 'approved' ? 'bg-emerald-50 border-emerald-100'
                  : r.status === 'rejected' ? 'bg-red-50 border-red-100'
                    : 'bg-amber-50 border-amber-100'
              }`}>
                <div className='flex items-center gap-1.5 text-xs font-semibold'>
                  {statusBadge(r.status)}
                  {r.rejectionReason && <span className='text-red-600 text-[11px]'>({r.rejectionReason})</span>}
                </div>
                <div className='flex items-center gap-1.5'>
                  <button
                    onClick={() => handleSetStatus(r._id, 'approved')}
                    disabled={r.status === 'approved'}
                    className='flex-1 px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-40 disabled:cursor-not-allowed'
                  >Approve</button>
                  <button
                    onClick={() => handleSetStatus(r._id, 'pending')}
                    disabled={r.status === 'pending'}
                    className='flex-1 px-2 py-1 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition disabled:opacity-40 disabled:cursor-not-allowed'
                  >Pending</button>
                  <button
                    onClick={() => handleSetStatus(r._id, 'rejected')}
                    disabled={r.status === 'rejected'}
                    className='flex-1 px-2 py-1 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed'
                  >Reject</button>
                </div>
              </div>

              <div className='p-5 flex-1 flex flex-col gap-3 text-sm'>
                <div className='flex flex-wrap gap-x-5 gap-y-1.5 text-gray-600'>
                  <span className='flex items-center gap-1.5'><Users size={13} className='text-indigo-500' /> {r.gender}{r.age ? ` · ${r.age} yrs` : ''}</span>
                </div>
                {r.fatherName && (
                  <div className='flex items-start gap-1.5 text-gray-600'>
                    <User size={14} className='text-indigo-500 mt-0.5 shrink-0' /> <span>Father: {r.fatherName}</span>
                  </div>
                )}
                <div className='flex items-start gap-1.5 text-gray-600'>
                  <MapPin size={14} className='text-indigo-500 mt-0.5 shrink-0' />
                  <span>{r.address || '—'}</span>
                </div>
                <div className='flex items-center justify-between text-xs'>
                  <span className='font-semibold text-gray-700'>{formatRegType(r.registrationType)}</span>
                  {r.utrNumber && <span className='text-gray-500 flex items-center gap-1'><Hash size={11} /> {r.utrNumber}</span>}
                </div>
                {(r.travelMode || r.arrivalDate) && (
                  <div className='text-xs text-gray-500'>
                    {r.travelMode && <div>Travel: {r.travelMode}{r.travelDetail ? ` · ${r.travelDetail}` : ''}</div>}
                    {r.arrivalDate && <div>Arrival: {r.arrivalDate}{r.arrivalTime ? ` · ${r.arrivalTime}` : ''}</div>}
                  </div>
                )}
                {r.dob && <div className='text-xs text-gray-500'>DOB: {r.dob}</div>}
              </div>

              <div className='px-5 py-3 border-t border-gray-100 flex items-center gap-2'>
                <button
                  onClick={() => setViewReg(r)}
                  className='flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition'
                >View</button>
                <button
                  onClick={() => handleDelete(r._id, r.registrationNo)}
                  className='flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition'
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewReg && (
        <div className='fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 pt-8 overflow-y-auto'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8'>
            <div className='flex items-center justify-between gap-3 px-6 py-4 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 text-white rounded-t-2xl sticky top-0'>
              <div className='min-w-0'>
                <h2 className='text-xl font-bold truncate'>{viewReg.fullName || 'Registration Details'}</h2>
                <div className='flex items-center gap-2 mt-1 text-xs text-indigo-100'>
                  <span className='font-semibold text-white'>{viewReg.registrationNo || ''}</span>
                  <span className='capitalize'>{viewReg.status || 'pending'}</span>
                  <span className='flex items-center gap-1'><Phone size={11} /> {viewReg.mobileNo || '—'}</span>
                </div>
              </div>
              <button onClick={() => setViewReg(null)} className='shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition'>
                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            <div className='p-6 space-y-5'>
              <div>
                <h3 className='text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5'><User size={14} className='text-indigo-500' /> Personal</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 bg-gray-50 border border-gray-100 rounded-xl p-4'>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Full Name</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewReg.fullName || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Gender</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewReg.gender || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Mobile</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewReg.mobileNo || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Date of Birth</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewReg.dob || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Age</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewReg.age || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Father&apos;s Name</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewReg.fatherName || '—'}</span></div>
                  <div className='flex justify-between gap-2 sm:col-span-2'><span className='text-gray-500 text-sm'>Address</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewReg.address || '—'}</span></div>
                </div>
              </div>

              <div>
                <h3 className='text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5'><BadgeCheck size={14} className='text-indigo-500' /> Registration</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 bg-gray-50 border border-gray-100 rounded-xl p-4'>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Registration No</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewReg.registrationNo || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Type</span><span className='font-semibold text-gray-800 text-sm text-right'>{formatRegType(viewReg.registrationType)}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Fee</span><span className='font-semibold text-gray-800 text-sm text-right'>{formatFee(viewReg.registrationFee)}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>UTR Number</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewReg.utrNumber || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Submitted On</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewReg.createdAt ? new Date(viewReg.createdAt).toLocaleString('en-IN') : '—'}</span></div>
                </div>
              </div>

              <div>
                <h3 className='text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5'><Clock size={14} className='text-indigo-500' /> Travel</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 bg-gray-50 border border-gray-100 rounded-xl p-4'>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Travel Mode</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewReg.travelMode || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Arrival Date</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewReg.arrivalDate || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Arrival Time</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewReg.arrivalTime || '—'}</span></div>
                  <div className='flex justify-between gap-2 sm:col-span-2'><span className='text-gray-500 text-sm'>Travel Detail</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewReg.travelDetail || '—'}</span></div>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <h3 className='text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5'><CalendarDays size={14} className='text-indigo-500' /> Photo</h3>
                  {viewReg.photo ? (
                    <a href={toAbsoluteUploadUrl(viewReg.photo)} target='_blank' rel='noreferrer'>
                      <img src={toAbsoluteUploadUrl(viewReg.photo)} alt='Applicant' className='w-full h-44 object-cover rounded-xl border border-gray-200 bg-gray-50' />
                    </a>
                  ) : (
                    <div className='w-full h-44 rounded-xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-400'>No photo uploaded</div>
                  )}
                </div>
                <div>
                  <h3 className='text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5'><BadgeCheck size={14} className='text-indigo-500' /> Payment Screenshot</h3>
                  {viewReg.paymentScreenshot ? (
                    <a href={toAbsoluteUploadUrl(viewReg.paymentScreenshot)} target='_blank' rel='noreferrer'>
                      <img src={toAbsoluteUploadUrl(viewReg.paymentScreenshot)} alt='Payment' className='w-full h-44 object-cover rounded-xl border border-gray-200 bg-gray-50' />
                    </a>
                  ) : (
                    <div className='w-full h-44 rounded-xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-400'>No payment screenshot</div>
                  )}
                </div>
              </div>

              {viewReg.rejectionReason && (
                <div className='flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl p-3'>
                  <BadgeX size={16} className='mt-0.5 shrink-0' />
                  <span><span className='font-semibold'>Rejection reason:</span> {viewReg.rejectionReason}</span>
                </div>
              )}

              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-600 font-semibold'>Change status:</span>
                <button
                  onClick={() => handleSetStatus(viewReg._id, 'approved')}
                  disabled={viewReg.status === 'approved'}
                  className='px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-40 disabled:cursor-not-allowed'
                >Approve</button>
                <button
                  onClick={() => handleSetStatus(viewReg._id, 'pending')}
                  disabled={viewReg.status === 'pending'}
                  className='px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition disabled:opacity-40 disabled:cursor-not-allowed'
                >Pending</button>
                <button
                  onClick={() => handleSetStatus(viewReg._id, 'rejected')}
                  disabled={viewReg.status === 'rejected'}
                  className='px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed'
                >Reject</button>
              </div>
            </div>

            <div className='px-6 py-4 border-t border-gray-100 flex justify-end'>
              <button onClick={() => setViewReg(null)} className='px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition'>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgraMahakumbhRegistrations