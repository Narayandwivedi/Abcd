import React, { useState, useEffect } from 'react'
import WhatsAppButton from '../component/WhatsAppButton'

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-slide functionality - cycles through 0, 1, 2, 3 for mobile (showing 2 ads at a time)
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4) // 0, 1, 2, 3 then back to 0
    }, 3000) // Change slide every 3 seconds

    return () => clearInterval(slideInterval)
  }, [])

  // Manual navigation functions
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 3 : prev - 1))
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 4)
  }
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Search Bar Section */}
      <section className='bg-white shadow-sm md:shadow-md sticky top-0 z-40 border-b border-gray-200'>
        <div className='container mx-auto px-3 md:px-4 py-1 md:py-4'>
          <div className='max-w-6xl mx-auto'>
            <div className='flex flex-col md:flex-row gap-1.5 md:gap-4 items-stretch md:items-center'>
              {/* City Selector - First on Mobile, Second on Desktop */}
              <div className='relative w-full md:w-auto md:min-w-[160px] md:order-2'>
                <select className='w-full px-2 py-1 pl-6 pr-5 md:px-3 md:py-2 md:pl-9 md:pr-8 rounded-md md:rounded-xl border md:border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-[11px] md:text-sm font-medium shadow-sm md:shadow-lg bg-white cursor-pointer appearance-none h-[28px] md:h-[38px]'>
                  <option value=''>📍 Select District</option>
                  <option value='balod'>Balod</option>
                  <option value='baloda-bazar'>Baloda Bazar</option>
                  <option value='balrampur'>Balrampur</option>
                  <option value='bastar'>Bastar</option>
                  <option value='bemetara'>Bemetara</option>
                  <option value='bijapur'>Bijapur</option>
                  <option value='bilaspur'>Bilaspur</option>
                  <option value='dantewada'>Dantewada</option>
                  <option value='dhamtari'>Dhamtari</option>
                  <option value='durg'>Durg</option>
                  <option value='gariaband'>Gariaband</option>
                  <option value='gaurela-pendra-marwahi'>Gaurela-Pendra-Marwahi</option>
                  <option value='janjgir-champa'>Janjgir-Champa</option>
                  <option value='jashpur'>Jashpur</option>
                  <option value='kanker'>Kanker</option>
                  <option value='kawardha'>Kawardha (Kabirdham)</option>
                  <option value='khairagarh-chhuikhadan-gandai'>Khairagarh-Chhuikhadan-Gandai</option>
                  <option value='kondagaon'>Kondagaon</option>
                  <option value='korba'>Korba</option>
                  <option value='korea'>Korea (Koriya)</option>
                  <option value='mahasamund'>Mahasamund</option>
                  <option value='manendragarh-chirmiri-bharatpur'>Manendragarh-Chirmiri-Bharatpur</option>
                  <option value='mohla-manpur-ambagarh-chouki'>Mohla-Manpur-Ambagarh Chouki</option>
                  <option value='mungeli'>Mungeli</option>
                  <option value='narayanpur'>Narayanpur</option>
                  <option value='raigarh'>Raigarh</option>
                  <option value='raipur'>Raipur</option>
                  <option value='rajnandgaon'>Rajnandgaon</option>
                  <option value='sakti'>Sakti</option>
                  <option value='sarangarh-bilaigarh'>Sarangarh-Bilaigarh</option>
                  <option value='sukma'>Sukma</option>
                  <option value='surajpur'>Surajpur</option>
                  <option value='surguja'>Surguja</option>
                </select>
                <svg
                  className='absolute left-1 md:left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 md:hidden text-gray-500 pointer-events-none'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
                <svg
                  className='absolute right-1 md:right-2.5 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-gray-500 pointer-events-none'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </div>

              {/* Search Input - Second on Mobile, First on Desktop */}
              <div className='relative flex-1 md:order-1'>
                <input
                  type='text'
                  placeholder='Search products, services...'
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

      {/* Sponsored Ads Section */}
      <section className='py-3 lg:py-6 bg-gray-100'>
        <div className='container mx-auto px-4'>
          {/* Desktop: Show all 5 in grid */}
          <div className='hidden lg:grid lg:grid-cols-5 gap-4 max-w-7xl mx-auto'>
            {/* Ad 1 */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-gradient-to-br from-blue-500 to-blue-600 h-40 flex items-center justify-center'>
                <div className='text-white text-center p-4'>
                  <div className='text-4xl mb-2'>🛍️</div>
                  <h3 className='font-bold text-lg'>Shop Now</h3>
                  <p className='text-sm opacity-90'>Amazing Deals</p>
                </div>
              </div>
            </div>

            {/* Ad 2 */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-gradient-to-br from-green-500 to-green-600 h-40 flex items-center justify-center'>
                <div className='text-white text-center p-4'>
                  <div className='text-4xl mb-2'>🎯</div>
                  <h3 className='font-bold text-lg'>New Arrivals</h3>
                  <p className='text-sm opacity-90'>Fresh Collection</p>
                </div>
              </div>
            </div>

            {/* Ad 3 */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-gradient-to-br from-purple-500 to-purple-600 h-40 flex items-center justify-center'>
                <div className='text-white text-center p-4'>
                  <div className='text-4xl mb-2'>⭐</div>
                  <h3 className='font-bold text-lg'>Premium</h3>
                  <p className='text-sm opacity-90'>Quality Assured</p>
                </div>
              </div>
            </div>

            {/* Ad 4 */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-gradient-to-br from-orange-500 to-orange-600 h-40 flex items-center justify-center'>
                <div className='text-white text-center p-4'>
                  <div className='text-4xl mb-2'>🔥</div>
                  <h3 className='font-bold text-lg'>Hot Deals</h3>
                  <p className='text-sm opacity-90'>Limited Time</p>
                </div>
              </div>
            </div>

            {/* Ad 5 */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-gradient-to-br from-pink-500 to-pink-600 h-40 flex items-center justify-center'>
                <div className='text-white text-center p-4'>
                  <div className='text-4xl mb-2'>💎</div>
                  <h3 className='font-bold text-lg'>Luxury</h3>
                  <p className='text-sm opacity-90'>Premium Selection</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Horizontal sliding carousel (First: 85%-15%, Then: 10%-80%-10%) */}
          <div className='lg:hidden relative mx-auto overflow-hidden'>
            {/* Previous Button */}
            <button
              onClick={handlePrevSlide}
              className='absolute left-1 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-lg transition-all'
              aria-label='Previous slide'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={handleNextSlide}
              className='absolute right-1 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-lg transition-all'
              aria-label='Next slide'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </button>

            <div
              className='flex transition-transform duration-500 ease-in-out'
              style={{
                transform: currentSlide === 0
                  ? 'translateX(0)'
                  : `translateX(calc(-70% - ${(currentSlide - 1) * 80}%))`
              }}
            >
              {/* Ad 1 */}
              <div className='flex-shrink-0 px-0.5' style={{ width: '80%' }}>
                <div className='bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer h-full'>
                  <div className='bg-gradient-to-br from-blue-500 to-blue-600 h-28 flex items-center justify-center'>
                    <div className='text-white text-center p-2'>
                      <div className='text-2xl mb-1'>🛍️</div>
                      <h3 className='font-bold text-sm'>Shop Now</h3>
                      <p className='text-[10px] opacity-90'>Amazing Deals</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ad 2 */}
              <div className='flex-shrink-0 px-0.5' style={{ width: '80%' }}>
                <div className='bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer h-full'>
                  <div className='bg-gradient-to-br from-green-500 to-green-600 h-28 flex items-center justify-center'>
                    <div className='text-white text-center p-2'>
                      <div className='text-2xl mb-1'>🎯</div>
                      <h3 className='font-bold text-sm'>New Arrivals</h3>
                      <p className='text-[10px] opacity-90'>Fresh Collection</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ad 3 */}
              <div className='flex-shrink-0 px-0.5' style={{ width: '80%' }}>
                <div className='bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer h-full'>
                  <div className='bg-gradient-to-br from-purple-500 to-purple-600 h-28 flex items-center justify-center'>
                    <div className='text-white text-center p-2'>
                      <div className='text-2xl mb-1'>⭐</div>
                      <h3 className='font-bold text-sm'>Premium</h3>
                      <p className='text-[10px] opacity-90'>Quality Assured</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ad 4 */}
              <div className='flex-shrink-0 px-0.5' style={{ width: '80%' }}>
                <div className='bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer h-full'>
                  <div className='bg-gradient-to-br from-orange-500 to-orange-600 h-28 flex items-center justify-center'>
                    <div className='text-white text-center p-2'>
                      <div className='text-2xl mb-1'>🔥</div>
                      <h3 className='font-bold text-sm'>Hot Deals</h3>
                      <p className='text-[10px] opacity-90'>Limited Time</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ad 5 */}
              <div className='flex-shrink-0 px-0.5' style={{ width: '80%' }}>
                <div className='bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer h-full'>
                  <div className='bg-gradient-to-br from-pink-500 to-pink-600 h-28 flex items-center justify-center'>
                    <div className='text-white text-center p-2'>
                      <div className='text-2xl mb-1'>💎</div>
                      <h3 className='font-bold text-sm'>Luxury</h3>
                      <p className='text-[10px] opacity-90'>Premium Selection</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsored Ads Section - Row 2 */}
      <section className='pb-1 lg:py-2 bg-white'>
        <div className='container mx-auto px-4'>
          {/* Desktop: Show all 5 in grid */}
          <div className='hidden lg:grid lg:grid-cols-5 gap-4 max-w-7xl mx-auto'>
            {/* Ad 1 */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-200'>
              <div className='bg-gradient-to-br from-teal-500 to-teal-600 h-40 flex items-center justify-center'>
                <div className='text-white text-center p-4'>
                  <div className='text-4xl mb-2'>🎁</div>
                  <h3 className='font-bold text-lg'>Gift Ideas</h3>
                  <p className='text-sm opacity-90'>Perfect Presents</p>
                </div>
              </div>
            </div>

            {/* Ad 2 */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-200'>
              <div className='bg-gradient-to-br from-indigo-500 to-indigo-600 h-40 flex items-center justify-center'>
                <div className='text-white text-center p-4'>
                  <div className='text-4xl mb-2'>📚</div>
                  <h3 className='font-bold text-lg'>Education</h3>
                  <p className='text-sm opacity-90'>Learn & Grow</p>
                </div>
              </div>
            </div>

            {/* Ad 3 */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-200'>
              <div className='bg-gradient-to-br from-rose-500 to-rose-600 h-40 flex items-center justify-center'>
                <div className='text-white text-center p-4'>
                  <div className='text-4xl mb-2'>💄</div>
                  <h3 className='font-bold text-lg'>Beauty</h3>
                  <p className='text-sm opacity-90'>Style & Care</p>
                </div>
              </div>
            </div>

            {/* Ad 4 */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-200'>
              <div className='bg-gradient-to-br from-amber-500 to-amber-600 h-40 flex items-center justify-center'>
                <div className='text-white text-center p-4'>
                  <div className='text-4xl mb-2'>🏡</div>
                  <h3 className='font-bold text-lg'>Home</h3>
                  <p className='text-sm opacity-90'>Comfort Living</p>
                </div>
              </div>
            </div>

            {/* Ad 5 */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-200'>
              <div className='bg-gradient-to-br from-cyan-500 to-cyan-600 h-40 flex items-center justify-center'>
                <div className='text-white text-center p-4'>
                  <div className='text-4xl mb-2'>⚡</div>
                  <h3 className='font-bold text-lg'>Tech</h3>
                  <p className='text-sm opacity-90'>Latest Gadgets</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Horizontal sliding carousel (First: 85%-15%, Then: 10%-80%-10%) */}
          <div className='lg:hidden relative mx-auto overflow-hidden'>
            {/* Previous Button */}
            <button
              onClick={handlePrevSlide}
              className='absolute left-1 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-lg transition-all'
              aria-label='Previous slide'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={handleNextSlide}
              className='absolute right-1 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-lg transition-all'
              aria-label='Next slide'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </button>

            <div
              className='flex transition-transform duration-500 ease-in-out'
              style={{
                transform: currentSlide === 0
                  ? 'translateX(0)'
                  : `translateX(calc(-70% - ${(currentSlide - 1) * 80}%))`
              }}
            >
              {/* Ad 1 */}
              <div className='flex-shrink-0 px-0.5' style={{ width: '80%' }}>
                <div className='bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer h-full border border-gray-200'>
                  <div className='bg-gradient-to-br from-teal-500 to-teal-600 h-28 flex items-center justify-center'>
                    <div className='text-white text-center p-2'>
                      <div className='text-2xl mb-1'>🎁</div>
                      <h3 className='font-bold text-sm'>Gift Ideas</h3>
                      <p className='text-[10px] opacity-90'>Perfect Presents</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ad 2 */}
              <div className='flex-shrink-0 px-0.5' style={{ width: '80%' }}>
                <div className='bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer h-full border border-gray-200'>
                  <div className='bg-gradient-to-br from-indigo-500 to-indigo-600 h-28 flex items-center justify-center'>
                    <div className='text-white text-center p-2'>
                      <div className='text-2xl mb-1'>📚</div>
                      <h3 className='font-bold text-sm'>Education</h3>
                      <p className='text-[10px] opacity-90'>Learn & Grow</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ad 3 */}
              <div className='flex-shrink-0 px-0.5' style={{ width: '80%' }}>
                <div className='bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer h-full border border-gray-200'>
                  <div className='bg-gradient-to-br from-rose-500 to-rose-600 h-28 flex items-center justify-center'>
                    <div className='text-white text-center p-2'>
                      <div className='text-2xl mb-1'>💄</div>
                      <h3 className='font-bold text-sm'>Beauty</h3>
                      <p className='text-[10px] opacity-90'>Style & Care</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ad 4 */}
              <div className='flex-shrink-0 px-0.5' style={{ width: '80%' }}>
                <div className='bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer h-full border border-gray-200'>
                  <div className='bg-gradient-to-br from-amber-500 to-amber-600 h-28 flex items-center justify-center'>
                    <div className='text-white text-center p-2'>
                      <div className='text-2xl mb-1'>🏡</div>
                      <h3 className='font-bold text-sm'>Home</h3>
                      <p className='text-[10px] opacity-90'>Comfort Living</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ad 5 */}
              <div className='flex-shrink-0 px-0.5' style={{ width: '80%' }}>
                <div className='bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer h-full border border-gray-200'>
                  <div className='bg-gradient-to-br from-cyan-500 to-cyan-600 h-28 flex items-center justify-center'>
                    <div className='text-white text-center p-2'>
                      <div className='text-2xl mb-1'>⚡</div>
                      <h3 className='font-bold text-sm'>Tech</h3>
                      <p className='text-[10px] opacity-90'>Latest Gadgets</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Categories Section */}
      <section className='pt-3 pb-24 md:py-12 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-2 md:mb-8'>
            <h2 className='text-lg md:text-3xl font-bold text-gray-800'>
              Shop by Category
            </h2>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 md:gap-4 max-w-7xl mx-auto'>
            {/* Medicine */}
            <div className='group bg-gradient-to-br from-green-50 to-green-100 p-3 md:p-4 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-green-200 hover:border-green-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-14 h-14 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-2xl md:text-3xl'>💊</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-xs md:text-sm'>Medicine</h3>
              <p className='text-center text-[9px] md:text-[10px] text-gray-600 mt-0.5'>Health & Pharmacy</p>
            </div>

            {/* Services */}
            <div className='group bg-gradient-to-br from-blue-50 to-blue-100 p-3 md:p-4 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-200 hover:border-blue-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-14 h-14 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-2xl md:text-3xl'>🔧</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-xs md:text-sm'>Services</h3>
              <p className='text-center text-[9px] md:text-[10px] text-gray-600 mt-0.5'>Professional Help</p>
            </div>

            {/* Foods */}
            <div className='group bg-gradient-to-br from-orange-50 to-orange-100 p-3 md:p-4 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-orange-200 hover:border-orange-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-14 h-14 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-2xl md:text-3xl'>🍔</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-xs md:text-sm'>Foods</h3>
              <p className='text-center text-[9px] md:text-[10px] text-gray-600 mt-0.5'>Restaurants & Cafes</p>
            </div>

            {/* Beverages */}
            <div className='group bg-gradient-to-br from-purple-50 to-purple-100 p-3 md:p-4 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-purple-200 hover:border-purple-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-14 h-14 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-2xl md:text-3xl'>🍾</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-xs md:text-sm'>Beverages</h3>
              <p className='text-center text-[9px] md:text-[10px] text-gray-600 mt-0.5'>Drinks & Juices</p>
            </div>

            {/* Grocery */}
            <div className='group bg-gradient-to-br from-red-50 to-red-100 p-3 md:p-4 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-red-200 hover:border-red-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-14 h-14 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-2xl md:text-3xl'>🛒</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-xs md:text-sm'>Grocery</h3>
              <p className='text-center text-[9px] md:text-[10px] text-gray-600 mt-0.5'>Daily Essentials</p>
            </div>

            {/* Electronics */}
            <div className='group bg-gradient-to-br from-indigo-50 to-indigo-100 p-3 md:p-4 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-200 hover:border-indigo-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-14 h-14 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-2xl md:text-3xl'>📱</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-xs md:text-sm'>Electronics</h3>
              <p className='text-center text-[9px] md:text-[10px] text-gray-600 mt-0.5'>Gadgets & Tech</p>
            </div>

            {/* Fashion */}
            <div className='group bg-gradient-to-br from-pink-50 to-pink-100 p-3 md:p-4 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-pink-200 hover:border-pink-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-14 h-14 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-2xl md:text-3xl'>👗</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-xs md:text-sm'>Fashion</h3>
              <p className='text-center text-[9px] md:text-[10px] text-gray-600 mt-0.5'>Clothing & Style</p>
            </div>

            {/* Home & Living */}
            <div className='group bg-gradient-to-br from-teal-50 to-teal-100 p-3 md:p-4 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-teal-200 hover:border-teal-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-14 h-14 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-2xl md:text-3xl'>🏠</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-xs md:text-sm'>Home & Living</h3>
              <p className='text-center text-[9px] md:text-[10px] text-gray-600 mt-0.5'>Furniture & Decor</p>
            </div>

            {/* Beauty */}
            <div className='group bg-gradient-to-br from-rose-50 to-rose-100 p-3 md:p-4 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-rose-200 hover:border-rose-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-14 h-14 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-2xl md:text-3xl'>💄</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-xs md:text-sm'>Beauty</h3>
              <p className='text-center text-[9px] md:text-[10px] text-gray-600 mt-0.5'>Cosmetics & Care</p>
            </div>

            {/* Books */}
            <div className='group bg-gradient-to-br from-amber-50 to-amber-100 p-3 md:p-4 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-amber-200 hover:border-amber-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-14 h-14 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-2xl md:text-3xl'>📚</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-xs md:text-sm'>Books</h3>
              <p className='text-center text-[9px] md:text-[10px] text-gray-600 mt-0.5'>Education & Learning</p>
            </div>

            {/* Sports */}
            <div className='group bg-gradient-to-br from-lime-50 to-lime-100 p-3 md:p-4 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-lime-200 hover:border-lime-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-14 h-14 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-2xl md:text-3xl'>⚽</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-xs md:text-sm'>Sports</h3>
              <p className='text-center text-[9px] md:text-[10px] text-gray-600 mt-0.5'>Fitness & Outdoor</p>
            </div>

            {/* Toys */}
            <div className='group bg-gradient-to-br from-cyan-50 to-cyan-100 p-3 md:p-4 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-cyan-200 hover:border-cyan-400 transform hover:-translate-y-1 cursor-pointer'>
              <div className='bg-white w-14 h-14 md:w-14 md:h-14 rounded-lg flex items-center justify-center mx-auto mb-1.5 md:mb-2 group-hover:scale-110 transition-transform shadow-sm'>
                <span className='text-2xl md:text-3xl'>🧸</span>
              </div>
              <h3 className='text-center font-bold text-gray-800 text-xs md:text-sm'>Toys</h3>
              <p className='text-center text-[9px] md:text-[10px] text-gray-600 mt-0.5'>Kids & Games</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-black mb-4 text-gray-800'>
              Why Choose ABCD?
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Discover the powerful features that make us the premier platform for the Agrawal community
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
            {/* Feature 1 */}
            <div className='group relative bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-400 transform hover:-translate-y-2'>
              <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-2xl'></div>
              <div className='bg-gradient-to-br from-blue-600 to-blue-700 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg'>
                <span className='text-3xl'>📈</span>
              </div>
              <h3 className='text-2xl font-bold mb-3 text-blue-900'>Business Growth</h3>
              <p className='text-gray-600 leading-relaxed'>
                Accelerate your business with cutting-edge tools, expert guidance, and a supportive network designed for success.
              </p>
            </div>

            {/* Feature 2 */}
            <div className='group relative bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-red-400 transform hover:-translate-y-2'>
              <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-700 rounded-t-2xl'></div>
              <div className='bg-gradient-to-br from-red-600 to-red-700 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg'>
                <span className='text-3xl'>🤝</span>
              </div>
              <h3 className='text-2xl font-bold mb-3 text-red-900'>Community Unity</h3>
              <p className='text-gray-600 leading-relaxed'>
                Connect with like-minded individuals, share experiences, and build lasting relationships within our thriving community.
              </p>
            </div>

            {/* Feature 3 */}
            <div className='group relative bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-yellow-400 transform hover:-translate-y-2'>
              <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-t-2xl'></div>
              <div className='bg-gradient-to-br from-yellow-500 to-yellow-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg'>
                <span className='text-3xl'>⚡</span>
              </div>
              <h3 className='text-2xl font-bold mb-3 text-yellow-900'>Fast & Reliable</h3>
              <p className='text-gray-600 leading-relaxed'>
                Experience lightning-fast performance and dependable service that keeps your business running smoothly 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className='py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden'>
        {/* Background Elements */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute top-20 right-20 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-20 left-20 w-80 h-80 bg-purple-500 opacity-10 rounded-full blur-3xl'></div>
        </div>

        <div className='container mx-auto px-4 text-center relative z-10'>
          <h2 className='text-4xl md:text-5xl font-black mb-6'>Ready to Get Started?</h2>
          <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
            Join thousands of successful businesses in the ABCD community today.
          </p>
          <button className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-xl font-bold text-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-2xl transform hover:scale-105 hover:-translate-y-1'>
            Join as a Buyer
          </button>
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
