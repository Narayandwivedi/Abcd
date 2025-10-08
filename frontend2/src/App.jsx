import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import VendorRegistration from './pages/VendorRegistration'
import Contact from './pages/Contact'

function App() {
  return (
    <Router>
      <div className='flex flex-col min-h-screen'>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/login' element={<Login />} />
          <Route path='/vendor-registration' element={<VendorRegistration />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
