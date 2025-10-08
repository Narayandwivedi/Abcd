const Orders = () => {
  const orders = [
    { id: 1001, customer: 'Rajesh Kumar', items: 3, total: 5999, status: 'Delivered', payment: 'Paid', date: '2024-10-05' },
    { id: 1002, customer: 'Priya Sharma', items: 1, total: 2499, status: 'Shipped', payment: 'Paid', date: '2024-10-06' },
    { id: 1003, customer: 'Amit Patel', items: 5, total: 8999, status: 'Processing', payment: 'Paid', date: '2024-10-07' },
    { id: 1004, customer: 'Sneha Verma', items: 2, total: 3599, status: 'Pending', payment: 'Pending', date: '2024-10-07' },
    { id: 1005, customer: 'Vikram Singh', items: 4, total: 12999, status: 'Cancelled', payment: 'Refunded', date: '2024-10-08' }
  ]

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-black text-gray-800 mb-2'>Orders Management</h1>
          <p className='text-gray-600'>Manage all customer orders</p>
        </div>
        <button className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg'>
          Export Orders
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-5 gap-6 mb-8'>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Total Orders</div>
          <div className='text-3xl font-black text-blue-600'>1,892</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Pending</div>
          <div className='text-3xl font-black text-orange-600'>142</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Processing</div>
          <div className='text-3xl font-black text-purple-600'>234</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Delivered</div>
          <div className='text-3xl font-black text-green-600'>1,452</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Cancelled</div>
          <div className='text-3xl font-black text-red-600'>64</div>
        </div>
      </div>

      {/* Orders Table */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
        <div className='p-6 border-b border-gray-200 flex items-center gap-4'>
          <input
            type='text'
            placeholder='Search orders...'
            className='flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <select className='px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'>
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Order ID</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Customer</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Items</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Total</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Status</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Payment</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Date</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {orders.map((order) => (
                <tr key={order.id} className='hover:bg-gray-50 transition'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='font-bold text-blue-600'>#{order.id}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold'>
                        {order.customer[0]}
                      </div>
                      <div className='font-semibold text-gray-800'>{order.customer}</div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-gray-600 font-semibold'>{order.items} items</td>
                  <td className='px-6 py-4 whitespace-nowrap text-gray-800 font-bold'>₹{order.total}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Processing' ? 'bg-purple-100 text-purple-700' :
                      order.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.payment === 'Paid' ? 'bg-green-100 text-green-700' :
                      order.payment === 'Refunded' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-gray-600 text-sm'>{order.date}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center gap-2'>
                      <button className='px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition'>
                        View
                      </button>
                      <button className='px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-200 transition'>
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Orders
