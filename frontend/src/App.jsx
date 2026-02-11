import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import BottomNav from './component/BottomNav'
import Seo from './component/Seo'
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
  const isHomePage = location.pathname === '/'
  const getSeoConfig = (pathname) => {
    if (pathname === '/') {
      return {
        title: 'ABCD Vyapar - Business Network for Buyers and Sellers',
        description:
          'ABCD Vyapar connects buyers, sellers, and vendors across categories. Find deals, post leads, and grow your business community.',
        canonicalPath: '/',
      }
    }

    if (pathname === '/about') {
      return {
        title: 'About ABCD Vyapar',
        description:
          'Learn about ABCD Vyapar, our mission, leadership, and how we support community-driven business growth.',
        canonicalPath: '/about',
      }
    }

    if (pathname === '/blog') {
      return {
        title: 'ABCD Blog - Business Insights and Community Updates',
        description:
          'Read ABCD Vyapar blog posts for business insights, updates, and community stories.',
        canonicalPath: '/blog',
      }
    }

    if (pathname.startsWith('/blog/')) {
      return {
        title: 'Blog Detail - ABCD Vyapar',
        description:
          'Read the full blog article on ABCD Vyapar and explore community and business insights.',
        canonicalPath: pathname,
      }
    }

    if (pathname === '/gallery') {
      return {
        title: 'Gallery - ABCD Vyapar',
        description:
          'Explore images and highlights from ABCD Vyapar activities, events, and community initiatives.',
        canonicalPath: '/gallery',
      }
    }

    if (pathname === '/download') {
      return {
        title: 'Access ABCD Vyapar',
        description:
          'Open ABCD Vyapar in your browser to access products, services, and business opportunities.',
        canonicalPath: '/download',
      }
    }

    if (pathname === '/buy-leads') {
      return {
        title: 'Buy Leads - ABCD Vyapar',
        description:
          'Browse and connect with verified buy leads on ABCD Vyapar to grow your business.',
        canonicalPath: '/buy-leads',
      }
    }

    if (pathname === '/sell-leads') {
      return {
        title: 'Sell Leads - ABCD Vyapar',
        description:
          'Post and discover sell leads on ABCD Vyapar to reach interested buyers faster.',
        canonicalPath: '/sell-leads',
      }
    }

    if (pathname === '/vouchers') {
      return {
        title: 'Vouchers - ABCD Vyapar',
        description:
          'Access vouchers and business benefits available through ABCD Vyapar.',
        canonicalPath: '/vouchers',
      }
    }

    if (pathname === '/contact') {
      return {
        title: 'Contact ABCD Vyapar',
        description:
          'Contact ABCD Vyapar support by phone, email, or message for business and platform assistance.',
        canonicalPath: '/contact',
      }
    }

    if (pathname.startsWith('/category/')) {
      return {
        title: 'Category Listings - ABCD Vyapar',
        description:
          'Explore business listings by category on ABCD Vyapar and connect with relevant vendors.',
        canonicalPath: pathname,
      }
    }

    if (pathname.startsWith('/ad/') || pathname.startsWith('/deal/')) {
      return {
        title: 'Offer Details - ABCD Vyapar',
        description:
          'View offer details and connect with the advertiser on ABCD Vyapar.',
        canonicalPath: pathname,
      }
    }

    if (pathname === '/login') {
      return {
        title: 'Login - ABCD Vyapar',
        description: 'Login to your ABCD Vyapar account.',
        canonicalPath: '/login',
        robots: 'noindex, nofollow',
      }
    }

    if (pathname === '/signup') {
      return {
        title: 'Sign Up - ABCD Vyapar',
        description: 'Create your ABCD Vyapar account.',
        canonicalPath: '/signup',
        robots: 'noindex, nofollow',
      }
    }

    if (pathname === '/forgot-password') {
      return {
        title: 'Forgot Password - ABCD Vyapar',
        description: 'Reset your ABCD Vyapar account password.',
        canonicalPath: '/forgot-password',
        robots: 'noindex, nofollow',
      }
    }

    return {
      title: 'ABCD Vyapar',
      description: 'ABCD Vyapar - Your Business Partner for Products and Services',
      canonicalPath: pathname,
    }
  }

  const seo = getSeoConfig(location.pathname)
  const homeStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ABCD Vyapar',
    url: 'https://abcdvyapar.com/',
    description:
      'ABCD Vyapar connects buyers, sellers, and vendors across categories.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://abcdvyapar.com/category/{search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <div className={isAuthPage ? '' : 'flex flex-col min-h-screen'}>
      <Seo
        title={seo.title}
        description={seo.description}
        canonicalPath={seo.canonicalPath}
        robots={seo.robots}
        structuredData={isHomePage ? homeStructuredData : null}
      />
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
