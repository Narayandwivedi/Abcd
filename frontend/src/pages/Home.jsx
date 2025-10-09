import React from 'react'

const Home = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Search Bar Section */}
      <section className='bg-white shadow-md sticky top-0 z-40 border-b border-gray-200'>
        <div className='container mx-auto px-4 py-4'>
          <div className='max-w-6xl mx-auto'>
            <div className='flex flex-col md:flex-row gap-4 items-stretch md:items-center'>
              {/* Search Input */}
              <div className='relative flex-1'>
                <input
                  type='text'
                  placeholder='Search for products, services, vendors...'
                  className='w-full px-6 py-4 pl-14 pr-32 rounded-2xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 shadow-lg'
                />
                <svg
                  className='absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
                <button className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md'>
                  Search
                </button>
              </div>

              {/* City Selector */}
              <div className='relative w-full md:w-auto md:min-w-[160px]'>
                <select className='w-full px-3 py-3 md:py-4 pl-9 pr-8 rounded-xl md:rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-sm font-medium shadow-lg bg-white cursor-pointer appearance-none'>
                  <option value=''>📍 Select City</option>
                  <option value='raipur'>Raipur</option>
                  <option value='bhilai'>Bhilai</option>
                  <option value='bilaspur'>Bilaspur</option>
                  <option value='korba'>Korba</option>
                  <option value='durg'>Durg</option>
                  <option value='rajnandgaon'>Rajnandgaon</option>
                  <option value='raigarh'>Raigarh</option>
                  <option value='jagdalpur'>Jagdalpur</option>
                  <option value='ambikapur'>Ambikapur</option>
                  <option value='dhamtari'>Dhamtari</option>
                  <option value='mahasamund'>Mahasamund</option>
                  <option value='kanker'>Kanker</option>
                  <option value='kawardha'>Kawardha</option>
                  <option value='janjgir'>Janjgir-Champa</option>
                  <option value='chirmiri'>Chirmiri</option>
                  <option value='bemetara'>Bemetara</option>
                  <option value='naila-janjgir'>Naila Janjgir</option>
                  <option value='tilda-newra'>Tilda Newra</option>
                  <option value='mungeli'>Mungeli</option>
                  <option value='manendragarh'>Manendragarh</option>
                  <option value='sakti'>Sakti</option>
                  <option value='kondagaon'>Kondagaon</option>
                  <option value='bhatapara'>Bhatapara</option>
                  <option value='dongargarh'>Dongargarh</option>
                  <option value='balod'>Balod</option>
                  <option value='baloda-bazar'>Baloda Bazar</option>
                  <option value='balrampur'>Balrampur</option>
                  <option value='gariaband'>Gariaband</option>
                  <option value='jashpur'>Jashpur</option>
                  <option value='khairagarh'>Khairagarh</option>
                  <option value='bastar'>Bastar</option>
                  <option value='bijapur'>Bijapur</option>
                  <option value='dantewada'>Dantewada</option>
                  <option value='narayanpur'>Narayanpur</option>
                  <option value='sukma'>Sukma</option>
                </select>
                <svg
                  className='absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 md:hidden text-gray-500 pointer-events-none'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
                <svg
                  className='absolute right-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </div>
            </div>

            {/* Quick Search Tags */}
            <div className='flex flex-wrap gap-2 mt-3 justify-center'>
              <span className='px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold cursor-pointer hover:bg-blue-100 transition'>
                Medicine
              </span>
              <span className='px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold cursor-pointer hover:bg-green-100 transition'>
                Grocery
              </span>
              <span className='px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-semibold cursor-pointer hover:bg-orange-100 transition'>
                Foods
              </span>
              <span className='px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold cursor-pointer hover:bg-purple-100 transition'>
                Electronics
              </span>
              <span className='px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-semibold cursor-pointer hover:bg-pink-100 transition'>
                Fashion
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-12 overflow-hidden'>
        {/* Background Elements */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute top-20 right-20 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-20 left-20 w-80 h-80 bg-purple-500 opacity-10 rounded-full blur-3xl'></div>
          <div className='absolute top-1/2 left-1/3 w-40 h-40 bg-indigo-500 opacity-10 rounded-full blur-2xl'></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className='absolute inset-0 opacity-5'>
          <div className='absolute inset-0' style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className='container mx-auto px-4 text-center relative z-10'>
          <div className='max-w-4xl mx-auto'>
            {/* Badge */}
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6'>
              <span className='w-2 h-2 bg-green-400 rounded-full'></span>
              <span className='text-sm font-medium'>Welcome to the Future of Community Growth</span>
            </div>

            <h1 className='text-4xl md:text-5xl font-black mb-4 leading-tight'>
              <span className='block bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent drop-shadow-2xl'>
                ABCD Platform
              </span>
            </h1>

            <p className='text-xl md:text-2xl mb-3 font-bold bg-gradient-to-r from-yellow-300 to-red-400 bg-clip-text text-transparent'>
              Agrawal Business & Community Development
            </p>

            <p className='text-base md:text-lg mb-6 text-gray-300 max-w-2xl mx-auto leading-relaxed'>
              Empowering businesses, strengthening communities, and building a prosperous future together through innovation and unity.
            </p>

            <div className='flex flex-col sm:flex-row gap-3 justify-center items-center'>
              <button className='bg-white text-gray-900 px-6 py-3 rounded-xl font-bold text-base hover:bg-yellow-400 hover:text-gray-900 transition-all shadow-2xl transform hover:scale-105 hover:-translate-y-1'>
                Get Started Now →
              </button>
              <button className='bg-transparent border-2 border-white text-white px-6 py-3 rounded-xl font-bold text-base hover:bg-white hover:text-gray-900 transition-all shadow-xl transform hover:scale-105'>
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-6 mt-8 max-w-2xl mx-auto'>
              <div className='text-center'>
                <div className='text-3xl font-black text-yellow-400'>500+</div>
                <div className='text-xs text-gray-400 mt-1'>Active Members</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-black text-yellow-400'>1000+</div>
                <div className='text-xs text-gray-400 mt-1'>Businesses</div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-black text-yellow-400'>24/7</div>
                <div className='text-xs text-gray-400 mt-1'>Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Categories Section */}
      <section className='py-20 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-black mb-4 text-gray-800'>
              Shop by Category
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Browse through our wide range of categories from trusted vendors
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto'>
            {/* Medicine */}
            <div className='group bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-green-200 hover:border-green-400 transform hover:-translate-y-2 cursor-pointer'>
              <div className='bg-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md'>
                <span className='text-4xl'>💊</span>
              </div>
              <h3 className='text-center font-bold text-gray-800'>Medicine</h3>
              <p className='text-center text-xs text-gray-600 mt-1'>Health & Pharmacy</p>
            </div>

            {/* Services */}
            <div className='group bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-400 transform hover:-translate-y-2 cursor-pointer'>
              <div className='bg-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md'>
                <span className='text-4xl'>🔧</span>
              </div>
              <h3 className='text-center font-bold text-gray-800'>Services</h3>
              <p className='text-center text-xs text-gray-600 mt-1'>Professional Help</p>
            </div>

            {/* Foods */}
            <div className='group bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-200 hover:border-orange-400 transform hover:-translate-y-2 cursor-pointer'>
              <div className='bg-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md'>
                <span className='text-4xl'>🍔</span>
              </div>
              <h3 className='text-center font-bold text-gray-800'>Foods</h3>
              <p className='text-center text-xs text-gray-600 mt-1'>Restaurants & Cafes</p>
            </div>

            {/* Beverages */}
            <div className='group bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-400 transform hover:-translate-y-2 cursor-pointer'>
              <div className='bg-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md'>
                <span className='text-4xl'>🍾</span>
              </div>
              <h3 className='text-center font-bold text-gray-800'>Beverages</h3>
              <p className='text-center text-xs text-gray-600 mt-1'>Drinks & Juices</p>
            </div>

            {/* Grocery */}
            <div className='group bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-red-200 hover:border-red-400 transform hover:-translate-y-2 cursor-pointer'>
              <div className='bg-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md'>
                <span className='text-4xl'>🛒</span>
              </div>
              <h3 className='text-center font-bold text-gray-800'>Grocery</h3>
              <p className='text-center text-xs text-gray-600 mt-1'>Daily Essentials</p>
            </div>

            {/* Electronics */}
            <div className='group bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-indigo-200 hover:border-indigo-400 transform hover:-translate-y-2 cursor-pointer'>
              <div className='bg-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md'>
                <span className='text-4xl'>📱</span>
              </div>
              <h3 className='text-center font-bold text-gray-800'>Electronics</h3>
              <p className='text-center text-xs text-gray-600 mt-1'>Gadgets & Tech</p>
            </div>

            {/* Fashion */}
            <div className='group bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-pink-200 hover:border-pink-400 transform hover:-translate-y-2 cursor-pointer'>
              <div className='bg-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md'>
                <span className='text-4xl'>👗</span>
              </div>
              <h3 className='text-center font-bold text-gray-800'>Fashion</h3>
              <p className='text-center text-xs text-gray-600 mt-1'>Clothing & Style</p>
            </div>

            {/* Home & Living */}
            <div className='group bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-teal-200 hover:border-teal-400 transform hover:-translate-y-2 cursor-pointer'>
              <div className='bg-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md'>
                <span className='text-4xl'>🏠</span>
              </div>
              <h3 className='text-center font-bold text-gray-800'>Home & Living</h3>
              <p className='text-center text-xs text-gray-600 mt-1'>Furniture & Decor</p>
            </div>

            {/* Beauty */}
            <div className='group bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-rose-200 hover:border-rose-400 transform hover:-translate-y-2 cursor-pointer'>
              <div className='bg-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md'>
                <span className='text-4xl'>💄</span>
              </div>
              <h3 className='text-center font-bold text-gray-800'>Beauty</h3>
              <p className='text-center text-xs text-gray-600 mt-1'>Cosmetics & Care</p>
            </div>

            {/* Books */}
            <div className='group bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-amber-200 hover:border-amber-400 transform hover:-translate-y-2 cursor-pointer'>
              <div className='bg-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md'>
                <span className='text-4xl'>📚</span>
              </div>
              <h3 className='text-center font-bold text-gray-800'>Books</h3>
              <p className='text-center text-xs text-gray-600 mt-1'>Education & Learning</p>
            </div>

            {/* Sports */}
            <div className='group bg-gradient-to-br from-lime-50 to-lime-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-lime-200 hover:border-lime-400 transform hover:-translate-y-2 cursor-pointer'>
              <div className='bg-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md'>
                <span className='text-4xl'>⚽</span>
              </div>
              <h3 className='text-center font-bold text-gray-800'>Sports</h3>
              <p className='text-center text-xs text-gray-600 mt-1'>Fitness & Outdoor</p>
            </div>

            {/* Toys */}
            <div className='group bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-cyan-200 hover:border-cyan-400 transform hover:-translate-y-2 cursor-pointer'>
              <div className='bg-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md'>
                <span className='text-4xl'>🧸</span>
              </div>
              <h3 className='text-center font-bold text-gray-800'>Toys</h3>
              <p className='text-center text-xs text-gray-600 mt-1'>Kids & Games</p>
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
            Join Now - It's Free!
          </button>
        </div>
      </section>

      {/* Fixed Mobile Buttons */}
      <div className='fixed bottom-6 right-6 flex flex-col gap-3 z-50'>
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

        {/* Join as Vendor Button */}
        <a
          href='/vendor-registration'
          className='group bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center gap-2 px-4 py-3'
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

export default Home
