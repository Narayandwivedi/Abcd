import CategoryDropdown from './CategoryDropdown'

const MAX_CATEGORIES = 5

const MultiCategorySelector = ({
  value = [],
  onChange,
  className = '',
  required = false,
}) => {
  const categories = value.length > 0 ? value : [{ category: '', subCategory: '' }]

  const addCategory = () => {
    if (categories.length >= MAX_CATEGORIES) return
    onChange([...categories, { category: '', subCategory: '' }])
  }

  const removeCategory = (index) => {
    const updated = categories.filter((_, i) => i !== index)
    onChange(updated)
  }

  const updateField = (index, field, val) => {
    const updated = categories.map((item, i) =>
      i === index ? { ...item, [field]: val } : item
    )
    onChange(updated)
  }

  return (
    <div className='space-y-3'>
      {categories.map((item, index) => (
        <div key={index} className='flex items-start gap-2'>
          <div className='flex-1'>
            <CategoryDropdown
              value={item.category}
              onChange={(category) => {
                const updated = categories.map((row, i) =>
                  i === index ? { ...row, category, subCategory: '' } : row
                )
                onChange(updated)
              }}
              subcategoryValue={item.subCategory}
              onSubcategoryChange={(subCategory) => updateField(index, 'subCategory', subCategory)}
              required={required}
              showSubcategory
              layout='row'
              showLabels
            />
          </div>
          {categories.length > 1 && (
            <button
              type='button'
              onClick={() => removeCategory(index)}
              className='mt-1 p-1.5 hover:bg-red-100 rounded-full transition-colors'
            >
              <svg className='w-4 h-4 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          )}
        </div>
      ))}

      {categories.length < MAX_CATEGORIES && (
        <button
          type='button'
          onClick={addCategory}
          className={`w-full px-3 py-2 bg-white border border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 transition flex items-center justify-center gap-1.5 text-xs font-medium ${className}`}
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          Add Category
          <span className='text-xs text-gray-400'>({categories.length}/{MAX_CATEGORIES})</span>
        </button>
      )}
    </div>
  )
}

export default MultiCategorySelector
