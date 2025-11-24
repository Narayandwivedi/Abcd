import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [formData, setFormData] = useState({ name: '', icon: '', description: '', subcategories: [] })
  const [subcategoryFormData, setSubcategoryFormData] = useState({ name: '' })
  const [tempSubcategory, setTempSubcategory] = useState('')
  const [editingSubcategory, setEditingSubcategory] = useState(null)
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, totalSubcategories: 0 })

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/admin/categories`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        setCategories(data.categories)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.icon.trim()) {
      toast.warning('Name and icon are required')
      return
    }

    // Filter out empty subcategories
    const validSubcategories = formData.subcategories.filter(s => s && s.trim())

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/categories`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          icon: formData.icon,
          description: formData.description
        }),
      })
      const data = await response.json()

      if (data.success) {
        // Add subcategories if any
        if (validSubcategories.length > 0) {
          for (const subcat of validSubcategories) {
            await fetch(`${BACKEND_URL}/api/admin/categories/${data.category._id}/subcategories`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name: subcat }),
            })
          }
        }

        toast.success(`Category added successfully with ${validSubcategories.length} subcategories!`)
        setShowAddModal(false)
        setFormData({ name: '', icon: '', description: '', subcategories: [] })
        fetchCategories()
      } else {
        toast.error(data.message || 'Failed to add category')
      }
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Failed to add category')
    }
  }

  const handleEditCategory = async (e) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.icon.trim()) {
      toast.warning('Name and icon are required')
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/categories/${selectedCategory._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          icon: formData.icon,
          description: formData.description
        }),
      })
      const data = await response.json()

      if (data.success) {
        // Add new subcategories that weren't in the original list
        const existingSubcategories = selectedCategory.subcategories.map(sub => sub.name)
        const newSubcategories = formData.subcategories
          .filter(subcat => subcat && subcat.trim()) // Filter out empty
          .filter(subcat => !existingSubcategories.includes(subcat))

        if (newSubcategories.length > 0) {
          for (const subcat of newSubcategories) {
            await fetch(`${BACKEND_URL}/api/admin/categories/${selectedCategory._id}/subcategories`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name: subcat }),
            })
          }
        }

        toast.success(`Category updated! ${newSubcategories.length} new subcategories added.`)
        setShowEditModal(false)
        setSelectedCategory(null)
        setFormData({ name: '', icon: '', description: '', subcategories: [] })
        fetchCategories()
      } else {
        toast.error(data.message || 'Failed to update category')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Failed to update category')
    }
  }

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"? This will also delete all subcategories.`)) return

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        toast.success('Category deleted successfully!')
        fetchCategories()
      } else {
        toast.error(data.message || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    }
  }

  const handleToggleStatus = async (categoryId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/categories/${categoryId}/toggle-status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (data.success) {
        toast.success(`Category ${data.category.isActive ? 'activated' : 'deactivated'} successfully!`)
        fetchCategories()
      } else {
        toast.error(data.message || 'Failed to toggle status')
      }
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error('Failed to toggle status')
    }
  }

  const openEditModal = (category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      icon: category.icon,
      description: category.description || '',
      subcategories: category.subcategories.map(sub => sub.name) || []
    })
    setTempSubcategory('')
    setShowEditModal(true)
  }

  const addSubcategoryToList = () => {
    if (!tempSubcategory.trim()) {
      toast.warning('Subcategory name cannot be empty')
      return
    }

    if (formData.subcategories.includes(tempSubcategory.trim())) {
      toast.warning('Subcategory already added')
      return
    }

    setFormData({
      ...formData,
      subcategories: [...formData.subcategories, tempSubcategory.trim()]
    })
    setTempSubcategory('')
  }

  const removeSubcategoryFromList = (subcatName) => {
    setFormData({
      ...formData,
      subcategories: formData.subcategories.filter(s => s !== subcatName)
    })
  }

  const addEmptySubcategory = () => {
    setFormData({
      ...formData,
      subcategories: [...formData.subcategories, '']
    })
  }

  const updateSubcategoryAtIndex = (index, value) => {
    const newSubcategories = [...formData.subcategories]
    newSubcategories[index] = value
    setFormData({
      ...formData,
      subcategories: newSubcategories
    })
  }

  const removeSubcategoryAtIndex = (index) => {
    setFormData({
      ...formData,
      subcategories: formData.subcategories.filter((_, i) => i !== index)
    })
  }

  const openSubcategoryModal = (category) => {
    setSelectedCategory(category)
    setSubcategoryFormData({ name: '' })
    setEditingSubcategory(null)
    setShowSubcategoryModal(true)
  }

  const handleAddSubcategory = async (e) => {
    e.preventDefault()

    if (!subcategoryFormData.name.trim()) {
      toast.warning('Subcategory name is required')
      return
    }

    try {
      const url = editingSubcategory
        ? `${BACKEND_URL}/api/admin/categories/${selectedCategory._id}/subcategories/${editingSubcategory._id}`
        : `${BACKEND_URL}/api/admin/categories/${selectedCategory._id}/subcategories`

      const response = await fetch(url, {
        method: editingSubcategory ? 'PUT' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subcategoryFormData),
      })
      const data = await response.json()

      if (data.success) {
        toast.success(editingSubcategory ? 'Subcategory updated successfully!' : 'Subcategory added successfully!')
        setSubcategoryFormData({ name: '' })
        setEditingSubcategory(null)
        fetchCategories()

        // Update the selected category with the new data
        setSelectedCategory(data.category)
      } else {
        toast.error(data.message || 'Failed to save subcategory')
      }
    } catch (error) {
      console.error('Error saving subcategory:', error)
      toast.error('Failed to save subcategory')
    }
  }

  const handleDeleteSubcategory = async (subcategoryId, subcategoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${subcategoryName}"?`)) return

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/admin/categories/${selectedCategory._id}/subcategories/${subcategoryId}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()

      if (data.success) {
        toast.success('Subcategory deleted successfully!')
        fetchCategories()
        // Update the selected category
        setSelectedCategory(data.category)
      } else {
        toast.error(data.message || 'Failed to delete subcategory')
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error)
      toast.error('Failed to delete subcategory')
    }
  }

  const editSubcategory = (subcategory) => {
    setEditingSubcategory(subcategory)
    setSubcategoryFormData({ name: subcategory.name })
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='p-3 md:p-6'>
      {/* Header */}
      <div className='mb-4 md:mb-6'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>Categories Management</h1>
        <p className='text-sm md:text-base text-gray-600'>Manage all categories and subcategories</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6'>
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg'>
          <div className='text-xs md:text-sm font-semibold opacity-90'>Total Categories</div>
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
          <div className='text-xs md:text-sm font-semibold opacity-90'>Subcategories</div>
          <div className='text-2xl md:text-3xl font-bold mt-1'>{stats.totalSubcategories}</div>
        </div>
      </div>

      {/* Search and Add */}
      <div className='bg-white rounded-xl shadow-md p-4 mb-4'>
        <div className='flex flex-col md:flex-row gap-3 md:items-center justify-between'>
          <div className='flex-1'>
            <input
              type='text'
              placeholder='Search categories...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <button
            onClick={() => {
              setFormData({ name: '', icon: '', description: '', subcategories: [] })
              setTempSubcategory('')
              setShowAddModal(true)
            }}
            className='bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md flex items-center justify-center gap-2'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            Add Category
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {loading ? (
          <div className='col-span-full flex items-center justify-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className='col-span-full text-center py-12 text-gray-500'>
            {searchTerm ? 'No categories found matching your search' : 'No categories available'}
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category._id} className='bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow'>
              <div className='flex items-start justify-between mb-3'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center'>
                    <span className='text-2xl font-bold text-blue-600'>{category.icon.substring(0, 2)}</span>
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-gray-800'>{category.name}</h3>
                    <p className='text-xs text-gray-500'>/{category.slug}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleStatus(category._id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    category.isActive
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } transition`}
                >
                  {category.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              {category.description && (
                <p className='text-sm text-gray-600 mb-3'>{category.description}</p>
              )}

              {/* Subcategories */}
              <div className='mb-3'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm font-semibold text-gray-700'>
                    Subcategories ({category.subcategories.length})
                  </span>
                  <button
                    onClick={() => openSubcategoryModal(category)}
                    className='text-xs text-blue-600 hover:text-blue-700 font-semibold'
                  >
                    Manage
                  </button>
                </div>
                {category.subcategories.length > 0 && (
                  <div className='flex flex-wrap gap-1'>
                    {category.subcategories.slice(0, 3).map((sub) => (
                      <span key={sub._id} className='bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs'>
                        {sub.name}
                      </span>
                    ))}
                    {category.subcategories.length > 3 && (
                      <span className='text-xs text-gray-500 px-2 py-1'>
                        +{category.subcategories.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className='flex gap-2'>
                <button
                  onClick={() => openEditModal(category)}
                  className='flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(category._id, category.name)}
                  className='flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition'
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-gray-800'>Add New Category</h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setTempSubcategory('')
                }}
                className='text-gray-400 hover:text-gray-600 transition'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddCategory} className='space-y-4 max-h-[80vh] overflow-y-auto pr-2'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Category Name *</label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder='e.g., Advocates, Electronics, Doctors'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
                <p className='text-xs text-gray-500 mt-1'>Main category name - slug auto-generated</p>
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Icon Name *</label>
                <input
                  type='text'
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder='e.g., Scale, Smartphone, Stethoscope'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
                <p className='text-xs text-gray-500 mt-1'>Lucide-react icon name</p>
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='Brief description of this category'
                  rows={2}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              {/* Subcategories Section */}
              <div className='border-t-2 border-gray-200 pt-4'>
                <div className='mb-3'>
                  <label className='block text-sm font-bold text-gray-800 mb-1'>
                    📋 Subcategories (Optional)
                  </label>
                  <p className='text-xs text-gray-600 mb-2'>
                    Add specific types under this category. Examples:
                    <br />
                    <span className='font-semibold'>Advocates:</span> Criminal Lawyer, Corporate Lawyer, Family Lawyer
                    <br />
                    <span className='font-semibold'>Doctors:</span> Cardiologist, Dentist, Pediatrician
                  </p>
                </div>

                {formData.subcategories.length > 0 ? (
                  <div className='space-y-2 mb-3 max-h-64 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg p-3'>
                    {formData.subcategories.map((subcat, index) => (
                      <div
                        key={index}
                        className='flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-2 hover:border-blue-400 transition'
                      >
                        <span className='bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded min-w-[32px] text-center'>
                          {index + 1}
                        </span>
                        <input
                          type='text'
                          value={subcat}
                          onChange={(e) => updateSubcategoryAtIndex(index, e.target.value)}
                          placeholder={`Subcategory ${index + 1} (e.g., Criminal Lawyer)`}
                          className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                        <button
                          type='button'
                          onClick={() => removeSubcategoryAtIndex(index)}
                          className='bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition flex items-center gap-1'
                          title='Remove'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                          </svg>
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-4 mb-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg'>
                    <p className='text-sm text-gray-500'>No subcategories added yet</p>
                    <p className='text-xs text-gray-400 mt-1'>Click "Add Subcategory" button below to start</p>
                  </div>
                )}

                <button
                  type='button'
                  onClick={addEmptySubcategory}
                  className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 px-4 rounded-lg font-semibold transition shadow-md flex items-center justify-center gap-2'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                  </svg>
                  Add Subcategory
                </button>
              </div>

              <div className='flex gap-3 mt-6'>
                <button
                  type='button'
                  onClick={() => {
                    setShowAddModal(false)
                    setTempSubcategory('')
                  }}
                  className='flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition shadow-md'
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-gray-800'>Edit Category</h2>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedCategory(null)
                  setTempSubcategory('')
                }}
                className='text-gray-400 hover:text-gray-600 transition'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditCategory} className='space-y-4 max-h-[80vh] overflow-y-auto pr-2'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Category Name *</label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder='e.g., Advocates, Electronics, Doctors'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
                <p className='text-xs text-gray-500 mt-1'>Main category name - slug auto-generated</p>
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Icon Name *</label>
                <input
                  type='text'
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder='e.g., Scale, Smartphone, Stethoscope'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
                <p className='text-xs text-gray-500 mt-1'>Lucide-react icon name</p>
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='Brief description of this category'
                  rows={2}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              {/* Subcategories Section */}
              <div className='border-t-2 border-gray-200 pt-4'>
                <div className='mb-3'>
                  <label className='block text-sm font-bold text-gray-800 mb-1'>
                    📋 Manage Subcategories
                  </label>
                </div>

                {/* Existing Subcategories from Database */}
                {selectedCategory && selectedCategory.subcategories.length > 0 && (
                  <div className='mb-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm font-semibold text-blue-700'>
                        💾 Saved Subcategories ({selectedCategory.subcategories.length})
                      </span>
                      <span className='text-xs text-gray-500'>
                        Use "Manage" button on card to edit/delete
                      </span>
                    </div>
                    <div className='space-y-2 bg-blue-50 border border-blue-200 rounded-lg p-3 max-h-48 overflow-y-auto'>
                      {selectedCategory.subcategories.map((sub, index) => (
                        <div
                          key={sub._id}
                          className='flex items-center gap-2 bg-white border border-blue-300 rounded-lg p-2'
                        >
                          <span className='bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded min-w-[32px] text-center'>
                            {index + 1}
                          </span>
                          <input
                            type='text'
                            value={sub.name}
                            disabled
                            className='flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed'
                          />
                          <button
                            type='button'
                            onClick={() => {
                              setShowEditModal(false)
                              openSubcategoryModal(selectedCategory)
                            }}
                            className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition text-xs font-semibold'
                          >
                            ✏️ Edit
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Subcategories to Add */}
                <div className='mb-3'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm font-semibold text-green-700'>
                      ➕ New Subcategories to Add ({formData.subcategories.filter(subcat => !selectedCategory?.subcategories.some(s => s.name === subcat)).length})
                    </span>
                    {formData.subcategories.filter(subcat => !selectedCategory?.subcategories.some(s => s.name === subcat)).length > 0 && (
                      <button
                        type='button'
                        onClick={() => setFormData({ ...formData, subcategories: selectedCategory.subcategories.map(sub => sub.name) })}
                        className='text-xs text-red-600 hover:text-red-700 font-semibold'
                      >
                        Clear All New
                      </button>
                    )}
                  </div>

                  {formData.subcategories.filter(subcat => !selectedCategory?.subcategories.some(s => s.name === subcat)).length > 0 ? (
                    <div className='space-y-2 mb-3 max-h-64 overflow-y-auto bg-green-50 border border-green-200 rounded-lg p-3'>
                      {formData.subcategories
                        .filter(subcat => !selectedCategory?.subcategories.some(s => s.name === subcat))
                        .map((subcat, index) => {
                          const actualIndex = formData.subcategories.findIndex(s => s === subcat)
                          return (
                            <div
                              key={index}
                              className='flex items-center gap-2 bg-white border border-green-300 rounded-lg p-2 hover:border-green-500 transition'
                            >
                              <span className='bg-green-600 text-white text-xs font-bold px-2 py-1 rounded'>
                                NEW
                              </span>
                              <input
                                type='text'
                                value={subcat}
                                onChange={(e) => updateSubcategoryAtIndex(actualIndex, e.target.value)}
                                placeholder={`New subcategory ${index + 1}`}
                                className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                              />
                              <button
                                type='button'
                                onClick={() => removeSubcategoryAtIndex(actualIndex)}
                                className='bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition flex items-center gap-1'
                                title='Remove'
                              >
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                </svg>
                                Delete
                              </button>
                            </div>
                          )
                        })}
                    </div>
                  ) : (
                    <div className='text-center py-4 mb-3 bg-green-50 border border-dashed border-green-300 rounded-lg'>
                      <p className='text-sm text-gray-500'>No new subcategories to add</p>
                      <p className='text-xs text-gray-400 mt-1'>Click "Add Subcategory" button below to add new ones</p>
                    </div>
                  )}

                  <button
                    type='button'
                    onClick={addEmptySubcategory}
                    className='w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2.5 px-4 rounded-lg font-semibold transition shadow-md flex items-center justify-center gap-2'
                  >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                    </svg>
                    Add Subcategory
                  </button>
                </div>
              </div>

              <div className='flex gap-3 mt-6'>
                <button
                  type='button'
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedCategory(null)
                    setTempSubcategory('')
                  }}
                  className='flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition shadow-md'
                >
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcategory Management Modal */}
      {showSubcategoryModal && selectedCategory && (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-gray-800'>
                Manage Subcategories - {selectedCategory.name}
              </h2>
              <button
                onClick={() => {
                  setShowSubcategoryModal(false)
                  setSelectedCategory(null)
                  setEditingSubcategory(null)
                }}
                className='text-gray-400 hover:text-gray-600 transition'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            {/* Add/Edit Subcategory Form */}
            <form onSubmit={handleAddSubcategory} className='mb-6 bg-gray-50 p-4 rounded-lg'>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                {editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
              </label>
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={subcategoryFormData.name}
                  onChange={(e) => setSubcategoryFormData({ name: e.target.value })}
                  placeholder='e.g., Mobile Phones'
                  className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
                {editingSubcategory && (
                  <button
                    type='button'
                    onClick={() => {
                      setEditingSubcategory(null)
                      setSubcategoryFormData({ name: '' })
                    }}
                    className='px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-semibold transition'
                  >
                    Cancel
                  </button>
                )}
                <button
                  type='submit'
                  className='px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition shadow-md'
                >
                  {editingSubcategory ? 'Update' : 'Add'}
                </button>
              </div>
              <p className='text-xs text-gray-500 mt-1'>Slug will be auto-generated from name</p>
            </form>

            {/* Subcategories List */}
            <div className='space-y-2'>
              <h3 className='text-sm font-semibold text-gray-700 mb-3'>
                Subcategories ({selectedCategory.subcategories.length})
              </h3>
              {selectedCategory.subcategories.length === 0 ? (
                <p className='text-center text-gray-500 py-4'>No subcategories yet</p>
              ) : (
                selectedCategory.subcategories.map((sub) => (
                  <div
                    key={sub._id}
                    className='flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition'
                  >
                    <div>
                      <h4 className='font-semibold text-gray-800'>{sub.name}</h4>
                      <p className='text-xs text-gray-500'>/{sub.slug}</p>
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => editSubcategory(sub)}
                        className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold transition'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSubcategory(sub._id, sub.name)}
                        className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold transition'
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories
