import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import WhatsAppButton from '../component/WhatsAppButton'
import CityDropdown from '../component/CityDropdown'

const Home = () => {
  const navigate = useNavigate()
  const [selectedCity, setSelectedCity] = useState('')
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

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

  const handleDealClick = (index) => {
    navigate(`/deal/${index + 1}`)
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

  const dealImages = [
    '/hot deals/deal1.jpg',
    '/hot deals/deal2.jpg',
    '/hot deals/deal3.jpg',
    '/hot deals/deal4.jpg',
    '/hot deals/deal5.jpg',
    '/hot deals/deal6.jpg',
    '/hot deals/deal7.jpg',
    '/hot deals/deal8.jpg',
    '/hot deals/deal9.png',
    '/hot deals/deal10.png',
    
  ]

  // Ads slider state
  const [currentSlide, setCurrentSlide] = useState(adImages.length)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  // Hot Deals slider state
  const [currentDealSlide, setCurrentDealSlide] = useState(dealImages.length)
  const [isDealTransitioning, setIsDealTransitioning] = useState(true)
  const [isDealPaused, setIsDealPaused] = useState(false)
  const [dealTouchStart, setDealTouchStart] = useState(0)
  const [dealTouchEnd, setDealTouchEnd] = useState(0)

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

  // Hot Deals auto-slide functionality
  useEffect(() => {
    if (isDealPaused) return

    const dealSlideInterval = setInterval(() => {
      setCurrentDealSlide((prev) => prev + 1)
    }, 2200)

    return () => clearInterval(dealSlideInterval)
  }, [isDealPaused])

  // Hot Deals reset position for infinite loop
  useEffect(() => {
    if (currentDealSlide >= dealImages.length * 2) {
      setTimeout(() => {
        setIsDealTransitioning(false)
        setCurrentDealSlide(dealImages.length)
        setTimeout(() => setIsDealTransitioning(true), 50)
      }, 500)
    }
    if (currentDealSlide < dealImages.length) {
      setIsDealTransitioning(false)
      setCurrentDealSlide(dealImages.length)
      setTimeout(() => setIsDealTransitioning(true), 50)
    }
  }, [currentDealSlide, dealImages.length])

  // Hot Deals touch handlers
  const handleDealTouchStart = (e) => {
    setDealTouchStart(e.targetTouches[0].clientX)
    setIsDealPaused(true)
  }

  const handleDealTouchMove = (e) => {
    setDealTouchEnd(e.targetTouches[0].clientX)
  }

  const handleDealTouchEnd = () => {
    if (!dealTouchStart || !dealTouchEnd) {
      setIsDealPaused(false)
      return
    }

    const distance = dealTouchStart - dealTouchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setCurrentDealSlide((prev) => prev + 1)
    } else if (isRightSwipe) {
      setCurrentDealSlide((prev) => prev - 1)
    }

    setDealTouchStart(0)
    setDealTouchEnd(0)
    setIsDealPaused(false)
  }

  // Hot Deals mouse handlers
  const handleDealMouseDown = () => {
    setIsDealPaused(true)
  }

  const handleDealMouseUp = () => {
    setIsDealPaused(false)
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

      {/* Top Deals Section */}
      <section className='py-1 pb-2 lg:py-2 lg:pb-3 bg-gray-100'>
        <div className='container mx-auto px-4'>
          {/* Unified: Horizontal sliding carousel for both Mobile and Desktop */}
          <div
            className='relative mx-auto overflow-hidden cursor-grab active:cursor-grabbing max-w-7xl'
            onTouchStart={handleDealTouchStart}
            onTouchMove={handleDealTouchMove}
            onTouchEnd={handleDealTouchEnd}
            onMouseDown={handleDealMouseDown}
            onMouseUp={handleDealMouseUp}
            onMouseLeave={handleDealMouseUp}
          >
            <div
              className='flex'
              style={{
                transform: `translateX(calc(-${currentDealSlide * (isDesktop ? 20 : 80)}%))`,
                transition: isDealTransitioning ? 'transform 500ms ease-in-out' : 'none'
              }}
            >
              {/* Render 3 sets of images for seamless infinite scrolling */}
              {[...Array(3)].map((_, setIndex) =>
                dealImages.map((deal, index) => (
                  <div key={`${setIndex}-${index}`} className='flex-shrink-0 px-0.5 lg:px-2' style={{ width: isDesktop ? '20%' : '80%' }}>
                    <div
                      onClick={() => handleDealClick(index)}
                      className='bg-white rounded-lg lg:rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-200 flex items-center justify-center bg-gray-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'
                      style={{ height: isDesktop ? '160px' : '150px' }}
                    >
                      <img
                        src={deal}
                        alt={`Hot Deal ${index + 1}`}
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

      {/* Sponsored Ads Section - Row 2 */}
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
