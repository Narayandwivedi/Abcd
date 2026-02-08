import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import WhatsAppButton from '../../component/WhatsAppButton'
import CityDropdown from '../../component/CityDropdown'
import { AppContext } from '../../context/AppContext'
import BuySellLeadSection from './components/BuySellLeadSection'
import AdsCarousel from './components/AdsCarousel'
import BuyLeadModal from './components/BuyLeadModal'
import SellLeadModal from './components/SellLeadModal'
import CategorySection from './components/CategorySection'
import {
  Scale, Car, Scissors, BookOpen, UtensilsCrossed, Camera, Calculator, Shirt,
  Megaphone, Stethoscope, GraduationCap, Zap, Smartphone, HardHat, Apple,
  Sofa, ShoppingCart, Wrench, Refrigerator, Home as HomeIcon, Building2, Hotel,
  Paintbrush, Truck, Grid3X3, Pill, FlaskConical, Building, Trophy,
  Phone, Plane, School, Globe
} from 'lucide-react'

const Home = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useContext(AppContext)
  const [selectedCity, setSelectedCity] = useState('')
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const [showBuyForm, setShowBuyForm] = useState(false)
  const [showSellForm, setShowSellForm] = useState(false)
  const [buyLeadData, setBuyLeadData] = useState({
    name: '',
    mobileNo: '',
    townCity: '',
    itemRequired: '',
    majorCategory: '',
    minorCategory: '',
    qualityQuantityDesc: '',
    priceRange: '',
    deliveryAddress: ''
  })
  const [sellLeadData, setSellLeadData] = useState({
    vendorName: '',
    vendorLocation: '',
    productServiceOffered: '',
    brand: '',
    modelDetail: '',
    mrpListPrice: '',
    specialOfferPrice: '',
    stockQtyAvailable: '',
    validity: '',
    mobileNo: ''
  })

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  const iconMap = {
    Scale, Car, Scissors, BookOpen, UtensilsCrossed, Camera, Calculator, Shirt,
    Megaphone, Stethoscope, GraduationCap, Zap, Smartphone, HardHat, Apple,
    Sofa, ShoppingCart, Wrench, Refrigerator, HomeIcon, Building2, Hotel,
    Paintbrush, Truck, Grid3X3, Pill, FlaskConical, Building, Trophy,
    Phone, Plane, School, Globe
  }

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
  }, [BACKEND_URL])

  useEffect(() => {
    const handlePopState = () => {
      if (showBuyForm) {
        setShowBuyForm(false)
      }
      if (showSellForm) {
        setShowSellForm(false)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [showBuyForm, showSellForm])

  useEffect(() => {
    if (showBuyForm || showSellForm) {
      window.history.pushState({ modal: true }, '')
    }
  }, [showBuyForm, showSellForm])

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`)
  }

  const handleBuyLeadClick = () => {
    if (isAuthenticated && user) {
      setBuyLeadData({
        name: user?.name || user?.fullName || '',
        mobileNo: user?.mobile || user?.phone || '',
        townCity: user?.city || user?.town || '',
        itemRequired: '',
        majorCategory: '',
        minorCategory: '',
        qualityQuantityDesc: '',
        priceRange: '',
        deliveryAddress: user?.address || ''
      })
    } else {
      setBuyLeadData({
        name: '',
        mobileNo: '',
        townCity: '',
        itemRequired: '',
        majorCategory: '',
        minorCategory: '',
        qualityQuantityDesc: '',
        priceRange: '',
        deliveryAddress: ''
      })
    }
    setShowBuyForm(true)
  }

  const handleSellLeadClick = () => {
    if (isAuthenticated && user) {
      setSellLeadData({
        vendorName: user?.name || user?.fullName || '',
        vendorLocation: user?.city || user?.town || '',
        productServiceOffered: '',
        brand: '',
        modelDetail: '',
        mrpListPrice: '',
        specialOfferPrice: '',
        stockQtyAvailable: '',
        validity: '',
        mobileNo: user?.mobile || user?.phone || ''
      })
    } else {
      setSellLeadData({
        vendorName: '',
        vendorLocation: '',
        productServiceOffered: '',
        brand: '',
        modelDetail: '',
        mrpListPrice: '',
        specialOfferPrice: '',
        stockQtyAvailable: '',
        validity: '',
        mobileNo: ''
      })
    }
    setShowSellForm(true)
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <BuySellLeadSection 
        handleBuyLeadClick={handleBuyLeadClick}
        handleSellLeadClick={handleSellLeadClick}
        navigate={navigate}
      />

      <AdsCarousel />

      <BuyLeadModal
        showBuyForm={showBuyForm}
        setShowBuyForm={setShowBuyForm}
        buyLeadData={buyLeadData}
        setBuyLeadData={setBuyLeadData}
        categories={categories.map(c => c.name)}
      />

      <SellLeadModal
        showSellForm={showSellForm}
        setShowSellForm={setShowSellForm}
        sellLeadData={sellLeadData}
        setSellLeadData={setSellLeadData}
      />

      <CategorySection 
        categories={categories}
        categoriesLoading={categoriesLoading}
        handleCategoryClick={handleCategoryClick}
      />

      <div className='hidden md:block'>
        <WhatsAppButton />
      </div>
    </div>
  )
}

export default Home
