import { useState, useEffect, useRef } from 'react'

const CategoryDropdown = ({
  value,
  onChange,
  onSubcategoryChange,
  subcategoryValue,
  className = '',
  placeholder = 'Select Category',
  subcategoryPlaceholder = 'Select Sub Category',
  required = false,
  showSubcategory = true
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [subcategorySearchQuery, setSubcategorySearchQuery] = useState('')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [subcategoryHighlightedIndex, setSubcategoryHighlightedIndex] = useState(-1)
  const dropdownRef = useRef(null)
  const subcategoryDropdownRef = useRef(null)
  const categoriesListRef = useRef(null)
  const subcategoriesListRef = useRef(null)

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  // Fetch all categories from API
  const fetchAllCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${BACKEND_URL}/api/admin/categories`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

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

  // Initial load when dropdown opens
  useEffect(() => {
    if (isOpen && categories.length === 0) {
      fetchAllCategories()
    }
  }, [isOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
      if (isSubcategoryOpen && subcategoryDropdownRef.current && !subcategoryDropdownRef.current.contains(event.target)) {
        setIsSubcategoryOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, isSubcategoryOpen])

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get subcategories for selected category
  const selectedCategory = categories.find(cat => cat.name === value)
  const subcategories = selectedCategory?.subcategories || []

  const filteredSubcategories = subcategories.filter((subcat) =>
    subcat.name.toLowerCase().includes(subcategorySearchQuery.toLowerCase())
  )

  const handleCategorySelect = (categoryName) => {
    console.log('Category selected:', categoryName)
    console.log('onChange function:', onChange)
    console.log('Current value:', value)

    if (onChange && typeof onChange === 'function') {
      onChange(categoryName)
      console.log('onChange called successfully')
    } else {
      console.error('onChange is not a function!')
    }

    if (onSubcategoryChange) {
      onSubcategoryChange('') // Reset subcategory when category changes
    }
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleSubcategorySelect = (subcategoryName) => {
    if (onSubcategoryChange) {
      onSubcategoryChange(subcategoryName)
    }
    setIsSubcategoryOpen(false)
    setSubcategorySearchQuery('')
  }

  const handleClearCategory = (e) => {
    e.stopPropagation()
    onChange('')
    if (onSubcategoryChange) {
      onSubcategoryChange('')
    }
  }

  const handleClearSubcategory = (e) => {
    e.stopPropagation()
    if (onSubcategoryChange) {
      onSubcategoryChange('')
    }
  }

  const displayValue = value || placeholder
  const displaySubcategoryValue = subcategoryValue || subcategoryPlaceholder

  // Debug logging
  useEffect(() => {
    console.log('CategoryDropdown - value changed:', value)
    console.log('CategoryDropdown - displayValue:', displayValue)
  }, [value, displayValue])

  // Reset highlighted index when search query changes
  useEffect(() => {
    setHighlightedIndex(-1)
  }, [searchQuery])

  useEffect(() => {
    setSubcategoryHighlightedIndex(-1)
  }, [subcategorySearchQuery])

  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isSubcategoryOpen) {
      setSubcategoryHighlightedIndex(-1)
    }
  }, [isSubcategoryOpen])

  // Handle keyboard navigation for category
  const handleKeyDown = (e) => {
    if (!isOpen) return

    const itemCount = filteredCategories.length

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => {
          const nextIndex = prev < itemCount - 1 ? prev + 1 : prev
          scrollToHighlighted(nextIndex, categoriesListRef)
          return nextIndex
        })
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => {
          const nextIndex = prev > 0 ? prev - 1 : 0
          scrollToHighlighted(nextIndex, categoriesListRef)
          return nextIndex
        })
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < itemCount) {
          handleCategorySelect(filteredCategories[highlightedIndex].name)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        break
      default:
        break
    }
  }

  // Handle keyboard navigation for subcategory
  const handleSubcategoryKeyDown = (e) => {
    if (!isSubcategoryOpen) return

    const itemCount = filteredSubcategories.length

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSubcategoryHighlightedIndex((prev) => {
          const nextIndex = prev < itemCount - 1 ? prev + 1 : prev
          scrollToHighlighted(nextIndex, subcategoriesListRef)
          return nextIndex
        })
        break
      case 'ArrowUp':
        e.preventDefault()
        setSubcategoryHighlightedIndex((prev) => {
          const nextIndex = prev > 0 ? prev - 1 : 0
          scrollToHighlighted(nextIndex, subcategoriesListRef)
          return nextIndex
        })
        break
      case 'Enter':
        e.preventDefault()
        if (subcategoryHighlightedIndex >= 0 && subcategoryHighlightedIndex < itemCount) {
          handleSubcategorySelect(filteredSubcategories[subcategoryHighlightedIndex].name)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsSubcategoryOpen(false)
        break
      default:
        break
    }
  }

  // Scroll to highlighted item
  const scrollToHighlighted = (index, listRef) => {
    if (listRef.current) {
      const items = listRef.current.children
      if (items[index]) {
        items[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }

  return (
    <div className='space-y-4'>
      {/* Custom Scrollbar Styles */}
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

      {/* Category Dropdown */}
      <div ref={dropdownRef} className='relative' onKeyDown={handleKeyDown}>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Category *</label>

        {/* Dropdown Trigger */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-2 bg-white border-2 border-gray-200 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm cursor-pointer flex items-center justify-between ${className}`}
        >
          <span className={`truncate pr-2 ${!value ? 'text-gray-400' : ''}`}>{displayValue}</span>
          <div className='flex items-center gap-1'>
            {value && (
              <button
                onClick={handleClearCategory}
                className='p-1 hover:bg-gray-200 rounded-full transition-colors'
                title='Clear selection'
              >
                <svg className='w-4 h-4 text-gray-500 hover:text-gray-700' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            )}
            <svg
              className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className='absolute z-[9999] w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-2xl max-h-96 overflow-hidden flex flex-col'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className='p-3 border-b border-gray-200 sticky top-0 bg-white'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search category...'
                className='w-full px-3 py-2 rounded-md border bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>

            {/* Categories List */}
            <div
              ref={categoriesListRef}
              className='overflow-y-auto max-h-80 scroll-smooth scrollbar-custom'
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#9ca3af #f3f4f6'
              }}
            >
              {loading ? (
                <div className='px-4 py-8 text-center'>
                  <div className='inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-2'></div>
                  <p className='text-sm text-gray-500'>Loading categories...</p>
                </div>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <div
                    key={category._id}
                    onClick={() => handleCategorySelect(category.name)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-4 py-2.5 cursor-pointer transition-colors text-sm ${
                      value === category.name
                        ? 'bg-blue-100 text-blue-800 font-medium'
                        : highlightedIndex === index
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <span className='font-medium'>{category.name}</span>
                      <span className='text-xs text-gray-500'>{category.subcategories.length} sub</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className='px-4 py-6 text-center text-gray-500 text-sm'>
                  No categories found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Subcategory Dropdown */}
      {showSubcategory && (
        <div ref={subcategoryDropdownRef} className='relative' onKeyDown={handleSubcategoryKeyDown}>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Sub Category *</label>

          {/* Dropdown Trigger */}
          <div
            onClick={() => value && setIsSubcategoryOpen(!isSubcategoryOpen)}
            className={`w-full px-4 py-2 bg-white border-2 border-gray-200 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm cursor-pointer flex items-center justify-between ${
              !value ? 'opacity-50 cursor-not-allowed' : ''
            } ${className}`}
          >
            <span className={`truncate pr-2 ${!subcategoryValue ? 'text-gray-400' : ''}`}>
              {displaySubcategoryValue}
            </span>
            <div className='flex items-center gap-1'>
              {subcategoryValue && (
                <button
                  onClick={handleClearSubcategory}
                  className='p-1 hover:bg-gray-200 rounded-full transition-colors'
                  title='Clear selection'
                >
                  <svg className='w-4 h-4 text-gray-500 hover:text-gray-700' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              )}
              <svg
                className={`w-5 h-5 transition-transform ${isSubcategoryOpen ? 'transform rotate-180' : ''}`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </div>
          </div>

          {!value && (
            <p className='text-xs text-gray-500 mt-1'>Please select a category first</p>
          )}

          {/* Dropdown Menu */}
          {isSubcategoryOpen && value && (
            <div
              className='absolute z-[9999] w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-2xl max-h-96 overflow-hidden flex flex-col'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className='p-3 border-b border-gray-200 sticky top-0 bg-white'>
                <input
                  type='text'
                  value={subcategorySearchQuery}
                  onChange={(e) => setSubcategorySearchQuery(e.target.value)}
                  placeholder='Search subcategory...'
                  className='w-full px-3 py-2 rounded-md border bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>

              {/* Subcategories List */}
              <div
                ref={subcategoriesListRef}
                className='overflow-y-auto max-h-80 scroll-smooth scrollbar-custom'
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#9ca3af #f3f4f6'
                }}
              >
                {filteredSubcategories.length > 0 ? (
                  filteredSubcategories.map((subcat, index) => (
                    <div
                      key={subcat._id}
                      onClick={() => handleSubcategorySelect(subcat.name)}
                      onMouseEnter={() => setSubcategoryHighlightedIndex(index)}
                      className={`px-4 py-2.5 cursor-pointer transition-colors text-sm ${
                        subcategoryValue === subcat.name
                          ? 'bg-blue-100 text-blue-800 font-medium'
                          : subcategoryHighlightedIndex === index
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {subcat.name}
                    </div>
                  ))
                ) : (
                  <div className='px-4 py-6 text-center text-gray-500 text-sm'>
                    No subcategories found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CategoryDropdown
