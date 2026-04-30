import { useEffect, useMemo, useState } from 'react'

const CategoryDropdown = ({
  value,
  onChange,
  onSubcategoriesChange,
  subcategoriesValue = [],
  className = '',
  placeholder = 'Select Category',
  subcategoryPlaceholder = 'Select Sub Category',
  required = false,
  showSubcategory = true,
  layout = 'column',
  showLabels = true,
  isMulti = true,
  maxTotalSubcategories = 5,
  currentTotalSubcategories = 0
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
  const containerClass = layout === 'row' && showSubcategory ? 'flex flex-col md:flex-row gap-4' : 'space-y-4'
  const selectClass = `w-full px-3 md:px-4 py-2 bg-white border-2 border-gray-200 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-xs md:text-sm ${className}`

  const handleSubcategoryToggle = (subcat) => {
    const isSelected = subcategoriesValue.some(s => s.name === subcat.name);
    let updated;
    
    if (isSelected) {
      updated = subcategoriesValue.filter(s => s.name !== subcat.name);
    } else {
      if (currentTotalSubcategories >= maxTotalSubcategories) {
        alert(`Maximum ${maxTotalSubcategories} subcategories allowed in total.`);
        return;
      }
      updated = [...subcategoriesValue, { name: subcat.name, id: subcat._id }];
    }
    
    onSubcategoriesChange && onSubcategoriesChange(updated);
  }

  return (
    <div className={containerClass}>
      <div className={layout === 'row' ? 'w-full md:w-1/3' : 'w-full'}>
        {showLabels && (
          <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>
            Category {required && '*'}
          </label>
        )}
        <select
          value={value || ''}
          onChange={(e) => {
            const cat = categories.find(c => c.name === e.target.value);
            onChange(e.target.value, cat?._id)
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
        <div className={layout === 'row' ? 'w-full md:w-2/3' : 'w-full'}>
          {showLabels && (
            <label className='block text-xs md:text-sm font-medium text-gray-700 mb-1'>
              Sub Categories (Select up to 5 total) {required && '*'}
            </label>
          )}
          
          <div className='flex flex-wrap gap-2 mt-1 min-h-[40px] p-2 bg-gray-50 border-2 border-gray-100 rounded-xl'>
            {!value ? (
              <span className='text-gray-400 text-xs italic'>Please select a category first</span>
            ) : subcategories.length > 0 ? (
              subcategories.map((subcat) => {
                const isSelected = subcategoriesValue.some(s => s.name === subcat.name);
                return (
                  <button
                    key={subcat._id}
                    type='button'
                    onClick={() => handleSubcategoryToggle(subcat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                        : 'bg-white border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {subcat.name}
                  </button>
                )
              })
            ) : (
              <span className='text-gray-400 text-xs italic'>No subcategories found for this category</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryDropdown
