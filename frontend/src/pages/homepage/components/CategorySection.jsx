import React, { useState, useEffect } from 'react'

const CategorySection = ({ handleCategoryClick, onCategoriesLoaded }) => {
  const [categories, setCategories] = useState([])
  const [noVendorCategories, setNoVendorCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [noVendorLoading, setNoVendorLoading] = useState(true)

  const gradients = [
    'from-[#FF5F6D] to-[#FFC371]',
    'from-[#2193b0] to-[#6dd5ed]',
    'from-[#ee9ca7] to-[#ffdde1]',
    'from-[#06beb6] to-[#48b1bf]',
    'from-[#eb3349] to-[#f45c43]',
    'from-[#614385] to-[#516395]',
    'from-[#02aab0] to-[#00cdac]',
    'from-[#ff512f] to-[#dd2476]',
    'from-[#4568dc] to-[#b06ab3]',
    'from-[#2b5876] to-[#4e4376]',
    'from-[#f2994a] to-[#f2c94c]',
    'from-[#11998e] to-[#38ef7d]',
  ]

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        const response = await fetch(`${BACKEND_URL}/api/categories?hasVendors=true`)
        const data = await response.json()

        if (data.success) {
          const mappedCategories = data.categories.map((cat, index) => ({
            name: cat.name,
            slug: cat.slug,
            image: cat.image,
            subcategories: cat.subcategories,
            gradient: gradients[index % gradients.length]
          }))
          setCategories(mappedCategories)
          if (onCategoriesLoaded) onCategoriesLoaded(mappedCategories)
        } else {
          console.error('Failed to load categories')
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setCategoriesLoading(false)
      }
    }

    const fetchNoVendorCategories = async () => {
      try {
        setNoVendorLoading(true)
        const response = await fetch(`${BACKEND_URL}/api/categories?hasVendors=false`)
        const data = await response.json()

        if (data.success) {
          const mappedCategories = data.categories.map((cat, index) => ({
            name: cat.name,
            slug: cat.slug,
            image: cat.image,
            subcategories: cat.subcategories,
            gradient: gradients[(index + 6) % gradients.length]
          }))
          setNoVendorCategories(mappedCategories)
        } else {
          console.error('Failed to load no-vendor categories')
        }
      } catch (error) {
        console.error('Error fetching no-vendor categories:', error)
      } finally {
        setNoVendorLoading(false)
      }
    }

    fetchCategories()
    fetchNoVendorCategories()
  }, [onCategoriesLoaded])

  return (
    <section className='pt-2 pb-2 md:pt-6 md:pb-6 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-4 md:mb-10'>
          <h2 className='text-xl md:text-3xl font-extrabold text-gray-900 tracking-tight'>
            Vendor by Category
          </h2>
          <div className='mt-1 md:mt-2 h-1 w-16 md:w-24 bg-blue-600 mx-auto rounded-full'></div>
        </div>

        <div className='grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 max-w-7xl mx-auto'>
          {categoriesLoading ? (
            Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className='h-24 md:h-32 bg-gray-100 rounded-xl animate-pulse'
              ></div>
            ))
          ) : categories.length === 0 ? (
            <div className='col-span-full text-center py-12'>
              <p className='text-gray-500'>No categories available with vendors</p>
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.name}
                onClick={() => handleCategoryClick(category.slug)}
                className={`group relative h-24 md:h-32 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-100`}
              >
                {category.image ? (
                  <>
                    <img
                      src={`${BACKEND_URL}${category.image}`}
                      alt={category.name}
                      className='absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 transition-opacity duration-500'></div>
                  </>
                ) : (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-85 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    {/* Decorative circle only for gradient cards */}
                    <div className='absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700'></div>
                  </>
                )}

                <div className='relative h-full flex items-center justify-center p-3 text-center'>
                  <h3 className='font-bold text-white text-xs md:text-base leading-tight drop-shadow-lg group-hover:scale-110 transition-transform duration-300'>
                    {category.name}
                  </h3>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Vendors Joining Soon Section */}
        {!noVendorLoading && noVendorCategories.length > 0 && (
          <div className='mt-6 md:mt-8 anim-fade-in'>
            {/* Divider Line */}
            <div className='relative flex items-center justify-center mb-6 md:mb-8'>
              <div className='w-full border-t border-gray-300'></div>
              <div className='absolute bg-white px-6 py-1 rounded-full border border-gray-300 shadow-sm'>
                <span className='text-xs md:text-sm font-semibold text-gray-500 tracking-widest uppercase'>
                  Explore More
                </span>
              </div>
            </div>

            <div className='text-center mb-5 md:mb-8'>
              <h2 className='text-xl md:text-3xl font-extrabold text-gray-900 tracking-tight'>
                Vendors Joining Soon
              </h2>
              <div className='mt-3 md:mt-4 h-1.5 w-16 md:w-24 bg-blue-600/40 mx-auto rounded-full'></div>
              
              <div className='mt-6'>
                <button 
                  className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Suggest Category
                </button>
              </div>
            </div>

            <div className='grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 max-w-7xl mx-auto'>
              {noVendorCategories.map((category) => (
                <div
                  key={category.name}
                  onClick={() => handleCategoryClick(category.slug)}
                  className={`group relative h-24 md:h-32 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-100`}
                >
                  {category.image ? (
                    <>
                      <img
                        src={`${BACKEND_URL}${category.image}`}
                        alt={category.name}
                        className='absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                      />
                      <div className='absolute inset-0 bg-black/40 backdrop-blur-[1px] group-hover:backdrop-blur-0 transition-all duration-500'></div>
                      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent'></div>
                    </>
                  ) : (
                    <>
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-60 group-hover:opacity-100 transition-all duration-500`}></div>
                      {/* Glassmorphic overlay for "Coming Soon" look */}
                      <div className='absolute inset-0 bg-white/10 backdrop-blur-[1px] group-hover:backdrop-blur-0 transition-all duration-500'></div>
                      {/* Decorative element */}
                      <div className='absolute -right-6 -bottom-6 w-20 h-20 bg-white/20 rounded-full group-hover:scale-150 transition-transform duration-700 blur-xl'></div>
                    </>
                  )}

                  <div className='relative h-full flex flex-col items-center justify-center p-3 text-center'>
                    <h3 className='font-bold text-white text-xs md:text-base leading-tight drop-shadow-lg group-hover:scale-105 transition-transform duration-300'>
                      {category.name}
                    </h3>
                    <div className='mt-1.5 px-2 py-0.5 bg-black/20 rounded-full backdrop-blur-md opacity-80 group-hover:opacity-100 transition-opacity'>
                      <span className='text-[8px] md:text-[10px] text-white font-bold tracking-wider uppercase'>
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default CategorySection
