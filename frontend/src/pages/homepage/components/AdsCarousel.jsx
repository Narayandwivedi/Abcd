import { useEffect, useState } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

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

  if (loading || ads.length === 0) {
    return null
  }

  return (
    <section className='pb-0 lg:pb-1 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='max-w-7xl mx-auto grid grid-cols-2 gap-2 md:gap-3'>
          {ads.map((ad, index) => (
            <AdCard key={ad._id || index} ad={ad} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AdsCarousel
