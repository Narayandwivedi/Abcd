const About = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50'>
      {/* Hero Section */}
      <section className='relative py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-10 right-10 w-72 h-72 bg-yellow-400 opacity-10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-10 left-10 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl'></div>
        </div>

        <div className='container mx-auto px-4 relative z-10 text-center'>
          <h1 className='text-6xl font-black mb-6'>About ABCD</h1>
          <p className='text-2xl text-purple-100 max-w-3xl mx-auto'>
            Agrawal Business & Community Development
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='grid md:grid-cols-2 gap-12 max-w-6xl mx-auto'>
            <div className='bg-white rounded-3xl p-10 shadow-xl border-t-4 border-purple-600'>
              <div className='text-5xl mb-6'>🎯</div>
              <h2 className='text-3xl font-black mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
                Our Mission
              </h2>
              <p className='text-gray-600 text-lg leading-relaxed'>
                To empower the Agrawal community by providing world-class business resources, fostering meaningful connections, and creating opportunities for sustainable growth and prosperity.
              </p>
            </div>

            <div className='bg-white rounded-3xl p-10 shadow-xl border-t-4 border-pink-600'>
              <div className='text-5xl mb-6'>🌟</div>
              <h2 className='text-3xl font-black mb-4 bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent'>
                Our Vision
              </h2>
              <p className='text-gray-600 text-lg leading-relaxed'>
                To become the most trusted and innovative platform that unites Agrawal businesses worldwide, driving economic development and social impact through collaboration and excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='text-5xl font-black text-center mb-16 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent'>
            Our Core Values
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto'>
            <div className='text-center group hover:scale-105 transition-transform'>
              <div className='bg-gradient-to-br from-purple-500 to-pink-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl shadow-lg group-hover:shadow-2xl transition-shadow'>
                🤝
              </div>
              <h3 className='text-xl font-bold mb-2 text-purple-900'>Unity</h3>
              <p className='text-gray-600'>Building stronger communities together</p>
            </div>

            <div className='text-center group hover:scale-105 transition-transform'>
              <div className='bg-gradient-to-br from-pink-500 to-red-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl shadow-lg group-hover:shadow-2xl transition-shadow'>
                💡
              </div>
              <h3 className='text-xl font-bold mb-2 text-pink-900'>Innovation</h3>
              <p className='text-gray-600'>Embracing new ideas and solutions</p>
            </div>

            <div className='text-center group hover:scale-105 transition-transform'>
              <div className='bg-gradient-to-br from-orange-500 to-yellow-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl shadow-lg group-hover:shadow-2xl transition-shadow'>
                🏆
              </div>
              <h3 className='text-xl font-bold mb-2 text-orange-900'>Excellence</h3>
              <p className='text-gray-600'>Striving for the highest quality</p>
            </div>

            <div className='text-center group hover:scale-105 transition-transform'>
              <div className='bg-gradient-to-br from-red-500 to-pink-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl shadow-lg group-hover:shadow-2xl transition-shadow'>
                🌱
              </div>
              <h3 className='text-xl font-bold mb-2 text-red-900'>Growth</h3>
              <p className='text-gray-600'>Continuous improvement and development</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <h2 className='text-5xl font-black text-center mb-16 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent'>
            Our Leadership
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto'>
            <div className='bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2'>
              <div className='h-64 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center'>
                <div className='w-32 h-32 bg-white rounded-full flex items-center justify-center text-5xl font-black text-purple-600'>
                  LA
                </div>
              </div>
              <div className='p-6 text-center'>
                <h3 className='text-2xl font-black mb-2 text-purple-900'>Lalit Agrawal</h3>
                <p className='text-pink-600 font-semibold mb-3'>Founder & CEO</p>
                <p className='text-gray-600 text-sm'>
                  Visionary leader with 20+ years of business experience
                </p>
              </div>
            </div>

            <div className='bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2'>
              <div className='h-64 bg-gradient-to-br from-pink-500 to-red-600 flex items-center justify-center'>
                <div className='w-32 h-32 bg-white rounded-full flex items-center justify-center text-5xl font-black text-pink-600'>
                  N
                </div>
              </div>
              <div className='p-6 text-center'>
                <h3 className='text-2xl font-black mb-2 text-pink-900'>Neha Agrawal</h3>
                <p className='text-red-600 font-semibold mb-3'>Director of Operations</p>
                <p className='text-gray-600 text-sm'>
                  Expert in community development and strategic planning
                </p>
              </div>
            </div>

            <div className='bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2'>
              <div className='h-64 bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center'>
                <div className='w-32 h-32 bg-white rounded-full flex items-center justify-center text-5xl font-black text-orange-600'>
                  V
                </div>
              </div>
              <div className='p-6 text-center'>
                <h3 className='text-2xl font-black mb-2 text-orange-900'>Vikram Agrawal</h3>
                <p className='text-yellow-700 font-semibold mb-3'>Head of Business Development</p>
                <p className='text-gray-600 text-sm'>
                  Specialist in networking and partnership building
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-5xl font-black mb-6'>Join Our Community</h2>
          <p className='text-xl text-purple-100 mb-8 max-w-2xl mx-auto'>
            Be part of a thriving network that's shaping the future of business
          </p>
          <button className='bg-white text-purple-700 px-10 py-5 rounded-full font-black text-xl hover:bg-yellow-400 hover:text-purple-900 transition-all shadow-2xl transform hover:scale-110'>
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  )
}

export default About
