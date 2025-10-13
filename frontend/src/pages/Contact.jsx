import { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Contact Form:', formData)
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <section className='relative py-20 mb-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-10 right-10 w-72 h-72 bg-blue-500 opacity-10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-10 left-10 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl'></div>
        </div>

        <div className='container mx-auto px-4 relative z-10 text-center'>
          <h1 className='text-5xl md:text-6xl font-black mb-6'>Get In Touch</h1>
          <p className='text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto'>
            We're here to help! Reach out to us through any of these channels
          </p>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className='py-16 relative z-10'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
            {/* Email Card */}
            <div className='bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-gray-200'>
              <div className='bg-gradient-to-br from-blue-600 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg'>
                <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
              </div>
              <h3 className='text-2xl font-black text-center mb-4 text-gray-800'>Email Us</h3>
              <p className='text-gray-600 text-center mb-8'>
                Send us an email and we'll respond within 24 hours
              </p>
              <div className='text-center mb-4'>
                <a href='mailto:cgpasabcd@gmail.com' className='text-blue-600 font-bold hover:underline block'>
                  cgpasabcd@gmail.com
                </a>
              </div>
              <button className='mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg cursor-pointer'>
                Send Email
              </button>
            </div>

            {/* Chat Card */}
            <div className='bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-gray-200'>
              <div className='bg-gradient-to-br from-blue-600 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg'>
                <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                </svg>
              </div>
              <h3 className='text-2xl font-black text-center mb-4 text-gray-800'>Live Chat</h3>
              <p className='text-gray-600 text-center mb-8'>
                Chat with our support team in real-time
              </p>
              <div className='bg-gray-100 rounded-xl p-4 mb-4 border-l-4 border-blue-600'>
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
                  <span className='text-gray-700 font-semibold text-sm'>Available Now</span>
                </div>
                <p className='text-gray-600 text-sm text-center mt-2'>
                  Mon-Sat: 9:00 AM - 6:00 PM
                </p>
              </div>
              <button className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg cursor-pointer'>
                Start Chat
              </button>
            </div>

            {/* Phone Card */}
            <div className='bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-gray-200'>
              <div className='bg-gradient-to-br from-blue-600 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg'>
                <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                </svg>
              </div>
              <h3 className='text-2xl font-black text-center mb-4 text-gray-800'>Call Support</h3>
              <p className='text-gray-600 text-center mb-8'>
                Speak directly with our support team
              </p>
              <div className='text-center mb-4'>
                <a href='tel:07713562323' className='text-blue-600 font-black text-xl hover:underline block mb-2'>
                  0771-3562323
                </a>
                <p className='text-gray-500 text-sm'>Telephone</p>
                <a href='tel:+919993961778' className='text-blue-600 font-black text-xl hover:underline block mt-2'>
                  +91 9993961778
                </a>
                <p className='text-gray-500 text-sm'>Mobile</p>
              </div>
              <button className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg cursor-pointer'>
                Call Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 className='text-5xl font-black mb-4 text-gray-800'>
                Send Us a Message
              </h2>
              <p className='text-xl text-gray-600'>
                Fill out the form below and we'll get back to you as soon as possible
              </p>
            </div>

            <div className='bg-gray-50 rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-gray-200'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-gray-700 font-semibold mb-2'>Your Name *</label>
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white'
                      placeholder='Enter your name'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-gray-700 font-semibold mb-2'>Email Address *</label>
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white'
                      placeholder='your@email.com'
                      required
                    />
                  </div>
                </div>

                <div className='grid md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-gray-700 font-semibold mb-2'>Phone Number</label>
                    <input
                      type='tel'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white'
                      placeholder='+91 1234567890'
                    />
                  </div>

                  <div>
                    <label className='block text-gray-700 font-semibold mb-2'>Subject *</label>
                    <select
                      name='subject'
                      value={formData.subject}
                      onChange={handleChange}
                      className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white'
                      required
                    >
                      <option value=''>Select a subject</option>
                      <option value='general'>General Inquiry</option>
                      <option value='support'>Technical Support</option>
                      <option value='vendor'>Vendor Related</option>
                      <option value='partnership'>Business Partnership</option>
                      <option value='feedback'>Feedback</option>
                      <option value='other'>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>Message *</label>
                  <textarea
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    rows='6'
                    className='w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white'
                    placeholder='Type your message here...'
                    required
                  ></textarea>
                </div>

                <button
                  type='submit'
                  className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-black text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer'
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Office Hours */}
      <section className='py-20 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='grid md:grid-cols-2 gap-12 max-w-6xl mx-auto'>
            {/* Office Location */}
            <div className='bg-white rounded-3xl p-10 shadow-xl'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='bg-gradient-to-br from-blue-600 to-blue-700 w-12 h-12 rounded-xl flex items-center justify-center'>
                  <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                  </svg>
                </div>
                <h3 className='text-2xl font-black text-blue-900'>Our Office</h3>
              </div>
              <div className='space-y-3 text-gray-600'>
                <p className='font-semibold text-lg text-gray-800'>ABCD Platform Office</p>
                <p>Hanuman Market, Ramsagar Para</p>
                <p>RAIPUR (CG) 492001</p>
                <p>India</p>
              </div>
            </div>

            {/* Office Hours */}
            <div className='bg-white rounded-3xl p-10 shadow-xl'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='bg-gradient-to-br from-green-600 to-green-700 w-12 h-12 rounded-xl flex items-center justify-center'>
                  <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                </div>
                <h3 className='text-2xl font-black text-green-900'>Office Hours</h3>
              </div>
              <div className='space-y-3 text-gray-600'>
                <div className='flex justify-between'>
                  <span className='font-semibold'>Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-semibold'>Saturday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-semibold'>Sunday:</span>
                  <span className='text-red-600 font-semibold'>Closed</span>
                </div>
                <div className='mt-6 bg-gray-100 rounded-xl p-4 border-l-4 border-blue-600'>
                  <p className='text-sm text-gray-700 font-semibold'>
                    💡 For urgent matters outside office hours, please use our live chat or email support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fixed Buttons */}
      <div className='fixed bottom-24 md:bottom-6 right-6 flex flex-col gap-3 z-40'>
        {/* WhatsApp Button */}
        <a
          href='https://wa.me/919993961778'
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

export default Contact
