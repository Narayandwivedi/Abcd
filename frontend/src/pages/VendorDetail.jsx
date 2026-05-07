import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

const VendorDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${BACKEND_URL}/api/vendor/public/${slug}`)
        const data = await res.json()
        if (data.success) {
          setVendor(data.vendor)
          // Update page title for SEO
          document.title = `${data.vendor.businessName} - ${data.vendor.city}, ${data.vendor.state} | ABCD Vyapar`
        } else {
          setNotFound(true)
        }
      } catch (e) {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchVendor()
  }, [slug])

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 pb-20 md:pb-8'>
        <div className='bg-gradient-to-r from-blue-600 to-purple-600 h-48' />
        <div className='container mx-auto px-4 -mt-16'>
          <div className='bg-white rounded-3xl shadow-xl p-6 animate-pulse'>
            <div className='flex gap-6 mb-6'>
              <div className='w-24 h-24 bg-gray-200 rounded-2xl' />
              <div className='flex-1'>
                <div className='h-6 bg-gray-200 rounded w-2/3 mb-3' />
                <div className='h-4 bg-gray-200 rounded w-1/2 mb-2' />
                <div className='h-4 bg-gray-200 rounded w-1/3' />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4 mb-6'>
              {[1,2,3,4].map(i => <div key={i} className='h-12 bg-gray-100 rounded-xl' />)}
            </div>
            <div className='h-32 bg-gray-100 rounded-xl' />
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !vendor) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center pb-20'>
        <div className='text-center bg-white rounded-3xl shadow-xl p-12 max-w-sm mx-4'>
          <div className='text-7xl mb-4'>🔍</div>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>Vendor Not Found</h1>
          <p className='text-gray-500 mb-6'>This vendor may no longer be active or the link may be incorrect.</p>
          <Link to='/' className='block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-2xl text-center'>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const handleCall = () => window.location.href = `tel:${vendor.mobile}`
  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Hello ${vendor.businessName}, I found your profile on ABCD Vyapar.`)
    window.open(`https://wa.me/91${vendor.mobile}?text=${msg}`, '_blank')
  }
  const handleEmail = () => vendor.email && (window.location.href = `mailto:${vendor.email}`)
  const handleWebsite = () => vendor.websiteUrl && window.open(vendor.websiteUrl, '_blank')

  const allCategories = vendor.businessCategories || []

  return (
    <div className='min-h-screen bg-gray-50 pb-24 md:pb-8'>
      {/* Hero Banner */}
      <div className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 h-44 relative'>
        <div className='absolute inset-0 opacity-20' style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}} />
        <button
          onClick={() => navigate(-1)}
          className='absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all duration-200'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
        </button>
      </div>

      <div className='container mx-auto px-4 max-w-3xl'>
        {/* Main Card */}
        <div className='bg-white rounded-3xl shadow-xl -mt-16 relative z-10 overflow-hidden'>
          {/* Vendor Header */}
          <div className='p-6 pb-4'>
            <div className='flex items-start gap-5'>
              <div className='w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center overflow-hidden border-4 border-white shadow-lg flex-shrink-0'>
                {vendor.passportPhoto ? (
                  <img src={`${BACKEND_URL}/${vendor.passportPhoto}`} alt={vendor.businessName} className='w-full h-full object-cover' />
                ) : (
                  <span className='text-4xl font-bold text-blue-400'>{vendor.businessName.charAt(0)}</span>
                )}
              </div>
              <div className='flex-1 min-w-0 pt-1'>
                <div className='flex items-center gap-2 flex-wrap mb-1'>
                  <h1 className='text-xl md:text-2xl font-bold text-gray-900'>{vendor.businessName}</h1>
                  <span className='bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1'>
                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                      <path d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' />
                    </svg>
                    Verified
                  </span>
                </div>
                <p className='text-gray-600 font-medium text-sm mb-1'>{vendor.ownerName}</p>
                {vendor.membershipType && (
                  <span className='inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full'>
                    ⭐ {vendor.membershipType} Member
                  </span>
                )}
              </div>
            </div>

            {/* Location */}
            <div className='flex items-center gap-1.5 text-sm text-gray-500 mt-3'>
              <svg className='w-4 h-4 text-blue-500 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
              <span>{[vendor.address, vendor.city, vendor.district, vendor.state].filter(Boolean).join(', ')}</span>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className='px-6 pb-5 grid grid-cols-2 sm:grid-cols-4 gap-3'>
            <button
              onClick={handleCall}
              className='flex flex-col items-center gap-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white py-3 px-2 rounded-2xl text-xs font-bold transition-all duration-300 hover:shadow-lg hover:shadow-blue-200'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
              </svg>
              Call
            </button>
            <button
              onClick={handleWhatsApp}
              className='flex flex-col items-center gap-1.5 bg-green-50 hover:bg-green-500 text-green-600 hover:text-white py-3 px-2 rounded-2xl text-xs font-bold transition-all duration-300 hover:shadow-lg hover:shadow-green-200'
            >
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.001 20c-1.85 0-3.61-.477-5.138-1.325l-.369-.204-3.813.999 1.018-3.715-.224-.356C2.622 13.882 2 12.012 2 10 2 4.477 6.477 0 12 0s10 4.477 10 10-4.477 10-10 10z'/>
              </svg>
              WhatsApp
            </button>
            {vendor.email && (
              <button
                onClick={handleEmail}
                className='flex flex-col items-center gap-1.5 bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white py-3 px-2 rounded-2xl text-xs font-bold transition-all duration-300 hover:shadow-lg hover:shadow-orange-200'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
                Email
              </button>
            )}
            {vendor.websiteUrl && (
              <button
                onClick={handleWebsite}
                className='flex flex-col items-center gap-1.5 bg-purple-50 hover:bg-purple-600 text-purple-600 hover:text-white py-3 px-2 rounded-2xl text-xs font-bold transition-all duration-300 hover:shadow-lg hover:shadow-purple-200'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9' />
                </svg>
                Website
              </button>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className='mt-4 space-y-4'>
          {/* Categories */}
          {allCategories.length > 0 && (
            <div className='bg-white rounded-2xl shadow-sm p-5'>
              <h2 className='text-base font-bold text-gray-800 mb-3 flex items-center gap-2'>
                <span className='text-blue-500'>🏷️</span> Business Categories
              </h2>
              <div className='space-y-3'>
                {allCategories.map((cat, i) => (
                  <div key={i}>
                    <p className='text-sm font-bold text-gray-700 mb-1.5'>{cat.category}</p>
                    <div className='flex flex-wrap gap-2'>
                      {(cat.subCategories || []).map((sub, j) => (
                        <span key={j} className='bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100'>
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Grid */}
          <div className='bg-white rounded-2xl shadow-sm p-5'>
            <h2 className='text-base font-bold text-gray-800 mb-3 flex items-center gap-2'>
              <span className='text-blue-500'>📋</span> Business Information
            </h2>
            <div className='space-y-3'>
              {vendor.mobile && (
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                    <svg className='w-4 h-4 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                    </svg>
                  </div>
                  <div>
                    <p className='text-xs text-gray-400 font-medium'>Phone</p>
                    <a href={`tel:${vendor.mobile}`} className='text-sm text-gray-800 font-semibold hover:text-blue-600 transition-colors'>+91 {vendor.mobile}</a>
                  </div>
                </div>
              )}
              {vendor.email && (
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                    <svg className='w-4 h-4 text-orange-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                    </svg>
                  </div>
                  <div>
                    <p className='text-xs text-gray-400 font-medium'>Email</p>
                    <a href={`mailto:${vendor.email}`} className='text-sm text-gray-800 font-semibold hover:text-orange-500 transition-colors break-all'>{vendor.email}</a>
                  </div>
                </div>
              )}
              {vendor.websiteUrl && (
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                    <svg className='w-4 h-4 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9' />
                    </svg>
                  </div>
                  <div>
                    <p className='text-xs text-gray-400 font-medium'>Website</p>
                    <a href={vendor.websiteUrl} target='_blank' rel='noreferrer' className='text-sm text-gray-800 font-semibold hover:text-purple-600 transition-colors break-all'>{vendor.websiteUrl}</a>
                  </div>
                </div>
              )}
              {(vendor.city || vendor.state) && (
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                    <svg className='w-4 h-4 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                    </svg>
                  </div>
                  <div>
                    <p className='text-xs text-gray-400 font-medium'>Location</p>
                    <p className='text-sm text-gray-800 font-semibold'>{[vendor.address, vendor.city, vendor.district, vendor.state].filter(Boolean).join(', ')}</p>
                  </div>
                </div>
              )}
              {vendor.referralCode && (
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0'>
                    <span className='text-amber-500 text-sm font-bold'>#</span>
                  </div>
                  <div>
                    <p className='text-xs text-gray-400 font-medium'>Referral Code</p>
                    <p className='text-sm text-gray-800 font-semibold'>{vendor.referralCode}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Certificate */}
          {vendor.activeCertificate && vendor.activeCertificate.status === 'active' && (
            <div className='bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5'>
              <div className='flex items-center gap-3'>
                <div className='text-3xl'>🏅</div>
                <div>
                  <p className='text-sm font-bold text-green-800'>Certified Vendor</p>
                  <p className='text-xs text-green-600'>Certificate No: {vendor.activeCertificate.certificateNumber}</p>
                  {vendor.activeCertificate.expiryDate && (
                    <p className='text-xs text-green-600'>Valid until: {new Date(vendor.activeCertificate.expiryDate).toLocaleDateString('en-IN', {day:'2-digit', month:'long', year:'numeric'})}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VendorDetail
