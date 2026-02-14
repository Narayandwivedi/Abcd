import { useEffect, useMemo, useState } from 'react'

const demoAds = [
  {
    id: 'ad1',
    label: 'ad1',
    title: 'Festival Offer',
    gradient: 'from-rose-500 via-orange-500 to-amber-500',
    icon: 'star'
  },
  {
    id: 'ad2',
    label: 'ad2',
    title: 'New Launch',
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    icon: 'spark'
  },
  {
    id: 'ad3',
    label: 'ad3',
    title: 'Limited Deal',
    gradient: 'from-violet-500 via-fuchsia-500 to-pink-500',
    icon: 'bolt'
  },
  {
    id: 'ad4',
    label: 'ad4',
    title: 'Best Seller',
    gradient: 'from-emerald-500 via-green-500 to-lime-500',
    icon: 'crown'
  },
  {
    id: 'ad5',
    label: 'ad5',
    title: 'Daily Deals',
    gradient: 'from-indigo-500 via-blue-500 to-sky-500',
    icon: 'spark'
  },
  {
    id: 'ad6',
    label: 'ad6',
    title: 'Hot Price',
    gradient: 'from-red-500 via-rose-500 to-pink-500',
    icon: 'bolt'
  },
  {
    id: 'ad7',
    label: 'ad7',
    title: 'Top Rated',
    gradient: 'from-amber-500 via-yellow-500 to-orange-500',
    icon: 'star'
  },
  {
    id: 'ad8',
    label: 'ad8',
    title: 'Weekend Sale',
    gradient: 'from-teal-500 via-emerald-500 to-green-500',
    icon: 'crown'
  }
]

const AdIcon = ({ type }) => {
  if (type === 'spark') {
    return (
      <svg className='w-5 h-5 md:w-6 md:h-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
        <path strokeLinecap='round' strokeLinejoin='round' d='M12 3l1.9 4.2L18 9l-4.1 1.8L12 15l-1.9-4.2L6 9l4.1-1.8L12 3z' />
      </svg>
    )
  }

  if (type === 'bolt') {
    return (
      <svg className='w-5 h-5 md:w-6 md:h-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
        <path strokeLinecap='round' strokeLinejoin='round' d='M13 2L5 14h6l-1 8 9-12h-6l1-8z' />
      </svg>
    )
  }

  if (type === 'crown') {
    return (
      <svg className='w-5 h-5 md:w-6 md:h-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
        <path strokeLinecap='round' strokeLinejoin='round' d='M3 8l4.5 4 4.5-7 4.5 7L21 8l-2 11H5L3 8z' />
      </svg>
    )
  }

  return (
    <svg className='w-5 h-5 md:w-6 md:h-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <path strokeLinecap='round' strokeLinejoin='round' d='M12 3l2.2 4.6L19 8.3l-3.5 3.4.8 4.9L12 14.8 7.7 16.6l.8-4.9L5 8.3l4.8-.7L12 3z' />
    </svg>
  )
}

const DemoAdCard = ({ ad }) => {
  return (
    <div className={`group relative h-32 md:h-40 rounded-xl bg-gradient-to-br ${ad.gradient} p-[1px] shadow-md hover:shadow-xl transition-all duration-300`}>
      <div className='relative h-full rounded-[11px] bg-white/95 p-4 md:p-5 overflow-hidden flex flex-col'>
        <div className='absolute -top-10 -right-8 w-24 h-24 rounded-full bg-white/35 blur-lg' />
        <span className='relative text-[10px] md:text-xs font-semibold text-gray-500'>{ad.label}</span>

        <div className='relative flex-1 flex items-center justify-center'>
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${ad.gradient} text-white flex items-center justify-center shadow-lg`}>
            <AdIcon type={ad.icon} />
          </div>
        </div>

        <p className='relative text-center text-sm md:text-base font-semibold text-gray-900'>{ad.title}</p>
      </div>
    </div>
  )
}

const AdsCarousel = () => {
  const [groupIndex, setGroupIndex] = useState(0)
  const [isCollapsing, setIsCollapsing] = useState(false)

  const adGroups = useMemo(() => {
    const groups = []
    for (let i = 0; i < demoAds.length; i += 4) {
      groups.push(demoAds.slice(i, i + 4))
    }
    return groups
  }, [])

  useEffect(() => {
    let collapseTimerId = null

    const intervalId = setInterval(() => {
      setIsCollapsing(true)

      collapseTimerId = setTimeout(() => {
        setGroupIndex((prev) => (prev + 1) % adGroups.length)
        setIsCollapsing(false)
      }, 230)
    }, 1500)

    return () => {
      clearInterval(intervalId)
      if (collapseTimerId) {
        clearTimeout(collapseTimerId)
      }
    }
  }, [adGroups.length])

  const visibleAds = adGroups[groupIndex] || demoAds.slice(0, 4)

  return (
    <section className='pb-0 lg:pb-1 bg-white'>
      <div className='container mx-auto px-4'>
        <div
          className={`max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 transition-all duration-300 ${
            isCollapsing ? 'scale-95 opacity-85' : 'scale-100 opacity-100'
          }`}
        >
          {visibleAds.map((ad) => (
            <DemoAdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AdsCarousel
