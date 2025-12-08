import { useState, useEffect } from 'react'

const StateCitySelector = ({
  stateValue,
  cityValue,
  onStateChange,
  onCityChange,
  required = false
}) => {
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  // Fetch all states on component mount
  useEffect(() => {
    fetchStates()
  }, [])

  // Fetch cities when state changes
  useEffect(() => {
    if (stateValue) {
      fetchCitiesByState(stateValue)
    } else {
      setCities([])
      onCityChange('')
    }
  }, [stateValue])

  const fetchStates = async () => {
    try {
      setLoadingStates(true)
      const response = await fetch(`${BACKEND_URL}/api/cities/states`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (result.success) {
        setStates(result.states)
      }
    } catch (error) {
      console.error('Error fetching states:', error)
    } finally {
      setLoadingStates(false)
    }
  }

  const fetchCitiesByState = async (state) => {
    try {
      setLoadingCities(true)
      const response = await fetch(
        `${BACKEND_URL}/api/cities/state/${encodeURIComponent(state)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const result = await response.json()

      if (result.success) {
        setCities(result.cities)
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
    } finally {
      setLoadingCities(false)
    }
  }

  const handleStateChange = (e) => {
    const newState = e.target.value
    onStateChange(newState)
    // City will be cleared automatically by the useEffect
  }

  const handleCityChange = (e) => {
    onCityChange(e.target.value)
  }

  return (
    <div className='space-y-4'>
      {/* State Dropdown */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          State {required && <span className='text-red-500'>*</span>}
        </label>
        <select
          value={stateValue}
          onChange={handleStateChange}
          disabled={loadingStates}
          className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 disabled:bg-gray-100'
          required={required}
        >
          <option value=''>Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* City Dropdown */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          City {required && <span className='text-red-500'>*</span>}
        </label>
        <select
          value={cityValue}
          onChange={handleCityChange}
          disabled={!stateValue || loadingCities}
          className='w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 disabled:bg-gray-100'
          required={required}
        >
          <option value=''>
            {!stateValue
              ? 'Select state first'
              : loadingCities
              ? 'Loading cities...'
              : 'Select City'}
          </option>
          {cities.map((cityObj) => (
            <option key={cityObj._id} value={cityObj.city}>
              {cityObj.city} ({cityObj.district})
            </option>
          ))}
        </select>
        {cities.length > 0 && (
          <p className='text-xs text-gray-500 mt-1'>
            {cities.length} cities available in {stateValue}
          </p>
        )}
      </div>
    </div>
  )
}

export default StateCitySelector
