import { useEffect, useMemo, useState } from 'react'

const CategoryDropdown = ({
  value,
  onChange,
  onSubcategoryChange,
  subcategoryValue,
  className = '',
  placeholder = 'Select Category',
  subcategoryPlaceholder = 'Select Sub Category',
  required = false,
  showSubcategory = true,
  layout = 'column',
  showLabels = true,
}) => {
  const [categories, setCategories] = useState([])

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/categories`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })
        const result = await response.json()
        if (result.success) setCategories(result.categories || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [BACKEND_URL])

  const selectedCategory = useMemo(
    () => categories.find((cat) => cat.name === value),
    [categories, value]
  )

  const subcategories = selectedCategory?.subcategories || []
  const containerClass = layout === 'row' && showSubcategory ? 'grid grid-cols-2 gap-2' : 'space-y-4'
  const selectClass = `w-full px-3 md:px-4 py-2 bg-white border-2 border-gray-200 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-xs md:text-sm ${className}`

  return (
    <div className={containerClass}>
      <div>
        {showLabels && (
          <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>
            Category {required && '*'}
          </label>
        )}
        <select
          value={value || ''}
          onChange={(e) => {
            onChange(e.target.value)
          }}
          className={selectClass}
        >
          <option value=''>{placeholder}</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {showSubcategory && (
        <div>
          {showLabels && (
            <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>
              Sub Category {required && '*'}
            </label>
          )}
          <select
            value={subcategoryValue || ''}
            onChange={(e) => onSubcategoryChange && onSubcategoryChange(e.target.value)}
            disabled={!value}
            className={`${selectClass} disabled:opacity-50`}
          >
            <option value=''>{subcategoryPlaceholder}</option>
            {subcategories.map((subcat) => (
              <option key={subcat._id} value={subcat.name}>
                {subcat.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

export default CategoryDropdown
