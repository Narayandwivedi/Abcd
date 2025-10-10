import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AddProduct = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    sku: '',
    brand: '',
    weight: '',
    dimensions: ''
  })

  const [images, setImages] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    setError('')
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed')
      return
    }
    setImages([...images, ...files])
    setError('')
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      setError('Please fill in all required fields')
      return
    }

    if (parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0')
      return
    }

    if (parseInt(formData.stock) < 0) {
      setError('Stock cannot be negative')
      return
    }

    if (images.length === 0) {
      setError('Please upload at least one product image')
      return
    }

    setLoading(true)

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()

      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key])
        }
      })

      // Add images
      images.forEach((image, index) => {
        formDataToSend.append(`images`, image)
      })

      const response = await fetch('http://localhost:5000/api/vendor/products', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Product added successfully!')
        setTimeout(() => {
          navigate('/products')
        }, 2000)
      } else {
        setError(data.message || 'Failed to add product')
      }
    } catch (err) {
      console.error('Add product error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-black text-gray-800 mb-2'>Add New Product</h1>
        <p className='text-gray-600'>Fill in the product details to add it to your inventory</p>
      </div>

      <form onSubmit={handleSubmit} className='bg-white rounded-2xl p-8 shadow-lg border border-gray-200'>
        {/* Basic Information */}
        <div className='mb-8'>
          <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
            <span className='text-2xl'>📝</span>
            Basic Information
          </h2>

          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                Product Name <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                placeholder='Enter product name'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                Category <span className='text-red-500'>*</span>
              </label>
              <select
                name='category'
                value={formData.category}
                onChange={handleChange}
                className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
              >
                <option value=''>Select category</option>
                <option value='electronics'>Electronics</option>
                <option value='fashion'>Fashion</option>
                <option value='home'>Home & Kitchen</option>
                <option value='books'>Books</option>
                <option value='sports'>Sports</option>
                <option value='toys'>Toys</option>
                <option value='other'>Other</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                Brand
              </label>
              <input
                type='text'
                name='brand'
                value={formData.brand}
                onChange={handleChange}
                className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                placeholder='Enter brand name'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                SKU
              </label>
              <input
                type='text'
                name='sku'
                value={formData.sku}
                onChange={handleChange}
                className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                placeholder='Enter SKU'
              />
            </div>
          </div>

          <div className='mt-6'>
            <label className='block text-sm font-bold text-gray-700 mb-2'>
              Description
            </label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              rows='4'
              className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
              placeholder='Enter product description'
            ></textarea>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className='mb-8'>
          <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
            <span className='text-2xl'>💰</span>
            Pricing & Inventory
          </h2>

          <div className='grid md:grid-cols-3 gap-6'>
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                Price (₹) <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                name='price'
                value={formData.price}
                onChange={handleChange}
                step='0.01'
                className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                placeholder='0.00'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                Stock Quantity <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                name='stock'
                value={formData.stock}
                onChange={handleChange}
                className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                placeholder='0'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>
                Weight (kg)
              </label>
              <input
                type='number'
                name='weight'
                value={formData.weight}
                onChange={handleChange}
                step='0.01'
                className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all'
                placeholder='0.00'
              />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className='mb-8'>
          <h2 className='text-xl font-bold text-gray-800 mb-4 flex items-center gap-2'>
            <span className='text-2xl'>📷</span>
            Product Images
          </h2>

          <div className='mb-4'>
            <label className='block w-full cursor-pointer'>
              <div className='border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-all'>
                <div className='text-4xl mb-3'>📸</div>
                <p className='text-gray-700 font-semibold mb-1'>Click to upload images</p>
                <p className='text-sm text-gray-500'>Maximum 5 images (JPG, PNG)</p>
              </div>
              <input
                type='file'
                multiple
                accept='image/*'
                onChange={handleImageChange}
                className='hidden'
              />
            </label>
          </div>

          {images.length > 0 && (
            <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
              {images.map((image, index) => (
                <div key={index} className='relative group'>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Product ${index + 1}`}
                    className='w-full h-32 object-cover rounded-xl border-2 border-gray-200'
                  />
                  <button
                    type='button'
                    onClick={() => removeImage(index)}
                    className='absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className='mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4'>
            <p className='text-sm font-semibold text-red-800'>{error}</p>
          </div>
        )}

        {success && (
          <div className='mb-6 bg-green-50 border-l-4 border-green-500 rounded-lg p-4'>
            <p className='text-sm font-semibold text-green-800'>{success}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex items-center gap-4'>
          <button
            type='submit'
            disabled={loading}
            className='flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
          <button
            type='button'
            onClick={() => navigate('/products')}
            className='px-6 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProduct
