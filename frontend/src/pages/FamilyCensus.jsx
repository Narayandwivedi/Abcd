import { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Users, UserPlus, Trash2 } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

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

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar', 'Chandigarh', 'Dadra & Nagar Haveli',
  'Daman & Diu', 'Delhi', 'Jammu & Kashmir', 'Ladakh',
  'Lakshadweep', 'Puducherry',
]

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
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-lg shadow-gray-200/50 overflow-hidden">
      <div className="px-6 sm:px-8 py-4 border-b border-gray-100 bg-gradient-to-r from-[#FFF8F0] to-white">
        <h3 className="text-base font-bold text-[#C67A2D] tracking-wide">{title}</h3>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  )
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

export default function FamilyCensus() {
  const [form, setForm] = useState({
    leaderName: '',
    leaderMobile: '',
    address: '',
    state: '',
    district: '',
    city: '',
    pincode: '',
    remarks: '',
    members: [],
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

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
    if (!form.address.trim()) errs.address = 'Address Is Required'
    if (!form.state) errs.state = 'State Is Required'
    if (!form.district.trim()) errs.district = 'District Is Required'
    if (!form.city.trim()) errs.city = 'City Is Required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)
    try {
      await axios.post(`${BACKEND_URL}/api/families`, {
        leaderName: form.leaderName,
        leaderMobile: form.leaderMobile,
        address: form.address,
        state: form.state,
        district: form.district,
        city: form.city,
        pincode: form.pincode,
        remarks: form.remarks,
        isActive: true,
        members: form.members.map((m) => ({
          ...m,
          age: m.age ? Number(m.age) : 0,
        })),
      })
      toast.success('Family Registered Successfully!')
      setForm({
        leaderName: '',
        leaderMobile: '',
        address: '',
        state: '',
        district: '',
        city: '',
        pincode: '',
        remarks: '',
        members: [],
      })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed To Save Family. Please Try Again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm({
      leaderName: '',
      leaderMobile: '',
      address: '',
      state: '',
      district: '',
      city: '',
      pincode: '',
      remarks: '',
      members: [],
    })
    setErrors({})
  }

  return (
    <>
      <img src="/mobile family hero.avif" alt="" className="w-full h-auto object-contain md:hidden" />
      <img src="/familyhero.avif" alt="" className="hidden md:block w-full h-auto object-contain" />
      <div className="bg-[#FFF8F0] min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12 pt-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A3520] leading-tight">
            Agrawal Samaj Census Portal
          </h1>
          <div className="mx-auto mt-4 w-20 h-1 rounded-full bg-gradient-to-r from-[#C67A2D] to-[#A8651E]" />
          <p className="mt-6 text-base sm:text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Register and manage family records in a secure, centralized, and user-friendly census management system. Keep community information organized, accurate, and easily accessible.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <SectionCard title="Family Information">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              </div>

              <Textarea
                label="Complete Address"
                required
                error={errors.address}
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter Complete Address"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <Select
                  label="State"
                  required
                  error={errors.state}
                  value={form.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                >
                  <option value="">-- Select State --</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
                <Input
                  label="District"
                  required
                  error={errors.district}
                  value={form.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  placeholder="Enter District"
                />
                <Input
                  label="City"
                  required
                  error={errors.city}
                  value={form.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Enter City"
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
              disabled={submitting}
              className="w-full sm:w-auto px-10 py-3.5 rounded-[14px] text-sm font-semibold text-white bg-gradient-to-r from-[#C67A2D] to-[#A8651E] shadow-lg shadow-[#C67A2D]/20 hover:shadow-xl hover:shadow-[#C67A2D]/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              ) : 'Save Family'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}
