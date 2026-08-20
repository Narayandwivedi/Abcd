import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
  BadgeCheck, BadgeX, Clock, Download, FileDown, Eye, Hash, Phone,
  MapPin, User, Users, ShieldCheck, ShieldAlert, ShieldX, LayoutGrid, Table,
  Delete, Pencil, FileText, Image as ImageIcon, Award, Mail, CalendarDays,
} from 'lucide-react'

const AgraAlankaranApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('table')
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [viewApp, setViewApp] = useState(null)
  const [editApp, setEditApp] = useState(null)
  const [editForm, setEditForm] = useState({})

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

  const getDocuments = (app) => {
    const list = []
    if (Array.isArray(app.documents) && app.documents.length > 0) {
      list.push(...app.documents)
    } else if (typeof app.document === 'string' && app.document) {
      list.push(app.document)
    }
    return list
  }

  const isImagePath = (value) => /\.(jpe?g|png|webp|gif)$/i.test(value || '')

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/admin/agra-alankaran`, {
        method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        setApplications(data.data)
        setStats({ total: data.total, pending: data.pending, approved: data.approved, rejected: data.rejected })
      } else {
        toast.error(data.message || 'Failed to fetch applications')
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast.error('Failed to fetch applications')
    } finally {
      setLoading(false)
    }
  }, [BACKEND_URL])

  useEffect(() => { fetchApplications() }, [fetchApplications])

  const handleSetStatus = async (id, status) => {
    let rejectionReason = ''
    if (status === 'rejected') {
      rejectionReason = window.prompt('Enter rejection reason (optional):') || ''
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/agra-alankaran/${id}/status`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason }),
      })
      const data = await response.json()
      if (data.success) {
        toast.success(status === 'approved' ? 'Application approved!' : status === 'rejected' ? 'Application rejected' : 'Application marked pending')
        fetchApplications()
      } else {
        toast.error(data.message || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id, applicationNo) => {
    if (!window.confirm(`Are you sure you want to delete application "${applicationNo}"?`)) return
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/agra-alankaran/${id}`, {
        method: 'DELETE', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Application deleted successfully!')
        fetchApplications()
      } else {
        toast.error(data.message || 'Failed to delete application')
      }
    } catch (error) {
      console.error('Error deleting application:', error)
      toast.error('Failed to delete application')
    }
  }

  const openEdit = (app) => {
    setEditForm({
      awardCategory: app.awardCategory || '',
      applicantName: app.applicantName || '',
      dob: app.dob || '',
      age: app.age || '',
      fatherHusbandName: app.fatherHusbandName || '',
      fullAddress: app.fullAddress || '',
      mobileNo: app.mobileNo || '',
      email: app.email || '',
      achievementDesc: app.achievementDesc || '',
      date: app.date || '',
      place: app.place || '',
    })
    setEditApp(app)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editApp) return
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/agra-alankaran/${editApp._id}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Application updated successfully!')
        setEditApp(null)
        fetchApplications()
      } else {
        toast.error(data.message || 'Failed to update application')
      }
    } catch (error) {
      console.error('Error updating application:', error)
      toast.error('Failed to update application')
    }
  }

  const filteredList = applications.filter((a) => {
    const matchesSearch = (a.applicantName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.mobileNo || '').includes(searchTerm) ||
      (a.applicationNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.awardCategory || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleExportExcel = () => {
    if (filteredList.length === 0) { toast.warning('No records to export'); return }
    const rows = filteredList.map((a) => ({
      'Application No': a.applicationNo || '',
      'Award Category': a.awardCategory || '',
      'Applicant Name': a.applicantName || '',
      'Date of Birth': a.dob || '',
      'Age': a.age || '',
      "Father's/Husband's Name": a.fatherHusbandName || '',
      'Full Address': a.fullAddress || '',
      'Mobile No': a.mobileNo || '',
      'Email': a.email || '',
      'Achievement Description': a.achievementDesc || '',
      'Date': a.date || '',
      'Place': a.place || '',
      'Status': a.status || '',
      'Rejection Reason': a.rejectionReason || '',
      'Photo': toAbsoluteUploadUrl(a.photo),
      'Documents': getDocuments(a).map(toAbsoluteUploadUrl).join(' | '),
      'Submitted On': a.createdAt ? new Date(a.createdAt).toLocaleString('en-IN') : '',
    }))
    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Agra Alankaran 2026')
    XLSX.writeFile(workbook, `Agra_Alankaran_2026_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const handleExportPDF = () => {
    if (filteredList.length === 0) { toast.warning('No records to export'); return }
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()

    doc.setFontSize(16)
    doc.text('Agra Alankaran 2026 - Applications', pageWidth / 2, 30, { align: 'center' })
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')} | Total Records: ${filteredList.length}`, pageWidth / 2, 46, { align: 'center' })

    const head = [['#', 'App No', 'Name', 'Mobile', 'Category', 'Address', 'Age', 'Status']]
    const body = filteredList.map((a, idx) => [
      idx + 1,
      a.applicationNo || '-',
      a.applicantName || '-',
      a.mobileNo || '-',
      a.awardCategory || '-',
      a.fullAddress || '-',
      a.age || '-',
      a.status || '-',
    ])

    autoTable(doc, {
      head, body,
      startY: 58,
      margin: { top: 40, left: 20, right: 20, bottom: 20 },
      styles: { fontSize: 7, cellPadding: 4, overflow: 'linebreak', valign: 'middle' },
      headStyles: { fillColor: [185, 28, 28], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [254, 243, 199] },
      columnStyles: { 4: { cellWidth: 120 }, 5: { cellWidth: 150 } },
    })

    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(120)
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10, { align: 'right' })
    }

    doc.save(`Agra_Alankaran_2026_${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  const statusBadge = (status) => {
    if (status === 'approved') return <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700'><ShieldCheck size={12} /> Approved</span>
    if (status === 'rejected') return <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-700'><ShieldX size={12} /> Rejected</span>
    return <span className='inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700'><ShieldAlert size={12} /> Pending</span>
  }

  const StatusButtons = ({ app }) => (
    <div className='flex items-center gap-1.5'>
      <button
        onClick={() => handleSetStatus(app._id, 'approved')}
        disabled={app.status === 'approved'}
        className='flex-1 px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-40 disabled:cursor-not-allowed'
      >Approve</button>
      <button
        onClick={() => handleSetStatus(app._id, 'pending')}
        disabled={app.status === 'pending'}
        className='flex-1 px-2 py-1 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition disabled:opacity-40 disabled:cursor-not-allowed'
      >Pending</button>
      <button
        onClick={() => handleSetStatus(app._id, 'rejected')}
        disabled={app.status === 'rejected'}
        className='flex-1 px-2 py-1 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed'
      >Reject</button>
    </div>
  )

  const DocumentsList = ({ app }) => {
    const docs = getDocuments(app)
    if (docs.length === 0) {
      return <div className='w-full rounded-xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-400 p-4'>No documents uploaded</div>
    }
    return (
      <div className='space-y-2'>
        {docs.map((doc, i) => {
          const url = toAbsoluteUploadUrl(doc)
          const isImg = isImagePath(doc)
          return (
            <a
              key={i}
              href={url}
              target='_blank'
              rel='noreferrer'
              className='flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 hover:border-red-300 hover:bg-red-50/40 transition'
            >
              {isImg ? <ImageIcon size={15} className='text-red-500 shrink-0' /> : <FileText size={15} className='text-red-500 shrink-0' />}
              <span className='text-xs font-semibold text-gray-700 truncate flex-1'>Document {i + 1}</span>
              <span className='text-[10px] text-blue-600 font-semibold shrink-0'>Open ↗</span>
            </a>
          )
        })}
      </div>
    )
  }

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm'

  return (
    <div className='p-3 md:p-6'>
      <div className='mb-4 md:mb-6 flex items-start justify-between gap-3'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>Agra Alankaran 2026</h1>
          <p className='text-sm md:text-base text-gray-600'>All submitted award applications</p>
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
        <div className='bg-gradient-to-br from-red-600 to-rose-700 text-white p-4 rounded-xl shadow-lg'>
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
        <div className='bg-gradient-to-br from-red-500 to-red-700 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-xs md:text-sm font-semibold opacity-90'>Rejected</div>
          <div className='text-2xl md:text-3xl font-bold mt-1'>{stats.rejected}</div>
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-md p-4 mb-4 flex flex-col sm:flex-row gap-3'>
        <input
          type='text'
          placeholder='Search by name, mobile, application no or category...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
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
                statusFilter === opt.key ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className='flex items-center gap-1 bg-gray-100 rounded-xl p-1 shrink-0'>
          <button
            onClick={() => setViewMode('card')}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${viewMode === 'card' ? 'bg-white text-red-600 shadow' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <LayoutGrid size={15} /> Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${viewMode === 'table' ? 'bg-white text-red-600 shadow' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <Table size={15} /> Table
          </button>
        </div>
      </div>

      {loading ? (
        <div className='bg-white rounded-xl shadow-md py-12 flex items-center justify-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-red-600'></div>
          <span className='ml-3 text-gray-500'>Loading...</span>
        </div>
      ) : filteredList.length === 0 ? (
        <div className='bg-white rounded-xl shadow-md py-12 text-center text-gray-500'>
          {searchTerm ? 'No applications found matching your search' : 'No applications submitted yet'}
        </div>
      ) : viewMode === 'table' ? (
        <div className='bg-white rounded-xl shadow-md overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm text-left'>
              <thead className='bg-gray-50 text-xs uppercase tracking-wider text-gray-500'>
                <tr>
                  <th className='px-4 py-3 font-semibold'>#</th>
                  <th className='px-4 py-3 font-semibold'>Applicant</th>
                  <th className='px-4 py-3 font-semibold'>Contact</th>
                  <th className='px-4 py-3 font-semibold'>Address</th>
                  <th className='px-4 py-3 font-semibold'>Category</th>
                  <th className='px-4 py-3 font-semibold'>Status</th>
                  <th className='px-4 py-3 font-semibold'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {filteredList.map((a, idx) => (
                  <tr key={a._id} className='hover:bg-gray-50 align-top'>
                    <td className='px-4 py-3 text-gray-500'>{idx + 1}</td>
                    <td className='px-4 py-3'>
                      <div className='font-bold text-gray-800'>{a.applicantName || '—'}</div>
                      <div className='text-xs text-red-600 font-semibold'>{a.applicationNo || ''}</div>
                      <div className='text-xs text-gray-500 mt-0.5'>{a.age ? `${a.age} yrs` : ''}</div>
                    </td>
                    <td className='px-4 py-3 text-xs text-gray-600'>
                      <div className='flex items-center gap-1'><Phone size={11} className='text-gray-400' /> {a.mobileNo || '—'}</div>
                      <div className='flex items-center gap-1 mt-0.5'><Mail size={11} className='text-gray-400' /> {a.email || '—'}</div>
                    </td>
                    <td className='px-4 py-3 text-xs text-gray-600 max-w-[220px]'>
                      <span className='flex items-start gap-1'><MapPin size={11} className='text-gray-400 mt-0.5 shrink-0' /> {a.fullAddress || '—'}</span>
                    </td>
                    <td className='px-4 py-3 text-xs font-semibold text-gray-700 max-w-[220px]'>{a.awardCategory || '—'}</td>
                    <td className='px-4 py-3'>{statusBadge(a.status)}</td>
                    <td className='px-4 py-3 whitespace-nowrap'>
                      <button onClick={() => setViewApp(a)} title='View Details' className='inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-500 hover:bg-gray-600 text-white text-xs font-semibold transition'><Eye size={12} /> View</button>
                      <button onClick={() => openEdit(a)} title='Edit' className='inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition ml-1'><Pencil size={12} /> Edit</button>
                      <button onClick={() => handleDelete(a._id, a.applicationNo)} title='Delete' className='inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition ml-1'><Delete size={12} /> Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
          {filteredList.map((a) => (
            <div key={a._id} className='bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300'>
              <div className='px-5 py-4 bg-gradient-to-br from-red-700 via-rose-600 to-orange-600 text-white'>
                <div className='flex items-start justify-between gap-2'>
                  <div className='min-w-0'>
                    <h3 className='font-bold text-lg leading-tight truncate'>{a.applicantName || '—'}</h3>
                    <p className='text-xs text-red-100 mt-0.5 font-semibold'>{a.applicationNo || ''}</p>
                  </div>
                  <span className='shrink-0 font-black text-lg'>{a.age ? `${a.age}y` : ''}</span>
                </div>
                <div className='flex items-center gap-3 mt-2 text-xs text-red-100'>
                  <span className='flex items-center gap-1'><Phone size={11} /> {a.mobileNo || '—'}</span>
                  <span className='flex items-center gap-1'><CalendarDays size={11} /> {a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-IN') : ''}</span>
                </div>
              </div>

              <div className={`px-5 py-2.5 flex flex-col gap-2 border-b ${
                a.status === 'approved' ? 'bg-emerald-50 border-emerald-100'
                  : a.status === 'rejected' ? 'bg-red-50 border-red-100'
                    : 'bg-amber-50 border-amber-100'
              }`}>
                <div className='flex items-center gap-1.5 text-xs font-semibold'>
                  {statusBadge(a.status)}
                  {a.rejectionReason && <span className='text-red-600 text-[11px]'>({a.rejectionReason})</span>}
                </div>
                <StatusButtons app={a} />
              </div>

              <div className='p-5 flex-1 flex flex-col gap-3 text-sm'>
                <div className='flex items-start gap-1.5 text-gray-600'>
                  <Award size={14} className='text-red-500 mt-0.5 shrink-0' /> <span className='text-xs'>{a.awardCategory || '—'}</span>
                </div>
                <div className='flex items-start gap-1.5 text-gray-600'>
                  <MapPin size={14} className='text-red-500 mt-0.5 shrink-0' />
                  <span className='text-xs'>{a.fullAddress || '—'}</span>
                </div>
                {a.fatherHusbandName && (
                  <div className='flex items-start gap-1.5 text-gray-600 text-xs'>
                    <User size={14} className='text-red-500 mt-0.5 shrink-0' /> <span>Father/Husband: {a.fatherHusbandName}</span>
                  </div>
                )}
              </div>

              <div className='px-5 py-3 border-t border-gray-100 flex items-center gap-2'>
                <button
                  onClick={() => setViewApp(a)}
                  className='flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition'
                >View</button>
                <button
                  onClick={() => openEdit(a)}
                  className='flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition'
                >Edit</button>
                <button
                  onClick={() => handleDelete(a._id, a.applicationNo)}
                  className='flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition'
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewApp && (
        <div className='fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 pt-8 overflow-y-auto'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8'>
            <div className='flex items-center justify-between gap-3 px-6 py-4 bg-gradient-to-br from-red-700 via-rose-600 to-orange-600 text-white rounded-t-2xl sticky top-0'>
              <div className='min-w-0'>
                <h2 className='text-xl font-bold truncate'>{viewApp.applicantName || 'Application Details'}</h2>
                <div className='flex items-center gap-2 mt-1 text-xs text-red-100'>
                  <span className='font-semibold text-white'>{viewApp.applicationNo || ''}</span>
                  <span className='capitalize'>{viewApp.status || 'pending'}</span>
                  <span className='flex items-center gap-1'><Phone size={11} /> {viewApp.mobileNo || '—'}</span>
                </div>
              </div>
              <button onClick={() => setViewApp(null)} className='shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition'>
                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            <div className='p-6 space-y-5'>
              <div>
                <h3 className='text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5'><User size={14} className='text-red-500' /> Applicant</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 bg-gray-50 border border-gray-100 rounded-xl p-4'>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Application No</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewApp.applicationNo || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Name</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewApp.applicantName || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Date of Birth</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewApp.dob || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Age</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewApp.age || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Father/Husband</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewApp.fatherHusbandName || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Mobile</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewApp.mobileNo || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Email</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewApp.email || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Submitted On</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewApp.createdAt ? new Date(viewApp.createdAt).toLocaleString('en-IN') : '—'}</span></div>
                  <div className='flex justify-between gap-2 sm:col-span-2'><span className='text-gray-500 text-sm'>Address</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewApp.fullAddress || '—'}</span></div>
                </div>
              </div>

              <div>
                <h3 className='text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5'><Award size={14} className='text-red-500' /> Award &amp; Application</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 bg-gray-50 border border-gray-100 rounded-xl p-4'>
                  <div className='flex justify-between gap-2 sm:col-span-2'><span className='text-gray-500 text-sm'>Award Category</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewApp.awardCategory || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Date</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewApp.date || '—'}</span></div>
                  <div className='flex justify-between gap-2'><span className='text-gray-500 text-sm'>Place</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewApp.place || '—'}</span></div>
                  <div className='flex justify-between gap-2 sm:col-span-2'><span className='text-gray-500 text-sm'>Achievement Description</span><span className='font-semibold text-gray-800 text-sm text-right'>{viewApp.achievementDesc || '—'}</span></div>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <h3 className='text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5'><ImageIcon size={14} className='text-red-500' /> Photo</h3>
                  {viewApp.photo ? (
                    <a href={toAbsoluteUploadUrl(viewApp.photo)} target='_blank' rel='noreferrer'>
                      <img src={toAbsoluteUploadUrl(viewApp.photo)} alt='Applicant' className='w-full h-44 object-cover rounded-xl border border-gray-200 bg-gray-50' />
                    </a>
                  ) : (
                    <div className='w-full h-44 rounded-xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-400'>No photo uploaded</div>
                  )}
                </div>
                <div>
                  <h3 className='text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5'><FileText size={14} className='text-red-500' /> Documents ({getDocuments(viewApp).length})</h3>
                  <DocumentsList app={viewApp} />
                </div>
              </div>

              {viewApp.rejectionReason && (
                <div className='flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl p-3'>
                  <BadgeX size={16} className='mt-0.5 shrink-0' />
                  <span><span className='font-semibold'>Rejection reason:</span> {viewApp.rejectionReason}</span>
                </div>
              )}

              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-600 font-semibold'>Change status:</span>
                <button
                  onClick={() => handleSetStatus(viewApp._id, 'approved')}
                  disabled={viewApp.status === 'approved'}
                  className='px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-40 disabled:cursor-not-allowed'
                >Approve</button>
                <button
                  onClick={() => handleSetStatus(viewApp._id, 'pending')}
                  disabled={viewApp.status === 'pending'}
                  className='px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition disabled:opacity-40 disabled:cursor-not-allowed'
                >Pending</button>
                <button
                  onClick={() => handleSetStatus(viewApp._id, 'rejected')}
                  disabled={viewApp.status === 'rejected'}
                  className='px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed'
                >Reject</button>
              </div>
            </div>

            <div className='px-6 py-4 border-t border-gray-100 flex justify-end'>
              <button onClick={() => setViewApp(null)} className='px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition'>Close</button>
            </div>
          </div>
        </div>
      )}

      {editApp && (
        <div className='fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 pt-8 overflow-y-auto'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8'>
            <div className='flex items-center justify-between gap-3 px-6 py-4 bg-gradient-to-br from-red-700 via-rose-600 to-orange-600 text-white rounded-t-2xl sticky top-0'>
              <div className='min-w-0'>
                <h2 className='text-xl font-bold truncate'>Edit Application</h2>
                <p className='text-xs text-red-100'>{editApp.applicationNo || ''} · {editApp.applicantName || ''}</p>
              </div>
              <button onClick={() => setEditApp(null)} className='shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition'>
                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className='p-6 space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='sm:col-span-2'>
                  <label className='block text-xs font-bold text-gray-600 mb-1'>Award Category</label>
                  <input type='text' className={inputClass} value={editForm.awardCategory} onChange={(e) => setEditForm({ ...editForm, awardCategory: e.target.value })} />
                </div>
                <div className='sm:col-span-2'>
                  <label className='block text-xs font-bold text-gray-600 mb-1'>Applicant Name</label>
                  <input type='text' className={inputClass} value={editForm.applicantName} onChange={(e) => setEditForm({ ...editForm, applicantName: e.target.value })} />
                </div>
                <div>
                  <label className='block text-xs font-bold text-gray-600 mb-1'>Date of Birth</label>
                  <input type='date' className={inputClass} value={editForm.dob} onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })} />
                </div>
                <div>
                  <label className='block text-xs font-bold text-gray-600 mb-1'>Age</label>
                  <input type='number' className={inputClass} value={editForm.age} onChange={(e) => setEditForm({ ...editForm, age: e.target.value })} />
                </div>
                <div className='sm:col-span-2'>
                  <label className='block text-xs font-bold text-gray-600 mb-1'>Father/Husband Name</label>
                  <input type='text' className={inputClass} value={editForm.fatherHusbandName} onChange={(e) => setEditForm({ ...editForm, fatherHusbandName: e.target.value })} />
                </div>
                <div className='sm:col-span-2'>
                  <label className='block text-xs font-bold text-gray-600 mb-1'>Full Address</label>
                  <textarea rows='2' className={inputClass} value={editForm.fullAddress} onChange={(e) => setEditForm({ ...editForm, fullAddress: e.target.value })} />
                </div>
                <div>
                  <label className='block text-xs font-bold text-gray-600 mb-1'>Mobile No</label>
                  <input type='text' className={inputClass} value={editForm.mobileNo} onChange={(e) => setEditForm({ ...editForm, mobileNo: e.target.value })} />
                </div>
                <div>
                  <label className='block text-xs font-bold text-gray-600 mb-1'>Email</label>
                  <input type='email' className={inputClass} value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                </div>
                <div>
                  <label className='block text-xs font-bold text-gray-600 mb-1'>Date</label>
                  <input type='date' className={inputClass} value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} />
                </div>
                <div>
                  <label className='block text-xs font-bold text-gray-600 mb-1'>Place</label>
                  <input type='text' className={inputClass} value={editForm.place} onChange={(e) => setEditForm({ ...editForm, place: e.target.value })} />
                </div>
                <div className='sm:col-span-2'>
                  <label className='block text-xs font-bold text-gray-600 mb-1'>Achievement Description</label>
                  <textarea rows='4' className={inputClass} value={editForm.achievementDesc} onChange={(e) => setEditForm({ ...editForm, achievementDesc: e.target.value })} />
                </div>
              </div>

              <div className='flex justify-end gap-2 pt-2 border-t border-gray-100'>
                <button type='button' onClick={() => setEditApp(null)} className='px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition'>Cancel</button>
                <button type='submit' className='px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition'>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgraAlankaranApplications