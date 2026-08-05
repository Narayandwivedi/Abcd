import { Link } from 'react-router-dom'
import { Building2, Users } from 'lucide-react'
import AudioControls from '../component/AudioControls'

export default function Census() {
  return (
    <>
      <img src="/census.avif" alt="" className="md:hidden w-full h-auto min-h-[21vh] object-cover" />

      <section className="hidden md:block relative w-full md:h-[300px] bg-[#FCEBD8] overflow-hidden px-4 sm:px-6 lg:px-8">
        <img
          src="/agrasen maharaj.avif"
          alt="Maharaja Agrasen Ji"
          className="absolute top-6 right-24 sm:right-28 lg:right-32 w-auto max-w-full h-[calc(100%-1.5rem)] object-contain object-right"
        />
        <div className="relative z-10 max-w-[1200px] mx-auto h-full flex items-center">
          <div className="max-w-lg">
            <p className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.2em] uppercase text-[#C67A2D]">
              <span className="h-0.5 w-10 rounded-full bg-gradient-to-r from-[#C67A2D] to-[#A8651E]" />
              Agrawal Samaj Census
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[#4A3520]">
              अग्रवाल समाज
              <span className="block text-[#C67A2D]">जय महाराजा अग्रसेन जी</span>
            </h1>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Welcome to the Agrawal Samaj Census Portal — register your branch and family to
              strengthen our community and preserve our heritage.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-[#FFF8F0] px-4 sm:px-6 lg:px-8 pt-2 pb-8 sm:pt-1 sm:pb-16 lg:pt-1 lg:pb-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-3 md:mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#4A3520]">Choose an Option</h2>
            <div className="mx-auto mt-2 w-16 h-1 rounded-full bg-gradient-to-r from-[#C67A2D] to-[#A8651E]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-8">
            <Link
              to="/location"
              className="group block w-full"
            >
              <div className="relative overflow-hidden flex items-center gap-2 md:gap-4 bg-gradient-to-br from-[#FB923C] via-[#F97316] to-[#C2410C] text-white px-3 py-2.5 md:px-7 md:py-3 rounded-2xl font-semibold text-center shadow-lg shadow-orange-500/25 ring-1 ring-white/10 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <div className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/25">
                  <Building2 size={18} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="leading-tight text-sm md:text-base">Submit New Agrawal Samaj Branch</p>
                  <p className="text-xs font-medium mt-1 text-orange-50/90">नया अग्रवाल समाज शाखा पंजीकृत करें</p>
                </div>
              </div>
            </Link>

            <Link
              to="/family-census"
              className="group block w-full"
            >
              <div className="relative overflow-hidden flex items-center gap-2 md:gap-4 bg-gradient-to-br from-[#60A5FA] via-[#2563EB] to-[#1E3A8A] text-white px-3 py-2.5 md:px-7 md:py-3 rounded-2xl font-semibold text-center shadow-lg shadow-blue-500/25 ring-1 ring-white/10 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <div className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/25">
                  <Users size={18} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="leading-tight text-sm md:text-base">Submit New Family Member Data</p>
                  <p className="text-xs font-medium mt-1 text-blue-50/90">नया परिवार सदस्य डेटा पंजीकृत करें</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-2 sm:mt-4 max-w-4xl mx-auto">
            <div className="relative bg-white rounded-[20px] border border-gray-100 shadow-lg shadow-gray-200/50 p-2 sm:p-6">
              <div>
                <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-2">
                    <div className="h-[4.5rem] md:h-24 rounded-lg overflow-hidden shrink-0 ring-2 ring-[#C67A2D]/20 bg-white mx-auto md:mx-0">
                      <img
                        src="/ashokji.avif"
                        alt="Dr Ashok Agrawal"
                        className="h-full w-auto object-contain"
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-xs md:text-sm font-bold text-[#4A3520]">Dr Ashok Agrawal</p>
                      <p className="m-0 text-[10px] md:text-xs text-gray-500">President CGPAS</p>
                      <a
                        href="tel:9301014000"
                        className="inline-flex items-center gap-1 text-[10px] md:text-xs text-[#C67A2D] hover:text-[#A8651E] font-semibold transition-colors"
                      >
                        <svg className="w-3 md:w-3.5 h-3 md:h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        9301014000
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-2">
                    <div className="h-[4.5rem] md:h-24 rounded-lg overflow-hidden shrink-0 ring-2 ring-[#C67A2D]/20 bg-white mx-auto md:mx-0">
                      <img
                        src="/image.jpeg"
                        alt="Lalit Kumar Agrawal"
                        className="h-full w-auto object-contain"
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-xs md:text-sm font-bold text-[#4A3520]">Lalit Kumar Agrawal</p>
                      <p className="m-0 text-[10px] md:text-xs text-gray-500">Chairman, ABCD</p>
                      <a
                        href="tel:7000484146"
                        className="inline-flex items-center gap-1 text-[10px] md:text-xs text-[#C67A2D] hover:text-[#A8651E] font-semibold transition-colors"
                      >
                        <svg className="w-3 md:w-3.5 h-3 md:h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
        </div>
      </div>
      <AudioControls />
    </>
  )
}
