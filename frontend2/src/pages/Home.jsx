const Home = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50'>
      {/* Hero Section - Unique Diagonal Layout */}
      <section className='relative min-h-screen flex items-center overflow-hidden'>
        {/* Diagonal Background */}
        <div className='absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 transform -skew-y-6 origin-top-left'></div>

        {/* Floating Shapes */}
        <div className='absolute top-20 left-20 w-72 h-72 bg-yellow-400 opacity-20 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-40 right-40 w-96 h-96 bg-pink-400 opacity-20 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1s' }}></div>
        <div className='absolute top-1/3 right-20 w-56 h-56 bg-purple-400 opacity-20 rounded-full blur-3xl animate-pulse' style={{ animationDelay: '2s' }}></div>

        <div className='container mx-auto px-4 relative z-10'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            {/* Left Content */}
            <div className='text-white space-y-6'>
              <div className='inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30'>
                <div className='w-2 h-2 bg-yellow-400 rounded-full animate-ping'></div>
                <span className='text-sm font-semibold'>Welcome to ABCD Platform</span>
              </div>

              <h1 className='text-6xl md:text-7xl font-black leading-tight'>
                <span className='block'>Empowering</span>
                <span className='block bg-gradient-to-r from-yellow-300 via-pink-300 to-white bg-clip-text text-transparent'>
                  Agrawal
                </span>
                <span className='block'>Community</span>
              </h1>

              <p className='text-xl text-purple-100 leading-relaxed max-w-lg'>
                Building bridges between businesses and communities. Join us in creating a prosperous future through collaboration, innovation, and unity.
              </p>

              <div className='flex flex-wrap gap-4'>
                <button className='bg-white text-purple-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 hover:text-purple-900 transition-all shadow-2xl transform hover:scale-110'>
                  Get Started
                </button>
                <button className='bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 backdrop-blur-sm transition-all'>
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Right Side - Stats Cards */}
            <div className='grid grid-cols-2 gap-6'>
              <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all transform hover:-translate-y-2 hover:rotate-2'>
                <div className='text-5xl font-black text-yellow-300'>2K+</div>
                <div className='text-white font-semibold mt-2'>Active Members</div>
                <div className='text-purple-200 text-sm mt-1'>Growing daily</div>
              </div>

              <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all transform hover:-translate-y-2 hover:-rotate-2 mt-8'>
                <div className='text-5xl font-black text-pink-300'>500+</div>
                <div className='text-white font-semibold mt-2'>Businesses</div>
                <div className='text-purple-200 text-sm mt-1'>Thriving network</div>
              </div>

              <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all transform hover:-translate-y-2 hover:-rotate-2 -mt-4'>
                <div className='text-5xl font-black text-orange-300'>100+</div>
                <div className='text-white font-semibold mt-2'>Events</div>
                <div className='text-purple-200 text-sm mt-1'>Every year</div>
              </div>

              <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all transform hover:-translate-y-2 hover:rotate-2 mt-4'>
                <div className='text-5xl font-black text-red-300'>24/7</div>
                <div className='text-white font-semibold mt-2'>Support</div>
                <div className='text-purple-200 text-sm mt-1'>Always here</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid Layout */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent'>
              Why Choose ABCD?
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Experience the power of community-driven growth
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto'>
            {/* Large Feature Card */}
            <div className='md:col-span-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-10 text-white relative overflow-hidden group'>
              <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2'></div>
              <div className='relative z-10'>
                <div className='text-6xl mb-6'>🚀</div>
                <h3 className='text-3xl font-black mb-4'>Business Growth Accelerator</h3>
                <p className='text-purple-100 text-lg leading-relaxed'>
                  Unlock your business potential with our comprehensive suite of tools, expert mentorship, and exclusive networking opportunities designed for exponential growth.
                </p>
              </div>
            </div>

            {/* Vertical Feature Card */}
            <div className='bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 text-white relative overflow-hidden'>
              <div className='text-5xl mb-4'>🎯</div>
              <h3 className='text-2xl font-black mb-3'>Targeted Solutions</h3>
              <p className='text-yellow-50'>
                Customized strategies tailored to your unique business needs and community goals.
              </p>
            </div>

            {/* Three Column Cards */}
            <div className='bg-gradient-to-br from-pink-500 to-red-600 rounded-3xl p-8 text-white'>
              <div className='text-5xl mb-4'>🤝</div>
              <h3 className='text-2xl font-black mb-3'>Community Unity</h3>
              <p className='text-pink-50'>
                Connect with like-minded individuals and build lasting relationships.
              </p>
            </div>

            <div className='bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 text-white'>
              <div className='text-5xl mb-4'>💼</div>
              <h3 className='text-2xl font-black mb-3'>Expert Guidance</h3>
              <p className='text-purple-100'>
                Learn from industry leaders and experienced professionals.
              </p>
            </div>

            <div className='bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl p-8 text-white'>
              <div className='text-5xl mb-4'>⚡</div>
              <h3 className='text-2xl font-black mb-3'>Fast Results</h3>
              <p className='text-red-50'>
                See measurable improvements in your business performance quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Carousel Style */}
      <section className='py-20 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
              Success Stories
            </h2>
            <p className='text-xl text-gray-600'>Hear from our thriving community members</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
            <div className='bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-black'>
                  RA
                </div>
                <div>
                  <div className='font-bold text-lg'>Rajesh Agrawal</div>
                  <div className='text-sm text-gray-500'>Business Owner</div>
                </div>
              </div>
              <p className='text-gray-600 italic leading-relaxed'>
                "ABCD transformed my business completely. The networking opportunities and support have been invaluable!"
              </p>
              <div className='flex gap-1 mt-4'>
                {[...Array(5)].map((_, i) => (
                  <span key={i} className='text-yellow-400 text-xl'>★</span>
                ))}
              </div>
            </div>

            <div className='bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-black'>
                  PA
                </div>
                <div>
                  <div className='font-bold text-lg'>Priya Agrawal</div>
                  <div className='text-sm text-gray-500'>Entrepreneur</div>
                </div>
              </div>
              <p className='text-gray-600 italic leading-relaxed'>
                "The community support is amazing. I've made connections that have helped my business grow exponentially."
              </p>
              <div className='flex gap-1 mt-4'>
                {[...Array(5)].map((_, i) => (
                  <span key={i} className='text-yellow-400 text-xl'>★</span>
                ))}
              </div>
            </div>

            <div className='bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-full flex items-center justify-center text-white text-2xl font-black'>
                  SA
                </div>
                <div>
                  <div className='font-bold text-lg'>Suresh Agrawal</div>
                  <div className='text-sm text-gray-500'>Startup Founder</div>
                </div>
              </div>
              <p className='text-gray-600 italic leading-relaxed'>
                "Best platform for Agrawal community! The resources and mentorship are top-notch."
              </p>
              <div className='flex gap-1 mt-4'>
                {[...Array(5)].map((_, i) => (
                  <span key={i} className='text-yellow-400 text-xl'>★</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Split Design */}
      <section className='relative py-24 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-purple-900 via-pink-900 to-red-900'></div>
        <div className='absolute inset-0'>
          <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/10 to-transparent'></div>
        </div>

        <div className='container mx-auto px-4 relative z-10'>
          <div className='max-w-4xl mx-auto text-center text-white'>
            <h2 className='text-5xl md:text-6xl font-black mb-6'>
              Ready to Transform Your Business?
            </h2>
            <p className='text-2xl text-purple-200 mb-10'>
              Join thousands of successful entrepreneurs in the ABCD community
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button className='bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-10 py-5 rounded-full font-black text-xl hover:from-yellow-300 hover:to-orange-400 transition-all shadow-2xl transform hover:scale-110'>
                Join Free Today
              </button>
              <button className='bg-white/10 backdrop-blur-sm border-2 border-white text-white px-10 py-5 rounded-full font-black text-xl hover:bg-white/20 transition-all'>
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
