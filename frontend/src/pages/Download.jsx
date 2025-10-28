import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const Download = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    console.log('Download Page: Setting up PWA detection')

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('PWA: App is already installed')
      setIsInstalled(true)
      return
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA: beforeinstallprompt event fired on Download page')
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
      console.log('PWA: Install button should now be available')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if service worker is registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          console.log('PWA: Service Worker is registered', registration)
        } else {
          console.log('PWA: Service Worker is NOT registered')
        }
      })
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.error('Installation not available. Please use a supported browser.')
      return
    }

    console.log('PWA: Showing install prompt')
    deferredPrompt.prompt()

    const { outcome } = await deferredPrompt.userChoice
    console.log(`PWA: User response: ${outcome}`)

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
      toast.success('App installed successfully! Check your home screen.')
      setIsInstalled(true)
    } else {
      console.log('User dismissed the install prompt')
      toast.info('Installation cancelled')
    }

    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='flex justify-center mb-6'>
            <div className='w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl'>
              <span className='text-5xl font-black text-white'>A</span>
            </div>
          </div>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Download ABCD Vyapar App
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Install our Progressive Web App for a better experience. Access the app directly from your home screen!
          </p>
        </div>

        {/* Installation Status Card */}
        <div className='bg-white rounded-2xl shadow-xl p-8 mb-8'>
          {isInstalled ? (
            <div className='text-center'>
              <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-10 h-10 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>Already Installed!</h2>
              <p className='text-gray-600'>The app is already installed on your device.</p>
            </div>
          ) : isInstallable ? (
            <div className='text-center'>
              <div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-10 h-10 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
                </svg>
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>Ready to Install!</h2>
              <p className='text-gray-600 mb-6'>Click the button below to install the app on your device.</p>
              <button
                onClick={handleInstallClick}
                className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105'
              >
                Install Now
              </button>
            </div>
          ) : (
            <div className='text-center'>
              <div className='w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-10 h-10 text-yellow-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
                </svg>
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>Installation Not Available</h2>
              <p className='text-gray-600 mb-4'>
                The app cannot be installed at this moment. This could be because:
              </p>
              <ul className='text-left text-gray-600 space-y-2 max-w-md mx-auto'>
                <li className='flex items-start gap-2'>
                  <span className='text-blue-600 mt-1'>•</span>
                  <span>You're using an unsupported browser (try Chrome, Edge, or Safari)</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-blue-600 mt-1'>•</span>
                  <span>The site is not served over HTTPS</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-blue-600 mt-1'>•</span>
                  <span>The app is already installed</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className='grid md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-xl shadow-lg p-6 text-center'>
            <div className='w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-7 h-7 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
              </svg>
            </div>
            <h3 className='font-bold text-gray-900 mb-2'>Fast & Lightweight</h3>
            <p className='text-gray-600 text-sm'>Quick loading times and minimal storage space</p>
          </div>

          <div className='bg-white rounded-xl shadow-lg p-6 text-center'>
            <div className='w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-7 h-7 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
              </svg>
            </div>
            <h3 className='font-bold text-gray-900 mb-2'>Works Offline</h3>
            <p className='text-gray-600 text-sm'>Access content even without internet connection</p>
          </div>

          <div className='bg-white rounded-xl shadow-lg p-6 text-center'>
            <div className='w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-7 h-7 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' />
              </svg>
            </div>
            <h3 className='font-bold text-gray-900 mb-2'>Native Experience</h3>
            <p className='text-gray-600 text-sm'>Feels like a native app on your device</p>
          </div>
        </div>

        {/* How to Install Section */}
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>How to Install</h2>
          <div className='grid md:grid-cols-2 gap-8'>
            {/* Desktop Instructions */}
            <div>
              <h3 className='font-bold text-lg text-gray-900 mb-4 flex items-center gap-2'>
                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
                On Desktop
              </h3>
              <ol className='space-y-3 text-gray-600'>
                <li className='flex gap-3'>
                  <span className='font-bold text-blue-600'>1.</span>
                  <span>Click the "Install Now" button above (Chrome/Edge)</span>
                </li>
                <li className='flex gap-3'>
                  <span className='font-bold text-blue-600'>2.</span>
                  <span>Or look for the install icon in your browser's address bar</span>
                </li>
                <li className='flex gap-3'>
                  <span className='font-bold text-blue-600'>3.</span>
                  <span>Confirm the installation in the popup</span>
                </li>
                <li className='flex gap-3'>
                  <span className='font-bold text-blue-600'>4.</span>
                  <span>Find the app in your applications folder</span>
                </li>
              </ol>
            </div>

            {/* Mobile Instructions */}
            <div>
              <h3 className='font-bold text-lg text-gray-900 mb-4 flex items-center gap-2'>
                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' />
                </svg>
                On Mobile
              </h3>
              <ol className='space-y-3 text-gray-600'>
                <li className='flex gap-3'>
                  <span className='font-bold text-blue-600'>1.</span>
                  <span>Tap the "Install Now" button above</span>
                </li>
                <li className='flex gap-3'>
                  <span className='font-bold text-blue-600'>2.</span>
                  <span><strong>Android:</strong> Chrome will show an install banner</span>
                </li>
                <li className='flex gap-3'>
                  <span className='font-bold text-blue-600'>3.</span>
                  <span><strong>iOS:</strong> Tap Share → "Add to Home Screen"</span>
                </li>
                <li className='flex gap-3'>
                  <span className='font-bold text-blue-600'>4.</span>
                  <span>Find the app icon on your home screen</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Debug Info (remove in production) */}
        <div className='mt-8 bg-gray-100 rounded-xl p-6 text-sm text-gray-600'>
          <h3 className='font-bold text-gray-900 mb-2'>Debug Information:</h3>
          <ul className='space-y-1'>
            <li>• Browser supports Service Worker: {('serviceWorker' in navigator) ? 'Yes' : 'No'}</li>
            <li>• App is installable: {isInstallable ? 'Yes' : 'No'}</li>
            <li>• App is installed: {isInstalled ? 'Yes' : 'No'}</li>
            <li>• Display mode: {window.matchMedia('(display-mode: standalone)').matches ? 'Standalone' : 'Browser'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Download
