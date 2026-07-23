import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

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

      <div className='bg-white rounded-xl shadow-md overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>#</th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Samaj Name</th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>Mobile</th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>City / State</th>
                <th className='px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase'>Leaders</th>
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
                    {searchTerm ? 'No records found matching your search' : 'No samaj records available'}
                  </td>
                </tr>
              ) : (
                filteredList.map((samaj, index) => (
                  <tr key={samaj._id} className='hover:bg-gray-50 transition-colors'>
                    <td className='px-4 py-3 text-sm text-gray-600'>{index + 1}</td>
                    <td className='px-4 py-3 text-sm font-semibold text-gray-800'>{samaj.samajName}</td>
                    <td className='px-4 py-3 text-sm text-gray-600'>{samaj.mobile || '—'}</td>
                    <td className='px-4 py-3 text-sm text-gray-600'>{[samaj.city, samaj.state].filter(Boolean).join(', ') || '—'}</td>
                    <td className='px-4 py-3 text-sm text-center text-gray-600'>{samaj.leaders?.length || 0}</td>
                    <td className='px-4 py-3'>
                      <button
                        onClick={() => handleToggleStatus(samaj._id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          samaj.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } transition`}
                      >
                        {samaj.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center justify-center gap-2'>
                        <button
                          onClick={() => openEditModal(samaj)}
                          className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition'
                        >Edit</button>
                        <button
                          onClick={() => handleDelete(samaj._id, samaj.samajName)}
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
