import { Plus, X } from 'lucide-react'

const MAX_CATEGORIES = 5

const MultiCategorySelector = ({
  value = [],
  onChange,
  className = '',
  required = false,
}) => {

  const addCategory = () => {
    if (value.length >= MAX_CATEGORIES) return
    onChange([...value, { category: '', subCategory: '' }])
  }

  const removeCategory = (index) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const updateField = (index, field, val) => {
    const updated = value.map((item, i) =>
      i === index ? { ...item, [field]: val } : item
    )
    onChange(updated)
  }

  return (
    <div className='space-y-2'>
      <label className='block text-sm font-semibold text-gray-700'>
        Major Business Category & Sub Category {required && <span className='text-red-500'>*</span>}
      </label>

      {value.map((item, index) => (
        <div key={index} className='flex items-start gap-2'>
          <div className='flex-1 grid grid-cols-2 gap-2'>
            <input
              type='text'
              value={item.category}
              onChange={(e) => updateField(index, 'category', e.target.value)}
              placeholder='Major Business Category'
              className='w-full px-3 py-2.5 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all text-sm'
            />
            <input
              type='text'
              value={item.subCategory}
              onChange={(e) => updateField(index, 'subCategory', e.target.value)}
              placeholder='Sub Category'
              className='w-full px-3 py-2.5 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all text-sm'
            />
          </div>
          {value.length > 1 && (
            <button
              type='button'
              onClick={() => removeCategory(index)}
              className='mt-1.5 p-1.5 hover:bg-red-100 rounded-full transition-colors'
            >
              <X className='w-4 h-4 text-red-500' />
            </button>
          )}
        </div>
      ))}

      {value.length < MAX_CATEGORIES && (
        <button
          type='button'
          onClick={addCategory}
          className={`w-full px-4 py-2 bg-green-50 border border-dashed border-green-400 text-green-700 rounded hover:border-green-600 hover:bg-green-100 transition-all flex items-center justify-center gap-2 font-semibold text-sm ${className}`}
        >
          <Plus className='w-4 h-4' />
          {value.length === 0 ? 'Add Business Category' : 'Add More Category'}
          <span className='text-xs text-green-500'>({value.length}/{MAX_CATEGORIES})</span>
        </button>
      )}

      {value.length === 0 && required && (
        <p className='text-xs text-red-500 mt-1'>Please add at least one category and subcategory</p>
      )}
    </div>
  )
}

export default MultiCategorySelector
