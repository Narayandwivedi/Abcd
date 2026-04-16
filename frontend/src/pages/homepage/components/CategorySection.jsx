import React, { useState, useEffect } from 'react'

const CategorySection = ({ handleCategoryClick, onCategoriesLoaded }) => {
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

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
            subcategories: cat.subcategories,
            gradient: gradients[index % gradients.length]
          }))
          setCategories(mappedCategories)
          onCategoriesLoaded(mappedCategories)
        } else {
          console.error('Failed to load categories')
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [onCategoriesLoaded])

  return (
    <section className='pt-2 pb-2 md:pt-6 md:pb-6 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-4 md:mb-10'>
          <h2 className='text-xl md:text-3xl font-extrabold text-gray-900 tracking-tight'>
            Shop by Category
          </h2>
          <div className='mt-1 md:mt-2 h-1 w-16 md:w-24 bg-blue-600 mx-auto rounded-full'></div>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 max-w-7xl mx-auto'>
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
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-85 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Decorative circle */}
                <div className='absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700'></div>
                
                <div className='relative h-full flex items-center justify-center p-3 text-center'>
                  <h3 className='font-bold text-white text-xs md:text-base leading-tight drop-shadow-md group-hover:scale-110 transition-transform duration-300'>
                    {category.name}
                  </h3>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
