import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

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
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 })
  const [samajList, setSamajList] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedFamily, setSelectedFamily] = useState(null)
  const [formData, setFormData] = useState({
    samaj: '', leaderName: '', leaderMobile: '', address: '',
    state: '', district: '', city: '', pincode: '',
    remarks: '', members: [],
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
        setStats({ total: data.total, active: data.active, inactive: data.inactive })
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

  const filteredList = familyList.filter(f =>
    f.leaderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.leaderMobile?.includes(searchTerm) ||
    f.city?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='p-3 md:p-6'>
      <div className='mb-4 md:mb-6'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>Family Census</h1>
        <p className='text-sm md:text-base text-gray-600'>Manage all Family records</p>
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
          placeholder='Search by leader name, mobile or city...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <div className='bg-white rounded-xl shadow-md overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>#</th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Leader Name</th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Mobile</th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>City / State</th>
                <th className='px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase'>Members</th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Status</th>
                <th className='px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {loading ? (
                <tr>
                  <td colSpan='7' className='px-4 py-8 text-center text-gray-500'>
                    <div className='flex items-center justify-center'>
                      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                      <span className='ml-3'>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan='7' className='px-4 py-8 text-center text-gray-500'>
                    {searchTerm ? 'No records found matching your search' : 'No family records available'}
                  </td>
                </tr>
              ) : (
                filteredList.map((family, index) => (
                  <tr key={family._id} className='hover:bg-gray-50 transition-colors'>
                    <td className='px-4 py-3 text-sm text-gray-600'>{index + 1}</td>
                    <td className='px-4 py-3 text-sm font-semibold text-gray-800'>{family.leaderName}</td>
                    <td className='px-4 py-3 text-sm text-gray-600'>{family.leaderMobile || '—'}</td>
                    <td className='px-4 py-3 text-sm text-gray-600'>{[family.city, family.state].filter(Boolean).join(', ') || '—'}</td>
                    <td className='px-4 py-3 text-sm text-center text-gray-600'>{family.members?.length || 0}</td>
                    <td className='px-4 py-3'>
                      <button
                        onClick={() => handleToggleStatus(family._id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          family.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } transition`}
                      >
                        {family.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center justify-center gap-2'>
                        <button
                          onClick={() => openEditModal(family)}
                          className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition'
                        >Edit</button>
                        <button
                          onClick={() => handleDelete(family._id, family.leaderName)}
                          className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition'
                        >Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
