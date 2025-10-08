const Vendors = () => {
  const vendors = [
    { id: 1, name: 'Agrawal Electronics', owner: 'Rajesh Agrawal', email: 'rajesh@electronics.com', category: 'Electronics', status: 'Active', products: 45, joined: '2024-01-10' },
    { id: 2, name: 'Fashion Hub', owner: 'Priya Sharma', email: 'priya@fashionhub.com', category: 'Fashion', status: 'Active', products: 120, joined: '2024-02-15' },
    { id: 3, name: 'Home Decor Palace', owner: 'Amit Kumar', email: 'amit@homedecor.com', category: 'Home & Living', status: 'Pending', products: 78, joined: '2024-03-20' },
    { id: 4, name: 'Book Store', owner: 'Sneha Patel', email: 'sneha@bookstore.com', category: 'Books', status: 'Active', products: 230, joined: '2024-04-05' },
    { id: 5, name: 'Sports Shop', owner: 'Vikram Singh', email: 'vikram@sports.com', category: 'Sports', status: 'Inactive', products: 56, joined: '2024-05-12' }
  ]

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-black text-gray-800 mb-2'>Vendors Management</h1>
          <p className='text-gray-600'>Manage all platform vendors</p>
        </div>
        <button className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg'>
          + Add Vendor
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Total Vendors</div>
          <div className='text-3xl font-black text-purple-600'>142</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Active Vendors</div>
          <div className='text-3xl font-black text-green-600'>128</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Pending Approval</div>
          <div className='text-3xl font-black text-orange-600'>8</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Total Products</div>
          <div className='text-3xl font-black text-blue-600'>1,245</div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
        <div className='p-6 border-b border-gray-200'>
          <input
            type='text'
            placeholder='Search vendors...'
            className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Vendor</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Owner</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Category</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Products</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Status</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Joined</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {vendors.map((vendor) => (
                <tr key={vendor.id} className='hover:bg-gray-50 transition'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold'>
                        {vendor.name[0]}
                      </div>
                      <div className='font-semibold text-gray-800'>{vendor.name}</div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-gray-800 font-medium'>{vendor.owner}</div>
                    <div className='text-sm text-gray-500'>{vendor.email}</div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold'>
                      {vendor.category}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-gray-600 font-semibold'>{vendor.products}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      vendor.status === 'Active' ? 'bg-green-100 text-green-700' :
                      vendor.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-gray-600 text-sm'>{vendor.joined}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center gap-2'>
                      <button className='px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition'>
                        View
                      </button>
                      <button className='px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-200 transition'>
                        Edit
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

export default Vendors
