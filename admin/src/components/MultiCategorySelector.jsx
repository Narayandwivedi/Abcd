import CategoryDropdown from './CategoryDropdown'

const MAX_TOTAL_SUBCATEGORIES = 5

const MultiCategorySelector = ({
  value = [],
  onChange,
  className = '',
  required = false,
}) => {
  // Ensure we have at least one empty row if value is empty
  const categories = value.length > 0 ? value : [{ category: '', categoryId: '', subCategories: [] }]

  const addCategory = () => {
    // Only allow adding another category if we haven't hit the subcategory limit yet
    const currentTotal = categories.reduce((sum, cat) => sum + (cat.subCategories?.length || 0), 0)
    if (currentTotal >= MAX_TOTAL_SUBCATEGORIES) {
      alert(`You can only select up to ${MAX_TOTAL_SUBCATEGORIES} subcategories in total.`)
      return
    }
    onChange([...categories, { category: '', categoryId: '', subCategories: [] }])
  }

  const removeCategory = (index) => {
    const updated = categories.filter((_, i) => i !== index)
    // If we remove the last category, add back an empty one
    if (updated.length === 0) {
      onChange([{ category: '', categoryId: '', subCategories: [] }])
    } else {
      onChange(updated)
    }
  }

  const currentTotalSubcategories = categories.reduce((sum, cat) => sum + (cat.subCategories?.length || 0), 0)

  return (
    <div className='space-y-6'>
      {categories.map((item, index) => (
        <div key={index} className='relative p-4 bg-white border border-gray-100 rounded-2xl shadow-sm'>
          <div className='flex items-start gap-2'>
            <div className='flex-1'>
              <CategoryDropdown
                value={item.category}
                subcategoriesValue={item.subCategories || []}
                onChange={(category, categoryId) => {
                  const updated = categories.map((row, i) =>
                    i === index ? { ...row, category, categoryId, subCategories: [] } : row
                  )
                  onChange(updated)
                }}
                onSubcategoriesChange={(subCategories) => {
                  const updated = categories.map((row, i) =>
                    i === index ? { ...row, subCategories } : row
                  )
                  onChange(updated)
                }}
                required={required && index === 0}
                showSubcategory
                layout='row'
                showLabels
                maxTotalSubcategories={MAX_TOTAL_SUBCATEGORIES}
                currentTotalSubcategories={currentTotalSubcategories}
              />
            </div>
            
            {categories.length > 1 && (
              <button
                type='button'
                onClick={() => removeCategory(index)}
                className='p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-xl transition-all'
                title='Remove Category'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}

      <div className='flex items-center justify-between px-2'>
        <div className='text-xs font-medium text-gray-500'>
          Total Subcategories: <span className={currentTotalSubcategories >= MAX_TOTAL_SUBCATEGORIES ? 'text-red-500 font-bold' : 'text-blue-600 font-bold'}>{currentTotalSubcategories}/{MAX_TOTAL_SUBCATEGORIES}</span>
        </div>
        
        {currentTotalSubcategories < MAX_TOTAL_SUBCATEGORIES && (
          <button
            type='button'
            onClick={addCategory}
            className={`px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all flex items-center gap-2 text-xs font-bold border border-blue-100 ${className}`}
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            Add More Categories
          </button>
        )}
      </div>
    </div>
  )
}

export default MultiCategorySelector
