import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Phone, Mail, MapPin, Users, FileText, UserCheck, Calendar } from 'lucide-react'

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
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 })
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSamaj, setSelectedSamaj] = useState(null)
  const [formData, setFormData] = useState({
    samajName: '', officeAddress: '', mobile: '', email: '',
    state: '', district: '', city: '', pincode: '',
    leaders: [emptyLeader()], remarks: '',
    submittedBy: '', submittedByMobile: '',
  })

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  useEffect(() => { fetchSamaj() }, [])

  const fetchSamaj = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/admin/samaj-census`, {
        method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        setSamajList(data.data)
        setStats({ total: data.total, active: data.active, inactive: data.inactive })
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

  const openEditModal = (samaj) => {
    setSelectedSamaj(samaj)
    setFormData({
      samajName: samaj.samajName || '',
      officeAddress: samaj.officeAddress || '',
      mobile: samaj.mobile || '',
      email: samaj.email || '',
      state: samaj.state || '',
      district: samaj.district || '',
      city: samaj.city || '',
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

  const filteredList = samajList.filter(s =>
    s.samajName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.mobile?.includes(searchTerm)
  )

  return (
    <div className='p-3 md:p-6'>
      <div className='mb-4 md:mb-6'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>Samaj Census</h1>
        <p className='text-sm md:text-base text-gray-600'>Manage all Samaj records</p>
      </div>

      <div className='grid grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6'>
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-xs md:text-sm font-semibold opacity-90'>Total</div>
          <div className='text-2xl md:text-3xl font-bold mt-1'>{stats.total}</div>
        </div>
        <div className='bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-xs md:text-sm font-semibold opacity-90'>Active</div>
          <div className='text-2xl md:text-3xl font-bold mt-1'>{stats.active}</div>
        </div>
        <div className='bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-xs md:text-sm font-semibold opacity-90'>Inactive</div>
          <div className='text-2xl md:text-3xl font-bold mt-1'>{stats.inactive}</div>
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-md p-4 mb-4'>
        <input
          type='text'
          placeholder='Search by name, city or mobile...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
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

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>State</label>
                  <select value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                    <option value=''>Select State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>District</label>
                  <input type='text' value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>City</label>
                  <input type='text' value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
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
    </div>
  )
}

export default AdminSamajCensus
