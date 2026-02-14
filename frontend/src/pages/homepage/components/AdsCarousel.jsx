import { useEffect, useMemo, useState } from 'react'

const HOT_DEAL_FILES = [
  'deal1.jpg',
  'deal11.jpg',
  'deal2.jpg',
  'deal3.jpg',
  'deal8.jpg',
  'images (1).jpg',
  'images (2).jpg',
  'images (3).jpg',
  'images (4).jpg',
  'images (5).jpg',
  'images (6).jpg',
  'images.jpg'
]

const COLLAPSE_MS = 720
const REVEAL_MS = 520
const SWITCH_INTERVAL_MS = 2500

const hotDealAds = HOT_DEAL_FILES.map((fileName, index) => ({
  id: `hot-deal-${index + 1}`,
  src: `/hot%20deals/${encodeURIComponent(fileName)}`,
  alt: `Hot Deal ${index + 1}`
}))

const ImageAdCard = ({ ad }) => {
  return (
    <div className='relative h-32 md:h-40 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden'>
      <img
        src={ad.src}
        alt={ad.alt}
        loading='lazy'
        className='w-full h-full object-cover'
      />
    </div>
  )
}

const AdsCarousel = () => {
  const [groupIndex, setGroupIndex] = useState(0)
  const [animationPhase, setAnimationPhase] = useState('idle')

  const adGroups = useMemo(() => {
    const groups = []
    for (let i = 0; i < hotDealAds.length; i += 4) {
      groups.push(hotDealAds.slice(i, i + 4))
    }
    return groups
  }, [])

  useEffect(() => {
    if (adGroups.length <= 1) {
      return
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

  const visibleAds = adGroups[groupIndex] || hotDealAds.slice(0, 4)

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
          {visibleAds.map((ad) => (
            <ImageAdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AdsCarousel
