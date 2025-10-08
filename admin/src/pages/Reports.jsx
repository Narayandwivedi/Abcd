const Reports = () => {
  const salesData = [
    { month: 'Jan', sales: 32000, orders: 145, customers: 89 },
    { month: 'Feb', sales: 38000, orders: 167, customers: 102 },
    { month: 'Mar', sales: 42000, orders: 189, customers: 115 },
    { month: 'Apr', sales: 45000, orders: 198, customers: 128 },
    { month: 'May', sales: 51000, orders: 223, customers: 142 },
    { month: 'Jun', sales: 48000, orders: 212, customers: 136 }
  ]

  const topProducts = [
    { name: 'Wireless Headphones', sales: 245, revenue: 734550 },
    { name: 'Cotton T-Shirt', sales: 412, revenue: 205588 },
    { name: 'JavaScript Guide', sales: 189, revenue: 113211 },
    { name: 'Cricket Bat', sales: 67, revenue: 127233 },
    { name: 'Wall Clock', sales: 98, revenue: 88102 }
  ]

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-black text-gray-800 mb-2'>Reports & Analytics</h1>
          <p className='text-gray-600'>Sales reports and business insights</p>
        </div>
        <div className='flex items-center gap-3'>
          <select className='px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-semibold'>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last 6 Months</option>
            <option>This Year</option>
          </select>
          <button className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg'>
            Download PDF
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg'>
          <div className='flex items-center justify-between mb-4'>
            <div className='text-4xl'>💰</div>
            <div className='bg-white/20 px-3 py-1 rounded-full text-xs font-semibold'>+18%</div>
          </div>
          <div className='text-3xl font-black mb-1'>₹45.2L</div>
          <div className='text-blue-100 text-sm font-medium'>Total Revenue</div>
        </div>

        <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg'>
          <div className='flex items-center justify-between mb-4'>
            <div className='text-4xl'>🛒</div>
            <div className='bg-white/20 px-3 py-1 rounded-full text-xs font-semibold'>+24%</div>
          </div>
          <div className='text-3xl font-black mb-1'>1,892</div>
          <div className='text-green-100 text-sm font-medium'>Total Orders</div>
        </div>

        <div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg'>
          <div className='flex items-center justify-between mb-4'>
            <div className='text-4xl'>📦</div>
            <div className='bg-white/20 px-3 py-1 rounded-full text-xs font-semibold'>+15%</div>
          </div>
          <div className='text-3xl font-black mb-1'>1,245</div>
          <div className='text-purple-100 text-sm font-medium'>Products Sold</div>
        </div>

        <div className='bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg'>
          <div className='flex items-center justify-between mb-4'>
            <div className='text-4xl'>📈</div>
            <div className='bg-white/20 px-3 py-1 rounded-full text-xs font-semibold'>+12%</div>
          </div>
          <div className='text-3xl font-black mb-1'>₹23.9K</div>
          <div className='text-orange-100 text-sm font-medium'>Avg Order Value</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        {/* Sales Trend */}
        <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-xl font-bold text-gray-800'>Sales Trend</h3>
            <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold'>+18% Growth</span>
          </div>
          <div className='space-y-4'>
            {salesData.map((data, idx) => (
              <div key={idx} className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='font-semibold text-gray-700'>{data.month}</span>
                  <span className='font-bold text-gray-800'>₹{data.sales.toLocaleString()}</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-3'>
                  <div
                    className='bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all'
                    style={{ width: `${(data.sales / 60000) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200'>
          <h3 className='text-xl font-bold text-gray-800 mb-6'>Top Selling Products</h3>
          <div className='space-y-4'>
            {topProducts.map((product, idx) => (
              <div key={idx} className='flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold'>
                    {idx + 1}
                  </div>
                  <div>
                    <div className='font-semibold text-gray-800'>{product.name}</div>
                    <div className='text-sm text-gray-500'>{product.sales} units sold</div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-green-600'>₹{product.revenue.toLocaleString()}</div>
                  <div className='text-xs text-gray-500'>Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200'>
        <h3 className='text-xl font-bold text-gray-800 mb-6'>Category Performance</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
          {[
            { name: 'Electronics', sales: 245, revenue: '₹12.3L', color: 'blue' },
            { name: 'Fashion', sales: 456, revenue: '₹15.8L', color: 'purple' },
            { name: 'Home & Living', sales: 189, revenue: '₹8.2L', color: 'green' },
            { name: 'Books', sales: 567, revenue: '₹6.5L', color: 'orange' },
            { name: 'Sports', sales: 134, revenue: '₹4.1L', color: 'red' }
          ].map((category, idx) => (
            <div key={idx} className={`bg-gradient-to-br from-${category.color}-100 to-${category.color}-50 rounded-xl p-4 border border-${category.color}-200`}>
              <div className='text-sm text-gray-600 font-medium mb-2'>{category.name}</div>
              <div className='text-2xl font-black text-gray-800 mb-1'>{category.revenue}</div>
              <div className='text-xs text-gray-600'>{category.sales} products</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Reports
