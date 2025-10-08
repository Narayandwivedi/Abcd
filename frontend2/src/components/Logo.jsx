import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <Link to='/' className='flex items-center gap-3 group'>
      {/* Hexagon Logo Icon */}
      <div className='relative'>
        <div className='absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg blur-md group-hover:blur-lg transition-all duration-300 opacity-40'></div>
        <div className='relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-lg p-3 shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:rotate-12 group-hover:scale-110'>
          <svg className='w-10 h-10 text-white' viewBox='0 0 24 24' fill='currentColor'>
            <path d='M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.5l6.5 3.6v7.3l-6.5 3.6-6.5-3.6V8.1l6.5-3.6z'/>
            <path d='M12 8l-4 2.3v4.6l4 2.3 4-2.3v-4.6L12 8zm0 2l2 1.2v2.4l-2 1.2-2-1.2v-2.4l2-1.2z' opacity='0.7'/>
          </svg>
        </div>
      </div>

      {/* Logo Text */}
      <div className='flex flex-col leading-none'>
        <div className='flex items-center gap-1.5'>
          <span className='text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:via-pink-700 group-hover:to-red-700 transition-all duration-300'
                style={{ letterSpacing: '3px' }}>
            ABCD
          </span>
          <div className='w-2 h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse'></div>
        </div>

        <div className='bg-gradient-to-r from-purple-600 to-pink-600 mt-1 px-2 py-1 rounded-md shadow-md'>
          <span className='text-[9px] font-extrabold text-white tracking-widest'>
            AGRAWAL BUSINESS
          </span>
        </div>

        <span className='text-[8px] text-gray-500 font-bold mt-1.5 tracking-widest uppercase italic'>
          Growth • Unity • Excellence
        </span>
      </div>
    </Link>
  )
}

export default Logo
