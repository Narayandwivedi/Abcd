import { Link } from 'react-router-dom'
import { Quote, Building2, Users } from 'lucide-react'
import BackgroundMusic from '../component/BackgroundMusic'

export default function Census() {
  return (
    <>
      <BackgroundMusic />
      <img src="/census.avif" alt="" className="w-full h-auto min-h-[21vh] md:min-h-0 object-cover md:object-contain" />

      <div className="bg-[#FFF8F0] px-4 sm:px-6 lg:px-8 pt-3 pb-12 sm:py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-3 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#4A3520]">Choose an Option</h2>
            <div className="mx-auto mt-3 w-16 h-1 rounded-full bg-gradient-to-r from-[#C67A2D] to-[#A8651E]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-8">
            <Link
              to="/samaj-census"
              className="group block w-full"
            >
              <div className="relative overflow-hidden flex items-center gap-3 md:gap-4 bg-gradient-to-br from-[#FB923C] via-[#F97316] to-[#C2410C] text-white px-4 py-4 md:px-7 md:py-6 rounded-2xl font-semibold text-center shadow-lg shadow-orange-500/25 ring-1 ring-white/10 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/25">
                  <Building2 size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="leading-tight text-sm md:text-lg">Submit New Agrawal Samaj Branch</p>
                  <p className="text-xs font-medium mt-1 text-orange-50/90">नया अग्रवाल समाज शाखा पंजीकृत करें</p>
                </div>
              </div>
            </Link>

            <Link
              to="/family-census"
              className="group block w-full"
            >
              <div className="relative overflow-hidden flex items-center gap-3 md:gap-4 bg-gradient-to-br from-[#60A5FA] via-[#2563EB] to-[#1E3A8A] text-white px-4 py-4 md:px-7 md:py-6 rounded-2xl font-semibold text-center shadow-lg shadow-blue-500/25 ring-1 ring-white/10 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/25">
                  <Users size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="leading-tight text-sm md:text-lg">Submit New Family Member Data</p>
                  <p className="text-xs font-medium mt-1 text-blue-50/90">नया परिवार सदस्य डेटा पंजीकृत करें</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-[14px] sm:mt-12 max-w-3xl mx-auto">
            <div className="relative bg-white rounded-[20px] border border-gray-100 shadow-lg shadow-gray-200/50 p-8 sm:p-10">
              <div className="absolute top-0 left-6 md:-top-4 md:left-8">
                <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#C67A2D] to-[#A8651E] flex items-center justify-center shadow-lg shadow-[#C67A2D]/30">
                  <Quote size={14} className="text-white" />
                </div>
              </div>
              <div className="pl-2">
                <p className="text-xs md:text-base text-gray-600 leading-relaxed mb-2">
                  <span className="md:hidden">Participate in the census to preserve our community heritage.</span>
                  <span className="hidden md:inline">Your participation in this census helps preserve our community heritage and strengthens the bonds between Samaj and families across regions.</span>
                </p>

                <div className="mt-1 pt-2 border-t border-gray-100">
                  <p className="text-base font-bold text-[#4A3520]">Lalit Kumar Agarwal</p>
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
