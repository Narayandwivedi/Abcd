import { useEffect, useMemo, useRef, useState } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'
const SLIDE_INTERVAL_MS = 1200
const SLIDE_TRANSITION_MS = 500
const DESKTOP_BREAKPOINT = 1024

const getAdImageUrl = (imagePath) => {
  if (!imagePath) {
    return ''
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath
  }

  return `${BACKEND_URL}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`
}

const openAdLink = (link) => {
  if (!link) {
    return
  }

  const targetUrl = /^https?:\/\//i.test(link) ? link : `https://${link}`
  window.open(targetUrl, '_blank', 'noopener,noreferrer')
}

const AdCard = ({ ad, index, visibleCount }) => {
  const imageUrl = getAdImageUrl(ad.adImg)
  const isClickable = Boolean(ad.link)

  return (
    <div
      className='flex-shrink-0 px-1 md:px-1.5'
      style={{ width: `${100 / visibleCount}%` }}
    >
      <button
        type='button'
        onClick={() => openAdLink(ad.link)}
        disabled={!isClickable}
        className={`relative h-40 md:h-48 w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden ${
          isClickable ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'
        } transition-shadow`}
        aria-label={ad.title || `Advertisement ${index + 1}`}
      >
        <img
          src={imageUrl}
          alt={ad.title || `Advertisement ${index + 1}`}
          loading='lazy'
          className='w-full h-full object-contain bg-gray-50'
        />
      </button>
    </div>
  )
}

const AdsCarousel = () => {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [visibleCount, setVisibleCount] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BREAKPOINT ? 4 : 2
  )
  const trackRef = useRef(null)
  const touchStartXRef = useRef(0)
  const touchCurrentXRef = useRef(0)
  const isDraggingRef = useRef(false)
  const suppressClickRef = useRef(false)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/ads/active`)
        const data = await response.json()

        if (response.ok && data.success && Array.isArray(data.ads)) {
          setAds(data.ads.filter((ad) => ad.adImg))
        } else {
          setAds([])
        }
      } catch (error) {
        console.error('Error fetching ads:', error)
        setAds([])
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(window.innerWidth >= DESKTOP_BREAKPOINT ? 4 : 2)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const effectiveVisibleCount = Math.min(visibleCount, Math.max(ads.length, 1))

  const carouselAds = useMemo(() => {
    if (ads.length <= effectiveVisibleCount) {
      return ads
    }

    return [...ads, ...ads, ...ads]
  }, [ads, effectiveVisibleCount])

  useEffect(() => {
    if (ads.length > effectiveVisibleCount) {
      setCurrentSlide(ads.length)
      setIsTransitioning(true)
    } else {
      setCurrentSlide(0)
      setIsTransitioning(false)
    }
  }, [ads.length, effectiveVisibleCount])

  useEffect(() => {
    if (ads.length <= effectiveVisibleCount) {
      return undefined
    }

    if (isPaused) {
      return undefined
    }

    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => prev + 1)
    }, SLIDE_INTERVAL_MS)

    return () => clearInterval(intervalId)
  }, [ads.length, effectiveVisibleCount, isPaused])

  useEffect(() => {
    if (ads.length <= effectiveVisibleCount) {
      return undefined
    }

    if (currentSlide >= ads.length * 2) {
      const timeoutId = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentSlide((prev) => prev - ads.length)
      }, SLIDE_TRANSITION_MS)

      return () => clearTimeout(timeoutId)
    }

    if (currentSlide < ads.length) {
      const timeoutId = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentSlide((prev) => prev + ads.length)
      }, SLIDE_TRANSITION_MS)

      return () => clearTimeout(timeoutId)
    }

    return undefined
  }, [ads.length, currentSlide, effectiveVisibleCount])

  useEffect(() => {
    if (!isTransitioning && ads.length > effectiveVisibleCount) {
      const frameId = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setIsTransitioning(true)
        })
      })

      return () => window.cancelAnimationFrame(frameId)
    }

    return undefined
  }, [ads.length, effectiveVisibleCount, isTransitioning])

  const handleTouchStart = (event) => {
    if (ads.length <= effectiveVisibleCount || event.touches.length !== 1) {
      return
    }

    const touchX = event.touches[0].clientX
    touchStartXRef.current = touchX
    touchCurrentXRef.current = touchX
    isDraggingRef.current = true
    suppressClickRef.current = false
    setIsPaused(true)
    setIsTransitioning(false)
    setDragOffset(0)
  }

  const handleTouchMove = (event) => {
    if (!isDraggingRef.current || event.touches.length !== 1) {
      return
    }

    const touchX = event.touches[0].clientX
    touchCurrentXRef.current = touchX

    const deltaX = touchX - touchStartXRef.current
    if (Math.abs(deltaX) > 8) {
      suppressClickRef.current = true
    }

    setDragOffset(deltaX)
  }

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) {
      return
    }

    isDraggingRef.current = false

    const slideWidth = trackRef.current
      ? trackRef.current.offsetWidth / effectiveVisibleCount
      : 0
    const swipeThreshold = Math.max(30, slideWidth * 0.2)
    const totalDeltaX = touchCurrentXRef.current - touchStartXRef.current

    if (Math.abs(totalDeltaX) >= swipeThreshold) {
      setCurrentSlide((prev) => {
        if (totalDeltaX < 0) {
          return prev + 1
        }

        return prev - 1
      })
    }

    setDragOffset(0)
    setIsTransitioning(true)
    setIsPaused(false)
  }

  const handleTouchCancel = () => {
    isDraggingRef.current = false
    setDragOffset(0)
    setIsTransitioning(true)
    setIsPaused(false)
  }

  const handleClickCapture = (event) => {
    if (!suppressClickRef.current) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    suppressClickRef.current = false
  }

  if (loading || ads.length === 0) {
    return null
  }

  if (ads.length <= effectiveVisibleCount) {
    return (
      <section className='pb-0 lg:pb-1 bg-white'>
        <div className='container mx-auto px-1 md:px-4'>
          <div className='max-w-7xl mx-auto flex'>
            {ads.map((ad, index) => (
              <AdCard
                key={ad._id || index}
                ad={ad}
                index={index}
                visibleCount={effectiveVisibleCount}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='pb-0 lg:pb-1 bg-white'>
      <div className='container mx-auto px-1 md:px-4'>
        <div className='max-w-7xl mx-auto overflow-hidden'>
          <div
            ref={trackRef}
            className='flex'
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            onClickCapture={handleClickCapture}
            style={{
              transform: `translateX(calc(-${currentSlide * (100 / effectiveVisibleCount)}% + ${dragOffset}px))`,
              transition: isTransitioning ? `transform ${SLIDE_TRANSITION_MS}ms ease-in-out` : 'none',
              touchAction: 'pan-x pinch-zoom'
            }}
          >
            {carouselAds.map((ad, index) => (
              <AdCard
                key={`${ad._id || ad.title || 'ad'}-${index}`}
                ad={ad}
                index={index}
                visibleCount={effectiveVisibleCount}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdsCarousel
