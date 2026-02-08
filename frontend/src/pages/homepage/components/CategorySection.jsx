import React, { useState, useEffect } from 'react'
import {
  Scale, Car, Scissors, BookOpen, UtensilsCrossed, Camera, Calculator, Shirt,
  Megaphone, Stethoscope, GraduationCap, Zap, Smartphone, HardHat, Apple,
  Sofa, ShoppingCart, Wrench, Refrigerator, Home as HomeIcon, Building2, Hotel,
  Paintbrush, Truck, Grid3X3, Pill, FlaskConical, Building, Trophy,
  Phone, Plane, School, Globe
} from 'lucide-react'

const CategorySection = ({ handleCategoryClick, onCategoriesLoaded }) => {
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const iconMap = {
    Scale, Car, Scissors, BookOpen, UtensilsCrossed, Camera, Calculator, Shirt,
    Megaphone, Stethoscope, GraduationCap, Zap, Smartphone, HardHat, Apple,
    Sofa, ShoppingCart, Wrench, Refrigerator, HomeIcon, Building2, Hotel,
    Paintbrush, Truck, Grid3X3, Pill, FlaskConical, Building, Trophy,
    Phone, Plane, School, Globe
  }

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        const response = await fetch(`${BACKEND_URL}/api/categories`)
        const data = await response.json()

        if (data.success) {
          const mappedCategories = data.categories.map(cat => ({
            name: cat.name,
            icon: iconMap[cat.icon] || ShoppingCart,
            slug: cat.slug,
            subcategories: cat.subcategories
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
    <section className='pt-1 pb-1 md:pt-3 md:pb-3 bg-gray-50'>
      <div className='container mx-auto px-3 md:px-4'>
        <div className='text-center mb-1 md:mb-6'>
          <h2 className='text-sm md:text-3xl font-bold text-gray-800'>
            Vendors by Category
          </h2>
        </div>

        <div className='grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3 max-w-7xl mx-auto'>
          {categoriesLoading ? (
            Array.from({ length: 24 }).map((_, index) => (
              <div
                key={index}
                className='bg-gray-100 p-2 md:p-3 rounded-lg shadow-sm animate-pulse'
              >
                <div className='flex flex-col items-center'>
                  <div className='w-5 h-5 md:w-7 md:h-7 bg-gray-300 rounded-full mb-1'></div>
                  <div className='w-12 md:w-16 h-2 md:h-3 bg-gray-300 rounded'></div>
                </div>
              </div>
            ))
          ) : categories.length === 0 ? (
            <div className='col-span-4 md:col-span-5 lg:col-span-6 text-center py-8'>
              <p className='text-gray-500'>No categories available</p>
            </div>
          ) : (
            categories.map((category) => {
              const IconComponent = category.icon
              return (
                <div
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className='group bg-white p-2 md:p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-400 cursor-pointer'
                >
                  <div className='flex flex-col items-center'>
                    <IconComponent className='w-5 h-5 md:w-7 md:h-7 text-blue-600 mb-1 group-hover:scale-110 transition-transform' />
                    <h3 className='text-center font-medium text-gray-800 text-[8px] md:text-xs leading-tight'>{category.name}</h3>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
