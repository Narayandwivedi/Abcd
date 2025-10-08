const Categories = () => {
  const categories = [
    { id: 1, name: 'Electronics', icon: '📱', products: 245, vendors: 23, status: 'Active', description: 'Phones, Laptops, Accessories' },
    { id: 2, name: 'Fashion', icon: '👕', products: 456, vendors: 45, status: 'Active', description: 'Clothing, Footwear, Accessories' },
    { id: 3, name: 'Home & Living', icon: '🏠', products: 189, vendors: 18, status: 'Active', description: 'Furniture, Decor, Kitchen' },
    { id: 4, name: 'Books', icon: '📚', products: 567, vendors: 12, status: 'Active', description: 'Fiction, Non-Fiction, Educational' },
    { id: 5, name: 'Sports', icon: '⚽', products: 134, vendors: 15, status: 'Active', description: 'Equipment, Fitness, Outdoor' },
    { id: 6, name: 'Beauty', icon: '💄', products: 298, vendors: 28, status: 'Active', description: 'Makeup, Skincare, Haircare' },
    { id: 7, name: 'Toys', icon: '🧸', products: 78, vendors: 8, status: 'Inactive', description: 'Kids Toys, Games, Puzzles' },
    { id: 8, name: 'Grocery', icon: '🛒', products: 423, vendors: 34, status: 'Active', description: 'Food, Beverages, Essentials' }
  ]

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-black text-gray-800 mb-2'>Categories Management</h1>
          <p className='text-gray-600'>Manage product categories</p>
        </div>
        <button className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg'>
          + Add Category
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Total Categories</div>
          <div className='text-3xl font-black text-blue-600'>24</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Active Categories</div>
          <div className='text-3xl font-black text-green-600'>21</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Total Products</div>
          <div className='text-3xl font-black text-purple-600'>2,890</div>
        </div>
        <div className='bg-white rounded-xl p-6 shadow-lg border border-gray-200'>
          <div className='text-gray-600 text-sm font-medium mb-2'>Top Category</div>
          <div className='text-xl font-black text-orange-600'>Fashion</div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {categories.map((category) => (
          <div key={category.id} className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow'>
            <div className='flex items-start justify-between mb-4'>
              <div className='w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center text-4xl'>
                {category.icon}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                category.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {category.status}
              </span>
            </div>

            <h3 className='text-xl font-black text-gray-800 mb-2'>{category.name}</h3>
            <p className='text-sm text-gray-600 mb-4'>{category.description}</p>

            <div className='flex items-center gap-4 mb-4 pb-4 border-b border-gray-200'>
              <div>
                <div className='text-2xl font-black text-blue-600'>{category.products}</div>
                <div className='text-xs text-gray-500'>Products</div>
              </div>
              <div>
                <div className='text-2xl font-black text-purple-600'>{category.vendors}</div>
                <div className='text-xs text-gray-500'>Vendors</div>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <button className='flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition'>
                View Products
              </button>
              <button className='px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-200 transition'>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories
