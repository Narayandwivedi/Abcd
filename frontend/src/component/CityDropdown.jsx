import React, { useState, useEffect, useRef } from 'react'
import { cityListByDistrict } from '../assets/citylist'

const CityDropdown = ({ value, onChange, className = '', placeholder = 'Select your City', required = false, darkMode = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)

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
  const getFilteredCities = () => {
    if (!searchQuery.trim()) return cityListByDistrict

    const filtered = {}
    Object.keys(cityListByDistrict).forEach((district) => {
      const matchingCities = cityListByDistrict[district].filter((city) =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      )
      if (matchingCities.length > 0) {
        filtered[district] = matchingCities
      }
    })
    return filtered
  }

  const filteredCities = getFilteredCities()

  const handleCitySelect = (city) => {
    onChange(city)
    setIsOpen(false)
    setSearchQuery('')
  }

  const displayValue = value || placeholder

  return (
    <div ref={dropdownRef} className='relative'>
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
        <svg
          className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
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
          <div className='overflow-y-auto max-h-80'>
            {Object.keys(filteredCities).length > 0 ? (
              Object.keys(filteredCities).map((district) => (
                <div key={district}>
                  {/* District Header */}
                  <div
                    className={`px-3 md:px-4 py-1.5 md:py-2 ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    } font-bold text-xs md:text-sm sticky top-0`}
                  >
                    {district}
                  </div>

                  {/* Cities in District */}
                  {filteredCities[district].map((city, index) => (
                    <div
                      key={index}
                      onClick={() => handleCitySelect(city)}
                      className={`px-3 md:px-4 py-2 md:py-2.5 cursor-pointer transition-colors text-xs md:text-sm ${
                        value === city
                          ? darkMode
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-100 text-purple-800'
                          : darkMode
                          ? 'text-gray-200 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {city}
                    </div>
                  ))}
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
