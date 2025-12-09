const Vouchers = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <section className='relative py-20 mb-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-10 right-10 w-72 h-72 bg-blue-500 opacity-10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-10 left-10 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl'></div>
        </div>

        <div className='container mx-auto px-4 relative z-10 text-center'>
          <h1 className='text-6xl font-black mb-6'>Vouchers</h1>
          <p className='text-2xl text-gray-300 max-w-3xl mx-auto'>
            Exclusive Discounts & Offers
          </p>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <div className='bg-white rounded-3xl p-16 shadow-xl border-2 border-gray-200 text-center'>
              {/* Icon */}
              <div className='mb-8 inline-block'>
                <div className='bg-gradient-to-br from-blue-600 to-purple-600 w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-2xl transform hover:scale-110 transition-transform'>
                  🎟️
                </div>
              </div>

              {/* Coming Soon Title */}
              <h2 className='text-5xl font-black mb-6 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Coming Soon
              </h2>

              {/* Description */}
              <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed'>
                We're working on something amazing! Get ready for exclusive vouchers and special discounts that will enhance your experience with ABCD.
              </p>

              {/* Features Preview */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-12'>
                <div className='bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow'>
                  <div className='text-4xl mb-3'>💰</div>
                  <h3 className='text-lg font-bold text-gray-800 mb-2'>
                    Special Discounts
                  </h3>
                  <p className='text-sm text-gray-600'>
                    Exclusive offers for our community
                  </p>
                </div>

                <div className='bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow'>
                  <div className='text-4xl mb-3'>🎁</div>
                  <h3 className='text-lg font-bold text-gray-800 mb-2'>
                    Reward Points
                  </h3>
                  <p className='text-sm text-gray-600'>
                    Earn and redeem rewards
                  </p>
                </div>

                <div className='bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow'>
                  <div className='text-4xl mb-3'>⏰</div>
                  <h3 className='text-lg font-bold text-gray-800 mb-2'>
                    Limited Time Deals
                  </h3>
                  <p className='text-sm text-gray-600'>
                    Time-sensitive exclusive offers
                  </p>
                </div>
              </div>

              {/* Notification Button */}
              <div className='mt-12'>
                <button className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full font-black text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg transform hover:scale-105'>
                  Notify Me When Available
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stay Tuned Section */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto text-center'>
            <h3 className='text-3xl font-black mb-4 text-gray-800'>
              Stay Tuned!
            </h3>
            <p className='text-gray-600 text-lg leading-relaxed'>
              We'll notify you as soon as vouchers are available. In the meantime, explore our other features and stay connected with the ABCD community.
            </p>
          </div>
        </div>
      </section>

      {/* Fixed Buttons */}
      <div className='fixed bottom-24 md:bottom-6 right-6 flex flex-col gap-3 z-40'>
        {/* WhatsApp Button */}
        <a
          href='https://wa.me/917000484146'
          target='_blank'
          rel='noopener noreferrer'
          className='group bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center gap-2 px-4 py-3'
          aria-label='Contact on WhatsApp'
        >
          <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'/>
          </svg>
          <span className='font-semibold text-sm whitespace-nowrap'>WhatsApp</span>
        </a>

        {/* Join as Vendor Button - Desktop Only */}
        <a
          href='https://vendor.abcdvyapar.com'
          target='_blank'
          rel='noopener noreferrer'
          className='hidden md:flex group bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 items-center gap-2 px-4 py-3'
          aria-label='Join as Vendor'
        >
          <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path d='M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H3V6h18v12zm-9-9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/>
          </svg>
          <span className='font-semibold text-sm whitespace-nowrap'>Join as Vendor</span>
        </a>
      </div>
    </div>
  )
}

export default Vouchers
