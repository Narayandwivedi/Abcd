import { Link } from 'react-router-dom'
import { Building2, Users, ArrowRight, Quote } from 'lucide-react'

export default function Census() {
  return (
    <>
      <div className="relative bg-gradient-to-br from-[#4A3520] via-[#5C4030] to-[#3A2510] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#C67A2D] blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#A8651E] blur-3xl" />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-white/80 tracking-wide">AGRAWAL SAMAJ CENSUS 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white leading-tight">
            Agrawal Samaj
            <br />
            <span className="bg-gradient-to-r from-[#F5A623] to-[#C67A2D] bg-clip-text text-transparent">
              Census Portal
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Help us build a comprehensive directory of the Agrawal community.
            Register your Samaj or Family details to strengthen our community network.
          </p>
        </div>
      </div>

      <div className="bg-[#FFF8F0] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#4A3520]">Choose an Option</h2>
            <div className="mx-auto mt-3 w-16 h-1 rounded-full bg-gradient-to-r from-[#C67A2D] to-[#A8651E]" />
            <p className="mt-4 text-gray-500 text-sm sm:text-base">
              Select the type of census registration you'd like to complete
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <Link
              to="/samaj-census"
              className="group block bg-white rounded-[20px] border border-gray-100 shadow-lg shadow-gray-200/50 overflow-hidden hover:shadow-xl hover:shadow-[#C67A2D]/10 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-2 bg-gradient-to-r from-[#C67A2D] to-[#F5A623]" />
              <div className="p-6 sm:p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D0] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Building2 size={28} className="text-[#C67A2D]" />
                </div>
                <h3 className="text-xl font-bold text-[#4A3520]">Submit New Agrawal Samaj Location</h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                  Register a new Samaj with office address, contact details, and leadership information.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[#C67A2D] font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Fill Samaj Details</span>
                  <ArrowRight size={16} className="transition-all group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            <Link
              to="/family-census"
              className="group block bg-white rounded-[20px] border border-gray-100 shadow-lg shadow-gray-200/50 overflow-hidden hover:shadow-xl hover:shadow-[#C67A2D]/10 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-2 bg-gradient-to-r from-[#A8651E] to-[#C67A2D]" />
              <div className="p-6 sm:p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D0] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Users size={28} className="text-[#C67A2D]" />
                </div>
                <h3 className="text-xl font-bold text-[#4A3520]">Submit New Family Member Data</h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                  Register your family with leader details, address, and comprehensive member information.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[#C67A2D] font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Fill Family Details</span>
                  <ArrowRight size={16} className="transition-all group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-16 sm:mt-20 max-w-3xl mx-auto">
            <div className="relative bg-white rounded-[20px] border border-gray-100 shadow-lg shadow-gray-200/50 p-8 sm:p-10">
              <div className="absolute -top-4 left-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C67A2D] to-[#A8651E] flex items-center justify-center shadow-lg shadow-[#C67A2D]/30">
                  <Quote size={18} className="text-white" />
                </div>
              </div>
              <div className="pl-2">
                <p className="text-lg sm:text-xl text-gray-700 italic leading-relaxed font-medium">
                  "This census is a crucial step toward documenting and strengthening our community.
                  Every Samaj and every family counts. Let's come together and build a comprehensive
                  record of the Agrawal community for future generations."
                </p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-base font-bold text-[#4A3520]">Quotsy - Lalit Kumar Agarwal</p>
                  <p className="text-sm text-gray-500">Chairman, ABCD</p>
                  <a
                    href="tel:7000484146"
                    className="inline-flex items-center gap-1.5 mt-1 text-sm text-[#C67A2D] hover:text-[#A8651E] font-semibold transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    7000484146
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
