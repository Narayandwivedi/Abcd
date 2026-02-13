import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'

const Dashboard = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'
  const [exporting, setExporting] = useState(false)
  const [exportOptions, setExportOptions] = useState({
    users: false,
    vendors: false,
    buyLeads: false,
    sellLeads: false
  })
  const [showExportModal, setShowExportModal] = useState(false)

  const handleCheckboxChange = (key) => {
    setExportOptions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const selectAll = () => {
    setExportOptions({ users: true, vendors: true, buyLeads: true, sellLeads: true })
  }

  const deselectAll = () => {
    setExportOptions({ users: false, vendors: false, buyLeads: false, sellLeads: false })
  }

  const downloadFile = (data, filename, type) => {
    if (type === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } else if (type === 'excel') {
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Data')
      XLSX.writeFile(wb, filename)
    }
  }

  const flattenObject = (obj, prefix = '') => {
    const flattened = {}
    for (const key in obj) {
      if (obj[key] === null || obj[key] === undefined) {
        flattened[prefix + key] = ''
      } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], prefix + key + '_'))
      } else if (Array.isArray(obj[key])) {
        flattened[prefix + key] = obj[key].join(', ')
      } else {
        flattened[prefix + key] = obj[key]
      }
    }
    return flattened
  }

  const toAbsoluteUploadUrl = (value) => {
    if (typeof value !== 'string') return value
    const trimmed = value.trim()
    if (!trimmed || /^https?:\/\//i.test(trimmed)) return value
    const normalizedPath = trimmed.replace(/\\/g, '/')
    const relativePath = normalizedPath.replace(/^\.?\//, '')
    if (relativePath.startsWith('upload/')) return `${BACKEND_URL}/${relativePath}`
    if (relativePath.startsWith('uploads/')) return `${BACKEND_URL}/${relativePath}`
    if (normalizedPath.startsWith('/upload/')) return `${BACKEND_URL}${normalizedPath}`
    if (normalizedPath.startsWith('/uploads/')) return `${BACKEND_URL}${normalizedPath}`
    return value
  }

  const normalizeExcelRow = (row) => {
    const normalizedRow = {}
    for (const key in row) {
      normalizedRow[key] = toAbsoluteUploadUrl(row[key])
    }
    return normalizedRow
  }

  const handleExport = async (format) => {
    const selected = Object.entries(exportOptions).filter(([_, v]) => v).map(([k]) => k)
    if (selected.length === 0) {
      toast.error('Please select at least one data type to export')
      return
    }

    setExporting(true)
    const timestamp = new Date().toISOString().split('T')[0]

    try {
      const endpoints = {
        users: '/api/admin/export/users',
        vendors: '/api/admin/export/vendors',
        buyLeads: '/api/admin/export/buy-leads',
        sellLeads: '/api/admin/export/sell-leads'
      }

      for (const key of selected) {
        try {
          toast.info(`Exporting ${key}...`)
          const response = await axios.get(endpoints[key])
          if (response.data.success && response.data.data.length > 0) {
            const data = response.data.data
            if (format === 'json') {
              downloadFile(data, `${key}_${timestamp}.json`, 'json')
            } else {
              const flatData = data.map(item => normalizeExcelRow(flattenObject(item)))
              downloadFile(flatData, `${key}_${timestamp}.xlsx`, 'excel')
            }
            toast.success(`${key} exported successfully (${response.data.count} records)`)
          } else {
            toast.warning(`No data found for ${key}`)
          }
        } catch (err) {
          toast.error(`Failed to export ${key}: ${err.response?.data?.message || err.message}`)
        }
      }
    } finally {
      setExporting(false)
      setShowExportModal(false)
    }
  }

  return (
    <div className='p-6'>
      <div className='mb-8 flex justify-between items-start'>
        <div>
          <h1 className='text-3xl font-black text-gray-800 mb-2'>Dashboard</h1>
          <p className='text-gray-600'>Overview of your ABCD platform</p>
        </div>
        <button
          onClick={() => setShowExportModal(true)}
          className='bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition flex items-center gap-2'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' />
          </svg>
          Export Data
        </button>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>Export Data</h2>

            <div className='mb-4'>
              <div className='flex gap-2 mb-3'>
                <button onClick={selectAll} className='text-sm text-blue-600 hover:underline'>Select All</button>
                <span className='text-gray-400'>|</span>
                <button onClick={deselectAll} className='text-sm text-gray-600 hover:underline'>Deselect All</button>
              </div>

              <div className='space-y-3'>
                {[
                  { key: 'users', label: 'All Users', icon: '👥' },
                  { key: 'vendors', label: 'All Vendors', icon: '🏪' },
                  { key: 'buyLeads', label: 'All Buy Leads', icon: '🛒' },
                  { key: 'sellLeads', label: 'All Sell Leads', icon: '💰' }
                ].map(({ key, label, icon }) => (
                  <label key={key} className='flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition'>
                    <input
                      type='checkbox'
                      checked={exportOptions[key]}
                      onChange={() => handleCheckboxChange(key)}
                      className='w-5 h-5 text-blue-600 rounded'
                    />
                    <span className='text-xl'>{icon}</span>
                    <span className='font-medium text-gray-700'>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className='flex gap-3 mt-6'>
              <button
                onClick={() => handleExport('excel')}
                disabled={exporting}
                className='flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
                {exporting ? 'Exporting...' : 'Export Excel'}
              </button>
              <button
                onClick={() => handleExport('json')}
                disabled={exporting}
                className='flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' />
                </svg>
                {exporting ? 'Exporting...' : 'Export JSON'}
              </button>
            </div>

            <button
              onClick={() => setShowExportModal(false)}
              className='w-full mt-3 py-2 text-gray-600 hover:text-gray-800 transition'
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow'>
          <div className='flex items-center justify-between mb-4'>
            <div className='text-4xl'>👥</div>
            <div className='bg-white/20 px-3 py-1 rounded-full text-xs font-semibold'>+12%</div>
          </div>
          <div className='text-3xl font-black mb-1'>2,543</div>
          <div className='text-blue-100 text-sm font-medium'>Total Users</div>
        </div>

        <div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow'>
          <div className='flex items-center justify-between mb-4'>
            <div className='text-4xl'>🏪</div>
            <div className='bg-white/20 px-3 py-1 rounded-full text-xs font-semibold'>+8%</div>
          </div>
          <div className='text-3xl font-black mb-1'>142</div>
          <div className='text-purple-100 text-sm font-medium'>Active Vendors</div>
        </div>

        <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow'>
          <div className='flex items-center justify-between mb-4'>
            <div className='text-4xl'>🛒</div>
            <div className='bg-white/20 px-3 py-1 rounded-full text-xs font-semibold'>+24%</div>
          </div>
          <div className='text-3xl font-black mb-1'>1,892</div>
          <div className='text-green-100 text-sm font-medium'>Total Orders</div>
        </div>

        <div className='bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow'>
          <div className='flex items-center justify-between mb-4'>
            <div className='text-4xl'>💰</div>
            <div className='bg-white/20 px-3 py-1 rounded-full text-xs font-semibold'>+18%</div>
          </div>
          <div className='text-3xl font-black mb-1'>₹45.2L</div>
          <div className='text-orange-100 text-sm font-medium'>Revenue</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200'>
          <h3 className='text-xl font-bold text-gray-800 mb-4'>Recent Orders</h3>
          <div className='space-y-3'>
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className='flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold'>
                    #{item}
                  </div>
                  <div>
                    <div className='font-semibold text-gray-800'>Order #{1000 + item}</div>
                    <div className='text-sm text-gray-500'>Customer {item}</div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-green-600'>₹{(Math.random() * 5000 + 1000).toFixed(0)}</div>
                  <div className='text-xs text-gray-500'>Completed</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-200'>
          <h3 className='text-xl font-bold text-gray-800 mb-4'>Top Vendors</h3>
          <div className='space-y-3'>
            {['Agrawal Electronics', 'Fashion Store', 'Home Decor', 'Book Store', 'Sports Shop'].map((vendor, idx) => (
              <div key={idx} className='flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold'>
                    {vendor[0]}
                  </div>
                  <div>
                    <div className='font-semibold text-gray-800'>{vendor}</div>
                    <div className='text-sm text-gray-500'>{Math.floor(Math.random() * 50 + 10)} Products</div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-bold text-blue-600'>₹{(Math.random() * 10000 + 5000).toFixed(0)}</div>
                  <div className='text-xs text-gray-500'>This month</div>
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
            { icon: '👥', text: 'New user registered: Rajesh Kumar', time: '2 min ago', color: 'blue' },
            { icon: '🏪', text: 'Vendor application approved: Fashion Hub', time: '15 min ago', color: 'green' },
            { icon: '📦', text: 'New product added by Electronics Store', time: '1 hour ago', color: 'purple' },
            { icon: '🛒', text: 'Order #1045 placed and confirmed', time: '2 hours ago', color: 'orange' },
            { icon: '💳', text: 'Payment received for Order #1044', time: '3 hours ago', color: 'green' }
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
