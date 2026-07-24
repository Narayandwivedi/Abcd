import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { UserPlus, Trash2, Eye, Edit3, X, AlertTriangle, Search, ChevronDown } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

const emptyContactPerson = () => ({
  name: '',
  designation: '',
  mobile: '',
  email: '',
  alternateMobile: '',
})

const emptyForm = {
  samajName: '',
  officeAddress: '',
  mobile: '',
  email: '',
  city: '',
  district: '',
  state: '',
  pincode: '',
  contactPersons: [{ name: '', designation: '', mobile: '', email: '', alternateMobile: '' }],
  remarks: '',
  submittedBy: '',
  submittedByMobile: '',
}

const titleCase = (str) => {
  if (!str) return ''
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const filterAndSortCities = (cityList, citySearch, currentDisplay) => {
  if (!citySearch || citySearch === currentDisplay) return cityList
  const q = citySearch.toLowerCase()
  const rank = (c) => {
    const city = c.city.toLowerCase()
    if (city.startsWith(q)) return 0
    if (city.includes(q)) return 1
    if (c.district.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)) return 2
    return -1
  }
  return cityList
    .map((c) => ({ c, r: rank(c) }))
    .filter(({ r }) => r !== -1)
    .sort((a, b) => a.r - b.r || a.c.city.localeCompare(b.c.city))
    .map(({ c }) => c)
}

function Input({ label, required, className, ...props }) {
  return (
    <label className="flex flex-col gap-1 font-medium text-xs sm:text-sm flex-1 min-w-0">
      <span className="text-gray-700 text-xs sm:text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        {...props}
        className={`w-full px-2.5 py-2 sm:px-3.5 sm:py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none transition-all duration-200 focus:border-[#C67A2D] focus:ring-2 focus:ring-[#C67A2D]/15 bg-white ${className || ''}`}
      />
    </label>
  )
}

function Textarea({ label, required, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 font-medium text-sm flex-1 min-w-0">
      <span className="text-gray-700 text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <textarea
        {...props}
        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none transition-all duration-200 focus:border-[#C67A2D] focus:ring-2 focus:ring-[#C67A2D]/15 bg-white resize-y min-h-[80px]"
      />
    </label>
  )
}

function Select({ label, required, children, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 font-medium text-sm flex-1 min-w-0">
      <span className="text-gray-700 text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <select
        {...props}
        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none transition-all duration-200 focus:border-[#C67A2D] focus:ring-2 focus:ring-[#C67A2D]/15 bg-white"
      >
        {children}
      </select>
    </label>
  )
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-lg shadow-gray-200/50">
      <div className="px-6 sm:px-8 py-4 border-b border-gray-100 bg-gradient-to-r from-[#FFF8F0] to-white rounded-t-[20px]">
        <h3 className="text-base font-bold text-[#C67A2D] tracking-wide">{title}</h3>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  )
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-lg bg-[#C67A2D]/10 flex items-center justify-center">
        <span className="text-[#C67A2D] text-base">{icon}</span>
      </div>
      <h2 className="text-lg font-bold text-[#4A3520]">{title}</h2>
    </div>
  )
}

function PreviewRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-2.5 border-b border-gray-50 last:border-b-0">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[160px]">{label}</span>
      <span className="text-sm text-gray-800 font-medium mt-0.5 sm:mt-0">{value || '—'}</span>
    </div>
  )
}

