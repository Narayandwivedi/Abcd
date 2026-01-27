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
    <div className='space-y-3'>
      <label className='block text-sm font-bold text-gray-700'>
        Business Categories & Subcategories {required && <span className='text-red-500'>*</span>}
      </label>

      {value.map((item, index) => (
        <div key={index} className='flex items-start gap-2'>
          <div className='flex-1 grid grid-cols-2 gap-2'>
            <input
              type='text'
              value={item.category}
              onChange={(e) => updateField(index, 'category', e.target.value)}
              placeholder='Business Category'
              className='w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm'
            />
            <input
              type='text'
              value={item.subCategory}
              onChange={(e) => updateField(index, 'subCategory', e.target.value)}
              placeholder='Subcategory'
              className='w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm'
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
          className={`w-full px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-dashed border-indigo-300 text-indigo-700 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all flex items-center justify-center gap-2 font-semibold text-sm ${className}`}
        >
          <Plus className='w-4 h-4' />
          {value.length === 0 ? 'Add Business Category' : 'Add More Category'}
          <span className='text-xs text-indigo-400'>({value.length}/{MAX_CATEGORIES})</span>
        </button>
      )}

      {value.length === 0 && required && (
        <p className='text-xs text-red-500 mt-1'>Please add at least one category and subcategory</p>
      )}
    </div>
  )
}

export default MultiCategorySelector
