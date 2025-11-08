import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import WhatsAppButton from '../component/WhatsAppButton'
import CityDropdown from '../component/CityDropdown'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

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


  // Sample Sell Leads Data
  const sampleSellLeads = [
    '20% discount on AC - Today only! Limited stock',
    'Fresh homemade sweets - Order now for Diwali',
    'Brand new iPhone 15 Pro Max - 15% off',
    'Premium leather sofa set - 30% discount',
    'Professional photography services - Book now',
    'Organic farm fresh vegetables - Free delivery',
    'Luxury 3 BHK apartment for rent - Prime location',
    'Designer ethnic wear - Flat 40% off',
    'Web development services - Special offer',
    'Gym membership - 50% off on annual plan'
  ]


  // Categories for dropdown
  const majorCategories = [
    'Medicine',
    'Services',
    'Food & Beverage',
    'Grocery',
    'Electronics',
    'Hardware',
    'Fashion',
    'Home & Living',
    'Beauty',
    'Books',
    'Sports',
    'Toys'
  ]

  const minorCategories = {
    'Medicine': ['Prescription Drugs', 'Over-the-Counter', 'Medical Supplies', 'Ayurvedic', 'Homeopathic', 'Other'],
    'Services': ['Repair', 'Cleaning', 'Photography', 'Catering', 'Tutoring', 'Event Management', 'Transport', 'Other'],
    'Food & Beverage': ['Sweets & Snacks', 'Ready-to-Eat', 'Bakery Items', 'Soft Drinks', 'Juices', 'Tea/Coffee', 'Dairy Products', 'Other'],
    'Grocery': ['Vegetables', 'Fruits', 'Pulses & Grains', 'Dry Fruits', 'Spices', 'Oils', 'Other'],
    'Electronics': ['Mobile', 'Laptop', 'TV', 'Camera', 'Accessories', 'Home Appliances', 'Other'],
    'Hardware': ['Building Materials', 'Tools', 'Plumbing', 'Electrical', 'Paint', 'Sanitary', 'Other'],
    'Fashion': ['Men', 'Women', 'Kids', 'Ethnic Wear', 'Western Wear', 'Footwear', 'Accessories', 'Other'],
    'Home & Living': ['Furniture', 'Decor', 'Kitchen', 'Bedding', 'Lighting', 'Other'],
    'Beauty': ['Skincare', 'Haircare', 'Makeup', 'Fragrance', 'Salon Services', 'Other'],
    'Books': ['Academic', 'Fiction', 'Non-Fiction', 'Children', 'Stationery', 'Other'],
    'Sports': ['Cricket', 'Football', 'Gym Equipment', 'Outdoor', 'Fitness', 'Other'],
    'Toys': ['Educational', 'Games', 'Dolls', 'Action Figures', 'Remote Control', 'Other']
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  // Buy Lead Form Handlers
  const handleBuyLeadSubmit = async (e) => {
    e.preventDefault()
    if (!buyLeadData.name || !buyLeadData.mobileNo || !buyLeadData.townCity || !buyLeadData.itemRequired ||
        !buyLeadData.majorCategory || !buyLeadData.minorCategory || !buyLeadData.qualityQuantityDesc ||
        !buyLeadData.priceRange || !buyLeadData.deliveryAddress) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'
      const response = await fetch(`${BACKEND_URL}/api/buy-lead/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buyLeadData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Buy lead submitted successfully! It will be visible after admin approval.')
        setShowBuyForm(false)
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
      } else {
        toast.error(data.message || 'Failed to submit buy lead')
      }
    } catch (error) {
      console.error('Error submitting buy lead:', error)
      toast.error('Failed to submit buy lead. Please try again.')
    }
  }

  // Sell Lead Form Handlers
  const handleSellLeadSubmit = async (e) => {
    e.preventDefault()
    if (!sellLeadData.vendorName || !sellLeadData.vendorLocation || !sellLeadData.productServiceOffered ||
        !sellLeadData.brand || !sellLeadData.mrpListPrice || !sellLeadData.specialOfferPrice ||
        !sellLeadData.stockQtyAvailable || !sellLeadData.validity || !sellLeadData.mobileNo) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'
      const response = await fetch(`${BACKEND_URL}/api/sell-lead/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sellLeadData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Sell lead submitted successfully! It will be visible after admin approval.')
        setShowSellForm(false)
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
      } else {
        toast.error(data.message || 'Failed to submit sell lead')
      }
    } catch (error) {
      console.error('Error submitting sell lead:', error)
      toast.error('Failed to submit sell lead. Please try again.')
    }
  }

  // Get available minor categories based on selected major category
  const getMinorCategories = () => {
    if (buyLeadData.majorCategory && minorCategories[buyLeadData.majorCategory]) {
      return minorCategories[buyLeadData.majorCategory]
    }
    return []
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
                    <h3 className='text-[11px] md:text-xs font-bold leading-tight'>See Buy Offers</h3>
                    <p className='text-[9px] md:text-[10px] text-indigo-100 leading-tight'>खरीददार क्या चाहते हैं</p>
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
                    <h3 className='text-[11px] md:text-xs font-bold leading-tight'>See Sell Offers</h3>
                    <p className='text-[9px] md:text-[10px] text-orange-100 leading-tight'>विक्रेता क्या बेच रहे हैं</p>
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
      {showBuyForm && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-2 md:p-4'>
          <div className='bg-white rounded-xl md:rounded-2xl max-w-2xl w-full shadow-2xl max-h-[95vh] md:max-h-[90vh] flex flex-col'>
            {/* Fixed Header */}
            <div className='flex items-center justify-between p-4 md:p-6 border-b border-gray-200 flex-shrink-0'>
              <h2 className='text-lg md:text-2xl font-bold text-gray-800'>Post Your Buy Lead</h2>
              <button
                onClick={() => setShowBuyForm(false)}
                className='text-gray-500 hover:text-gray-700 transition'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className='overflow-y-auto flex-1 p-4 md:p-6'>
              <form onSubmit={handleBuyLeadSubmit} className='space-y-2 md:space-y-4'>
              {/* Name */}
              <div>
                <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Your Name *</label>
                <input
                  type='text'
                  value={buyLeadData.name}
                  onChange={(e) => setBuyLeadData({ ...buyLeadData, name: e.target.value })}
                  className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                  placeholder='Enter your name'
                  required
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Mobile Number *</label>
                <input
                  type='tel'
                  value={buyLeadData.mobileNo}
                  onChange={(e) => setBuyLeadData({ ...buyLeadData, mobileNo: e.target.value })}
                  className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                  placeholder='Enter your mobile number'
                  pattern='[0-9]{10}'
                  maxLength='10'
                  required
                />
              </div>

              {/* Town/City */}
              <div>
                <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Town/City *</label>
                <CityDropdown
                  value={buyLeadData.townCity}
                  onChange={(city) => setBuyLeadData({ ...buyLeadData, townCity: city })}
                  placeholder='Select your city'
                  required={true}
                  darkMode={false}
                  className='border-2 border-gray-300 rounded-lg md:rounded-xl h-[42px] md:h-[50px]'
                />
              </div>

              {/* Item Required */}
              <div>
                <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Item Required *</label>
                <input
                  type='text'
                  value={buyLeadData.itemRequired}
                  onChange={(e) => setBuyLeadData({ ...buyLeadData, itemRequired: e.target.value })}
                  className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                  placeholder='What do you want to buy?'
                  required
                />
              </div>

              {/* Major Category */}
              <div>
                <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Major Category *</label>
                <select
                  value={buyLeadData.majorCategory}
                  onChange={(e) => setBuyLeadData({ ...buyLeadData, majorCategory: e.target.value, minorCategory: '' })}
                  className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                  required
                >
                  <option value=''>Select Major Category</option>
                  {majorCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Minor Category */}
              <div>
                <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Minor Category *</label>
                <select
                  value={buyLeadData.minorCategory}
                  onChange={(e) => setBuyLeadData({ ...buyLeadData, minorCategory: e.target.value })}
                  className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                  required
                  disabled={!buyLeadData.majorCategory}
                >
                  <option value=''>Select Minor Category</option>
                  {getMinorCategories().map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Quality & Quantity Description */}
              <div>
                <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Quality & Quantity Description *</label>
                <textarea
                  value={buyLeadData.qualityQuantityDesc}
                  onChange={(e) => setBuyLeadData({ ...buyLeadData, qualityQuantityDesc: e.target.value })}
                  className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                  placeholder='Describe the quality and quantity you need'
                  rows='2'
                  required
                />
              </div>

              {/* Price Range */}
              <div>
                <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Price Range *</label>
                <input
                  type='text'
                  value={buyLeadData.priceRange}
                  onChange={(e) => setBuyLeadData({ ...buyLeadData, priceRange: e.target.value })}
                  className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                  placeholder='e.g., ₹1000 - ₹5000'
                  required
                />
              </div>

              {/* Delivery Address */}
              <div>
                <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Delivery Address *</label>
                <textarea
                  value={buyLeadData.deliveryAddress}
                  onChange={(e) => setBuyLeadData({ ...buyLeadData, deliveryAddress: e.target.value })}
                  className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                  placeholder='Enter complete delivery address'
                  rows='2'
                  required
                />
              </div>

              <button
                type='submit'
                className='w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition shadow-lg text-sm md:text-base'
              >
                Submit Buy Lead
              </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Sell Lead Form Modal */}
      {showSellForm && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-2 md:p-4'>
          <div className='bg-white rounded-xl md:rounded-2xl max-w-2xl w-full shadow-2xl max-h-[95vh] md:max-h-[90vh] flex flex-col'>
            {/* Fixed Header */}
            <div className='flex items-center justify-between p-4 md:p-6 border-b border-gray-200 flex-shrink-0'>
              <h2 className='text-lg md:text-2xl font-bold text-gray-800'>Post Your Sell Lead</h2>
              <button
                onClick={() => setShowSellForm(false)}
                className='text-gray-500 hover:text-gray-700 transition'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className='overflow-y-auto flex-1 p-4 md:p-6'>
              <form onSubmit={handleSellLeadSubmit} className='space-y-2 md:space-y-4'>
                {/* Vendor Name */}
                <div>
                  <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Vendor Name *</label>
                  <input
                    type='text'
                    value={sellLeadData.vendorName}
                    onChange={(e) => setSellLeadData({ ...sellLeadData, vendorName: e.target.value })}
                    className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                    placeholder='Enter vendor/business name'
                    required
                  />
                </div>

                {/* Vendor Location */}
                <div>
                  <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Vendor Location (Town/District) *</label>
                  <CityDropdown
                    value={sellLeadData.vendorLocation}
                    onChange={(city) => setSellLeadData({ ...sellLeadData, vendorLocation: city })}
                    placeholder='Select location'
                    required={true}
                    darkMode={false}
                    className='border-2 border-gray-300 rounded-lg md:rounded-xl h-[42px] md:h-[50px]'
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Mobile Number *</label>
                  <input
                    type='tel'
                    value={sellLeadData.mobileNo}
                    onChange={(e) => setSellLeadData({ ...sellLeadData, mobileNo: e.target.value })}
                    className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                    placeholder='Enter mobile number'
                    pattern='[0-9]{10}'
                    maxLength='10'
                    required
                  />
                </div>

                {/* Product/Service Offered */}
                <div>
                  <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Product/Service Offered *</label>
                  <input
                    type='text'
                    value={sellLeadData.productServiceOffered}
                    onChange={(e) => setSellLeadData({ ...sellLeadData, productServiceOffered: e.target.value })}
                    className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                    placeholder='What are you selling?'
                    required
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Brand *</label>
                  <input
                    type='text'
                    value={sellLeadData.brand}
                    onChange={(e) => setSellLeadData({ ...sellLeadData, brand: e.target.value })}
                    className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                    placeholder='Enter brand name'
                    required
                  />
                </div>

                {/* Model Detail (Optional) */}
                <div>
                  <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Model Detail</label>
                  <input
                    type='text'
                    value={sellLeadData.modelDetail}
                    onChange={(e) => setSellLeadData({ ...sellLeadData, modelDetail: e.target.value })}
                    className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                    placeholder='Enter model (optional)'
                  />
                </div>

                {/* MRP/List Price */}
                <div>
                  <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>MRP/List Price (Unit) *</label>
                  <input
                    type='text'
                    value={sellLeadData.mrpListPrice}
                    onChange={(e) => setSellLeadData({ ...sellLeadData, mrpListPrice: e.target.value })}
                    className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                    placeholder='e.g., ₹5000'
                    required
                  />
                </div>

                {/* Special Offer Price */}
                <div>
                  <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Special Offer Price (Unit) *</label>
                  <input
                    type='text'
                    value={sellLeadData.specialOfferPrice}
                    onChange={(e) => setSellLeadData({ ...sellLeadData, specialOfferPrice: e.target.value })}
                    className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                    placeholder='e.g., ₹4000'
                    required
                  />
                </div>

                {/* Stock Quantity Available */}
                <div>
                  <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Stock Quantity Available *</label>
                  <input
                    type='text'
                    value={sellLeadData.stockQtyAvailable}
                    onChange={(e) => setSellLeadData({ ...sellLeadData, stockQtyAvailable: e.target.value })}
                    className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                    placeholder='e.g., 100 units'
                    required
                  />
                </div>

                {/* Validity */}
                <div>
                  <label className='block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2'>Validity *</label>
                  <input
                    type='text'
                    value={sellLeadData.validity}
                    onChange={(e) => setSellLeadData({ ...sellLeadData, validity: e.target.value })}
                    className='w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
                    placeholder='e.g., Valid till 31st Dec 2024'
                    required
                  />
                </div>

                <button
                  type='submit'
                  className='w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition shadow-lg text-sm md:text-base'
                >
                  Submit Sell Lead
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Shop Categories Section */}
      <section className='pt-1 pb-1 md:pt-3 md:pb-3 bg-gray-50'>
        <div className='container mx-auto px-3 md:px-4'>
          <div className='text-center mb-1 md:mb-6'>
            <h2 className='text-sm md:text-3xl font-bold text-gray-800'>
              Shop by Category
            </h2>
          </div>

          <div className='grid grid-cols-4 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4 max-w-7xl mx-auto'>
            {/* Medicine */}
            <div onClick={() => handleCategoryClick('Medicine')} className='group bg-gradient-to-br from-green-50 to-green-100 p-2 md:p-4 rounded-lg md:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-green-200 hover:border-green-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-xl md:text-3xl'>💊</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-[10px] md:text-sm leading-tight'>Medicine</h3>
              <p className='text-center text-[7px] md:text-[10px] text-gray-600 mt-0 hidden md:block'>Health & Pharmacy</p>
            </div>

            {/* Services */}
            <div onClick={() => handleCategoryClick('Services')} className='group bg-gradient-to-br from-blue-50 to-blue-100 p-2 md:p-4 rounded-lg md:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-200 hover:border-blue-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-xl md:text-3xl'>🔧</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-[10px] md:text-sm leading-tight'>Services</h3>
              <p className='text-center text-[7px] md:text-[10px] text-gray-600 mt-0 hidden md:block'>Professional Help</p>
            </div>

            {/* Foods */}
            <div onClick={() => handleCategoryClick('Foods')} className='group bg-gradient-to-br from-orange-50 to-orange-100 p-2 md:p-4 rounded-lg md:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-orange-200 hover:border-orange-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-xl md:text-3xl'>🍔</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-[10px] md:text-sm leading-tight'>Foods</h3>
              <p className='text-center text-[7px] md:text-[10px] text-gray-600 mt-0 hidden md:block'>Restaurants & Cafes</p>
            </div>

            {/* Beverages */}
            <div onClick={() => handleCategoryClick('Beverages')} className='group bg-gradient-to-br from-purple-50 to-purple-100 p-2 md:p-4 rounded-lg md:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-purple-200 hover:border-purple-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-xl md:text-3xl'>🍾</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-[10px] md:text-sm leading-tight'>Beverages</h3>
              <p className='text-center text-[7px] md:text-[10px] text-gray-600 mt-0 hidden md:block'>Drinks & Juices</p>
            </div>

            {/* Grocery */}
            <div onClick={() => handleCategoryClick('Grocery')} className='group bg-gradient-to-br from-red-50 to-red-100 p-2 md:p-4 rounded-lg md:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-red-200 hover:border-red-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-xl md:text-3xl'>🛒</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-[10px] md:text-sm leading-tight'>Grocery</h3>
              <p className='text-center text-[7px] md:text-[10px] text-gray-600 mt-0 hidden md:block'>Daily Essentials</p>
            </div>

            {/* Electronics */}
            <div onClick={() => handleCategoryClick('Electronics')} className='group bg-gradient-to-br from-indigo-50 to-indigo-100 p-2 md:p-4 rounded-lg md:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-indigo-200 hover:border-indigo-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-xl md:text-3xl'>📱</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-[10px] md:text-sm leading-tight'>Electronics</h3>
              <p className='text-center text-[7px] md:text-[10px] text-gray-600 mt-0 hidden md:block'>Gadgets & Tech</p>
            </div>

            {/* Fashion */}
            <div onClick={() => handleCategoryClick('Fashion')} className='group bg-gradient-to-br from-pink-50 to-pink-100 p-2 md:p-4 rounded-lg md:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-pink-200 hover:border-pink-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-xl md:text-3xl'>👗</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-[10px] md:text-sm leading-tight'>Fashion</h3>
              <p className='text-center text-[7px] md:text-[10px] text-gray-600 mt-0 hidden md:block'>Clothing & Style</p>
            </div>

            {/* Home & Living */}
            <div onClick={() => handleCategoryClick('Home & Living')} className='group bg-gradient-to-br from-teal-50 to-teal-100 p-2 md:p-4 rounded-lg md:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-teal-200 hover:border-teal-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-xl md:text-3xl'>🏠</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-[10px] md:text-sm leading-tight'>Home & Living</h3>
              <p className='text-center text-[7px] md:text-[10px] text-gray-600 mt-0 hidden md:block'>Furniture & Decor</p>
            </div>

            {/* Beauty */}
            <div onClick={() => handleCategoryClick('Beauty')} className='group bg-gradient-to-br from-rose-50 to-rose-100 p-2 md:p-4 rounded-lg md:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-rose-200 hover:border-rose-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-xl md:text-3xl'>💄</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-[10px] md:text-sm leading-tight'>Beauty</h3>
              <p className='text-center text-[7px] md:text-[10px] text-gray-600 mt-0 hidden md:block'>Cosmetics & Care</p>
            </div>

            {/* Books */}
            <div onClick={() => handleCategoryClick('Books')} className='group bg-gradient-to-br from-amber-50 to-amber-100 p-2 md:p-4 rounded-lg md:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-amber-200 hover:border-amber-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-xl md:text-3xl'>📚</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-[10px] md:text-sm leading-tight'>Books</h3>
              <p className='text-center text-[7px] md:text-[10px] text-gray-600 mt-0 hidden md:block'>Education & Learning</p>
            </div>

            {/* Sports */}
            <div onClick={() => handleCategoryClick('Sports')} className='group bg-gradient-to-br from-lime-50 to-lime-100 p-2 md:p-4 rounded-lg md:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-lime-200 hover:border-lime-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-xl md:text-3xl'>⚽</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-[10px] md:text-sm leading-tight'>Sports</h3>
              <p className='text-center text-[7px] md:text-[10px] text-gray-600 mt-0 hidden md:block'>Fitness & Outdoor</p>
            </div>

            {/* Toys */}
            <div onClick={() => handleCategoryClick('Toys')} className='group bg-gradient-to-br from-cyan-50 to-cyan-100 p-2 md:p-4 rounded-lg md:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-cyan-200 hover:border-cyan-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-10 h-10 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-xl md:text-3xl'>🧸</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-[10px] md:text-sm leading-tight'>Toys</h3>
              <p className='text-center text-[7px] md:text-[10px] text-gray-600 mt-0 hidden md:block'>Kids & Games</p>
            </div>
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
