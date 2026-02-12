import { useEffect, useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'

const MAX_CATEGORIES = 5

const MultiCategorySelector = ({
  value = [],
  onChange,
  className = '',
  required = false,
}) => {
  const [categories, setCategories] = useState([])
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/categories`)
        const data = await response.json()
        if (data.success) {
          setCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [BACKEND_URL])

  const rows = useMemo(
    () => (value.length > 0 ? value : [{ category: '', subCategory: '' }]),
    [value]
  )

  const addCategory = () => {
    if (rows.length >= MAX_CATEGORIES) return
    onChange([...rows, { category: '', subCategory: '' }])
  }

  const removeCategory = (index) => {
    const updated = rows.filter((_, i) => i !== index)
    onChange(updated)
  }

  const updateRow = (index, payload) => {
    const updated = rows.map((item, i) => (i === index ? { ...item, ...payload } : item))
    onChange(updated)
  }

  return (
    <div className='space-y-2'>
      <label className='block text-sm font-semibold text-gray-700'>
        Major Business Category & Sub Category {required && <span className='text-red-500'>*</span>}
      </label>

      {rows.map((item, index) => {
        const selectedCategory = categories.find((cat) => cat.name === item.category)
        const subcategories = selectedCategory?.subcategories || []

        return (
          <div key={index} className='flex items-start gap-2'>
            <div className='flex-1 grid grid-cols-2 gap-2'>
              <select
                value={item.category || ''}
                onChange={(e) => updateRow(index, { category: e.target.value, subCategory: '' })}
                className='w-full px-3 py-2.5 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all text-sm'
              >
                <option value=''>Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={item.subCategory || ''}
                onChange={(e) => updateRow(index, { subCategory: e.target.value })}
                disabled={!item.category}
                className='w-full px-3 py-2.5 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all text-sm disabled:opacity-50'
              >
                <option value=''>Select Sub Category</option>
                {subcategories.map((subcat) => (
                  <option key={subcat._id} value={subcat.name}>
                    {subcat.name}
                  </option>
                ))}
              </select>
            </div>

            {rows.length > 1 && (
              <button
                type='button'
                onClick={() => removeCategory(index)}
                className='mt-1.5 p-1.5 hover:bg-red-100 rounded-full transition-colors'
              >
                <X className='w-4 h-4 text-red-500' />
              </button>
            )}
          </div>
        )
      })}

      {rows.length < MAX_CATEGORIES && (
        <button
          type='button'
          onClick={addCategory}
          className={`w-full px-4 py-2 bg-green-50 border border-dashed border-green-400 text-green-700 rounded hover:border-green-600 hover:bg-green-100 transition-all flex items-center justify-center gap-2 font-semibold text-sm ${className}`}
        >
          <Plus className='w-4 h-4' />
          Add More Category
          <span className='text-xs text-green-500'>({rows.length}/{MAX_CATEGORIES})</span>
        </button>
      )}
    </div>
  )
}

export default MultiCategorySelector
