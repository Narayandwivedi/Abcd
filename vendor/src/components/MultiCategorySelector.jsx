import { useState, useEffect, useRef } from 'react'
import { ChevronDown, X, Plus, ChevronRight } from 'lucide-react'

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
      const response = await fetch(`${BACKEND_URL}/api/categories`)

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
      <label className='block text-sm font-bold text-gray-700'>
        Business Categories & Subcategories {required && <span className='text-red-500'>*</span>}
      </label>

      {/* Selected Items Display */}
      {value.length > 0 && (
        <div className='flex flex-wrap gap-2 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-100'>
          {value.map((item, index) => (
            <div
              key={`${item.categoryId}-${item.subcategoryId}-${index}`}
              className='inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-indigo-200 text-indigo-800 rounded-lg text-xs sm:text-sm font-medium shadow-sm'
            >
              <span className='font-bold'>{item.categoryName}</span>
              <ChevronRight className='w-3 h-3 text-indigo-400' />
              <span>{item.subcategoryName}</span>
              <button
                onClick={() => removeItem(item.categoryId, item.subcategoryId)}
                className='ml-1 p-0.5 hover:bg-red-100 rounded-full transition-colors'
                type='button'
              >
                <X className='w-3.5 h-3.5 text-red-500' />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Selection Stats */}
      {value.length > 0 && (
        <div className='flex items-center gap-4 text-xs text-gray-600'>
          <span className='flex items-center gap-1'>
            <span className='font-bold text-indigo-600'>{uniqueCategoryCount}</span>
            {uniqueCategoryCount === 1 ? 'Category' : 'Categories'}
          </span>
          <span className='flex items-center gap-1'>
            <span className='font-bold text-purple-600'>{value.length}</span>
            {value.length === 1 ? 'Subcategory' : 'Subcategories'}
          </span>
        </div>
      )}

      {/* Add More Button */}
      <div ref={dropdownRef} className='relative'>
        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-dashed ${
            isOpen ? 'border-indigo-500' : 'border-indigo-300'
          } text-indigo-700 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all flex items-center justify-center gap-2 font-semibold text-sm sm:text-base ${className}`}
        >
          <Plus className='w-4 h-4 sm:w-5 sm:h-5' />
          {value.length === 0 ? 'Select Categories & Subcategories' : 'Add More Categories'}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className='absolute z-[9999] w-full mt-2 bg-white border-2 border-indigo-200 rounded-xl shadow-2xl overflow-hidden'>
            {/* Search Input */}
            <div className='p-3 border-b-2 border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search categories...'
                className='w-full px-3 py-2 rounded-lg border-2 border-indigo-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm'
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>

            {/* Categories and Subcategories List */}
            <div className='max-h-96 overflow-y-auto'>
              {loading ? (
                <div className='px-4 py-8 text-center'>
                  <div className='inline-block w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2'></div>
                  <p className='text-sm text-gray-500'>Loading categories...</p>
                </div>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <div key={category._id} className='border-b border-gray-100 last:border-b-0'>
                    {/* Category Header */}
                    <div
                      className={`px-4 py-3 cursor-pointer transition-all ${
                        selectedCategoryId === category._id
                          ? 'bg-gradient-to-r from-indigo-100 to-purple-100'
                          : 'hover:bg-indigo-50'
                      }`}
                      onClick={() =>
                        setSelectedCategoryId(selectedCategoryId === category._id ? null : category._id)
                      }
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <ChevronRight
                            className={`w-4 h-4 transition-transform ${
                              selectedCategoryId === category._id ? 'rotate-90' : ''
                            }`}
                          />
                          <span className='font-bold text-gray-800 text-sm sm:text-base'>{category.name}</span>
                        </div>
                        <span className='text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium'>
                          {category.subcategories.length} sub
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
                              className={`px-8 py-2.5 cursor-pointer transition-all flex items-center justify-between text-sm ${
                                isSelected
                                  ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-900 font-semibold border-l-4 border-indigo-500'
                                  : 'text-gray-700 hover:bg-white hover:pl-9'
                              }`}
                            >
                              <span>{subcategory.name}</span>
                              {isSelected && (
                                <svg className='w-5 h-5 text-indigo-600' fill='currentColor' viewBox='0 0 20 20'>
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
