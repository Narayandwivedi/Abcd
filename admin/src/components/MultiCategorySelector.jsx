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
      <label className='block text-sm font-medium text-gray-700'>
        Business Categories & Subcategories {required && '*'}
      </label>

      {value.map((item, index) => (
        <div key={index} className='flex items-start gap-2'>
          <div className='flex-1 grid grid-cols-2 gap-2'>
            <input
              type='text'
              value={item.category}
              onChange={(e) => updateField(index, 'category', e.target.value)}
              placeholder='Business Category'
              className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
            />
            <input
              type='text'
              value={item.subCategory}
              onChange={(e) => updateField(index, 'subCategory', e.target.value)}
              placeholder='Subcategory'
              className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
            />
          </div>
          <button
            type='button'
            onClick={() => removeCategory(index)}
            className='mt-1 p-1.5 hover:bg-red-100 rounded-full transition-colors'
          >
            <svg className='w-4 h-4 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
      ))}

      {value.length < MAX_CATEGORIES && (
        <button
          type='button'
          onClick={addCategory}
          className={`w-full px-4 py-2.5 bg-white border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-blue-400 hover:text-blue-600 transition flex items-center justify-center gap-2 font-medium ${className}`}
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          {value.length === 0 ? 'Add Business Category' : 'Add More Category'}
          <span className='text-xs text-gray-400'>({value.length}/{MAX_CATEGORIES})</span>
        </button>
      )}

      {value.length === 0 && required && (
        <p className='text-xs text-red-500 mt-1'>Please add at least one category and subcategory</p>
      )}
    </div>
  )
}

export default MultiCategorySelector
