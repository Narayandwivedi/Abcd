const Settings = () => {
  return (
    <div className='p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-black text-gray-800 mb-2'>System Settings</h1>
        <p className='text-gray-600'>Manage your platform settings and preferences</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Side - Settings Menu */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-4'>
            <nav className='space-y-2'>
              {[
                { name: 'General Settings', icon: '⚙️', active: true },
                { name: 'Admin Profile', icon: '👤', active: false },
                { name: 'Platform Config', icon: '🔧', active: false },
                { name: 'Email Settings', icon: '📧', active: false },
                { name: 'Payment Gateway', icon: '💳', active: false },
                { name: 'Security', icon: '🔒', active: false },
                { name: 'Notifications', icon: '🔔', active: false },
                { name: 'Backup & Restore', icon: '💾', active: false }
              ].map((item, idx) => (
                <button
                  key={idx}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    item.active
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className='text-xl'>{item.icon}</span>
                  <span className='font-semibold'>{item.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Side - Settings Content */}
        <div className='lg:col-span-2 space-y-6'>
          {/* General Settings */}
          <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200'>
            <h3 className='text-xl font-bold text-gray-800 mb-6'>General Settings</h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-gray-700 font-semibold mb-2'>Platform Name</label>
                <input
                  type='text'
                  defaultValue='ABCD'
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='block text-gray-700 font-semibold mb-2'>Platform Email</label>
                <input
                  type='email'
                  defaultValue='admin@abcd.com'
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='block text-gray-700 font-semibold mb-2'>Support Phone</label>
                <input
                  type='tel'
                  defaultValue='+91 9876543210'
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='block text-gray-700 font-semibold mb-2'>Platform Description</label>
                <textarea
                  rows={4}
                  defaultValue='ABCD is a multi-vendor e-commerce platform connecting buyers and sellers.'
                  className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>
          </div>

          {/* Admin Profile */}
          <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200'>
            <h3 className='text-xl font-bold text-gray-800 mb-6'>Admin Profile</h3>
            <div className='space-y-4'>
              <div className='flex items-center gap-6 mb-6'>
                <div className='w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg'>
                  LA
                </div>
                <div>
                  <h4 className='text-2xl font-black text-gray-800'>Lalit Agrawal</h4>
                  <p className='text-gray-600'>Super Admin</p>
                  <button className='mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition'>
                    Change Avatar
                  </button>
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>Full Name</label>
                  <input
                    type='text'
                    defaultValue='Lalit Agrawal'
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>Email</label>
                  <input
                    type='email'
                    defaultValue='lalit@abcd.com'
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>Phone</label>
                  <input
                    type='tel'
                    defaultValue='+91 9876543210'
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-gray-700 font-semibold mb-2'>Role</label>
                  <input
                    type='text'
                    defaultValue='Super Admin'
                    disabled
                    className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200'>
            <h3 className='text-xl font-bold text-gray-800 mb-6'>Quick Actions</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <button className='flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition border border-blue-200'>
                <div className='w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl'>
                  🔄
                </div>
                <div className='text-left'>
                  <div className='font-bold text-gray-800'>Clear Cache</div>
                  <div className='text-xs text-gray-600'>Clear system cache</div>
                </div>
              </button>

              <button className='flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition border border-purple-200'>
                <div className='w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xl'>
                  💾
                </div>
                <div className='text-left'>
                  <div className='font-bold text-gray-800'>Backup Data</div>
                  <div className='text-xs text-gray-600'>Create system backup</div>
                </div>
              </button>

              <button className='flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition border border-green-200'>
                <div className='w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl'>
                  📊
                </div>
                <div className='text-left'>
                  <div className='font-bold text-gray-800'>Export Data</div>
                  <div className='text-xs text-gray-600'>Export all platform data</div>
                </div>
              </button>

              <button className='flex items-center gap-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition border border-orange-200'>
                <div className='w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xl'>
                  🔔
                </div>
                <div className='text-left'>
                  <div className='font-bold text-gray-800'>Send Alert</div>
                  <div className='text-xs text-gray-600'>Send notification to users</div>
                </div>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className='flex justify-end gap-4'>
            <button className='px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition'>
              Cancel
            </button>
            <button className='px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg'>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
