import { useState, useEffect, useRef } from 'react'

const MultiCategorySelector = ({
  value = [], // Array of selected category-subcategory pairs
  onChange,
  className = '',
  required = false,
}) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  // Fetch all categories from API
  const fetchAllCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/admin/categories`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (result.success) {
        setCategories(result.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllCategories()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSelectedCategoryId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Check if a subcategory is already selected
  const isSubcategorySelected = (categoryId, subcategoryId) => {
    return value.some(
      (item) => item.categoryId === categoryId && item.subcategoryId === subcategoryId
    )
  }

  // Add or remove subcategory selection
  const toggleSubcategory = (category, subcategory) => {
    const isSelected = isSubcategorySelected(category._id, subcategory._id)

    if (isSelected) {
      // Remove from selection
      const newValue = value.filter(
        (item) => !(item.categoryId === category._id && item.subcategoryId === subcategory._id)
      )
      onChange(newValue)
    } else {
      // Add to selection
      const newValue = [
        ...value,
        {
          categoryId: category._id,
          subcategoryId: subcategory._id,
          categoryName: category.name,
          subcategoryName: subcategory.name,
        },
      ]
      onChange(newValue)
    }
  }

  // Remove a selected item
  const removeItem = (categoryId, subcategoryId) => {
    const newValue = value.filter(
      (item) => !(item.categoryId === categoryId && item.subcategoryId === subcategoryId)
    )
    onChange(newValue)
  }

  // Filter categories based on search
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get unique category count
  const uniqueCategoryCount = new Set(value.map((item) => item.categoryId)).size

  return (
    <div className='space-y-2'>
      <style>{`
        .scrollbar-custom::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>

      <label className='block text-sm font-medium text-gray-700'>
        Business Categories & Subcategories {required && '*'}
      </label>

      {/* Selected Items Display */}
      {value.length > 0 && (
        <div className='flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200'>
          {value.map((item, index) => (
            <div
              key={`${item.categoryId}-${item.subcategoryId}-${index}`}
              className='inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium'
            >
              <span className='font-semibold'>{item.categoryName}</span>
              <span className='text-blue-600'>→</span>
              <span>{item.subcategoryName}</span>
              <button
                onClick={() => removeItem(item.categoryId, item.subcategoryId)}
                className='ml-1 p-0.5 hover:bg-blue-200 rounded-full transition-colors'
                type='button'
              >
                <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Selection Stats */}
      <div className='flex items-center gap-4 text-xs text-gray-600'>
        <span className='flex items-center gap-1'>
          <span className='font-semibold text-blue-600'>{uniqueCategoryCount}</span>
          {uniqueCategoryCount === 1 ? 'Category' : 'Categories'}
        </span>
        <span className='flex items-center gap-1'>
          <span className='font-semibold text-purple-600'>{value.length}</span>
          {value.length === 1 ? 'Subcategory' : 'Subcategories'}
        </span>
      </div>

      {/* Add More Button */}
      <div ref={dropdownRef} className='relative'>
        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 bg-white border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-blue-400 hover:text-blue-600 transition flex items-center justify-center gap-2 font-medium ${className}`}
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          {value.length === 0 ? 'Select Categories & Subcategories' : 'Add More'}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className='absolute z-[9999] w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-2xl overflow-hidden'>
            {/* Search Input */}
            <div className='p-3 border-b border-gray-200 bg-gray-50'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search categories...'
                className='w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>

            {/* Categories and Subcategories List */}
            <div className='max-h-96 overflow-y-auto scrollbar-custom'>
              {loading ? (
                <div className='px-4 py-8 text-center'>
                  <div className='inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-2'></div>
                  <p className='text-sm text-gray-500'>Loading categories...</p>
                </div>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <div key={category._id} className='border-b border-gray-100 last:border-b-0'>
                    {/* Category Header */}
                    <div
                      className={`px-4 py-3 bg-gradient-to-r from-gray-50 to-white cursor-pointer hover:from-blue-50 hover:to-blue-50 transition-colors ${
                        selectedCategoryId === category._id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() =>
                        setSelectedCategoryId(selectedCategoryId === category._id ? null : category._id)
                      }
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              selectedCategoryId === category._id ? 'rotate-90' : ''
                            }`}
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                          </svg>
                          <span className='font-semibold text-gray-800'>{category.name}</span>
                        </div>
                        <span className='text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full'>
                          {category.subcategories.length} subcategories
                        </span>
                      </div>
                    </div>

                    {/* Subcategories List */}
                    {selectedCategoryId === category._id && (
                      <div className='bg-gray-50'>
                        {category.subcategories.map((subcategory) => {
                          const isSelected = isSubcategorySelected(category._id, subcategory._id)
                          return (
                            <div
                              key={subcategory._id}
                              onClick={() => toggleSubcategory(category, subcategory)}
                              className={`px-8 py-2.5 cursor-pointer transition-colors flex items-center justify-between ${
                                isSelected
                                  ? 'bg-blue-100 text-blue-800 font-medium'
                                  : 'text-gray-700 hover:bg-white'
                              }`}
                            >
                              <span className='text-sm'>{subcategory.name}</span>
                              {isSelected && (
                                <svg className='w-4 h-4 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                                  <path
                                    fillRule='evenodd'
                                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className='px-4 py-6 text-center text-gray-500 text-sm'>No categories found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {value.length === 0 && required && (
        <p className='text-xs text-red-500 mt-1'>Please select at least one category and subcategory</p>
      )}
    </div>
  )
}

export default MultiCategorySelector
