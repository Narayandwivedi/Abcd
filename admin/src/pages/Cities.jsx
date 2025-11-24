import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const Cities = () => {
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCity, setSelectedCity] = useState(null)
  const [formData, setFormData] = useState({ state: '', district: '', city: '' })
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, districts: 0 })
  const [sortBy, setSortBy] = useState('city')
  const [sortOrder, setSortOrder] = useState('asc')

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  useEffect(() => {
    fetchCities()
  }, [sortBy, sortOrder])

  const fetchCities = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${BACKEND_URL}/api/admin/cities?sortBy=${sortBy}&order=${sortOrder}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()

      if (data.success) {
        setCities(data.cities)
        calculateStats(data.cities, data.districtCount)
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
      toast.error('Failed to fetch cities')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (cityList, districtCount) => {
    const total = cityList.length
    const active = cityList.filter(c => c.isActive).length
    const inactive = cityList.filter(c => !c.isActive).length

    setStats({ total, active, inactive, districts: districtCount })
  }

  const handleAddCity = async (e) => {
    e.preventDefault()

    if (!formData.state.trim() || !formData.district.trim() || !formData.city.trim()) {
      toast.warning('State, district and city are required')
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/cities`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()

      if (data.success) {
        toast.success('City added successfully!')
        setShowAddModal(false)
        setFormData({ state: '', district: '', city: '' })
        fetchCities()
      } else {
        toast.error(data.message || 'Failed to add city')
      }
    } catch (error) {
      console.error('Error adding city:', error)
      toast.error('Failed to add city')
    }
  }

  const handleEditCity = async (e) => {
    e.preventDefault()

    if (!formData.state.trim() || !formData.district.trim() || !formData.city.trim()) {
      toast.warning('State, district and city are required')
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/cities/${selectedCity._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()

      if (data.success) {
        toast.success('City updated successfully!')
        setShowEditModal(false)
        setSelectedCity(null)
        setFormData({ state: '', district: '', city: '' })
        fetchCities()
      } else {
        toast.error(data.message || 'Failed to update city')
      }
    } catch (error) {
      console.error('Error updating city:', error)
      toast.error('Failed to update city')
    }
  }

  const handleDeleteCity = async (cityId, cityName) => {
    if (!window.confirm(`Are you sure you want to delete "${cityName}"?`)) return

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/cities/${cityId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        toast.success('City deleted successfully!')
        fetchCities()
      } else {
        toast.error(data.message || 'Failed to delete city')
      }
    } catch (error) {
      console.error('Error deleting city:', error)
      toast.error('Failed to delete city')
    }
  }

  const handleToggleStatus = async (cityId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/cities/${cityId}/toggle-status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        toast.success(`City ${data.city.isActive ? 'activated' : 'deactivated'} successfully!`)
        fetchCities()
      } else {
        toast.error(data.message || 'Failed to toggle status')
      }
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error('Failed to toggle status')
    }
  }

  const openEditModal = (city) => {
    setSelectedCity(city)
    setFormData({ state: city.state, district: city.district, city: city.city })
    setShowEditModal(true)
  }

  const filteredCities = cities.filter(
    city =>
      city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (city.state && city.state.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className='p-3 md:p-6'>
      {/* Header */}
      <div className='mb-4 md:mb-6'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>Cities Management</h1>
        <p className='text-sm md:text-base text-gray-600'>Manage all cities and districts</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6'>
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-xs md:text-sm font-semibold opacity-90'>Total Cities</div>
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
        <div className='bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-xs md:text-sm font-semibold opacity-90'>Districts</div>
          <div className='text-2xl md:text-3xl font-bold mt-1'>{stats.districts}</div>
        </div>
      </div>

      {/* Search and Add */}
      <div className='bg-white rounded-xl shadow-md p-4 mb-4'>
        <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
          <div className='flex-1'>
            <input
              type='text'
              placeholder='Search by city, district or state...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <button
            onClick={() => {
              setFormData({ state: '', district: '', city: '' })
              setShowAddModal(true)
            }}
            className='bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md flex items-center justify-center gap-2'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            Add City
          </button>
        </div>
      </div>

      {/* Cities Table */}
      <div className='bg-white rounded-xl shadow-md overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>
                  #
                </th>
                <th
                  className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100'
                  onClick={() => handleSort('city')}
                >
                  <div className='flex items-center gap-1'>
                    City
                    {sortBy === 'city' && (
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100'
                  onClick={() => handleSort('district')}
                >
                  <div className='flex items-center gap-1'>
                    District
                    {sortBy === 'district' && (
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100'
                  onClick={() => handleSort('state')}
                >
                  <div className='flex items-center gap-1'>
                    State
                    {sortBy === 'state' && (
                      <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className='px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase'>
                  Status
                </th>
                <th className='px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {loading ? (
                <tr>
                  <td colSpan='6' className='px-4 py-8 text-center text-gray-500'>
                    <div className='flex items-center justify-center'>
                      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                      <span className='ml-3'>Loading cities...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCities.length === 0 ? (
                <tr>
                  <td colSpan='6' className='px-4 py-8 text-center text-gray-500'>
                    {searchTerm ? 'No cities found matching your search' : 'No cities available'}
                  </td>
                </tr>
              ) : (
                filteredCities.map((city, index) => (
                  <tr key={city._id} className='hover:bg-gray-50 transition-colors'>
                    <td className='px-4 py-3 text-sm text-gray-600'>{index + 1}</td>
                    <td className='px-4 py-3 text-sm font-semibold text-gray-800'>{city.city}</td>
                    <td className='px-4 py-3 text-sm text-gray-600'>{city.district}</td>
                    <td className='px-4 py-3 text-sm text-gray-600'>{city.state || 'N/A'}</td>
                    <td className='px-4 py-3'>
                      <button
                        onClick={() => handleToggleStatus(city._id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          city.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } transition`}
                      >
                        {city.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center justify-center gap-2'>
                        <button
                          onClick={() => openEditModal(city)}
                          className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition'
                          title='Edit'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCity(city._id, city.city)}
                          className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition'
                          title='Delete'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add City Modal */}
      {showAddModal && (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-gray-800'>Add New City</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className='text-gray-400 hover:text-gray-600 transition'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddCity} className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>State</label>
                <input
                  type='text'
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder='Enter state name'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>District</label>
                <input
                  type='text'
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder='Enter district name'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>City</label>
                <input
                  type='text'
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder='Enter city name'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div className='flex gap-3 mt-6'>
                <button
                  type='button'
                  onClick={() => setShowAddModal(false)}
                  className='flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition shadow-md'
                >
                  Add City
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit City Modal */}
      {showEditModal && (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-md w-full p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-gray-800'>Edit City</h2>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedCity(null)
                }}
                className='text-gray-400 hover:text-gray-600 transition'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditCity} className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>State</label>
                <input
                  type='text'
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder='Enter state name'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>District</label>
                <input
                  type='text'
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder='Enter district name'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>City</label>
                <input
                  type='text'
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder='Enter city name'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
              </div>
              <div className='flex gap-3 mt-6'>
                <button
                  type='button'
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedCity(null)
                  }}
                  className='flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition shadow-md'
                >
                  Update City
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cities
