import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const CategoryDropdown = ({ value, onChange, categories = [], className = '', placeholder = 'Select Category', required = false, darkMode = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
  const dropdownRef = useRef(null)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      updateCoords()
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus()
      }, 100)
    }
  }, [isOpen])

  const updateCoords = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('scroll', updateCoords, true)
      window.addEventListener('resize', updateCoords)
    }
    return () => {
      window.removeEventListener('scroll', updateCoords, true)
      window.removeEventListener('resize', updateCoords)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        const portal = document.getElementById('category-dropdown-portal')
        if (portal && !portal.contains(event.target)) {
          setIsOpen(false)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const DropdownMenu = () => {
    return createPortal(
      <div
        id='category-dropdown-portal'
        style={{ top: `${coords.top}px`, left: `${coords.left}px`, width: `${coords.width}px`, position: 'absolute' }}
        className={`z-[100] mt-1 ${darkMode ? 'bg-gray-900' : 'bg-white'} border ${darkMode ? 'border-white/20' : 'border-gray-300'} rounded-xl shadow-2xl max-h-[400px] overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200`}
      >
        <div className={`p-3 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-slate-50'}`}>
          <div className='relative'>
            <input
              ref={inputRef}
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search category...'
              className={`w-full pl-9 pr-3 py-2.5 rounded-lg border-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
              onClick={(e) => e.stopPropagation()}
            />
            <svg className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
          </div>
        </div>
        <div ref={listRef} className='overflow-y-auto max-h-[300px] p-1 scrollbar-custom'>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <div
                key={cat.id || cat.name}
                onClick={() => handleSelect(cat)}
                className={`px-4 py-3 cursor-pointer rounded-lg transition-all text-sm mb-1 flex items-center justify-between ${
                  (value === cat.name || value === cat.id)
                    ? 'bg-blue-600 text-white shadow-md'
                    : darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{cat.name}</span>
                {(value === cat.name || value === cat.id) && (
                   <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                  </svg>
                )}
              </div>
            ))
          ) : (
            <div className='py-8 text-center text-gray-500 text-sm'>No categories found</div>
          )}
        </div>
      </div>,
      document.body
    )
  }



  return (
    <div ref={dropdownRef} className='relative w-full'>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 md:px-4 py-2.5 md:py-3.5 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-slate-50 border-gray-300 text-gray-800 shadow-sm'} border-2 rounded-xl cursor-pointer flex items-center justify-between ${className}`}
      >
        <span className={`truncate text-sm md:text-base ${!value ? 'text-gray-400' : 'font-medium'}`}>{displayValue}</span>
        <svg className={`w-4 h-4 text-blue-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M19 9l-7 7-7-7' />
        </svg>
      </div>
      {isOpen && <DropdownMenu />}
    </div>
  )
}

export default CategoryDropdown
