import React, { useState, useEffect, useRef } from 'react'

const CategoryDropdown = ({ value, onChange, categories = [], className = '', placeholder = 'Select Category', required = false, darkMode = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus()
      }, 100)
    } else {
      setSearchQuery('')
    }
  }, [isOpen])

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (category) => {
    onChange(category)
    setIsOpen(false)
    setSearchQuery('')
  }

  // Find the current category object by name or ID
  const selectedCategory = categories.find(c => c.name === value || c.id === value)
  const displayValue = selectedCategory ? selectedCategory.name : placeholder

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Custom Scrollbar Styles */}
      <style>{`
        .cat-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .cat-scrollbar::-webkit-scrollbar-track {
          background: ${darkMode ? '#374151' : '#f3f4f6'};
          border-radius: 4px;
        }
        .cat-scrollbar::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#6b7280' : '#9ca3af'};
          border-radius: 4px;
        }
        .cat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#9ca3af' : '#6b7280'};
        }
      `}</style>

      {/* Trigger button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border rounded-lg cursor-pointer flex items-center justify-between text-xs md:text-sm transition
          ${darkMode
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-300 text-gray-800'
          }
          ${!value ? 'text-gray-400' : ''}
        `}
      >
        <span className={`truncate pr-2 ${!value ? (darkMode ? 'text-gray-400' : 'text-gray-400') : ''}`}>
          {displayValue}
        </span>
        <svg
          className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''} ${darkMode ? 'text-gray-400' : 'text-blue-500'}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M19 9l-7 7-7-7' />
        </svg>
      </div>

      {/* Inline dropdown menu - no portal */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 z-[200] mt-1 rounded-xl shadow-2xl border flex flex-col
            ${darkMode ? 'bg-gray-900 border-white/20' : 'bg-white border-gray-300'}
          `}
          style={{ maxHeight: '260px' }}
        >
          {/* Search */}
          <div className={`p-2 border-b flex-shrink-0 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-slate-50'}`}>
            <div className='relative'>
              <input
                ref={inputRef}
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search category...'
                className={`w-full pl-8 pr-3 py-2 rounded-lg border text-xs md:text-sm
                  ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-800'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500`}
                onClick={(e) => e.stopPropagation()}
              />
              <svg className='absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </div>
          </div>

          {/* List */}
          <div
            ref={listRef}
            className='overflow-y-auto cat-scrollbar overscroll-contain p-1'
            style={{ maxHeight: '190px', WebkitOverflowScrolling: 'touch' }}
          >
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <div
                  key={cat.id || cat.name}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleSelect(cat)
                  }}
                  className={`px-3 py-2.5 cursor-pointer rounded-lg transition-all text-xs md:text-sm mb-0.5 flex items-center justify-between
                    ${(value === cat.name || value === cat.id)
                      ? 'bg-blue-600 text-white'
                      : darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <span>{cat.name}</span>
                  {(value === cat.name || value === cat.id) && (
                    <svg className='w-4 h-4 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                    </svg>
                  )}
                </div>
              ))
            ) : (
              <div className='py-6 text-center text-gray-500 text-sm'>No categories found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryDropdown
