const Dashboard = () => {
  return (
    <div className='p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-black text-gray-800 mb-2'>Vendor Dashboard</h1>
        <p className='text-gray-600'>Overview of your business performance</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow'>
          <div className='flex items-center justify-between mb-4'>
            <div className='text-4xl'>📦</div>
            <div className='bg-white/20 px-3 py-1 rounded-full text-xs font-semibold'>Total</div>
          </div>
          <div className='text-3xl font-black mb-1'>45</div>
          <div className='text-blue-100 text-sm font-medium'>Total Products</div>
        </div>

        <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow'>
          <div className='flex items-center justify-between mb-4'>
            <div className='text-4xl'>🛒</div>
            <div className='bg-white/20 px-3 py-1 rounded-full text-xs font-semibold'>+24%</div>
          </div>
          <div className='text-3xl font-black mb-1'>128</div>
          <div className='text-green-100 text-sm font-medium'>Total Orders</div>
        </div>

        <div className='bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow'>
          <div className='flex items-center justify-between mb-4'>
            <div className='text-4xl'>💰</div>
            <div className='bg-white/20 px-3 py-1 rounded-full text-xs font-semibold'>+18%</div>
          </div>
          <div className='text-3xl font-black mb-1'>₹12.5L</div>
          <div className='text-orange-100 text-sm font-medium'>Revenue</div>
        </div>

        <div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow'>
          <div className='flex items-center justify-between mb-4'>
            <div className='text-4xl'>⭐</div>
            <div className='bg-white/20 px-3 py-1 rounded-full text-xs font-semibold'>4.8/5</div>
          </div>
          <div className='text-3xl font-black mb-1'>256</div>
          <div className='text-purple-100 text-sm font-medium'>Reviews</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200'>
          <h3 className='text-xl font-bold text-gray-800 mb-4'>Recent Orders</h3>
          <div className='space-y-3'>
            {[
              { id: 1, customer: 'Rahul Sharma', amount: 2500, status: 'Completed' },
              { id: 2, customer: 'Priya Gupta', amount: 1800, status: 'Processing' },
              { id: 3, customer: 'Amit Kumar', amount: 3200, status: 'Completed' },
              { id: 4, customer: 'Sneha Patel', amount: 1500, status: 'Pending' },
              { id: 5, customer: 'Vikram Singh', amount: 4100, status: 'Completed' }
            ].map((order) => (
              <div key={order.id} className='flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold'>
                    #{order.id}
                  </div>
                  <div>
                    <div className='font-semibold text-gray-800'>{order.customer}</div>
                    <div className='text-sm text-gray-500'>Order #{2000 + order.id}</div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-green-600'>₹{order.amount}</div>
                  <div className={`text-xs ${
                    order.status === 'Completed' ? 'text-green-600' :
                    order.status === 'Processing' ? 'text-blue-600' :
                    'text-orange-600'
                  }`}>{order.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200'>
          <h3 className='text-xl font-bold text-gray-800 mb-4'>Top Selling Products</h3>
          <div className='space-y-3'>
            {[
              { name: 'Wireless Headphones', sold: 45, revenue: 45000 },
              { name: 'Smart Watch', sold: 38, revenue: 38000 },
              { name: 'Bluetooth Speaker', sold: 32, revenue: 32000 },
              { name: 'Power Bank', sold: 28, revenue: 14000 },
              { name: 'Phone Case', sold: 25, revenue: 7500 }
            ].map((product, idx) => (
              <div key={idx} className='flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold'>
                    {idx + 1}
                  </div>
                  <div>
                    <div className='font-semibold text-gray-800'>{product.name}</div>
                    <div className='text-sm text-gray-500'>{product.sold} units sold</div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-blue-600'>₹{product.revenue}</div>
                  <div className='text-xs text-gray-500'>Revenue</div>
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
            { icon: '🛒', text: 'New order #2045 received from Rajesh Kumar', time: '5 min ago', color: 'blue' },
            { icon: '📦', text: 'Product "Wireless Mouse" stock running low', time: '1 hour ago', color: 'orange' },
            { icon: '⭐', text: 'New 5-star review on Smart Watch', time: '2 hours ago', color: 'green' },
            { icon: '💳', text: 'Payment received for Order #2043', time: '3 hours ago', color: 'green' },
            { icon: '📦', text: 'Product "USB Cable" added successfully', time: '5 hours ago', color: 'purple' }
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
