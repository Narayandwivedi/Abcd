import React from 'react'

const BuySellLeadSection = ({ handleBuyLeadClick, handleSellLeadClick, navigate }) => {
  return (
    <section className='py-1.5 mt-2 md:py-2 bg-gradient-to-br from-blue-50 via-white to-green-50'>
      <div className='container mx-auto px-4'>
        <div className='max-w-3xl mx-auto space-y-2'>
          <div className='grid grid-cols-2 gap-2 md:gap-3'>
            <button
              onClick={handleBuyLeadClick}
              className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 md:py-2.5 px-2 md:px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5'
            >
              <div className='flex items-center justify-center gap-1.5 md:gap-2'>
                <svg className='w-4 h-4 md:w-5 md:h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
                </svg>
                <div className='text-left'>
                  <h3 className='text-[11px] md:text-xs font-bold leading-tight'>Post Your Buy Lead</h3>
                  <p className='text-[9px] md:text-[10px] text-blue-100 leading-tight'>आपको क्या खरीदना है</p>
                </div>
              </div>
            </button>

            <button
              onClick={handleSellLeadClick}
              className='bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 md:py-2.5 px-2 md:px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5'
            >
              <div className='flex items-center justify-center gap-1.5 md:gap-2'>
                <svg className='w-4 h-4 md:w-5 md:h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                <div className='text-left'>
                  <h3 className='text-[11px] md:text-xs font-bold leading-tight'>Post Your Sell Lead</h3>
                  <p className='text-[9px] md:text-[10px] text-green-100 leading-tight'>आपको क्या बेचना है</p>
                </div>
              </div>
            </button>
          </div>

          <div className='grid grid-cols-2 gap-2 md:gap-3'>
            <button
              onClick={() => navigate('/buy-leads')}
              className='bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-2 md:py-2.5 px-2 md:px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5'
            >
              <div className='flex items-center justify-center gap-1.5 md:gap-2'>
                <svg className='w-4 h-4 md:w-5 md:h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                </svg>
                <div className='text-left'>
                  <h3 className='text-[11px] md:text-xs font-bold leading-tight'>See All Buy Offers</h3>
                  <p className='text-[9px] md:text-[10px] text-indigo-100 leading-tight'>सभी खरीददार क्या चाहते हैं</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/sell-leads')}
              className='bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-2 md:py-2.5 px-2 md:px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5'
            >
              <div className='flex items-center justify-center gap-1.5 md:gap-2'>
                <svg className='w-4 h-4 md:w-5 md:h-5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                </svg>
                <div className='text-left'>
                  <h3 className='text-[11px] md:text-xs font-bold leading-tight'>See All Sell Offers</h3>
                  <p className='text-[9px] md:text-[10px] text-orange-100 leading-tight'>सभी विक्रेता क्या बेच रहे हैं</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BuySellLeadSection
