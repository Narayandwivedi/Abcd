const Dashboard = () => {
  return (
    <div className='p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-black text-gray-800 mb-2'>Dashboard</h1>
        <p className='text-gray-600'>Overview of your ABCD platform</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow'>
          <div className='flex items-center justify-between mb-4'>
            <div className='text-4xl'>👥</div>
            <div className='bg-white/20 px-3 py-1 rounded-full text-xs font-semibold'>+12%</div>
          </div>
          <div className='text-3xl font-black mb-1'>2,543</div>
          <div className='text-blue-100 text-sm font-medium'>Total Users</div>
        </div>

        <div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow'>
          <div className='flex items-center justify-between mb-4'>
            <div className='text-4xl'>🏪</div>
            <div className='bg-white/20 px-3 py-1 rounded-full text-xs font-semibold'>+8%</div>
          </div>
          <div className='text-3xl font-black mb-1'>142</div>
          <div className='text-purple-100 text-sm font-medium'>Active Vendors</div>
        </div>

        <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow'>
          <div className='flex items-center justify-between mb-4'>
            <div className='text-4xl'>🛒</div>
            <div className='bg-white/20 px-3 py-1 rounded-full text-xs font-semibold'>+24%</div>
          </div>
          <div className='text-3xl font-black mb-1'>1,892</div>
          <div className='text-green-100 text-sm font-medium'>Total Orders</div>
        </div>

        <div className='bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow'>
          <div className='flex items-center justify-between mb-4'>
            <div className='text-4xl'>💰</div>
            <div className='bg-white/20 px-3 py-1 rounded-full text-xs font-semibold'>+18%</div>
          </div>
          <div className='text-3xl font-black mb-1'>₹45.2L</div>
          <div className='text-orange-100 text-sm font-medium'>Revenue</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200'>
          <h3 className='text-xl font-bold text-gray-800 mb-4'>Recent Orders</h3>
          <div className='space-y-3'>
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className='flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold'>
                    #{item}
                  </div>
                  <div>
                    <div className='font-semibold text-gray-800'>Order #{1000 + item}</div>
                    <div className='text-sm text-gray-500'>Customer {item}</div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-green-600'>₹{(Math.random() * 5000 + 1000).toFixed(0)}</div>
                  <div className='text-xs text-gray-500'>Completed</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200'>
          <h3 className='text-xl font-bold text-gray-800 mb-4'>Top Vendors</h3>
          <div className='space-y-3'>
            {['Agrawal Electronics', 'Fashion Store', 'Home Decor', 'Book Store', 'Sports Shop'].map((vendor, idx) => (
              <div key={idx} className='flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold'>
                    {vendor[0]}
                  </div>
                  <div>
                    <div className='font-semibold text-gray-800'>{vendor}</div>
                    <div className='text-sm text-gray-500'>{Math.floor(Math.random() * 50 + 10)} Products</div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-blue-600'>₹{(Math.random() * 10000 + 5000).toFixed(0)}</div>
                  <div className='text-xs text-gray-500'>This month</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200'>
        <h3 className='text-xl font-bold text-gray-800 mb-4'>Recent Activity</h3>
        <div className='space-y-4'>
          {[
            { icon: '👥', text: 'New user registered: Rajesh Kumar', time: '2 min ago', color: 'blue' },
            { icon: '🏪', text: 'Vendor application approved: Fashion Hub', time: '15 min ago', color: 'green' },
            { icon: '📦', text: 'New product added by Electronics Store', time: '1 hour ago', color: 'purple' },
            { icon: '🛒', text: 'Order #1045 placed and confirmed', time: '2 hours ago', color: 'orange' },
            { icon: '💳', text: 'Payment received for Order #1044', time: '3 hours ago', color: 'green' }
          ].map((activity, idx) => (
            <div key={idx} className='flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition'>
              <div className={`w-10 h-10 bg-${activity.color}-100 rounded-lg flex items-center justify-center text-xl`}>
                {activity.icon}
              </div>
              <div className='flex-1'>
                <div className='text-gray-800 font-medium'>{activity.text}</div>
                <div className='text-sm text-gray-500'>{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
