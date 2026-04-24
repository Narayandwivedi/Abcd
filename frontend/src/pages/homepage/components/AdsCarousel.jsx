import { useEffect, useMemo, useState } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'
const SLIDE_INTERVAL_MS = 1200
const SLIDE_TRANSITION_MS = 500

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

const AdCard = ({ ad, index }) => {
  const imageUrl = getAdImageUrl(ad.adImg)
  const isClickable = Boolean(ad.link)

  return (
    <div className='w-1/2 flex-shrink-0 px-1.5'>
      <button
        type='button'
        onClick={() => openAdLink(ad.link)}
        disabled={!isClickable}
        className={`relative h-32 md:h-40 w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden ${
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

  const carouselAds = useMemo(() => {
    if (ads.length <= 1) {
      return ads
    }

    return [...ads, ...ads, ...ads]
  }, [ads])

  useEffect(() => {
    if (ads.length > 1) {
      setCurrentSlide(ads.length)
      setIsTransitioning(true)
    } else {
      setCurrentSlide(0)
    }
  }, [ads.length])

  useEffect(() => {
    if (ads.length <= 1) {
      return undefined
    }

    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => prev + 1)
    }, SLIDE_INTERVAL_MS)

    return () => clearInterval(intervalId)
  }, [ads.length])

  useEffect(() => {
    if (ads.length <= 1) {
      return undefined
    }

    if (currentSlide >= ads.length * 2) {
      const timeoutId = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentSlide(ads.length)
      }, SLIDE_TRANSITION_MS)

      return () => clearTimeout(timeoutId)
    }

    return undefined
  }, [ads.length, currentSlide])

  useEffect(() => {
    if (!isTransitioning) {
      const frameId = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setIsTransitioning(true)
        })
      })

      return () => window.cancelAnimationFrame(frameId)
    }

    return undefined
  }, [isTransitioning])

  if (loading || ads.length === 0) {
    return null
  }

  if (ads.length === 1) {
    return (
      <section className='pb-0 lg:pb-1 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-7xl mx-auto px-1.5'>
            <button
              type='button'
              onClick={() => openAdLink(ads[0].link)}
              disabled={!ads[0].link}
              className={`relative h-32 md:h-40 w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden ${
                ads[0].link ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'
              } transition-shadow`}
              aria-label={ads[0].title || 'Advertisement 1'}
            >
              <img
                src={getAdImageUrl(ads[0].adImg)}
                alt={ads[0].title || 'Advertisement 1'}
                loading='lazy'
                className='w-full h-full object-contain bg-gray-50'
              />
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='pb-0 lg:pb-1 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='max-w-7xl mx-auto overflow-hidden'>
          <div
            className='flex'
            style={{
              transform: `translateX(-${currentSlide * 50}%)`,
              transition: isTransitioning ? `transform ${SLIDE_TRANSITION_MS}ms ease-in-out` : 'none'
            }}
          >
            {carouselAds.map((ad, index) => (
              <AdCard key={`${ad._id || ad.title || 'ad'}-${index}`} ad={ad} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdsCarousel
