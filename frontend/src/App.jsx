import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import BottomNav from './component/BottomNav'
import Home from './pages/homepage/Home'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Gallery from './pages/Gallery'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Contact from './pages/Contact'
import ForgotPassword from './pages/ForgotPassword'
import CategoryPage from './pages/CategoryPage'
import AdDetail from './pages/AdDetail'
import Download from './pages/Download'
import BuyLeads from './pages/BuyLeads'
import SellLeads from './pages/SellLeads'
import Vouchers from './pages/Vouchers'

const App = () => {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

  return (
    <div className={isAuthPage ? '' : 'flex flex-col min-h-screen'}>
      {!isAuthPage && <Navbar />}
      <div className='pb-0 md:pb-0'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/blog/:id' element={<BlogDetail />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/download' element={<Download />} />
          <Route path='/buy-leads' element={<BuyLeads />} />
          <Route path='/sell-leads' element={<SellLeads />} />
          <Route path='/vouchers' element={<Vouchers />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/category/:categoryName' element={<CategoryPage />} />
          <Route path='/:type/:id' element={<AdDetail />} />
        </Routes>
      </div>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <BottomNav />}

      {/* Toast Notification Container */}
      <ToastContainer
        position="top-right"
        autoClose={700}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  )
}

export default App
