import axios from 'axios'

// Get backend URL from environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

// Create axios instance with default config
const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // Important for sending cookies
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor (optional - for adding auth tokens, etc.)
api.interceptors.request.use(
  (config) => {
    // You can add custom headers here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor (optional - for handling errors globally)
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors here
    if (error.response?.status === 401) {
      console.error('Unauthorized - Please login again')
    }
    return Promise.reject(error)
  }
)

export default api
export { BACKEND_URL }
