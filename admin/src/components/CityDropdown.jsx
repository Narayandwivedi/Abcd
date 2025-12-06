import { useState, useEffect, useRef } from 'react'

const CityDropdown = ({ value, onChange, className = '', placeholder = 'Select City', required = false }) => {
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
        `${BACKEND_URL}/api/cities?page=1&limit=1000&sortBy=city`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const result = await response.json()

      if (result.success) {
        setCities(result.data)
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
  const filteredCities = cities.filter((cityObj) =>
    cityObj.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cityObj.district.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCitySelect = (city) => {
    onChange(city)
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
          handleCitySelect(filteredCities[highlightedIndex].city)
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
          background: #f3f4f6;
          border-radius: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>

      {/* Dropdown Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 bg-white border-2 border-gray-200 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm cursor-pointer flex items-center justify-between ${className}`}
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
            className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
          </svg>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className='absolute z-[9999] w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-2xl max-h-96 overflow-hidden flex flex-col'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className='p-3 border-b border-gray-200 sticky top-0 bg-white'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search city or district...'
              className='w-full px-3 py-2 rounded-md border bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>

          {/* Cities List */}
          <div
            ref={citiesListRef}
            className='overflow-y-auto max-h-80 scroll-smooth scrollbar-custom'
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#9ca3af #f3f4f6'
            }}
          >
            {loading ? (
              <div className='px-4 py-8 text-center'>
                <div className='inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-2'></div>
                <p className='text-sm text-gray-500'>Loading cities...</p>
              </div>
            ) : filteredCities.length > 0 ? (
              filteredCities.map((cityObj, index) => (
                <div
                  key={cityObj._id}
                  onClick={() => handleCitySelect(cityObj.city)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-4 py-2.5 cursor-pointer transition-colors text-sm ${
                    value === cityObj.city
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : highlightedIndex === index
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <span className='font-medium'>{cityObj.city}</span>
                    <span className='text-xs text-gray-500'>{cityObj.district}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className='px-4 py-6 text-center text-gray-500 text-sm'>
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
