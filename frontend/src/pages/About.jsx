const About = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <section className='relative py-20 mb-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-10 right-10 w-72 h-72 bg-blue-500 opacity-10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-10 left-10 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl'></div>
        </div>

        <div className='container mx-auto px-4 relative z-10 text-center'>
          <h1 className='text-6xl font-black mb-6'>About ABCD</h1>
          <p className='text-2xl text-gray-300 max-w-3xl mx-auto'>
            Agrawal Business & Community Development
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className='py-20'>
        <div className='container mx-auto px-4'>
          <div className='grid md:grid-cols-2 gap-12 max-w-6xl mx-auto'>
            <div className='bg-white rounded-3xl p-10 shadow-xl border-2 border-gray-200'>
              <div className='text-5xl mb-6'>🎯</div>
              <h2 className='text-3xl font-black mb-4 text-gray-800'>
                Our Mission
              </h2>
              <p className='text-gray-600 text-lg leading-relaxed'>
                To empower the Agrawal community by providing world-class business resources, fostering meaningful connections, and creating opportunities for sustainable growth and prosperity.
              </p>
            </div>

            <div className='bg-white rounded-3xl p-10 shadow-xl border-2 border-gray-200'>
              <div className='text-5xl mb-6'>🌟</div>
              <h2 className='text-3xl font-black mb-4 text-gray-800'>
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
          <h2 className='text-5xl font-black text-center mb-16 text-gray-800'>
            Our Core Values
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto'>
            <div className='text-center group hover:scale-105 transition-transform'>
              <div className='bg-gradient-to-br from-blue-600 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl shadow-lg group-hover:shadow-2xl transition-shadow'>
                🤝
              </div>
              <h3 className='text-xl font-bold mb-2 text-gray-800'>Unity</h3>
              <p className='text-gray-600'>Building stronger communities together</p>
            </div>

            <div className='text-center group hover:scale-105 transition-transform'>
              <div className='bg-gradient-to-br from-blue-600 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl shadow-lg group-hover:shadow-2xl transition-shadow'>
                💡
              </div>
              <h3 className='text-xl font-bold mb-2 text-gray-800'>Innovation</h3>
              <p className='text-gray-600'>Embracing new ideas and solutions</p>
            </div>

            <div className='text-center group hover:scale-105 transition-transform'>
              <div className='bg-gradient-to-br from-blue-600 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl shadow-lg group-hover:shadow-2xl transition-shadow'>
                🏆
              </div>
              <h3 className='text-xl font-bold mb-2 text-gray-800'>Excellence</h3>
              <p className='text-gray-600'>Striving for the highest quality</p>
            </div>

            <div className='text-center group hover:scale-105 transition-transform'>
              <div className='bg-gradient-to-br from-blue-600 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl shadow-lg group-hover:shadow-2xl transition-shadow'>
                🌱
              </div>
              <h3 className='text-xl font-bold mb-2 text-gray-800'>Growth</h3>
              <p className='text-gray-600'>Continuous improvement and development</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className='py-20 bg-gradient-to-b from-white to-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='max-w-5xl mx-auto'>
            {/* Header */}
            <div className='text-center mb-8'>
              <h2 className='text-4xl font-black text-gray-800 mb-4'>
                See How It Works
              </h2>
              <p className='text-gray-600 text-lg'>
                Watch our demo to learn how ABCD can transform your experience
              </p>
            </div>

            {/* Video Thumbnail */}
            <div className='relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer group'>
              {/* Thumbnail Image/Gradient Background */}
              <div className='aspect-video bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center relative'>
                {/* Overlay */}
                <div className='absolute inset-0 bg-black opacity-30 group-hover:opacity-20 transition-opacity duration-300'></div>

                {/* Play Button */}
                <div className='relative z-10 transform transition-all duration-300 group-hover:scale-110'>
                  <div className='bg-white rounded-full p-6 shadow-lg'>
                    <svg
                      className='w-16 h-16 text-blue-600'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M8 5v14l11-7z' />
                    </svg>
                  </div>
                </div>

                {/* Duration Badge */}
                <div className='absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-lg text-sm font-semibold'>
                  3:45
                </div>

                {/* Title Overlay */}
                <div className='absolute bottom-4 left-4 text-white'>
                  <h3 className='text-2xl font-bold drop-shadow-lg'>Product Demo</h3>
                  <p className='text-sm opacity-90'>Introduction to ABCD Platform</p>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className='mt-6 text-center'>
              <p className='text-gray-600'>
                Click to watch our comprehensive product walkthrough
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className='py-20 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-5xl font-black text-center mb-16 text-gray-800'>
            Our Leadership
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto'>
            <div className='bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-gray-200'>
              <div className='h-64 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center'>
                <div className='w-32 h-32 bg-white rounded-full flex items-center justify-center text-5xl font-black text-blue-600'>
                  LA
                </div>
              </div>
              <div className='p-6 text-center'>
                <h3 className='text-2xl font-black mb-2 text-gray-800'>Lalit Agrawal</h3>
                <p className='text-blue-600 font-semibold mb-3'>Founder & CEO</p>
                <p className='text-gray-600 text-sm'>
                  Visionary leader with 20+ years of business experience
                </p>
              </div>
            </div>

            <div className='bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-gray-200'>
              <div className='h-64 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center'>
                <div className='w-32 h-32 bg-white rounded-full flex items-center justify-center text-5xl font-black text-blue-600'>
                  N
                </div>
              </div>
              <div className='p-6 text-center'>
                <h3 className='text-2xl font-black mb-2 text-gray-800'>Neha Agrawal</h3>
                <p className='text-blue-600 font-semibold mb-3'>Director of Operations</p>
                <p className='text-gray-600 text-sm'>
                  Expert in community development and strategic planning
                </p>
              </div>
            </div>

            <div className='bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-gray-200'>
              <div className='h-64 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center'>
                <div className='w-32 h-32 bg-white rounded-full flex items-center justify-center text-5xl font-black text-blue-600'>
                  V
                </div>
              </div>
              <div className='p-6 text-center'>
                <h3 className='text-2xl font-black mb-2 text-gray-800'>Vikram Agrawal</h3>
                <p className='text-blue-600 font-semibold mb-3'>Head of Business Development</p>
                <p className='text-gray-600 text-sm'>
                  Specialist in networking and partnership building
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-10 right-10 w-72 h-72 bg-blue-500 opacity-10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-10 left-10 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl'></div>
        </div>

        <div className='container mx-auto px-4 text-center relative z-10'>
          <h2 className='text-5xl font-black mb-6'>Join Our Community</h2>
          <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
            Be part of a thriving network that's shaping the future of business
          </p>
          <button className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-full font-black text-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-2xl transform hover:scale-110'>
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  )
}

export default About
