import React, { useState, useEffect, useRef } from 'react'

const CityDropdown = ({ value, onChange, className = '', placeholder = 'Select your City', required = false, darkMode = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef(null)
  const citiesListRef = useRef(null)

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  // Fetch all cities from API
  const fetchAllCities = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${BACKEND_URL}/api/cities?page=1&limit=500&sortBy=city`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const result = await response.json()

      if (result.success) {
        const cityNames = result.data.map(c => c.city)
        setCities(cityNames)
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial load when dropdown opens
  useEffect(() => {
    if (isOpen && cities.length === 0) {
      fetchAllCities()
    }
  }, [isOpen])

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

  // Filter cities based on search query
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCitySelect = (city) => {
    onChange(city.toUpperCase())
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleClearSelection = (e) => {
    e.stopPropagation()
    onChange('')
  }

  const displayValue = value || placeholder

  // Reset highlighted index when search query changes or dropdown closes
  useEffect(() => {
    setHighlightedIndex(-1)
  }, [searchQuery])

  // Reset highlighted index when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1)
    }
  }, [isOpen])

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return

    const itemCount = filteredCities.length

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => {
          const nextIndex = prev < itemCount - 1 ? prev + 1 : prev
          scrollToHighlighted(nextIndex)
          return nextIndex
        })
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => {
          const nextIndex = prev > 0 ? prev - 1 : 0
          scrollToHighlighted(nextIndex)
          return nextIndex
        })
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < itemCount) {
          handleCitySelect(filteredCities[highlightedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        break
      default:
        break
    }
  }

  // Scroll to highlighted item
  const scrollToHighlighted = (index) => {
    if (citiesListRef.current) {
      const items = citiesListRef.current.children
      if (items[index]) {
        items[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }

  return (
    <div ref={dropdownRef} className='relative' onKeyDown={handleKeyDown}>
      {/* Custom Scrollbar Styles */}
      <style>{`
        .scrollbar-custom::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: ${darkMode ? '#374151' : '#f3f4f6'};
          border-radius: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#6b7280' : '#9ca3af'};
          border-radius: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#9ca3af' : '#6b7280'};
        }
      `}</style>
      {/* Dropdown Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 md:px-4 py-2 md:py-3 pl-9 md:pl-11 ${
          darkMode
            ? 'bg-white/20 border-white/30 text-white'
            : 'bg-white border-gray-300 text-gray-800'
        } border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition backdrop-blur-sm text-xs md:text-sm cursor-pointer flex items-center justify-between ${className}`}
      >
        <span className={`truncate pr-2 ${!value ? 'text-gray-400' : ''}`}>{displayValue}</span>
        <div className='flex items-center gap-1'>
          {value && (
            <button
              onClick={handleClearSelection}
              className='p-1 hover:bg-gray-200 rounded-full transition-colors'
              title='Clear selection'
            >
              <svg className='w-4 h-4 text-gray-500 hover:text-gray-700' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          )}
          <svg
            className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
          </svg>
        </div>
      </div>

      {/* Location Icon */}
      <svg
        className='absolute left-2.5 md:left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 pointer-events-none'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
      </svg>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 w-full mt-2 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } border ${
            darkMode ? 'border-white/20' : 'border-gray-300'
          } rounded-lg shadow-2xl max-h-96 overflow-hidden flex flex-col`}
        >
          {/* Search Input */}
          <div className='p-2 md:p-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-inherit'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search city...'
              className={`w-full px-3 py-2 rounded-md border ${
                darkMode
                  ? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
                  : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs md:text-sm`}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Cities List */}
          <div
            ref={citiesListRef}
            className='overflow-y-auto max-h-80 scroll-smooth scrollbar-custom'
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: darkMode ? '#6b7280 #374151' : '#9ca3af #f3f4f6'
            }}
          >
            {loading ? (
              <div className='px-3 md:px-4 py-8 text-center'>
                <div className='inline-block w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mb-2'></div>
                <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Loading cities...
                </p>
              </div>
            ) : filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <div
                  key={`${city}-${index}`}
                  onClick={() => handleCitySelect(city)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-3 md:px-4 py-2 md:py-2.5 cursor-pointer transition-colors text-xs md:text-sm ${
                    value === city
                      ? darkMode
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-100 text-purple-800'
                      : highlightedIndex === index
                      ? darkMode
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-900'
                      : darkMode
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {city}
                </div>
              ))
            ) : (
              <div
                className={`px-3 md:px-4 py-6 text-center ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                } text-xs md:text-sm`}
              >
                No cities found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CityDropdown
