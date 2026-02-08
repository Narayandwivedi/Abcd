import { useState, useEffect } from 'react'

const AdsCarousel = () => {
  const [adsData, setAdsData] = useState([])
  const [adsLoading, setAdsLoading] = useState(true)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  // Fallback static images if no ads in database
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

  // Use fetched ads if available, otherwise fallback to static images
  // For database ads, prepend BACKEND_URL to the image path
  const displayAds = adsData.length > 0
    ? adsData.map(ad => ({ ...ad, adImg: `${BACKEND_URL}${ad.adImg}` }))
    : adImages.map((img, idx) => ({ adImg: img, _id: idx }))

  // Fetch ads from database
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setAdsLoading(true)
        const response = await fetch(`${BACKEND_URL}/api/ads/active`)
        const data = await response.json()

        if (data.success && data.ads.length > 0) {
          setAdsData(data.ads)
        } else {
          // Fallback to static images if no ads in database
          setAdsData([])
        }
      } catch (error) {
        console.error('Error fetching ads:', error)
        setAdsData([]) // Fallback to empty array on error
      } finally {
        setAdsLoading(false)
      }
    }

    fetchAds()
  }, [BACKEND_URL])

  // Initialize currentSlide after displayAds is ready
  useEffect(() => {
    if (displayAds.length > 0 && currentSlide === 0) {
      setCurrentSlide(displayAds.length)
    }
  }, [displayAds.length])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-slide functionality - infinite scroll to the right
  useEffect(() => {
    if (isPaused || displayAds.length === 0) return // Don't auto-scroll when paused or no ads

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1)
    }, 1600) // Change slide every 1.6 seconds

    return () => clearInterval(slideInterval)
  }, [isPaused, displayAds.length])

  // Reset position for infinite loop effect
  useEffect(() => {
    if (displayAds.length === 0) return

    // When we reach the end of the second set, instantly reset to the first set
    if (currentSlide >= displayAds.length * 2) {
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentSlide(displayAds.length)
        setTimeout(() => setIsTransitioning(true), 50)
      }, 500) // Wait for transition to complete
    }
    // When going backward past the first set, reset to the second set
    if (currentSlide < displayAds.length) {
      setIsTransitioning(false)
      setCurrentSlide(displayAds.length)
      setTimeout(() => setIsTransitioning(true), 50)
    }
  }, [currentSlide, displayAds.length])

  // Manual navigation functions
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

  const handleAdClick = (index) => {
    // Navigate to ad detail or do nothing for static images
    console.log('Ad clicked:', index)
  }

  // Don't render if loading or no ads
  if (adsLoading || displayAds.length === 0) {
    return null
  }

  return (
    <section className='pb-0 lg:pb-1 bg-white'>
      <div className='container mx-auto px-4'>
        {/* Horizontal sliding carousel for both Mobile and Desktop */}
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
              displayAds.map((ad, index) => (
                <div key={`${setIndex}-${index}`} className='flex-shrink-0 px-0.5 lg:px-2' style={{ width: isDesktop ? '20%' : '80%' }}>
                  <div
                    onClick={() => ad.link ? window.open(ad.link, '_blank') : handleAdClick(index)}
                    className='bg-white rounded-lg lg:rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-200 flex items-center justify-center bg-gray-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1'
                    style={{ height: isDesktop ? '160px' : '150px' }}
                  >
                    <img
                      src={ad.adImg}
                      alt={ad.title || `Advertisement ${index + 1}`}
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
  )
}

export default AdsCarousel
