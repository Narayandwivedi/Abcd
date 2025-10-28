import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppContextProvider from './context/AppContext.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>,
)

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    console.log('PWA: Attempting to register service worker...')
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('PWA: Service Worker registered successfully:', registration)
        console.log('PWA: Scope:', registration.scope)

        // Check for updates
        registration.addEventListener('updatefound', () => {
          console.log('PWA: Service Worker update found')
        })
      })
      .catch((registrationError) => {
        console.error('PWA: Service Worker registration failed:', registrationError)
      })
  })
} else {
  console.warn('PWA: Service Workers are not supported in this browser')
}
