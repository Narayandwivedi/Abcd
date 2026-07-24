import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Users, UserPlus, Trash2, Eye, Edit3, X, AlertTriangle, Search, ChevronDown } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.abcdvyapar.com'

const RELATION_OPTIONS = [
  'Self', 'Husband', 'Wife', 'Son', 'Daughter', 'Father', 'Mother',
  'Brother', 'Sister', 'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Other',
]

const emptyMember = () => ({
  name: '',
  relation: '',
  mobile: '',
  age: '',
  gender: '',
  occupation: '',
})

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



function Input({ label, required, error, className, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 font-medium text-sm flex-1 min-w-0">
      <span className="text-gray-700 text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        {...props}
        className={`w-full px-3.5 py-2.5 border ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-[#C67A2D] focus:ring-[#C67A2D]/15'} rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 bg-white ${className || ''}`}
      />
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </label>
  )
}

function Textarea({ label, required, error, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 font-medium text-sm flex-1 min-w-0">
      <span className="text-gray-700 text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <textarea
        {...props}
        className={`w-full px-3.5 py-2.5 border ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-[#C67A2D] focus:ring-[#C67A2D]/15'} rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 bg-white resize-y min-h-[80px]`}
      />
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </label>
  )
}

function Select({ label, required, error, children, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 font-medium text-sm flex-1 min-w-0">
      <span className="text-gray-700 text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <select
        {...props}
        className={`w-full px-3.5 py-2.5 border ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-[#C67A2D] focus:ring-[#C67A2D]/15'} rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 bg-white`}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </label>
  )
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-lg shadow-gray-200/50">
      <div className="px-6 sm:px-8 py-4 border-b border-gray-100 bg-gradient-to-r from-[#FFF8F0] to-white">
        <h3 className="text-base font-bold text-[#C67A2D] tracking-wide">{title}</h3>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
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

function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

const titleCase = (str) => {
  if (!str) return ''
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export default function FamilyCensus() {
  const [form, setForm] = useState({
    samaj: '',
    leaderName: '',
    leaderMobile: '',
    address: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    remarks: '',
    members: [],
    submittedBy: '',
    submittedByMobile: '',
  })
  const [samajList, setSamajList] = useState([])
  const [cityList, setCityList] = useState([])
  const [citySearch, setCitySearch] = useState('')
  const [cityLoading, setCityLoading] = useState(true)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const cityRef = useRef(null)
  const cityInputRef = useRef(null)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPreview, setShowPreview] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/samaj?status=approved`)
      .then((res) => setSamajList(res.data.data || []))
      .catch(() => toast.error('Failed to load Samaj list'))
  }, [])

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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleMemberChange = (index, field, value) => {
    const updated = [...form.members]
    updated[index] = { ...updated[index], [field]: value }
    setForm((prev) => ({ ...prev, members: updated }))
  }

  const addMember = () => {
    setForm((prev) => ({ ...prev, members: [...prev.members, emptyMember()] }))
  }

  const removeMember = (index) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }))
  }

  const validate = () => {
    const errs = {}
    if (!form.leaderName.trim()) errs.leaderName = 'Family Leader Name Is Required'
    if (!form.leaderMobile.trim()) errs.leaderMobile = 'Mobile Number Is Required'
    if (!form.city.trim()) errs.city = 'City Is Required'
    if (!form.submittedBy.trim()) errs.submittedBy = 'Submitted By Name Is Required'
    if (!form.submittedByMobile.trim()) errs.submittedByMobile = 'Mobile Number Is Required'
    else if (!/^\d{10}$/.test(form.submittedByMobile.trim())) errs.submittedByMobile = 'Please Enter A Valid 10-Digit Mobile Number'
    return errs
  }

  const submitToApi = async () => {
    setSubmitting(true)
    try {
      await axios.post(`${BACKEND_URL}/api/families`, {
        samaj: form.samaj || null,
        leaderName: form.leaderName,
        leaderMobile: form.leaderMobile,
        address: form.address,
        city: form.city,
        district: form.district,
        state: form.state,
        pincode: form.pincode,
        remarks: form.remarks,
        isActive: true,
        members: form.members.map((m) => ({
          ...m,
          age: m.age ? Number(m.age) : 0,
        })),
        submittedBy: form.submittedBy,
        submittedByMobile: form.submittedByMobile,
      })
      setShowPreview(false)
      toast.success('Family Registered Successfully!')
      setForm({
        samaj: '',
        leaderName: '',
        leaderMobile: '',
        address: '',
        city: '',
        district: '',
        state: '',
        pincode: '',
        remarks: '',
        members: [],
        submittedBy: '',
        submittedByMobile: '',
      })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed To Save Family. Please Try Again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setShowPreview(true)
  }

  const handleConfirmSave = async () => {
    setShowConfirm(false)
    await submitToApi()
  }

  const handleReset = () => {
    setForm({
      samaj: '',
      leaderName: '',
      leaderMobile: '',
      address: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      remarks: '',
      members: [],
    })
    setErrors({})
    setShowPreview(false)
    setShowConfirm(false)
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
                <h1 className="text-2xl sm:text-3xl font-bold text-[#4A3520]">Preview Family Details</h1>
                <p className="text-sm text-gray-500">Please review all information before saving</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <SectionCard title="Family Information">
                <PreviewRow label="Family Leader Name" value={form.leaderName} />
                <PreviewRow label="Mobile Number" value={form.leaderMobile} />
                <PreviewRow label="Samaj" value={(() => {
                  const s = samajList.find((x) => x._id === form.samaj)
                  return s ? (s.city ? `${titleCase(s.city)} - ${s.samajName}` : s.samajName) : ''
                })()} />
                <PreviewRow label="City" value={form.city ? `${titleCase(form.city)} - ${titleCase(form.district)} - ${titleCase(form.state)}` : ''} />
                <PreviewRow label="Complete Address" value={form.address} />
                <PreviewRow label="Pincode" value={form.pincode} />
                <PreviewRow label="Remarks" value={form.remarks} />
              </SectionCard>

              <SectionCard title="Family Members">
                {form.members.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No members added</p>
                ) : (
                  form.members.map((member, idx) => (
                    <div key={idx} className={idx < form.members.length - 1 ? 'border-b border-gray-100 pb-4 mb-4' : ''}>
                      <p className="text-xs font-bold text-[#C67A2D] uppercase tracking-wider mb-3">Member {idx + 1}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                        <PreviewRow label="Name" value={member.name} />
                        <PreviewRow label="Relation" value={member.relation} />
                        <PreviewRow label="Mobile" value={member.mobile} />
                        <PreviewRow label="Age" value={member.age} />
                        <PreviewRow label="Gender" value={member.gender} />
                        <PreviewRow label="Occupation" value={member.occupation} />
                      </div>
                    </div>
                  ))
                )}
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
                className="w-full sm:w-auto px-10 py-3.5 rounded-[14px] text-sm font-semibold text-white bg-[#C67A2D] shadow-sm hover:bg-[#A8651E] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                Save Family
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
                Are you sure you want to save this Family data? Please verify all details before confirming.
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
      <img src="/mobile family hero.avif" alt="" className="w-full h-auto object-contain md:hidden" />
      <img src="/familyhero.avif" alt="" className="hidden md:block w-full h-auto object-contain" />
      <div className="bg-[#FFF8F0] min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-12 lg:py-16">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-4 md:mb-12 pt-2 md:pt-4">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#4A3520] leading-tight">
            Agrawal Samaj Census Portal
          </h1>
          <div className="mx-auto mt-3 md:mt-4 w-20 h-1 rounded-full bg-gradient-to-r from-[#C67A2D] to-[#A8651E]" />
          <p className="mt-2 md:mt-6 text-base sm:text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Fill In The Details Below To Register A New Family In The Census Portal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <SectionCard title="Family Information">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <Input
                  label="Family Leader Name"
                  required
                  error={errors.leaderName}
                  value={form.leaderName}
                  onChange={(e) => handleChange('leaderName', e.target.value)}
                  placeholder="Enter Family Leader Name"
                />
                <Input
                  label="Mobile Number"
                  required
                  error={errors.leaderMobile}
                  type="tel"
                  value={form.leaderMobile}
                  onChange={(e) => handleChange('leaderMobile', e.target.value)}
                  placeholder="Enter Mobile Number"
                />
                <Select
                  label="Samaj"
                  value={form.samaj}
                  onChange={(e) => handleChange('samaj', e.target.value)}
                >
                  <option value="">-- Select Samaj --</option>
                  {samajList.map((s) => (
                    <option key={s._id} value={s._id}>{s.city ? `${titleCase(s.city)} - ${s.samajName}` : s.samajName}</option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative min-w-0" ref={cityRef}>
                  <label className="flex flex-col gap-1.5 font-medium text-sm flex-1 min-w-0">
                    <span className="text-gray-700 text-sm font-semibold">
                      City <span className="text-red-500">*</span>
                    </span>
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        ref={cityInputRef}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        name="family-city-search"
                        value={form.city && !cityDropdownOpen ? `${titleCase(form.city)} - ${titleCase(form.district)} - ${titleCase(form.state)}` : citySearch}
                        onChange={(e) => { setCitySearch(e.target.value); setCityDropdownOpen(true); setHighlightedIndex(-1); if (form.city) setForm((prev) => ({ ...prev, city: '', district: '', state: '' })) }}
                        onFocus={() => { setCityDropdownOpen(true); setHighlightedIndex(-1); if (form.city && !citySearch) setCitySearch(`${titleCase(form.city)} - ${titleCase(form.district)} - ${titleCase(form.state)}`) }}
                        onKeyDown={(e) => {
                          const currentDisplay = form.city ? `${titleCase(form.city)} - ${titleCase(form.district)} - ${titleCase(form.state)}` : ''
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
                        className={`w-full pl-9 pr-9 py-2.5 border ${errors.city ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-[#C67A2D] focus:ring-[#C67A2D]/15'} rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 bg-white`}
                      />
                      <ChevronDown
                        size={16}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer transition-transform duration-200 ${cityDropdownOpen ? 'rotate-180' : ''}`}
                        onClick={() => {
                          if (!cityDropdownOpen) {
                            const formatted = form.city ? `${titleCase(form.city)} - ${titleCase(form.district)} - ${titleCase(form.state)}` : ''
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
                    {errors.city && <span className="text-xs text-red-500 mt-0.5">{errors.city}</span>}
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
                          const currentDisplay = form.city ? `${titleCase(form.city)} - ${titleCase(form.district)} - ${titleCase(form.state)}` : ''
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
                                <div className="text-xs text-gray-400">{titleCase(c.district)} - {titleCase(c.state)}</div>
                              </div>
                            )
                          })
                        })()
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Textarea
                  label="Complete Address"
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Enter Complete Address (Optional)"
                />
                <Input
                  label="Pincode"
                  value={form.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  placeholder="Enter Pincode"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Remarks"
                  value={form.remarks}
                  onChange={(e) => handleChange('remarks', e.target.value)}
                  placeholder="Any Remarks (Optional)"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Family Members">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {form.members.length} member{form.members.length !== 1 ? 's' : ''} added
                </span>
                <button
                  type="button"
                  onClick={addMember}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#C67A2D] to-[#A8651E] text-white hover:opacity-90 transition-all duration-200 cursor-pointer shadow-sm shadow-[#C67A2D]/20"
                >
                  <UserPlus size={14} /> Add Member
                </button>
              </div>

              {form.members.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                  <Users size={32} className="mx-auto text-gray-300" />
                  <p className="text-sm text-gray-400 mt-2">No members added yet</p>
                  <button
                    type="button"
                    onClick={addMember}
                    className="mt-2 text-xs text-[#C67A2D] hover:text-[#A8651E] font-semibold cursor-pointer"
                  >
                    + Add a member
                  </button>
                </div>
              )}

              {form.members.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-300 hover:shadow-sm animate-fade-in"
                >
                  <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#FFF8F0] to-white border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C67A2D] to-[#A8651E] flex items-center justify-center shadow-sm">
                        <span className="text-xs font-bold text-white">{idx + 1}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Member {idx + 1}</span>
                    </div>
                    {form.members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(idx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 cursor-pointer"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    )}
                  </div>

                  <div className="p-5 flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Member Name"
                        value={member.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        placeholder="Enter member name"
                      />
                      <Select
                        label="Relation"
                        value={member.relation}
                        onChange={(e) => handleMemberChange(idx, 'relation', e.target.value)}
                      >
                        <option value="">-- Select Relation --</option>
                        {RELATION_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        label="Mobile Number"
                        type="tel"
                        value={member.mobile}
                        onChange={(e) => handleMemberChange(idx, 'mobile', e.target.value)}
                        placeholder="Enter mobile number"
                      />
                      <Input
                        label="Age"
                        type="number"
                        min="0"
                        value={member.age}
                        onChange={(e) => handleMemberChange(idx, 'age', e.target.value)}
                        placeholder="Enter age"
                      />
                      <Select
                        label="Gender"
                        value={member.gender}
                        onChange={(e) => handleMemberChange(idx, 'gender', e.target.value)}
                      >
                        <option value="">-- Select Gender --</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Select>
                    </div>
                    <Input
                      label="Occupation"
                      value={member.occupation}
                      onChange={(e) => handleMemberChange(idx, 'occupation', e.target.value)}
                      placeholder="Enter occupation"
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Submitted By">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="This Form Is Submitted By"
                required
                error={errors.submittedBy}
                value={form.submittedBy}
                onChange={(e) => handleChange('submittedBy', e.target.value)}
                placeholder="Enter Full Name"
              />
              <Input
                label="Mobile Number"
                required
                error={errors.submittedByMobile}
                type="tel"
                value={form.submittedByMobile}
                onChange={(e) => handleChange('submittedByMobile', e.target.value)}
                placeholder="Enter Mobile Number"
              />
            </div>
          </SectionCard>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-8 py-3.5 rounded-[14px] text-sm font-semibold text-gray-500 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-3.5 rounded-[14px] text-sm font-semibold text-white bg-[#C67A2D] shadow-sm hover:bg-[#A8651E] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              <Eye size={18} /> Preview & Save
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}