export default function SamajCensus() {
  const [form, setForm] = useState({ ...emptyForm, contactPersons: [emptyContactPerson()] })
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [cityList, setCityList] = useState([])
  const [citySearch, setCitySearch] = useState('')
  const [cityLoading, setCityLoading] = useState(true)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [additionalInfoOpen, setAdditionalInfoOpen] = useState(false)
  const cityRef = useRef(null)
  const cityInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/cities?limit=1000`)
      .then((res) => {
        if (res.data.success) {
          setCityList(res.data.data)
        }
        setCityLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load cities')
        setCityLoading(false)
      })
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setCityDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleReset = () => {
    setForm({ ...emptyForm, contactPersons: [emptyContactPerson()] })
    setShowPreview(false)
    setShowConfirm(false)
    setCitySearch('')
  }

  const handleContactPersonChange = (index, field, value) => {
    const updated = [...form.contactPersons]
    updated[index] = { ...updated[index], [field]: value }
    setForm((prev) => ({ ...prev, contactPersons: updated }))
  }

  const addContactPerson = () => {
    setForm((prev) => ({
      ...prev,
      contactPersons: [...prev.contactPersons, emptyContactPerson()],
    }))
  }

  const removeContactPerson = (index) => {
    setForm((prev) => ({
      ...prev,
      contactPersons: prev.contactPersons.filter((_, i) => i !== index),
    }))
  }

  const validate = () => {
    if (!form.samajName.trim()) { toast.error('Samaj Name Is Required.'); return false }
    if (!form.mobile.trim()) { toast.error('Mobile Number Is Required.'); return false }
    if (!form.city.trim()) { toast.error('City Is Required.'); return false }
    if (!form.submittedBy.trim()) { toast.error('Submitted By Name Is Required.'); return false }
    if (!form.submittedByMobile.trim()) { toast.error('Mobile Number Is Required.'); return false }
    if (!/^\d{10}$/.test(form.submittedByMobile.trim())) { toast.error('Please Enter A Valid 10-Digit Mobile Number.'); return false }

    for (let i = 0; i < form.contactPersons.length; i++) {
      const cp = form.contactPersons[i]
      if (!cp.name.trim()) { toast.error(`Contact Person ${i + 1}: Name is required.`); return false }
      if (!cp.designation.trim()) { toast.error(`Contact Person ${i + 1}: Designation is required.`); return false }
      if (!cp.mobile.trim()) { toast.error(`Contact Person ${i + 1}: Mobile Number is required.`); return false }
    }
    return true
  }

  const submitToApi = async () => {
    setSubmitting(true)
    try {
      await axios.post(`${BACKEND_URL}/api/samaj`, {
        samajName: form.samajName,
        officeAddress: form.officeAddress,
        mobile: form.mobile,
        email: form.email,
        state: form.state,
        district: form.district,
        city: form.city,
        pincode: form.pincode,
        leaders: form.contactPersons.map((cp) => ({
          name: cp.name,
          designation: cp.designation,
          mobile: cp.mobile,
        })),
        remarks: form.remarks,
        isActive: true,
      })
      setShowPreview(false)
      setShowSuccess(true)
      toast.success('Samaj Registered Successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed To Save Samaj. Please Try Again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setShowPreview(true)
  }

  const handleConfirmSave = async () => {
    setShowConfirm(false)
    await submitToApi()
  }

  if (showSuccess) {
    return (
      <>
        <img src="/samaj hero mobile.avif" alt="" className="w-full h-auto object-contain md:hidden" />
        <img src="/samaj hero.avif" alt="" className="hidden md:block w-full h-auto object-contain" />
        <div className="bg-[#FFF8F0] min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-[20px] shadow-lg shadow-gray-200/50 p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C67A2D] to-[#A8651E] flex items-center justify-center mx-auto shadow-lg shadow-[#C67A2D]/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#4A3520] mt-6">Samaj Registered Successfully!</h3>
          <p className="text-sm text-gray-500 mt-2">The Samaj Information Has Been Saved Successfully.</p>
          <button
            onClick={() => { setShowSuccess(false); handleReset() }}
            className="mt-8 px-8 py-3 rounded-[14px] text-sm font-semibold text-white bg-gradient-to-r from-[#C67A2D] to-[#A8651E] hover:shadow-lg hover:shadow-[#C67A2D]/25 transition-all duration-300 cursor-pointer"
          >
            Register Another Samaj
          </button>
        </div>
      </div>
    </>
    )
  }

  if (showPreview) {
    return (
      <>
        <div className="bg-[#FFF8F0] min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-[900px] mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C67A2D] to-[#A8651E] flex items-center justify-center shadow-lg shadow-[#C67A2D]/30">
                <Eye size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#4A3520]">Preview Samaj Details</h1>
                <p className="text-sm text-gray-500">Please review all information before saving</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <SectionCard title="Samaj Information">
                <PreviewRow label="Samaj Name" value={form.samajName} />
                <PreviewRow label="Mobile Number" value={form.mobile} />
                <PreviewRow label="Office Address" value={form.officeAddress} />
                <PreviewRow label="Email" value={form.email} />
              </SectionCard>

              <SectionCard title="Location Details">
                <PreviewRow label="City" value={form.city ? `${titleCase(form.city)} • ${titleCase(form.district)} • ${titleCase(form.state)}` : ''} />
                <PreviewRow label="Pincode" value={form.pincode} />
              </SectionCard>

              <SectionCard title="Contact Persons">
                {form.contactPersons.map((cp, idx) => (
                  <div key={idx} className={idx < form.contactPersons.length - 1 ? 'border-b border-gray-100 pb-4 mb-4' : ''}>
                    <p className="text-xs font-bold text-[#C67A2D] uppercase tracking-wider mb-3">Contact Person {idx + 1}</p>
                    <PreviewRow label="Name" value={cp.name} />
                    <PreviewRow label="Designation" value={cp.designation} />
                    <PreviewRow label="Mobile" value={cp.mobile} />
                    <PreviewRow label="Email" value={cp.email} />
                    <PreviewRow label="Alternate Mobile" value={cp.alternateMobile} />
                  </div>
                ))}
              </SectionCard>

              <SectionCard title="Additional Information">
                <PreviewRow label="Remarks" value={form.remarks} />
              </SectionCard>

              <SectionCard title="Submitted By">
                <PreviewRow label="Name" value={form.submittedBy} />
                <PreviewRow label="Mobile Number" value={form.submittedByMobile} />
              </SectionCard>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pb-8">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-[14px] text-sm font-semibold text-gray-500 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <Edit3 size={16} /> Edit Details
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="w-full sm:w-auto px-10 py-3.5 rounded-[14px] text-sm font-semibold text-white bg-[#C67A2D] shadow-sm hover:bg-[#A8651E] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                Save Samaj
              </button>
            </div>
          </div>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
            <div className="relative bg-white rounded-[20px] shadow-2xl p-8 max-w-md w-full animate-fade-in">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} className="text-gray-500" />
              </button>
              <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
                <AlertTriangle size={28} className="text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-[#4A3520] text-center mt-4">Confirm Save</h3>
              <p className="text-sm text-gray-500 text-center mt-2 leading-relaxed">
                Are you sure you want to save this Samaj data? Please verify all details before confirming.
              </p>
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-5 py-3 rounded-[14px] text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  disabled={submitting}
                  className="flex-1 px-5 py-3 rounded-[14px] text-sm font-semibold text-white bg-[#C67A2D] shadow-sm hover:bg-[#A8651E] transition-all duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  ) : 'Yes, Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <img src="/samaj hero mobile.avif" alt="" className="w-full h-auto object-contain md:hidden" />
      <img src="/samaj hero.avif" alt="" className="hidden md:block w-full h-auto object-contain" />
      <div className="bg-[#FFF8F0] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4A3520]">Samaj Census</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Fill In The Details Below To Register A New Samaj In The Census Portal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div>
            <SectionHeader icon="🏛️" title="Samaj Information" />
            <SectionCard title="Basic Details">
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-5">
                  <Input label="Samaj Name" required value={form.samajName} onChange={handleChange} name="samajName" placeholder="Enter Name" />
                  <Input label="Samaj Mobile" required value={form.mobile} onChange={handleChange} name="mobile" placeholder="Enter Mobile" />
                  <div className="relative min-w-0" ref={cityRef}>
                    <label className="flex flex-col gap-1 font-medium text-xs sm:text-sm">
                      <span className="text-gray-700 text-xs sm:text-sm font-semibold">
                        City <span className="text-red-500">*</span>
                      </span>
                      <div className="relative">
                        <Search size={14} className="absolute left-2 sm:left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                          ref={cityInputRef}
                          value={form.city && !cityDropdownOpen ? `${titleCase(form.city)} • ${titleCase(form.district)} • ${titleCase(form.state)}` : citySearch}
                          onChange={(e) => { setCitySearch(e.target.value); setCityDropdownOpen(true); setHighlightedIndex(-1); if (form.city) setForm((prev) => ({ ...prev, city: '', district: '', state: '' })) }}
                          onFocus={() => { setCityDropdownOpen(true); setHighlightedIndex(-1); if (form.city && !citySearch) setCitySearch(`${titleCase(form.city)} • ${titleCase(form.district)} • ${titleCase(form.state)}`) }}
                          onKeyDown={(e) => {
                            const currentDisplay = form.city ? `${titleCase(form.city)} • ${titleCase(form.district)} • ${titleCase(form.state)}` : ''
                            const filtered = filterAndSortCities(cityList, citySearch, currentDisplay)
                            const visible = filtered.slice(0, 50)
                            if (e.key === 'ArrowDown') {
                              e.preventDefault()
                              setHighlightedIndex((prev) => (prev < visible.length - 1 ? prev + 1 : prev))
                            } else if (e.key === 'ArrowUp') {
                              e.preventDefault()
                              setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
                            } else if (e.key === 'Enter' && highlightedIndex >= 0 && visible[highlightedIndex]) {
                              e.preventDefault()
                              const c = visible[highlightedIndex]
                              setForm((prev) => ({ ...prev, city: titleCase(c.city), district: titleCase(c.district), state: titleCase(c.state) }))
                              setCitySearch('')
                              setCityDropdownOpen(false)
                              setHighlightedIndex(-1)
                            } else if (e.key === 'Escape') {
                              setCityDropdownOpen(false)
                              setHighlightedIndex(-1)
                            }
                          }}
                          placeholder="Select City"
                          className="w-full pl-7 sm:pl-9 pr-8 sm:pr-10 px-2.5 py-2 sm:px-3.5 sm:py-2.5 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none transition-all duration-200 focus:border-[#C67A2D] focus:ring-2 focus:ring-[#C67A2D]/15 bg-white"
                        />
                        <ChevronDown
                          size={16}
                          className={`absolute right-2 sm:right-3.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer transition-transform duration-200 ${cityDropdownOpen ? 'rotate-180' : ''}`}
                          onClick={() => {
                            if (!cityDropdownOpen) {
                              const formatted = form.city ? `${titleCase(form.city)} • ${titleCase(form.district)} • ${titleCase(form.state)}` : ''
                              setCitySearch(formatted)
                              setHighlightedIndex(-1)
                              setCityDropdownOpen(true)
                              cityInputRef.current?.focus()
                            } else {
                              setCityDropdownOpen(false)
                            }
                          }}
                        />
                      </div>
                    </label>
                    {cityDropdownOpen && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-200/50 max-h-80 overflow-y-auto">
                        {cityLoading ? (
                          <div className="px-4 py-6 text-sm text-gray-400 flex flex-col items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-[#C67A2D]/30 border-t-[#C67A2D] rounded-full animate-spin" />
                            Loading cities...
                          </div>
                        ) : (
                          (() => {
                            const currentDisplay = form.city ? `${titleCase(form.city)} • ${titleCase(form.district)} • ${titleCase(form.state)}` : ''
                            const filtered = filterAndSortCities(cityList, citySearch, currentDisplay)
                            if (filtered.length === 0) {
                              return (
                                <div className="px-4 py-6 text-sm text-gray-400 text-center">No cities found</div>
                              )
                            }
                            return filtered.slice(0, 50).map((c, i) => {
                              const isSelected = form.city && titleCase(c.city) === titleCase(form.city) && titleCase(c.district) === titleCase(form.district)
                              const isHighlighted = i === highlightedIndex
                              return (
                                <div
                                  key={`${c.city}-${c.district}-${c.state}`}
                                  onClick={() => {
                                    setForm((prev) => ({ ...prev, city: titleCase(c.city), district: titleCase(c.district), state: titleCase(c.state) }))
                                    setCitySearch('')
                                    setCityDropdownOpen(false)
                                    setHighlightedIndex(-1)
                                  }}
                                  onMouseEnter={() => setHighlightedIndex(i)}
                                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors border-b border-gray-50 last:border-b-0 ${
                                    isSelected ? 'bg-[#FFF8F0] text-[#C67A2D] font-semibold' : isHighlighted ? 'bg-[#FFF8F0] text-[#C67A2D]' : 'text-gray-700 hover:bg-[#FFF8F0] hover:text-[#C67A2D]'
                                  }`}
                                >
                                  <div>{titleCase(c.city)}</div>
                                  <div className="text-xs text-gray-400">{titleCase(c.district)} • {titleCase(c.state)}</div>
                                </div>
                              )
                            })
                          })()
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          <div>
            <SectionHeader icon="👤" title="Samaj Head / Contact Person" />
            <SectionCard title="Contact Person Details">
              <div className="flex flex-col gap-5">
                <span className="text-xs text-gray-400">
                  {form.contactPersons.length} contact person{form.contactPersons.length !== 1 ? 's' : ''}
                </span>

                {form.contactPersons.map((cp, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-300 hover:shadow-sm animate-fade-in">
                    {idx > 0 && (
                      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#FFF8F0] to-white border-b border-gray-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C67A2D] to-[#A8651E] flex items-center justify-center shadow-sm">
                            <span className="text-xs font-bold text-white">{idx + 1}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">Contact Person {idx + 1}</span>
                        </div>
                        <button type="button" onClick={() => removeContactPerson(idx)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer">
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    )}

                    <div className="p-5 flex flex-col gap-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <Input label="Full Name" required value={cp.name} onChange={(e) => handleContactPersonChange(idx, 'name', e.target.value)} placeholder="Enter full name" />
                        <Input label="Designation" required value={cp.designation} onChange={(e) => handleContactPersonChange(idx, 'designation', e.target.value)} placeholder="Enter designation" />
                        <Input label="Mobile Number" required type="tel" value={cp.mobile} onChange={(e) => handleContactPersonChange(idx, 'mobile', e.target.value)} placeholder="Enter mobile number" />
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Input label="Email Address" type="email" value={cp.email} onChange={(e) => handleContactPersonChange(idx, 'email', e.target.value)} placeholder="Enter email address" />
                        <Input label="Alternate Mobile" value={cp.alternateMobile} onChange={(e) => handleContactPersonChange(idx, 'alternateMobile', e.target.value)} placeholder="Enter alternate mobile (Optional)" />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-end mt-2">
                  <button type="button" onClick={addContactPerson} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#C67A2D] to-[#A8651E] text-white hover:opacity-90 transition-all duration-200 cursor-pointer shadow-sm shadow-[#C67A2D]/20">
                    <UserPlus size={15} /> Add More Heads
                  </button>
                </div>
              </div>
            </SectionCard>
          </div>

          <div>
            <SectionHeader icon="📋" title="Additional Information (Optional)" />
<div className="bg-white rounded-[20px] border border-gray-100 shadow-lg shadow-gray-200/50">
              <button
                type="button"
                onClick={() => setAdditionalInfoOpen(!additionalInfoOpen)}
                className="w-full flex items-center justify-between px-6 sm:px-8 py-4 bg-white cursor-pointer transition-colors"
              >
                <h3 className="text-base font-bold text-[#C67A2D] tracking-wide">Additional Details</h3>
                <ChevronDown
                  size={20}
                  className={`text-[#C67A2D] transition-transform duration-300 ${additionalInfoOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  additionalInfoOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 sm:p-8 flex flex-col gap-5">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <Input label="Samaj Email" type="email" value={form.email} onChange={handleChange} name="email" placeholder="Enter Email Address" />
                    <Input label="Pincode" value={form.pincode} onChange={handleChange} name="pincode" placeholder="Enter Pincode (Optional)" />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Textarea label="Samaj Office Address" value={form.officeAddress} onChange={handleChange} name="officeAddress" placeholder="Enter Office Address" />
                    <Textarea label="Remarks" value={form.remarks} onChange={handleChange} name="remarks" placeholder="Enter Any Additional Remarks Or Notes..." />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionHeader icon="📝" title="Form Submission Details" />
            <SectionCard title="Submitted By">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="This Form Is Submitted By" required value={form.submittedBy} onChange={handleChange} name="submittedBy" placeholder="Enter Full Name" />
                <Input label="Mobile Number" required type="tel" value={form.submittedByMobile} onChange={handleChange} name="submittedByMobile" placeholder="Enter Mobile Number" />
              </div>
            </SectionCard>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8">
            <button type="button" onClick={handleReset} className="w-full sm:w-auto px-8 py-3.5 rounded-[14px] text-sm font-semibold text-gray-500 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 transition-all duration-200 cursor-pointer">
              Reset Form
            </button>
            <button type="submit" className="w-full sm:w-auto px-10 py-3.5 rounded-[14px] text-sm font-semibold text-white bg-[#C67A2D] shadow-sm hover:bg-[#A8651E] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2">
              <Eye size={18} /> Preview & Save
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}

