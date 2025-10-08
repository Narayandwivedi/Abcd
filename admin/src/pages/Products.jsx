const Products = () => {
  const products = [
    { id: 1, name: 'Wireless Headphones', vendor: 'Agrawal Electronics', category: 'Electronics', price: 2999, stock: 45, status: 'Active', image: '🎧' },
    { id: 2, name: 'Cotton T-Shirt', vendor: 'Fashion Hub', category: 'Fashion', price: 499, stock: 120, status: 'Active', image: '👕' },
    { id: 3, name: 'Wall Clock', vendor: 'Home Decor Palace', category: 'Home & Living', price: 899, stock: 0, status: 'Out of Stock', image: '🕐' },
    { id: 4, name: 'JavaScript Guide', vendor: 'Book Store', category: 'Books', price: 599, stock: 230, status: 'Active', image: '📚' },
    { id: 5, name: 'Cricket Bat', vendor: 'Sports Shop', category: 'Sports', price: 1899, stock: 15, status: 'Low Stock', image: '🏏' }
  ]

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-black text-gray-800 mb-2'>Products Management</h1>
          <p className='text-gray-600'>Manage all platform products</p>
        </div>
        <button className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg'>
          + Add Product
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Total Products</div>
          <div className='text-3xl font-black text-blue-600'>1,245</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Active Products</div>
          <div className='text-3xl font-black text-green-600'>1,089</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Low Stock</div>
          <div className='text-3xl font-black text-orange-600'>45</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Out of Stock</div>
          <div className='text-3xl font-black text-red-600'>111</div>
        </div>
      </div>

      {/* Products Table */}
      <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
        <div className='p-6 border-b border-gray-200 flex items-center gap-4'>
          <input
            type='text'
            placeholder='Search products...'
            className='flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <select className='px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'>
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home & Living</option>
            <option>Books</option>
            <option>Sports</option>
          </select>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Product</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Vendor</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Category</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Price</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Stock</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Status</th>
                <th className='px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {products.map((product) => (
                <tr key={product.id} className='hover:bg-gray-50 transition'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center gap-3'>
                      <div className='w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl'>
                        {product.image}
                      </div>
                      <div className='font-semibold text-gray-800'>{product.name}</div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-gray-600'>{product.vendor}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold'>
                      {product.category}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-gray-800 font-bold'>₹{product.price}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-gray-600 font-semibold'>{product.stock}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'Active' ? 'bg-green-100 text-green-700' :
                      product.status === 'Low Stock' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center gap-2'>
                      <button className='px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition'>
                        Edit
                      </button>
                      <button className='px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition'>
                        Delete
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

export default Products
