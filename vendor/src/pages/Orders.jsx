import React, { useState, useEffect } from 'react'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data - Replace with actual API call
  useEffect(() => {
    setTimeout(() => {
      setOrders([
        { id: 2001, customer: 'Rahul Sharma', product: 'Wireless Headphones', quantity: 2, amount: 5998, status: 'pending', date: '2025-10-09', address: 'Raipur, Chhattisgarh' },
        { id: 2002, customer: 'Priya Gupta', product: 'Smart Watch', quantity: 1, amount: 4999, status: 'processing', date: '2025-10-09', address: 'Bilaspur, Chhattisgarh' },
        { id: 2003, customer: 'Amit Kumar', product: 'Bluetooth Speaker', quantity: 3, amount: 5997, status: 'shipped', date: '2025-10-08', address: 'Bhilai, Chhattisgarh' },
        { id: 2004, customer: 'Sneha Patel', product: 'Power Bank', quantity: 2, amount: 2998, status: 'delivered', date: '2025-10-07', address: 'Durg, Chhattisgarh' },
        { id: 2005, customer: 'Vikram Singh', product: 'Phone Case', quantity: 5, amount: 1495, status: 'delivered', date: '2025-10-07', address: 'Raipur, Chhattisgarh' },
        { id: 2006, customer: 'Anjali Verma', product: 'USB Cable', quantity: 4, amount: 796, status: 'processing', date: '2025-10-09', address: 'Korba, Chhattisgarh' },
        { id: 2007, customer: 'Rajesh Yadav', product: 'Wireless Mouse', quantity: 1, amount: 599, status: 'pending', date: '2025-10-09', address: 'Raigarh, Chhattisgarh' },
        { id: 2008, customer: 'Pooja Sharma', product: 'Keyboard', quantity: 2, amount: 2598, status: 'cancelled', date: '2025-10-06', address: 'Jagdalpur, Chhattisgarh' },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Processing' },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Shipped' },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Delivered' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' }
    }
    const config = statusConfig[status] || statusConfig.pending
    return (
      <span className={`px-3 py-1 ${config.bg} ${config.text} text-xs font-bold rounded-full`}>
        {config.label}
      </span>
    )
  }

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === '' || order.status === filterStatus
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm)
    return matchesStatus && matchesSearch
  })

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  }

  return (
    <div className='p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-black text-gray-800 mb-2'>Orders</h1>
        <p className='text-gray-600'>Manage customer orders and track deliveries</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mb-6'>
        <div className='bg-white rounded-xl p-4 shadow-lg border border-gray-200'>
          <div className='text-sm font-semibold text-gray-600 mb-1'>Total</div>
          <div className='text-2xl font-black text-gray-800'>{stats.total}</div>
        </div>
        <div className='bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white shadow-lg'>
          <div className='text-sm font-semibold mb-1'>Pending</div>
          <div className='text-2xl font-black'>{stats.pending}</div>
        </div>
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg'>
          <div className='text-sm font-semibold mb-1'>Processing</div>
          <div className='text-2xl font-black'>{stats.processing}</div>
        </div>
        <div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg'>
          <div className='text-sm font-semibold mb-1'>Shipped</div>
          <div className='text-2xl font-black'>{stats.shipped}</div>
        </div>
        <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg'>
          <div className='text-sm font-semibold mb-1'>Delivered</div>
          <div className='text-2xl font-black'>{stats.delivered}</div>
        </div>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6'>
        <div className='grid md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>Search Orders</label>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search by order ID or customer name...'
              className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
            />
          </div>
          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
            >
              <option value=''>All Status</option>
              <option value='pending'>Pending</option>
              <option value='processing'>Processing</option>
              <option value='shipped'>Shipped</option>
              <option value='delivered'>Delivered</option>
              <option value='cancelled'>Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className='bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center'>
          <div className='text-4xl mb-4'>⏳</div>
          <p className='text-gray-600 font-semibold'>Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className='bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center'>
          <div className='text-6xl mb-4'>🛒</div>
          <h3 className='text-xl font-bold text-gray-800 mb-2'>No Orders Found</h3>
          <p className='text-gray-600'>No orders match your search criteria</p>
        </div>
      ) : (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white'>
                <tr>
                  <th className='px-6 py-4 text-left text-sm font-bold'>Order ID</th>
                  <th className='px-6 py-4 text-left text-sm font-bold'>Customer</th>
                  <th className='px-6 py-4 text-left text-sm font-bold'>Product</th>
                  <th className='px-6 py-4 text-left text-sm font-bold'>Quantity</th>
                  <th className='px-6 py-4 text-left text-sm font-bold'>Amount</th>
                  <th className='px-6 py-4 text-left text-sm font-bold'>Date</th>
                  <th className='px-6 py-4 text-left text-sm font-bold'>Status</th>
                  <th className='px-6 py-4 text-left text-sm font-bold'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className='hover:bg-gray-50 transition-colors'>
                    <td className='px-6 py-4'>
                      <div className='font-bold text-indigo-600'>#{order.id}</div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='font-semibold text-gray-800'>{order.customer}</div>
                      <div className='text-sm text-gray-500'>{order.address}</div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='font-semibold text-gray-800'>{order.product}</div>
                    </td>
                    <td className='px-6 py-4 font-semibold text-gray-700'>{order.quantity}</td>
                    <td className='px-6 py-4 font-bold text-gray-800'>₹{order.amount}</td>
                    <td className='px-6 py-4 text-gray-600'>{order.date}</td>
                    <td className='px-6 py-4'>{getStatusBadge(order.status)}</td>
                    <td className='px-6 py-4'>
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className='px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:outline-none focus:border-indigo-500'
                        >
                          <option value='pending'>Pending</option>
                          <option value='processing'>Processing</option>
                          <option value='shipped'>Shipped</option>
                          <option value='delivered'>Delivered</option>
                          <option value='cancelled'>Cancelled</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
