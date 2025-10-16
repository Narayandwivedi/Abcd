import React from 'react'
import { useNavigate } from 'react-router-dom'

const Blog = () => {
  const navigate = useNavigate()

  const blogPosts = [
    {
      id: 1,
      category: 'Community & Business',
      categoryColor: 'bg-blue-100 text-blue-700',
      title: 'Empowering the Agrawal Community Through Business Development',
      excerpt: 'ABCD is a transformative initiative dedicated to empowering the Agrawal community through unified business growth and social development.',
      date: 'January 15, 2025',
      readTime: '5 min read',
      bannerGradient: 'bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600',
      bannerIcon: '🏢'
    },
    {
      id: 2,
      category: 'Business Tips',
      categoryColor: 'bg-orange-100 text-orange-700',
      title: '5 Ways to Grow Your Business with ABCD Vyapar',
      excerpt: 'Discover proven strategies to expand your business network and increase sales through our platform.',
      date: 'January 10, 2025',
      readTime: '4 min read',
      bannerGradient: 'bg-gradient-to-br from-orange-500 via-orange-400 to-amber-500',
      bannerIcon: '💡'
    },
    {
      id: 3,
      category: 'Success Stories',
      categoryColor: 'bg-green-100 text-green-700',
      title: 'How ABCD Members Are Achieving Success',
      excerpt: 'Real stories from our community members who transformed their businesses through collaboration.',
      date: 'January 5, 2025',
      readTime: '6 min read',
      bannerGradient: 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600',
      bannerIcon: '🏆'
    }
  ]

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4'>
      <div className='container mx-auto max-w-6xl'>
        {/* Page Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-4'>
            ABCD Blog
          </h1>
          <p className='text-gray-600 mb-6'>
            Insights, stories, and updates from the ABCD community
          </p>
          <div className='w-24 h-1 bg-gradient-to-r from-orange-500 to-blue-500 mx-auto'></div>
        </div>

        {/* Blog Cards Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {blogPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => handleBlogClick(post.id)}
              className='bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group'
            >
              {/* Blog Banner */}
              <div className={`overflow-hidden h-48 ${post.bannerGradient} flex items-center justify-center relative`}>
                <div className='text-center text-white z-10'>
                  <div className='text-6xl mb-3 group-hover:scale-110 transition-transform duration-300'>
                    {post.bannerIcon}
                  </div>
                  <div className='px-4'>
                    <h3 className='text-xl font-bold drop-shadow-lg'>
                      {post.category}
                    </h3>
                  </div>
                </div>
                {/* Decorative circles */}
                <div className='absolute top-4 right-4 w-20 h-20 bg-white opacity-10 rounded-full'></div>
                <div className='absolute bottom-4 left-4 w-16 h-16 bg-white opacity-10 rounded-full'></div>
              </div>

              {/* Blog Content */}
              <div className='p-6'>
                <span className={`inline-block ${post.categoryColor} px-3 py-1 rounded-full text-xs font-semibold mb-3`}>
                  {post.category}
                </span>
                <h4 className='text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors'>
                  {post.title}
                </h4>
                <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
                  {post.excerpt}
                </p>
                <div className='flex items-center justify-between text-gray-500 text-xs'>
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <div className='mt-4'>
                  <span className='text-blue-600 font-semibold text-sm group-hover:text-blue-700'>
                    Read More →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Blog
