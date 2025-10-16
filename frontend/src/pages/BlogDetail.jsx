import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const BlogDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const blogData = {
    1: {
      category: 'Community & Business',
      categoryColor: 'bg-blue-100 text-blue-700',
      title: 'Empowering the Agrawal Community Through Business Development',
      date: 'January 15, 2025',
      readTime: '5 min read',
      author: 'Lalit Agrawal',
      authorRole: 'Chairman, ABCD',
      authorInitials: 'LA',
      bannerGradient: 'bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600',
      bannerIcon: '🏢',
      content: [
        'ABCD (Agrawal Business and Community Development) is a transformative initiative dedicated to empowering the Agrawal community through unified business growth and social development. Founded with the vision of fostering entrepreneurship and collaboration, ABCD connects over 15,000 verified buyers and vendors across various industries, creating unprecedented opportunities for business expansion and community prosperity.',
        'Our platform serves as a bridge between traditional business values and modern digital commerce, enabling members to showcase their products, connect with potential buyers, and build lasting partnerships. Through innovative technology and community-driven initiatives, ABCD is revolutionizing how the Agrawal community conducts business in the digital age.',
        'Under the visionary leadership of Chairman Lalit Agrawal, ABCD has grown into a robust ecosystem that celebrates our cultural heritage while embracing progress. We believe in empowering growth and empowering unity, ensuring that every member of our community has access to opportunities that drive success. Join us in building a stronger, more prosperous future together.'
      ]
    },
    2: {
      category: 'Business Tips',
      categoryColor: 'bg-orange-100 text-orange-700',
      title: '5 Ways to Grow Your Business with ABCD Vyapar',
      date: 'January 10, 2025',
      readTime: '4 min read',
      author: 'Business Team',
      authorRole: 'ABCD Business Development',
      authorInitials: 'BT',
      bannerGradient: 'bg-gradient-to-br from-orange-500 via-orange-400 to-amber-500',
      bannerIcon: '💡',
      content: [
        'Growing your business in today\'s competitive market requires strategic planning and the right network. ABCD Vyapar provides a unique platform that connects you with verified buyers and sellers within the Agrawal community, creating endless opportunities for growth.',
        'The first strategy is to optimize your business profile on our platform. Make sure to showcase your products with high-quality images and detailed descriptions. This increases your visibility and attracts potential buyers who are looking for exactly what you offer.',
        'Networking is key to business success. Attend our community events and webinars to connect with other members, share experiences, and learn from success stories. Building these relationships can lead to valuable partnerships and collaborations.',
        'Leverage our digital tools to streamline your operations. From inventory management to customer communication, ABCD Vyapar offers integrated solutions that save time and increase efficiency, allowing you to focus on growth.',
        'Finally, stay engaged with the community. Participate in discussions, share your expertise, and be active on the platform. Your involvement not only builds your reputation but also opens doors to new opportunities you might not have discovered otherwise.'
      ]
    },
    3: {
      category: 'Success Stories',
      categoryColor: 'bg-green-100 text-green-700',
      title: 'How ABCD Members Are Achieving Success',
      date: 'January 5, 2025',
      readTime: '6 min read',
      author: 'Community Team',
      authorRole: 'ABCD Community Relations',
      authorInitials: 'CT',
      bannerGradient: 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600',
      bannerIcon: '🏆',
      content: [
        'Success stories from our community members serve as inspiration for others looking to grow their businesses. The ABCD platform has been instrumental in transforming how businesses connect, collaborate, and thrive together.',
        'One remarkable example is a textile business owner from Rajasthan who expanded their reach from local markets to nationwide distribution within just six months of joining ABCD. By connecting with verified buyers across different states, they increased their revenue by 300%.',
        'Another inspiring story comes from a young entrepreneur who started a handicrafts business. Through ABCD\'s networking events and online platform, they found mentors who guided them through challenges and connected them with export opportunities, taking their local craft to international markets.',
        'A food processing unit owner shared how ABCD helped them during challenging times. When traditional distribution channels were disrupted, the ABCD platform enabled them to connect directly with retailers and bulk buyers, maintaining business continuity and even expanding their customer base.',
        'These success stories highlight the power of community-driven business development. When members support each other, share knowledge, and create opportunities together, everyone benefits. The ABCD platform is more than just a business directory; it\'s a ecosystem where success is shared and celebrated.',
        'Join us today and write your own success story. Whether you\'re a established business owner or just starting your entrepreneurial journey, ABCD provides the tools, network, and support you need to achieve your goals.'
      ]
    }
  }

  const blog = blogData[id]

  if (!blog) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>Blog Not Found</h2>
          <button
            onClick={() => navigate('/blog')}
            className='text-blue-600 hover:text-blue-700 font-semibold'
          >
            ← Back to Blogs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4'>
      <div className='container mx-auto max-w-4xl'>
        {/* Back Button */}
        <button
          onClick={() => navigate('/blog')}
          className='mb-6 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 transition-colors'
        >
          ← Back to Blogs
        </button>

        {/* Blog Content Card */}
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          {/* Blog Header Banner */}
          <div className={`w-full h-64 md:h-96 ${blog.bannerGradient} flex items-center justify-center relative overflow-hidden`}>
            <div className='text-center text-white z-10'>
              <div className='text-8xl md:text-9xl mb-4 animate-pulse'>
                {blog.bannerIcon}
              </div>
              <div className='px-6'>
                <h2 className='text-3xl md:text-4xl font-bold drop-shadow-2xl'>
                  {blog.category}
                </h2>
              </div>
            </div>
            {/* Decorative elements */}
            <div className='absolute top-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full'></div>
            <div className='absolute bottom-10 left-10 w-24 h-24 bg-white opacity-10 rounded-full'></div>
            <div className='absolute top-1/2 left-1/4 w-16 h-16 bg-white opacity-5 rounded-full'></div>
          </div>

          {/* Blog Content */}
          <div className='p-8 md:p-10'>
            {/* Category Badge */}
            <span className={`inline-block ${blog.categoryColor} px-4 py-1 rounded-full text-sm font-semibold mb-4`}>
              {blog.category}
            </span>

            {/* Title */}
            <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className='flex items-center gap-4 text-gray-500 text-sm mb-8 pb-8 border-b border-gray-200'>
              <span>{blog.date}</span>
              <span>•</span>
              <span>{blog.readTime}</span>
            </div>

            {/* Blog Body */}
            <div className='prose max-w-none'>
              <div className='text-gray-700 leading-relaxed space-y-4 text-lg'>
                {blog.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Author Section */}
            <div className='mt-8 pt-6 border-t border-gray-200'>
              <div className='flex items-center gap-4'>
                <div className='w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold'>
                  {blog.authorInitials}
                </div>
                <div>
                  <h3 className='font-bold text-gray-800'>{blog.author}</h3>
                  <p className='text-gray-600 text-sm'>{blog.authorRole}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts or Call to Action */}
        <div className='mt-8 bg-gradient-to-r from-orange-500 to-blue-500 rounded-xl p-8 text-white text-center'>
          <h3 className='text-2xl font-bold mb-4'>Want to Read More?</h3>
          <p className='mb-6'>Explore more insightful articles from the ABCD community</p>
          <button
            onClick={() => navigate('/blog')}
            className='bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
          >
            View All Blogs
          </button>
        </div>
      </div>
    </div>
  )
}

export default BlogDetail
