import React from 'react'

const YouTubeDemo = () => {
  return (
    <section className='py-1 lg:py-2 bg-gray-100'>
      <div className='container mx-auto px-4'>
        <div className='max-w-xs lg:max-w-sm mx-auto'>
          {/* YouTube Video Container */}
          <div className='relative w-full bg-white rounded shadow-sm overflow-hidden'>
            <div className='relative' style={{ paddingBottom: '40%' }}>
              <iframe
                className='absolute top-0 left-0 w-full h-full'
                src='https://www.youtube.com/embed/dQw4w9WgXcQ'
                title='ABCD Vyapar Demo'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default YouTubeDemo
