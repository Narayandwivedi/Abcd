import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import WhatsAppButton from '../../component/WhatsAppButton'
import CityDropdown from '../../component/CityDropdown'
import { AppContext } from '../../context/AppContext'
import BuySellLeadSection from './components/BuySellLeadSection'
import AdsCarousel from './components/AdsCarousel'
import BuyLeadModal from './components/BuyLeadModal'
import SellLeadModal from './components/SellLeadModal'
import CategorySection from './components/CategorySection'

const Home = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useContext(AppContext)
  const [selectedCity, setSelectedCity] = useState('')
  const [categories, setCategories] = useState([])

  const [showBuyForm, setShowBuyForm] = useState(false)
  const [showSellForm, setShowSellForm] = useState(false)
  const [buyLeadData, setBuyLeadData] = useState({
    name: '',
    mobileNo: '',
    townCity: '',
    itemRequired: '',
    majorCategory: '',
    categoryId: '',
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

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'
        const response = await fetch(`${BACKEND_URL}/api/categories`)
        const data = await response.json()
        if (data.success) {
          setCategories(data.categories.map(c => ({ id: c._id, name: c.name })))
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchAllCategories()
  }, [])

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
        categoryId: '',
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
        categoryId: '',
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
        categories={categories}
      />

      <SellLeadModal
        showSellForm={showSellForm}
        setShowSellForm={setShowSellForm}
        sellLeadData={sellLeadData}
        setSellLeadData={setSellLeadData}
      />

      <CategorySection 
        handleCategoryClick={handleCategoryClick}
      />

      <div className='hidden md:block'>
        <WhatsAppButton />
      </div>
    </div>
  )
}

export default Home
