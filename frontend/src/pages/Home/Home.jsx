import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import WhatsAppButton from '../../component/WhatsAppButton'
import CityDropdown from '../../component/CityDropdown'
import { AppContext } from '../../context/AppContext'
import BuyLeadModal from './components/BuyLeadModal'
import SellLeadModal from './components/SellLeadModal'
import AdsCarousel from './components/AdsCarousel'
import {
  Scale, Car, Scissors, BookOpen, UtensilsCrossed, Camera, Calculator, Shirt,
  Megaphone, Stethoscope, GraduationCap, Zap, Smartphone, HardHat, Apple,
  Sofa, ShoppingCart, Wrench, Refrigerator, Home as HomeIcon, Building2, Hotel,
  Paintbrush, Truck, Grid3X3, Pill, FlaskConical, Building, Trophy,
  Phone, Plane, School, Globe
} from 'lucide-react'

const Home = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useContext(AppContext)
  const [selectedCity, setSelectedCity] = useState('')
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  // Buy/Sell Lead Form States
  const [showBuyForm, setShowBuyForm] = useState(false)
  const [showSellForm, setShowSellForm] = useState(false)
  const [buyLeadData, setBuyLeadData] = useState({
    name: '',
    mobileNo: '',
    townCity: '',
    itemRequired: '',
    majorCategory: '',
    minorCategory: '',
    qualityQuantityDesc: '',
    priceRange: '',
    deliveryAddress: ''
  })
  const [sellLeadData, setSellLeadData] = useState({
    vendorName: '',
    vendorLocation: '',
    productServiceOffered: '',
    brand: '',
    modelDetail: '',
    mrpListPrice: '',
    specialOfferPrice: '',
    stockQtyAvailable: '',
    validity: '',
    mobileNo: ''
  })

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  // Icon mapping - Map icon names from database to Lucide React components
  const iconMap = {
    Scale, Car, Scissors, BookOpen, UtensilsCrossed, Camera, Calculator, Shirt,
    Megaphone, Stethoscope, GraduationCap, Zap, Smartphone, HardHat, Apple,
    Sofa, ShoppingCart, Wrench, Refrigerator, HomeIcon, Building2, Hotel,
    Paintbrush, Truck, Grid3X3, Pill, FlaskConical, Building, Trophy,
    Phone, Plane, School, Globe
  }

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        const response = await fetch(`${BACKEND_URL}/api/categories`)
        const data = await response.json()

        if (data.success) {
          // Map database categories to include icon components
          const mappedCategories = data.categories.map(cat => ({
            name: cat.name,
            icon: iconMap[cat.icon] || ShoppingCart, // Fallback to ShoppingCart if icon not found
            slug: cat.slug,
            subcategories: cat.subcategories
          }))
          setCategories(mappedCategories)
        } else {
          console.error('Failed to load categories')
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [BACKEND_URL])

  // Handle browser back button for modals
  useEffect(() => {
    const handlePopState = () => {
      if (showBuyForm) {
        setShowBuyForm(false)
      }
      if (showSellForm) {
        setShowSellForm(false)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [showBuyForm, showSellForm])

  // Push history state when modal opens
  useEffect(() => {
    if (showBuyForm || showSellForm) {
      window.history.pushState({ modal: true }, '')
    }
  }, [showBuyForm, showSellForm])

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`)
  }

  // Format date to readable format with full date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString)

    // Format time
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes
    const timeString = `${displayHours}:${displayMinutes} ${ampm}`

    // Format date
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const year = date.getFullYear()

    // Always show full date and time
    return `${day} ${month} ${year} at ${timeString}`
  }

  // Handle Buy Lead Button Click (No Auth Required)
  const handleBuyLeadClick = () => {
    // Pre-fill form with user data if authenticated, otherwise show empty form
    if (isAuthenticated && user) {
      setBuyLeadData({
        name: user?.name || user?.fullName || '',
        mobileNo: user?.mobile || user?.phone || '',
        townCity: user?.city || user?.town || '',
        itemRequired: '',
        majorCategory: '',
        minorCategory: '',
        qualityQuantityDesc: '',
        priceRange: '',
        deliveryAddress: user?.address || ''
      })
    } else {
      // Empty form for non-authenticated users
      setBuyLeadData({
        name: '',
        mobileNo: '',
        townCity: '',
        itemRequired: '',
        majorCategory: '',
        minorCategory: '',
        qualityQuantityDesc: '',
        priceRange: '',
        deliveryAddress: ''
      })
    }
    setShowBuyForm(true)
  }

  // Handle Sell Lead Button Click (No Auth Required)
  const handleSellLeadClick = () => {
    // Pre-fill form with user data if authenticated, otherwise show empty form
    if (isAuthenticated && user) {
      setSellLeadData({
        vendorName: user?.name || user?.fullName || '',
        vendorLocation: user?.city || user?.town || '',
        productServiceOffered: '',
        brand: '',
        modelDetail: '',
        mrpListPrice: '',
        specialOfferPrice: '',
        stockQtyAvailable: '',
        validity: '',
        mobileNo: user?.mobile || user?.phone || ''
      })
    } else {
      // Empty form for non-authenticated users
      setSellLeadData({
        vendorName: '',
        vendorLocation: '',
        productServiceOffered: '',
        brand: '',
        modelDetail: '',
        mrpListPrice: '',
        specialOfferPrice: '',
        stockQtyAvailable: '',
        validity: '',
        mobileNo: ''
      })
    }
    setShowSellForm(true)
  }

  return (
    <div className='min-h-screen bg-gray-50'>

      {/* Buy/Sell Lead Buttons Section - Compact */}
      <section className='py-1.5 mt-2 md:py-2 bg-gradient-to-br from-blue-50 via-white to-green-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto space-y-2'>
            {/* Post Buy/Sell Lead Buttons Row */}
            <div className='grid grid-cols-2 gap-2 md:gap-3'>
              {/* Buy Lead Button */}
              <button
                onClick={handleBuyLeadClick}
                className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 md:py-2.5 px-2 md:px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5'
              >
                <div className='flex items-center justify-center gap-1.5 md:gap-2'>
                  <svg className='w-4 h-4 md:w-5 md:h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
                  </svg>
                  <div className='text-left'>
                    <h3 className='text-[11px] md:text-xs font-bold leading-tight'>Post Your Buy Lead</h3>
                    <p className='text-[9px] md:text-[10px] text-blue-100 leading-tight'>आपको क्या खरीदना है</p>
                  </div>
                </div>
              </button>

              {/* Sell Lead Button */}
              <button
                onClick={handleSellLeadClick}
                className='bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 md:py-2.5 px-2 md:px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5'
              >
                <div className='flex items-center justify-center gap-1.5 md:gap-2'>
                  <svg className='w-4 h-4 md:w-5 md:h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  <div className='text-left'>
                    <h3 className='text-[11px] md:text-xs font-bold leading-tight'>Post Your Sell Lead</h3>
                    <p className='text-[9px] md:text-[10px] text-green-100 leading-tight'>आपको क्या बेचना है</p>
                  </div>
                </div>
              </button>
            </div>

            {/* See Buy/Sell Offers Buttons Row */}
            <div className='grid grid-cols-2 gap-2 md:gap-3'>
              {/* See Buy Offers Button */}
              <button
                onClick={() => navigate('/buy-leads')}
                className='bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-2 md:py-2.5 px-2 md:px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5'
              >
                <div className='flex items-center justify-center gap-1.5 md:gap-2'>
                  <svg className='w-4 h-4 md:w-5 md:h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                  </svg>
                  <div className='text-left'>
                    <h3 className='text-[11px] md:text-xs font-bold leading-tight'>See All Buy Offers</h3>
                    <p className='text-[9px] md:text-[10px] text-indigo-100 leading-tight'>सभी खरीददार क्या चाहते हैं</p>
                  </div>
                </div>
              </button>

              {/* See Sell Offers Button */}
              <button
                onClick={() => navigate('/sell-leads')}
                className='bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-2 md:py-2.5 px-2 md:px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5'
              >
                <div className='flex items-center justify-center gap-1.5 md:gap-2'>
                  <svg className='w-4 h-4 md:w-5 md:h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                  </svg>
                  <div className='text-left'>
                    <h3 className='text-[11px] md:text-xs font-bold leading-tight'>See All Sell Offers</h3>
                    <p className='text-[9px] md:text-[10px] text-orange-100 leading-tight'>सभी विक्रेता क्या बेच रहे हैं</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsored Ads Section */}
      <AdsCarousel />

      {/* Buy Lead Form Modal */}
      <BuyLeadModal
        showBuyForm={showBuyForm}
        setShowBuyForm={setShowBuyForm}
        buyLeadData={buyLeadData}
        setBuyLeadData={setBuyLeadData}
        categories={categories.map(c => c.name)}
      />

      {/* Sell Lead Form Modal */}
      <SellLeadModal
        showSellForm={showSellForm}
        setShowSellForm={setShowSellForm}
        sellLeadData={sellLeadData}
        setSellLeadData={setSellLeadData}
      />

      {/* Shop Categories Section */}
      <section className='pt-1 pb-1 md:pt-3 md:pb-3 bg-gray-50'>
        <div className='container mx-auto px-3 md:px-4'>
          <div className='text-center mb-1 md:mb-6'>
            <h2 className='text-sm md:text-3xl font-bold text-gray-800'>
              Vendors by Category
            </h2>
          </div>

          <div className='grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3 max-w-7xl mx-auto'>
            {categoriesLoading ? (
              // Loading skeleton
              Array.from({ length: 24 }).map((_, index) => (
                <div
                  key={index}
                  className='bg-gray-100 p-2 md:p-3 rounded-lg shadow-sm animate-pulse'
                >
                  <div className='flex flex-col items-center'>
                    <div className='w-5 h-5 md:w-7 md:h-7 bg-gray-300 rounded-full mb-1'></div>
                    <div className='w-12 md:w-16 h-2 md:h-3 bg-gray-300 rounded'></div>
                  </div>
                </div>
              ))
            ) : categories.length === 0 ? (
              // No categories found
              <div className='col-span-4 md:col-span-5 lg:col-span-6 text-center py-8'>
                <p className='text-gray-500'>No categories available</p>
              </div>
            ) : (
              // Display categories
              categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <div
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className='group bg-white p-2 md:p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-400 cursor-pointer'
                  >
                    <div className='flex flex-col items-center'>
                      <IconComponent className='w-5 h-5 md:w-7 md:h-7 text-blue-600 mb-1 group-hover:scale-110 transition-transform' />
                      <h3 className='text-center font-medium text-gray-800 text-[8px] md:text-xs leading-tight'>{category.name}</h3>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Fixed Buttons - Hidden on Mobile */}
      <div className='hidden md:block'>
        <WhatsAppButton />
      </div>
    </div>
  )
}

export default Home
