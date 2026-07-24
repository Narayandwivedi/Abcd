import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Phone, MapPin, Users, FileText, UserCheck, Calendar, Building2, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react'

const RELATION_OPTIONS = [
  'Self', 'Husband', 'Wife', 'Son', 'Daughter', 'Father', 'Mother',
  'Brother', 'Sister', 'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Other',
]

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

const emptyMember = () => ({ name: '', relation: '', mobile: '', age: '', gender: '', occupation: '' })

const AdminFamilyCensus = () => {
  const [familyList, setFamilyList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, approved: 0, pending: 0, rejected: 0 })
  const [samajList, setSamajList] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedFamily, setSelectedFamily] = useState(null)
  const [formData, setFormData] = useState({
    samaj: '', leaderName: '', leaderMobile: '', address: '',
    state: '', district: '', city: '', pincode: '',
    remarks: '', members: [], submittedBy: '', submittedByMobile: '',
  })

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  useEffect(() => { fetchFamilies() }, [])

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/samaj`)
      .then(res => res.json())
      .then(data => { if (data.success) setSamajList(data.data) })
      .catch(() => toast.error('Failed to load Samaj list'))
  }, [])

  const fetchFamilies = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/admin/family-census`, {
        method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        setFamilyList(data.data)
        setStats({ total: data.total, active: data.active, inactive: data.inactive, approved: data.approved, pending: data.pending, rejected: data.rejected })
      }
    } catch (error) {
      toast.error('Failed to fetch family records')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    if (!formData.leaderName.trim()) { toast.warning('Leader name is required'); return }
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/family-census/${selectedFamily._id}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Family updated successfully!')
        setShowEditModal(false)
        setSelectedFamily(null)
        fetchFamilies()
      } else {
        toast.error(data.message || 'Failed to update family')
      }
    } catch (error) {
      toast.error('Failed to update family')
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/family-census/${id}`, {
        method: 'DELETE', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Family deleted successfully!')
        fetchFamilies()
      } else {
        toast.error(data.message || 'Failed to delete family')
      }
    } catch (error) {
      toast.error('Failed to delete family')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/family-census/${id}/toggle-status`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.success) {
        toast.success(`Family ${data.data.isActive ? 'activated' : 'deactivated'} successfully!`)
        fetchFamilies()
      } else {
        toast.error(data.message || 'Failed to toggle status')
      }
    } catch (error) {
      toast.error('Failed to toggle status')
    }
  }

  const handleSetVerificationStatus = async (id, status) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/family-census/${id}/verification-status`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await response.json()
      if (data.success) {
        const messages = { approved: 'Family approved!', rejected: 'Family rejected', pending: 'Family marked as pending' }
        toast.success(messages[status])
        fetchFamilies()
      } else {
        toast.error(data.message || 'Failed to update verification status')
      }
    } catch (error) {
      toast.error('Failed to update verification status')
    }
  }

  const openEditModal = (family) => {
    setSelectedFamily(family)
    setFormData({
      samaj: family.samaj || '',
      leaderName: family.leaderName || '',
      leaderMobile: family.leaderMobile || '',
      address: family.address || '',
      state: family.state || '',
      district: family.district || '',
      city: family.city || '',
      pincode: family.pincode || '',
      remarks: family.remarks || '',
      members: family.members && family.members.length > 0
        ? family.members.map(m => ({
            name: m.name || '', relation: m.relation || '', mobile: m.mobile || '',
            age: m.age || '', gender: m.gender || '', occupation: m.occupation || '',
          }))
        : [],
      submittedBy: family.submittedBy || '',
      submittedByMobile: family.submittedByMobile || '',
    })
    setShowEditModal(true)
  }

  const handleMemberChange = (index, field, value) => {
    const updated = [...formData.members]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, members: updated })
  }

  const addMember = () => {
    setFormData({ ...formData, members: [...formData.members, emptyMember()] })
  }

  const removeMember = (index) => {
    setFormData({ ...formData, members: formData.members.filter((_, i) => i !== index) })
  }

  const filteredList = familyList.filter(f => {
    const matchesSearch = f.leaderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.leaderMobile?.includes(searchTerm) ||
      f.city?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || f.verificationStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className='p-3 md:p-6'>
      <div className='mb-4 md:mb-6'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>Family Census</h1>
        <p className='text-sm md:text-base text-gray-600'>Manage all Family records</p>
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
          placeholder='Search by leader name, mobile or city...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
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
                statusFilter === opt.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
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
          {searchTerm ? 'No records found matching your search' : 'No family records available'}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
          {filteredList.map((family) => {
            const samajName = samajList.find(s => s._id === (family.samaj?._id || family.samaj))?.samajName
              || family.samaj?.samajName
            const createdDate = family.createdAt
              ? new Date(family.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : null
            return (
              <div key={family._id} className='bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300'>
                <div className='relative px-5 py-4 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white'>
                  <div className='flex items-start justify-between gap-2'>
                    <div className='min-w-0'>
                      <h3 className='font-bold text-lg leading-tight truncate'>{family.leaderName}</h3>
                      {samajName && (
                        <p className='text-xs text-blue-100 mt-1 flex items-center gap-1'>
                          <Building2 size={12} /> {samajName}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleStatus(family._id)}
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition ${
                        family.isActive ? 'bg-green-400/90 text-green-900 hover:bg-green-300' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {family.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <div className='flex items-center gap-3 mt-3 text-xs text-blue-50'>
                    <span className='flex items-center gap-1'><Users size={12} /> {family.members?.length || 0} member{family.members?.length !== 1 ? 's' : ''}</span>
                    {createdDate && <span className='flex items-center gap-1'><Calendar size={12} /> {createdDate}</span>}
                  </div>
                </div>

                <div className={`px-5 py-2.5 flex flex-col gap-2 border-b ${
                  family.verificationStatus === 'approved' ? 'bg-emerald-50 border-emerald-100'
                    : family.verificationStatus === 'rejected' ? 'bg-red-50 border-red-100'
                    : 'bg-amber-50 border-amber-100'
                }`}>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold ${
                    family.verificationStatus === 'approved' ? 'text-emerald-700'
                      : family.verificationStatus === 'rejected' ? 'text-red-700'
                      : 'text-amber-700'
                  }`}>
                    {family.verificationStatus === 'approved' ? <ShieldCheck size={14} />
                      : family.verificationStatus === 'rejected' ? <ShieldX size={14} />
                      : <ShieldAlert size={14} />}
                    {family.verificationStatus === 'approved' ? 'Verified & Approved'
                      : family.verificationStatus === 'rejected' ? 'Rejected'
                      : 'Pending Verification'}
                  </span>
                  <div className='flex items-center gap-1.5'>
                    <button
                      onClick={() => handleSetVerificationStatus(family._id, 'approved')}
                      disabled={family.verificationStatus === 'approved'}
                      className='flex-1 px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-40 disabled:cursor-not-allowed'
                    >Approve</button>
                    <button
                      onClick={() => handleSetVerificationStatus(family._id, 'pending')}
                      disabled={family.verificationStatus === 'pending'}
                      className='flex-1 px-2 py-1 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition disabled:opacity-40 disabled:cursor-not-allowed'
                    >Pending</button>
                    <button
                      onClick={() => handleSetVerificationStatus(family._id, 'rejected')}
                      disabled={family.verificationStatus === 'rejected'}
                      className='flex-1 px-2 py-1 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-40 disabled:cursor-not-allowed'
                    >Reject</button>
                  </div>
                </div>

                <div className='p-5 flex-1 flex flex-col gap-3.5 text-sm'>
                  <div className='flex flex-wrap gap-x-5 gap-y-1.5 text-gray-600'>
                    <span className='flex items-center gap-1.5'><Phone size={13} className='text-blue-500' /> {family.leaderMobile || '—'}</span>
                    {family.pincode && <span className='text-gray-500'>Pin: {family.pincode}</span>}
                  </div>

                  <div className='flex items-start gap-1.5 text-gray-600'>
                    <MapPin size={14} className='text-blue-500 mt-0.5 shrink-0' />
                    <div>
                      {family.address && <div>{family.address}</div>}
                      <div className='text-gray-500'>{[family.city, family.district, family.state].filter(Boolean).join(', ') || '—'}</div>
                    </div>
                  </div>

                  {family.remarks && (
                    <div className='flex items-start gap-1.5 text-gray-600'>
                      <FileText size={14} className='text-blue-500 mt-0.5 shrink-0' />
                      <span>{family.remarks}</span>
                    </div>
                  )}

                  <div>
                    <p className='font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5'>
                      <Users size={13} /> Members ({family.members?.length || 0})
                    </p>
                    {family.members?.length > 0 ? (
                      <div className='flex flex-col gap-1.5'>
                        {family.members.map((m, idx) => (
                          <div key={idx} className='bg-gray-50 border border-gray-100 rounded-lg px-3 py-2'>
                            <div className='flex items-center justify-between'>
                              <span className='font-semibold text-gray-800'>{m.name || '—'}</span>
                              <span className='text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full'>{m.relation || '—'}</span>
                            </div>
                            <div className='text-xs text-gray-500 mt-1 flex flex-wrap gap-x-3 gap-y-0.5'>
                              {m.mobile && <span className='flex items-center gap-1'><Phone size={10} /> {m.mobile}</span>}
                              {m.age ? <span>Age: {m.age}</span> : null}
                              {m.gender && <span>{m.gender}</span>}
                              {m.occupation && <span>{m.occupation}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className='text-xs text-gray-400 italic'>No members added</p>
                    )}
                  </div>

                  {(family.submittedBy || family.submittedByMobile) && (
                    <div className='mt-auto pt-3 border-t border-dashed border-gray-200 flex items-center gap-2 text-xs text-gray-500'>
                      <UserCheck size={14} className='text-emerald-500 shrink-0' />
                      <span>
                        <span className='font-semibold text-gray-600'>Submitted by:</span>{' '}
                        {family.submittedBy || '—'}
                        {family.submittedByMobile && <span className='text-gray-400'> · {family.submittedByMobile}</span>}
                      </span>
                    </div>
                  )}
                </div>

                <div className='px-5 py-3 border-t border-gray-100 flex items-center gap-2'>
                  <button
                    onClick={() => openEditModal(family)}
                    className='flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition'
                  >Edit</button>
                  <button
                    onClick={() => handleDelete(family._id, family.leaderName)}
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
              <h2 className='text-xl font-bold text-gray-800'>Edit Family</h2>
              <button onClick={() => { setShowEditModal(false); setSelectedFamily(null) }} className='text-gray-400 hover:text-gray-600 transition'>
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEdit} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>Leader Name *</label>
                  <input type='text' value={formData.leaderName} onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' required />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>Mobile</label>
                  <input type='text' value={formData.leaderMobile} onChange={(e) => setFormData({ ...formData, leaderMobile: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>Samaj</label>
                  <select value={formData.samaj} onChange={(e) => setFormData({ ...formData, samaj: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                    <option value=''>-- Select Samaj --</option>
                    {samajList.map(s => <option key={s._id} value={s._id}>{s.samajName}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-1'>Address</label>
                <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y' rows='2' />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
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
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-1'>Pincode</label>
                  <input type='text' value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='block text-sm font-semibold text-gray-700'>Family Members</label>
                  <button type='button' onClick={addMember} className='text-blue-600 hover:text-blue-800 text-sm font-semibold'>+ Add Member</button>
                </div>
                {formData.members.length === 0 && (
                  <p className='text-sm text-gray-400 italic'>No members added</p>
                )}
                {formData.members.map((member, idx) => (
                  <div key={idx} className='border border-gray-200 rounded-lg p-3 mb-2 bg-gray-50'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm font-semibold text-gray-700'>Member {idx + 1}</span>
                      {formData.members.length > 1 && (
                        <button type='button' onClick={() => removeMember(idx)} className='text-red-500 hover:text-red-700 text-sm'>✕ Remove</button>
                      )}
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                      <input type='text' placeholder='Name' value={member.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        className='px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm' />
                      <select value={member.relation} onChange={(e) => handleMemberChange(idx, 'relation', e.target.value)}
                        className='px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'>
                        <option value=''>Relation</option>
                        {RELATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <input type='text' placeholder='Mobile' value={member.mobile}
                        onChange={(e) => handleMemberChange(idx, 'mobile', e.target.value)}
                        className='px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm' />
                      <input type='number' placeholder='Age' value={member.age}
                        onChange={(e) => handleMemberChange(idx, 'age', e.target.value)}
                        className='px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm' />
                      <select value={member.gender} onChange={(e) => handleMemberChange(idx, 'gender', e.target.value)}
                        className='px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'>
                        <option value=''>Gender</option>
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                        <option value='Other'>Other</option>
                      </select>
                      <input type='text' placeholder='Occupation' value={member.occupation}
                        onChange={(e) => handleMemberChange(idx, 'occupation', e.target.value)}
                        className='px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm' />
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
                <button type='button' onClick={() => { setShowEditModal(false); setSelectedFamily(null) }}
                  className='flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition'>Cancel</button>
                <button type='submit'
                  className='flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition shadow-md'>Update Family</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminFamilyCensus
