const Payments = () => {
  const payments = [
    { id: 'PAY001', order: 1001, customer: 'Rajesh Kumar', amount: 5999, method: 'UPI', status: 'Completed', date: '2024-10-05', time: '10:45 AM' },
    { id: 'PAY002', order: 1002, customer: 'Priya Sharma', amount: 2499, method: 'Card', status: 'Completed', date: '2024-10-06', time: '02:30 PM' },
    { id: 'PAY003', order: 1003, customer: 'Amit Patel', amount: 8999, method: 'Net Banking', status: 'Pending', date: '2024-10-07', time: '11:15 AM' },
    { id: 'PAY004', order: 1004, customer: 'Sneha Verma', amount: 3599, method: 'Wallet', status: 'Failed', date: '2024-10-07', time: '04:20 PM' },
    { id: 'PAY005', order: 1005, customer: 'Vikram Singh', amount: 12999, method: 'Card', status: 'Refunded', date: '2024-10-08', time: '09:00 AM' }
  ]

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-black text-gray-800 mb-2'>Payments Management</h1>
          <p className='text-gray-600'>Track and manage all transactions</p>
        </div>
        <button className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg'>
          Export Report
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg'>
          <div className='text-green-100 text-sm font-medium mb-2'>Total Revenue</div>
          <div className='text-3xl font-black'>₹45.2L</div>
          <div className='text-green-100 text-xs mt-2'>+18% from last month</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Completed</div>
          <div className='text-3xl font-black text-green-600'>1,654</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Pending</div>
          <div className='text-3xl font-black text-orange-600'>142</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Failed/Refunded</div>
          <div className='text-3xl font-black text-red-600'>96</div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white rounded-xl p-4 shadow-lg border border-gray-200 flex items-center gap-3'>
          <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl'>💳</div>
          <div>
            <div className='text-sm text-gray-600'>Cards</div>
            <div className='text-xl font-black text-gray-800'>45%</div>
          </div>
        </div>
        <div className='bg-white rounded-xl p-4 shadow-lg border border-gray-200 flex items-center gap-3'>
          <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl'>📱</div>
          <div>
            <div className='text-sm text-gray-600'>UPI</div>
            <div className='text-xl font-black text-gray-800'>35%</div>
          </div>
        </div>
        <div className='bg-white rounded-xl p-4 shadow-lg border border-gray-200 flex items-center gap-3'>
          <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl'>🏦</div>
          <div>
            <div className='text-sm text-gray-600'>Net Banking</div>
            <div className='text-xl font-black text-gray-800'>15%</div>
          </div>
        </div>
        <div className='bg-white rounded-xl p-4 shadow-lg border border-gray-200 flex items-center gap-3'>
          <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl'>👛</div>
          <div>
            <div className='text-sm text-gray-600'>Wallet</div>
            <div className='text-xl font-black text-gray-800'>5%</div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
        <div className='p-6 border-b border-gray-200 flex items-center gap-4'>
          <input
            type='text'
            placeholder='Search payments...'
            className='flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <select className='px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'>
            <option>All Status</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
            <option>Refunded</option>
          </select>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Payment ID</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Order</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Customer</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Amount</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Method</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Status</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Date & Time</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {payments.map((payment) => (
                <tr key={payment.id} className='hover:bg-gray-50 transition'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='font-bold text-blue-600'>{payment.id}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='font-semibold text-gray-800'>#{payment.order}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold'>
                        {payment.customer[0]}
                      </div>
                      <div className='font-semibold text-gray-800'>{payment.customer}</div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-gray-800 font-bold'>₹{payment.amount}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold'>
                      {payment.method}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      payment.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      payment.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                      payment.status === 'Failed' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-gray-800 text-sm'>{payment.date}</div>
                    <div className='text-gray-500 text-xs'>{payment.time}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center gap-2'>
                      <button className='px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition'>
                        View
                      </button>
                      <button className='px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-200 transition'>
                        Receipt
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

export default Payments
