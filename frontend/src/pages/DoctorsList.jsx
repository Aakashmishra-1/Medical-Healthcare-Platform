import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Star, Clock, Stethoscope, ShieldCheck } from 'lucide-react'
import api from '../services/api'

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterSpec, setFilterSpec] = useState('All')

  useEffect(() => {
    api.get('/doctors').then(r => setDoctors(Array.isArray(r.data) ? r.data : [])).catch(() => setDoctors([])).finally(() => setLoading(false))
  }, [])

  const specialties = ['All', ...new Set(doctors.map(d => d.specialty).filter(Boolean))]
  const filtered = doctors.filter(d => {
    const s = search.toLowerCase()
    const matchSearch = d.name?.toLowerCase().includes(s) || d.specialty?.toLowerCase().includes(s)
    const matchSpec = filterSpec === 'All' || d.specialty === filterSpec
    return matchSearch && matchSpec
  })

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-teal-600">
      <Stethoscope size={48} className="animate-pulse mb-4" />
      <p className="font-black italic uppercase tracking-widest animate-pulse text-xs">Loading Specialists...</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-2 italic tracking-tighter">Find Your Specialist</h1>
        <p className="text-slate-500 font-medium">Access top-tier healthcare professionals.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-4 text-slate-400" size={18} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-teal-500 outline-none font-medium"
            placeholder="Search by name or specialty..." />
        </div>
        <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)}
          className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 appearance-none outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer">
          {specialties.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <Stethoscope size={48} className="mx-auto mb-4 text-slate-200" />
          <p className="text-slate-400 italic text-lg">No specialists found.</p>
          {doctors.length === 0 && <p className="text-slate-400 text-sm mt-2">No doctors have been added yet. Doctors can register or admin can add them.</p>}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((doc, i) => (
            <div key={doc._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="relative mb-6">
                <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center group-hover:from-teal-500 group-hover:to-teal-600 transition-all duration-500">
                  <Stethoscope size={56} className="text-teal-300 group-hover:text-white transition-colors duration-500" />
                </div>
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-xl flex items-center gap-1 text-xs font-black shadow-sm">
                  <Star size={11} className="text-amber-500 fill-amber-500" /> {doc.rating || '4.8'}
                </div>
                {doc.isVerified && (
                  <div className="absolute top-3 left-3 bg-blue-500 p-1.5 rounded-lg">
                    <ShieldCheck size={12} className="text-white" />
                  </div>
                )}
              </div>
              <h3 className="font-black text-slate-900 text-xl leading-tight mb-1 italic">Dr. {doc.name}</h3>
              <p className="text-teal-600 font-bold text-xs uppercase tracking-widest mb-4">{doc.specialty}</p>
              {doc.location && (
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-2">
                  <MapPin size={13} /> {doc.location}
                </div>
              )}
              {doc.experience > 0 && (
                <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-5">
                  <Clock size={13} /> {doc.experience} Years Experience
                </div>
              )}
              {doc.description && <p className="text-slate-400 text-xs leading-relaxed mb-5 italic line-clamp-2">"{doc.description}"</p>}
              <Link to="/book" className="block w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-center hover:bg-teal-600 transition shadow-lg text-sm">
                Book Appointment
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
