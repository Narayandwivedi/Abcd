import { useState } from 'react'
import { useAdminAuth } from '../context/AdminAuthContext'

const Settings = () => {
  const { admin } = useAdminAuth()
  const { isInstallable, isInstalled, installPWA } = usePWAInstall()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'All fields are required' })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/api/admin/change-password`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to change password' })
      }
    } catch (error) {
      console.error('Change password error:', error)
      setMessage({ type: 'error', text: 'Failed to change password' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-4 md:p-6'>
      <div className='mb-6 md:mb-8'>
        <h1 className='text-2xl md:text-3xl font-black text-gray-800 mb-1 md:mb-2'>Settings</h1>
        <p className='text-sm md:text-base text-gray-600'>Manage your admin profile and security settings</p>
      </div>

      <div className='max-w-4xl mx-auto space-y-6'>
        {/* PWA Install App */}
        <div className='bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white text-xl'>
              📱
            </div>
            <div>
              <h2 className='text-lg font-bold text-gray-800'>Install App</h2>
              <p className='text-xs text-gray-500'>Install ABCD Admin as a desktop application</p>
            </div>
          </div>

          <div className='space-y-3'>
            {isInstalled ? (
              <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <div className='text-2xl'>✅</div>
                  <div className='flex-1'>
                    <div className='font-semibold text-green-800 text-sm'>App Installed</div>
                    <div className='text-xs text-green-600'>ABCD Admin is installed on your device</div>
                  </div>
                </div>
              </div>
            ) : isInstallable ? (
              <div className='space-y-3'>
                <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                  <div className='text-sm text-blue-800 mb-3'>
                    Install this app on your device for quick access without opening a browser. Works offline and provides a native app experience.
                  </div>
                  <ul className='text-xs text-blue-700 space-y-1 ml-4 list-disc'>
                    <li>Launch directly from desktop/home screen</li>
                    <li>Works offline with cached data</li>
                    <li>Faster loading times</li>
                    <li>No browser address bar</li>
                  </ul>
                </div>
                <button
                  onClick={async () => {
                    const success = await installPWA()
                    if (success) {
                      console.log('App installation initiated')
                    }
                  }}
                  className='w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105'
                >
                  <span className='text-xl'>⬇️</span>
                  <span>Install ABCD Admin App</span>
                </button>
              </div>
            ) : (
              <div className='p-4 bg-gray-50 border border-gray-200 rounded-lg'>
                <div className='flex items-center gap-3'>
                  <div className='text-2xl'>ℹ️</div>
                  <div className='flex-1'>
                    <div className='font-semibold text-gray-800 text-sm'>Installation Not Available</div>
                    <div className='text-xs text-gray-600 mt-1'>
                      To install this app:
                      <ul className='mt-2 ml-4 list-disc space-y-1'>
                        <li>Use Chrome, Edge, or Safari browser</li>
                        <li>Access via HTTPS (secure connection)</li>
                        <li>App may already be installed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Admin Profile */}
          <div className='bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200'>
            <h3 className='text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6'>Admin Profile</h3>
            <div className='space-y-3 md:space-y-4'>
              {/* Desktop View */}
              <div className='hidden md:flex items-center gap-6 mb-6'>
                <div className='w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg'>
                  {admin?.fullName?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <h4 className='text-2xl font-black text-gray-800'>{admin?.fullName || 'Admin'}</h4>
                  <p className='text-gray-600'>Super Admin</p>
                </div>
              </div>

              {/* Mobile View */}
              <div className='md:hidden flex items-center gap-3 mb-4'>
                <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg'>
                  {admin?.fullName?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <h4 className='text-lg font-black text-gray-800'>{admin?.fullName || 'Admin'}</h4>
                  <p className='text-sm text-gray-600'>Super Admin</p>
                </div>
              </div>


            </div>
          </div>

          {/* Change Password */}
          <div className='bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200'>
            <h3 className='text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2'>
              <span>🔒</span> Change Password
            </h3>

            {/* Message Alert */}
            {message.text && (
              <div className={`mb-4 p-3 md:p-4 rounded-xl ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <div className='flex items-center gap-2'>
                  <span className='text-sm md:text-base'>{message.type === 'success' ? '✅' : '❌'}</span>
                  <span className='text-sm md:text-base font-semibold'>{message.text}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleChangePassword} className='space-y-3 md:space-y-4'>
              <div>
                <label className='block text-gray-700 font-semibold mb-2 text-sm md:text-base'>Current Password</label>
                <div className='relative'>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder='Enter current password'
                    className='w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div>
                <label className='block text-gray-700 font-semibold mb-2 text-sm md:text-base'>New Password</label>
                <div className='relative'>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder='Enter new password (min 6 characters)'
                    className='w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div>
                <label className='block text-gray-700 font-semibold mb-2 text-sm md:text-base'>Confirm New Password</label>
                <div className='relative'>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='Confirm new password'
                    className='w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='showPasswords'
                  checked={showPasswords}
                  onChange={(e) => setShowPasswords(e.target.checked)}
                  className='w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
                />
                <label htmlFor='showPasswords' className='text-xs md:text-sm text-gray-700 cursor-pointer'>
                  Show passwords
                </label>
              </div>

              <div className='flex gap-2 md:gap-4 pt-2'>
                <button
                  type='button'
                  onClick={() => {
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                    setMessage({ type: '', text: '' })
                  }}
                  className='flex-1 px-3 py-2 md:px-6 md:py-3 border-2 border-gray-200 text-gray-700 rounded-xl text-sm md:text-base font-bold hover:bg-gray-50 transition'
                >
                  Clear
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className='flex-1 px-3 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm md:text-base font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>

            <div className='mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-xl'>
              <p className='text-xs md:text-sm text-blue-800'>
                <strong>💡 Security Tip:</strong> Use a strong password with at least 6 characters.
                Include a mix of letters, numbers, and symbols for better security.
              </p>
            </div>
          </div>
      </div>
    </div>
  )
}

export default Settings
