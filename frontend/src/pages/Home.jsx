import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import WhatsAppButton from '../component/WhatsAppButton'
import CityDropdown from '../component/CityDropdown'

const Home = () => {
  const navigate = useNavigate()
  const [selectedCity, setSelectedCity] = useState('')
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  // Buy/Sell Lead Form States
  const [showBuyForm, setShowBuyForm] = useState(false)
  const [showSellForm, setShowSellForm] = useState(false)
  const [buyLeadData, setBuyLeadData] = useState({ name: '', category: '' })
  const [sellLeadData, setSellLeadData] = useState({ name: '', category: '' })

  // Show Buy/Sell Leads States
  const [showBuyLeads, setShowBuyLeads] = useState(false)
  const [showSellLeads, setShowSellLeads] = useState(false)

  // Sample Buy Leads Data
  const sampleBuyLeads = [
    'I need 5 kg Kaju Katli for Diwali celebrations',
    'Looking for 2 BHK flat in Central Delhi',
    'Need bulk order of 100 office chairs',
    'Want to buy 50 kg organic vegetables daily',
    'Looking for wedding photographer in Mumbai',
    'Need 10 laptops for office setup',
    'Looking for AC repair services urgently',
    'Want to purchase branded shoes size 9',
    'Need English tutor for class 10 student',
    'Looking for catering services for 200 people'
  ]

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
  const categories = [
    'Medicine',
    'Services',
    'Foods',
    'Beverages',
    'Grocery',
    'Electronics',
    'Fashion',
    'Home & Living',
    'Beauty',
    'Books',
    'Sports',
    'Toys'
  ]

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
  const handleBuyLeadSubmit = (e) => {
    e.preventDefault()
    if (!buyLeadData.name || !buyLeadData.category) {
      alert('Please fill all fields')
      return
    }
    console.log('Buy Lead Submitted:', buyLeadData)
    alert(`Buy Lead submitted!\nName: ${buyLeadData.name}\nCategory: ${buyLeadData.category}`)
    setShowBuyForm(false)
    setBuyLeadData({ name: '', category: '' })
  }

  // Sell Lead Form Handlers
  const handleSellLeadSubmit = (e) => {
    e.preventDefault()
    if (!sellLeadData.name || !sellLeadData.category) {
      alert('Please fill all fields')
      return
    }
    console.log('Sell Lead Submitted:', sellLeadData)
    alert(`Sell Lead submitted!\nName: ${sellLeadData.name}\nCategory: ${sellLeadData.category}`)
    setShowSellForm(false)
    setSellLeadData({ name: '', category: '' })
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
                onClick={() => setShowBuyForm(true)}
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
                onClick={() => setShowSellForm(true)}
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

            {/* See Buy/Sell Leads Buttons Row */}
            <div className='grid grid-cols-2 gap-2 md:gap-3'>
              {/* See Buy Leads Button */}
              <button
                onClick={() => setShowBuyLeads(true)}
                className='bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-2 md:py-2.5 px-2 md:px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5'
              >
                <div className='flex items-center justify-center gap-1.5 md:gap-2'>
                  <svg className='w-4 h-4 md:w-5 md:h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                  </svg>
                  <div className='text-left'>
                    <h3 className='text-[11px] md:text-xs font-bold leading-tight'>See Buy Leads</h3>
                    <p className='text-[9px] md:text-[10px] text-indigo-100 leading-tight'>खरीददार क्या चाहते हैं</p>
                  </div>
                </div>
              </button>

              {/* See Sell Leads Button */}
              <button
                onClick={() => setShowSellLeads(true)}
                className='bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-2 md:py-2.5 px-2 md:px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5'
              >
                <div className='flex items-center justify-center gap-1.5 md:gap-2'>
                  <svg className='w-4 h-4 md:w-5 md:h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                  </svg>
                  <div className='text-left'>
                    <h3 className='text-[11px] md:text-xs font-bold leading-tight'>See Sell Leads</h3>
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
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-gray-800'>Buy Lead Form</h2>
              <button
                onClick={() => setShowBuyForm(false)}
                className='text-gray-500 hover:text-gray-700 transition'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <form onSubmit={handleBuyLeadSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Your Name *</label>
                <input
                  type='text'
                  value={buyLeadData.name}
                  onChange={(e) => setBuyLeadData({ ...buyLeadData, name: e.target.value })}
                  className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='Enter your name'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Product Category *</label>
                <select
                  value={buyLeadData.category}
                  onChange={(e) => setBuyLeadData({ ...buyLeadData, category: e.target.value })}
                  className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  required
                >
                  <option value=''>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <button
                type='submit'
                className='w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition shadow-lg'
              >
                Confirm Buy Lead
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sell Lead Form Modal */}
      {showSellForm && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-gray-800'>Sell Lead Form</h2>
              <button
                onClick={() => setShowSellForm(false)}
                className='text-gray-500 hover:text-gray-700 transition'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSellLeadSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Your Name *</label>
                <input
                  type='text'
                  value={sellLeadData.name}
                  onChange={(e) => setSellLeadData({ ...sellLeadData, name: e.target.value })}
                  className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                  placeholder='Enter your name'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>Product Category *</label>
                <select
                  value={sellLeadData.category}
                  onChange={(e) => setSellLeadData({ ...sellLeadData, category: e.target.value })}
                  className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                  required
                >
                  <option value=''>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <button
                type='submit'
                className='w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition shadow-lg'
              >
                Confirm Sell Lead
              </button>
            </form>
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

      {/* Buy Leads Popup Modal */}
      {showBuyLeads && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4'>
          <div className='bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-4 md:p-6 max-w-2xl w-full shadow-2xl h-[90vh] flex flex-col'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-2xl md:text-3xl font-bold text-indigo-800 flex items-center gap-2'>
                <svg className='w-7 h-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
                </svg>
                Buy Leads
              </h2>
              <button
                onClick={() => setShowBuyLeads(false)}
                className='text-gray-500 hover:text-gray-700 transition bg-white rounded-full p-2 hover:bg-gray-100'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <div className='relative flex-1 overflow-hidden bg-white rounded-xl border-2 border-indigo-200 shadow-inner'>
              <div className='absolute inset-0 overflow-y-auto scrollbar-hide'>
                <div className='space-y-0 animate-scroll-continuous'>
                  {[...sampleBuyLeads, ...sampleBuyLeads].map((lead, index) => (
                    <div
                      key={index}
                      className='py-4 px-6 border-b border-indigo-100'
                    >
                      <div className='flex items-start gap-3'>
                        <div className='bg-indigo-100 rounded-full p-2 flex-shrink-0'>
                          <svg className='w-5 h-5 text-indigo-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                          </svg>
                        </div>
                        <p className='text-gray-800 font-medium text-sm md:text-base leading-relaxed'>{lead}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className='text-xs md:text-sm text-gray-500 text-center mt-4'>
              Showing latest buyer requirements
            </p>
          </div>
        </div>
      )}

      {/* Sell Leads Popup Modal */}
      {showSellLeads && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4'>
          <div className='bg-gradient-to-br from-orange-50 to-white rounded-2xl p-4 md:p-6 max-w-2xl w-full shadow-2xl h-[90vh] flex flex-col'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-2xl md:text-3xl font-bold text-orange-800 flex items-center gap-2'>
                <svg className='w-7 h-7' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                Sell Leads
              </h2>
              <button
                onClick={() => setShowSellLeads(false)}
                className='text-gray-500 hover:text-gray-700 transition bg-white rounded-full p-2 hover:bg-gray-100'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <div className='relative flex-1 overflow-hidden bg-white rounded-xl border-2 border-orange-200 shadow-inner'>
              <div className='absolute inset-0 overflow-y-auto scrollbar-hide'>
                <div className='space-y-0 animate-scroll-continuous'>
                  {[...sampleSellLeads, ...sampleSellLeads].map((lead, index) => (
                    <div
                      key={index}
                      className='py-4 px-6 border-b border-orange-100'
                    >
                      <div className='flex items-start gap-3'>
                        <div className='bg-orange-100 rounded-full p-2 flex-shrink-0'>
                          <svg className='w-5 h-5 text-orange-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
                          </svg>
                        </div>
                        <p className='text-gray-800 font-medium text-sm md:text-base leading-relaxed'>{lead}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className='text-xs md:text-sm text-gray-500 text-center mt-4'>
              Showing latest seller offers
            </p>
          </div>
        </div>
      )}

      {/* Fixed Buttons - Hidden on Mobile */}
      <div className='hidden md:block'>
        <WhatsAppButton />
      </div>
    </div>
  )
}

export default Home
