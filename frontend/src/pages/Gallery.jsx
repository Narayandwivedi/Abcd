import React from 'react'

const Gallery = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4'>
      <div className='container mx-auto max-w-6xl'>
        {/* Page Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-4'>
            ABCD Gallery
          </h1>
          <p className='text-gray-600 text-lg mb-4'>
            Showcasing our community's journey and achievements
          </p>
          <div className='w-24 h-1 bg-gradient-to-r from-orange-500 to-blue-500 mx-auto'></div>
        </div>

        {/* Banner Gallery */}
        <div className='space-y-8'>
          {/* Banner 1 - Main Promotional Banner */}
          <div className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300'>
            <div className='p-8 md:p-12 text-white'>
              <div className='flex flex-col md:flex-row items-center justify-between gap-8'>
                <div className='flex-1 text-center md:text-left'>
                  <h2 className='text-4xl md:text-5xl font-black mb-4'>
                    Welcome to <span className='text-yellow-300'>ABCD Vyapar</span>
                  </h2>
                  <p className='text-xl md:text-2xl mb-6 text-blue-100'>
                    Connecting 15,000+ Verified Buyers & Vendors
                  </p>
                  <div className='flex flex-wrap gap-4 justify-center md:justify-start'>
                    <div className='bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full'>
                      <span className='font-bold text-lg'>Trusted Platform</span>
                    </div>
                    <div className='bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full'>
                      <span className='font-bold text-lg'>Verified Members</span>
                    </div>
                    <div className='bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full'>
                      <span className='font-bold text-lg'>Secure Trading</span>
                    </div>
                  </div>
                </div>
                <div className='flex-shrink-0'>
                  <div className='w-48 h-48 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30'>
                    <div className='text-center'>
                      <div className='text-6xl font-black mb-2'>
                        <span className='text-orange-300'>A</span>
                        <span className='text-red-300'>B</span>
                        <span className='text-blue-300'>C</span>
                        <span className='text-green-300'>D</span>
                      </div>
                      <p className='text-sm font-semibold'>Since 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Banner 2 - Community Unity Banner */}
          <div className='bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300'>
            <div className='p-8 md:p-12 text-white'>
              <div className='flex flex-col md:flex-row items-center gap-8'>
                <div className='flex-1'>
                  <div className='inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4'>
                    <span className='font-bold'>Our Mission</span>
                  </div>
                  <h2 className='text-3xl md:text-4xl font-black mb-4'>
                    Empowering Growth & Empowering Unity
                  </h2>
                  <p className='text-lg md:text-xl mb-6 text-orange-100'>
                    Building a stronger Agrawal community through business development, innovation, and collaboration. Together, we create opportunities that drive success for all members.
                  </p>
                  <div className='flex items-center gap-4'>
                    <div className='text-center bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl'>
                      <div className='text-3xl font-bold'>15K+</div>
                      <div className='text-sm'>Members</div>
                    </div>
                    <div className='text-center bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl'>
                      <div className='text-3xl font-bold'>500+</div>
                      <div className='text-sm'>Vendors</div>
                    </div>
                    <div className='text-center bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl'>
                      <div className='text-3xl font-bold'>24/7</div>
                      <div className='text-sm'>Support</div>
                    </div>
                  </div>
                </div>
                <div className='flex-shrink-0'>
                  <div className='w-64 h-64 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/30 p-6'>
                    <div className='text-center'>
                      <svg className='w-32 h-32 mx-auto mb-4' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
                      </svg>
                      <p className='text-xl font-bold'>Community First</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Banner 3 - Chairman Message Banner */}
          <div className='bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300'>
            <div className='p-8 md:p-12 text-white'>
              <div className='flex flex-col md:flex-row-reverse items-center gap-8'>
                <div className='flex-1'>
                  <div className='inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4'>
                    <span className='font-bold'>Leadership</span>
                  </div>
                  <h2 className='text-3xl md:text-4xl font-black mb-4'>
                    Visionary Leadership
                  </h2>
                  <p className='text-lg md:text-xl mb-4 text-green-100'>
                    "Together we are building a platform that not only connects businesses but strengthens the bonds within our community. ABCD Vyapar is more than a marketplace—it's a movement toward collective prosperity and unity."
                  </p>
                  <div className='flex items-center gap-4 mt-6'>
                    <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white/40'>
                      LA
                    </div>
                    <div>
                      <h3 className='text-xl font-bold'>Lalit Agrawal</h3>
                      <p className='text-green-200'>Chairman, ABCD</p>
                    </div>
                  </div>
                </div>
                <div className='flex-shrink-0'>
                  <div className='w-64 h-64 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/30 p-6'>
                    <div className='text-center'>
                      <svg className='w-32 h-32 mx-auto mb-4' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z' />
                      </svg>
                      <p className='text-xl font-bold'>Excellence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className='mt-12 bg-white rounded-2xl shadow-xl p-8 text-center'>
          <h3 className='text-2xl md:text-3xl font-bold text-gray-800 mb-4'>
            Join ABCD Vyapar Today
          </h3>
          <p className='text-gray-600 mb-6 text-lg'>
            Be part of India's fastest-growing business community
          </p>
          <div className='flex flex-wrap gap-4 justify-center'>
            <button className='bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:scale-105'>
              Join as Buyer
            </button>
            <button className='bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all shadow-md hover:shadow-lg transform hover:scale-105'>
              Join as Vendor
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gallery
