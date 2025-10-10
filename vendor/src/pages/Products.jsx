import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Products = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  // Mock data - Replace with actual API call
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setProducts([
        { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 2999, stock: 50, status: 'active', image: 'https://via.placeholder.com/100' },
        { id: 2, name: 'Smart Watch', category: 'Electronics', price: 4999, stock: 30, status: 'active', image: 'https://via.placeholder.com/100' },
        { id: 3, name: 'Bluetooth Speaker', category: 'Electronics', price: 1999, stock: 0, status: 'out_of_stock', image: 'https://via.placeholder.com/100' },
        { id: 4, name: 'Power Bank', category: 'Electronics', price: 1499, stock: 75, status: 'active', image: 'https://via.placeholder.com/100' },
        { id: 5, name: 'Phone Case', category: 'Accessories', price: 299, stock: 100, status: 'active', image: 'https://via.placeholder.com/100' },
        { id: 6, name: 'USB Cable', category: 'Accessories', price: 199, stock: 150, status: 'active', image: 'https://via.placeholder.com/100' },
        { id: 7, name: 'Wireless Mouse', category: 'Electronics', price: 599, stock: 5, status: 'low_stock', image: 'https://via.placeholder.com/100' },
        { id: 8, name: 'Keyboard', category: 'Electronics', price: 1299, stock: 40, status: 'active', image: 'https://via.placeholder.com/100' },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === '' || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getStatusBadge = (status, stock) => {
    if (stock === 0) {
      return <span className='px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full'>Out of Stock</span>
    } else if (stock <= 10) {
      return <span className='px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full'>Low Stock</span>
    } else {
      return <span className='px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full'>In Stock</span>
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  return (
    <div className='p-6'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-black text-gray-800 mb-2'>Products</h1>
          <p className='text-gray-600'>Manage your product inventory</p>
        </div>
        <button
          onClick={() => navigate('/add-product')}
          className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2'
        >
          <span className='text-xl'>➕</span>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6'>
        <div className='grid md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>Search Products</label>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search by product name...'
              className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
            />
          </div>
          <div>
            <label className='block text-sm font-bold text-gray-700 mb-2'>Filter by Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
            >
              <option value=''>All Categories</option>
              <option value='Electronics'>Electronics</option>
              <option value='Accessories'>Accessories</option>
              <option value='Fashion'>Fashion</option>
              <option value='Home'>Home & Kitchen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className='bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center'>
          <div className='text-4xl mb-4'>⏳</div>
          <p className='text-gray-600 font-semibold'>Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className='bg-white rounded-2xl p-12 shadow-lg border border-gray-200 text-center'>
          <div className='text-6xl mb-4'>📦</div>
          <h3 className='text-xl font-bold text-gray-800 mb-2'>No Products Found</h3>
          <p className='text-gray-600 mb-6'>Start by adding your first product</p>
          <button
            onClick={() => navigate('/add-product')}
            className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-xl transition-all hover:scale-105'
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white'>
                <tr>
                  <th className='px-6 py-4 text-left text-sm font-bold'>Product</th>
                  <th className='px-6 py-4 text-left text-sm font-bold'>Category</th>
                  <th className='px-6 py-4 text-left text-sm font-bold'>Price</th>
                  <th className='px-6 py-4 text-left text-sm font-bold'>Stock</th>
                  <th className='px-6 py-4 text-left text-sm font-bold'>Status</th>
                  <th className='px-6 py-4 text-left text-sm font-bold'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className='hover:bg-gray-50 transition-colors'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold'>
                          {product.name[0]}
                        </div>
                        <div>
                          <div className='font-semibold text-gray-800'>{product.name}</div>
                          <div className='text-sm text-gray-500'>ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full'>
                        {product.category}
                      </span>
                    </td>
                    <td className='px-6 py-4 font-bold text-gray-800'>₹{product.price}</td>
                    <td className='px-6 py-4 font-semibold text-gray-700'>{product.stock}</td>
                    <td className='px-6 py-4'>{getStatusBadge(product.status, product.stock)}</td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => navigate(`/edit-product/${product.id}`)}
                          className='p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors'
                          title='Edit'
                        >
                          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className='p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors'
                          title='Delete'
                        >
                          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white'>
          <div className='text-sm font-semibold mb-1'>Total Products</div>
          <div className='text-2xl font-black'>{products.length}</div>
        </div>
        <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white'>
          <div className='text-sm font-semibold mb-1'>In Stock</div>
          <div className='text-2xl font-black'>{products.filter(p => p.stock > 10).length}</div>
        </div>
        <div className='bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white'>
          <div className='text-sm font-semibold mb-1'>Low Stock</div>
          <div className='text-2xl font-black'>{products.filter(p => p.stock > 0 && p.stock <= 10).length}</div>
        </div>
      </div>
    </div>
  )
}

export default Products
