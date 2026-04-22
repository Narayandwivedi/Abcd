import { useEffect, useMemo, useState } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'
const COLLAPSE_MS = 720
const REVEAL_MS = 520
const SWITCH_INTERVAL_MS = 2600

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
    <button
      type='button'
      onClick={() => openAdLink(ad.link)}
      disabled={!isClickable}
      className={`relative h-32 md:h-40 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden ${
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
  )
}

const AdsCarousel = () => {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [groupIndex, setGroupIndex] = useState(0)
  const [animationPhase, setAnimationPhase] = useState('idle')

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

  const adGroups = useMemo(() => {
    const groups = []
    for (let i = 0; i < ads.length; i += 4) {
      groups.push(ads.slice(i, i + 4))
    }
    return groups
  }, [ads])

  useEffect(() => {
    if (adGroups.length <= 1) {
      return undefined
    }

    let collapseTimerId = null

    const intervalId = setInterval(() => {
      setAnimationPhase('collapsing')

      collapseTimerId = setTimeout(() => {
        setGroupIndex((prev) => (prev + 1) % adGroups.length)
        setAnimationPhase('revealing')
      }, COLLAPSE_MS)
    }, SWITCH_INTERVAL_MS)

    return () => {
      clearInterval(intervalId)
      if (collapseTimerId) {
        clearTimeout(collapseTimerId)
      }
    }
  }, [adGroups.length])

  useEffect(() => {
    if (groupIndex >= adGroups.length) {
      setGroupIndex(0)
    }
  }, [adGroups.length, groupIndex])

  if (loading || ads.length === 0) {
    return null
  }

  const visibleAds = adGroups[groupIndex] || adGroups[0] || []
  const isCollapsing = animationPhase === 'collapsing'
  const gridAnimationStyle = {
    transitionProperty: 'transform, opacity, filter',
    transitionDuration: `${isCollapsing ? COLLAPSE_MS : REVEAL_MS}ms`,
    transitionTimingFunction: isCollapsing
      ? 'cubic-bezier(0.4, 0, 0.2, 1)'
      : 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    transformOrigin: 'center center',
    willChange: 'transform, opacity, filter',
    transform:
      isCollapsing
        ? 'scale(0.94) translateY(-6px)'
        : 'scale(1) translateY(0px)',
    opacity: isCollapsing ? 0.06 : 1,
    filter: isCollapsing ? 'blur(2px) saturate(0.95)' : 'blur(0px) saturate(1)'
  }

  return (
    <section className='pb-0 lg:pb-1 bg-white'>
      <div className='container mx-auto px-4'>
        <div
          className='max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3'
          style={gridAnimationStyle}
        >
          {visibleAds.map((ad, index) => (
            <AdCard key={ad._id || `${groupIndex}-${index}`} ad={ad} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AdsCarousel
