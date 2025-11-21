import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import WhatsAppButton from '../../component/WhatsAppButton'
import CityDropdown from '../../component/CityDropdown'
import { AppContext } from '../../context/AppContext'
import BuyLeadModal from './components/BuyLeadModal'
import SellLeadModal from './components/SellLeadModal'
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
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

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


  // Categories with icons (alphabetically sorted)
  const categories = [
    { name: 'Advocates', icon: Scale },
    { name: 'Automobiles', icon: Car },
    { name: 'Beauty parlour', icon: Scissors },
    { name: 'Books n stationery', icon: BookOpen },
    { name: 'Catering', icon: UtensilsCrossed },
    { name: 'CCTV', icon: Camera },
    { name: 'Chartered accountants', icon: Calculator },
    { name: 'Clothing', icon: Shirt },
    { name: 'Digital marketing', icon: Megaphone },
    { name: 'Doctors', icon: Stethoscope },
    { name: 'Education n training', icon: GraduationCap },
    { name: 'Electrical', icon: Zap },
    { name: 'Electronics', icon: Smartphone },
    { name: 'Engineers', icon: HardHat },
    { name: 'Fruits n Veg', icon: Apple },
    { name: 'Furniture', icon: Sofa },
    { name: 'Grocery', icon: ShoppingCart },
    { name: 'Hardware', icon: Wrench },
    { name: 'Home appliances', icon: Refrigerator },
    { name: 'Home service', icon: HomeIcon },
    { name: 'Hospital', icon: Building2 },
    { name: 'Hotel', icon: Hotel },
    { name: 'Interior decorators', icon: Paintbrush },
    { name: 'Logistics n courier', icon: Truck },
    { name: 'Marble and tiles', icon: Grid3X3 },
    { name: 'Medicine', icon: Pill },
    { name: 'Pathology', icon: FlaskConical },
    { name: 'Properties', icon: Building },
    { name: 'Restaurent', icon: UtensilsCrossed },
    { name: 'Sports', icon: Trophy },
    { name: 'Telecommunication', icon: Phone },
    { name: 'Tour n Travels', icon: Plane },
    { name: 'Tuition and coaching', icon: School },
    { name: 'Web solutions', icon: Globe }
  ]

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  const handleAdClick = (index) => {
    navigate(`/ad/${index + 1}`)
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

  const adImages = [
    '/ad1.webp',
    '/ad2.webp',
    '/ad3.webp',
    '/ad4.webp',
    '/ad5.webp',
    '/ad6.webp',
    '/ad7.webp',
    '/ad8.webp',
    '/ad9.webp',
    '/ad10.webp',
    '/ad11.webp',
    '/ad12.webp',
    '/ad13.webp',
    '/ad14.webp',
    '/ad15.webp',
    '/ad16.webp'
  ]

  // Ads slider state
  const [currentSlide, setCurrentSlide] = useState(adImages.length)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  // Auto-slide functionality - infinite scroll to the right
  useEffect(() => {
    if (isPaused) return // Don't auto-scroll when paused

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1)
    }, 1600) // Change slide every 1.6 seconds

    return () => clearInterval(slideInterval)
  }, [isPaused])

  // Reset position for infinite loop effect
  useEffect(() => {
    // When we reach the end of the second set, instantly reset to the first set
    if (currentSlide >= adImages.length * 2) {
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentSlide(adImages.length)
        setTimeout(() => setIsTransitioning(true), 50)
      }, 500) // Wait for transition to complete
    }
    // When going backward past the first set, reset to the second set
    if (currentSlide < adImages.length) {
      setIsTransitioning(false)
      setCurrentSlide(adImages.length)
      setTimeout(() => setIsTransitioning(true), 50)
    }
  }, [currentSlide, adImages.length])

  // Manual navigation functions - always move forward
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => prev - 1)
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => prev + 1)
  }

  // Touch event handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
    setIsPaused(true) // Pause auto-scroll on touch
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsPaused(false)
      return
    }

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      handleNextSlide() // Swipe left = next slide
    } else if (isRightSwipe) {
      handlePrevSlide() // Swipe right = previous slide
    }

    // Reset touch values and resume auto-scroll
    setTouchStart(0)
    setTouchEnd(0)
    setIsPaused(false)
  }

  // Mouse event handlers for desktop
  const handleMouseDown = () => {
    setIsPaused(true)
  }

  const handleMouseUp = () => {
    setIsPaused(false)
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
      {/* Search Bar Section */}
      <section className='bg-white shadow-sm md:shadow-md sticky top-0 z-40 border-b border-gray-200'>
        <div className='container mx-auto px-3 md:px-4 py-1 md:py-4'>
          <div className='max-w-6xl mx-auto'>
            <div className='flex flex-row gap-1.5 md:gap-4 items-stretch md:items-center'>
              {/* City Selector - 40% width on Mobile, Second on Desktop */}
              <div className='w-[40%] md:w-auto md:min-w-[180px] md:order-2'>
                <CityDropdown
                  value={selectedCity}
                  onChange={setSelectedCity}
                  placeholder='Select City'
                  darkMode={false}
                  className='h-[32px] md:h-[38px]'
                />
              </div>

              {/* Search Input - 60% width on Mobile, First on Desktop */}
              <div className='relative w-[60%] md:flex-1 md:order-1'>
                <input
                  type='text'
                  placeholder='products, services , vendors'
                  className='w-full px-3 py-1.5 pl-9 pr-20 md:px-5 md:py-2.5 md:pl-12 md:pr-28 rounded-lg md:rounded-xl border md:border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 placeholder:text-xs md:placeholder:text-sm shadow-sm md:shadow-lg text-xs md:text-sm h-[32px] md:h-auto'
                />
                <svg
                  className='absolute left-2.5 md:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
                <button className='absolute right-1.5 md:right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 md:px-5 md:py-2 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm md:shadow-md text-xs md:text-sm'>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buy/Sell Lead Buttons Section - Compact */}
      <section className='py-1.5 md:py-2 bg-gradient-to-br from-blue-50 via-white to-green-50'>
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
      <section className='pb-0 lg:pb-1 bg-white'>
        <div className='container mx-auto px-4'>
          {/* Unified: Horizontal sliding carousel for both Mobile and Desktop */}
          <div
            className='relative mx-auto overflow-hidden cursor-grab active:cursor-grabbing max-w-7xl'
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Previous Button - Mobile Only */}
            <button
              onClick={handlePrevSlide}
              className='lg:hidden absolute left-1 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-1 shadow-md transition-all'
              aria-label='Previous slide'
            >
              <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>

            {/* Next Button - Mobile Only */}
            <button
              onClick={handleNextSlide}
              className='lg:hidden absolute right-1 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-1 shadow-md transition-all'
              aria-label='Next slide'
            >
              <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </button>

            <div
              className='flex'
              style={{
                transform: `translateX(calc(-${currentSlide * (isDesktop ? 20 : 80)}%))`,
                transition: isTransitioning ? 'transform 500ms ease-in-out' : 'none'
              }}
            >
              {/* Render 3 sets of images for seamless infinite scrolling */}
              {[...Array(3)].map((_, setIndex) =>
                adImages.map((ad, index) => (
                  <div key={`${setIndex}-${index}`} className='flex-shrink-0 px-0.5 lg:px-2' style={{ width: isDesktop ? '20%' : '80%' }}>
                    <div
                      onClick={() => handleAdClick(index)}
                      className='bg-white rounded-lg lg:rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-200 flex items-center justify-center bg-gray-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'
                      style={{ height: isDesktop ? '160px' : '150px' }}
                    >
                      <img
                        src={ad}
                        alt={`Advertisement ${index + 1}`}
                        className='w-full h-full object-contain p-2'
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

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
              Shop by Category
            </h2>
          </div>

          <div className='grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3 max-w-7xl mx-auto'>
            {categories.map((category) => {
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
            })}
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
