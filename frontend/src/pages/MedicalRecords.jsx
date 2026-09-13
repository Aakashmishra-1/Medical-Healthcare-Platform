// MedicalRecords.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { FileText, Download, Search, Filter, HeartPulse } from 'lucide-react'

export function MedicalRecords() {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const DEMO_RECORDS = [
    { _id: 'def_1', patientEmail: user?.email || '', doctorName: 'Sarah Wilson', doctorEmail: 'sarah@hospital.com', recordType: 'Annual Physical', diagnosis: 'Healthy, slight vitamin D deficiency', treatment: 'Vitamin D supplements prescribed', medications: [{ name: 'Vitamin D3', dosage: '1000 IU', frequency: 'Daily', duration: '3 months' }], recordDate: new Date(Date.now() - 86400000 * 10).toISOString(), createdAt: new Date().toISOString() },
    { _id: 'def_2', patientEmail: user?.email || '', doctorName: 'James Carter', doctorEmail: 'james@hospital.com', recordType: 'Dermatology Consult', diagnosis: 'Contact Dermatitis', treatment: 'Topical cream application', medications: [{ name: 'Hydrocortisone', dosage: '1%', frequency: 'Twice daily', duration: '1 week' }], recordDate: new Date(Date.now() - 86400000 * 25).toISOString(), createdAt: new Date().toISOString() },
    { _id: 'def_3', patientEmail: user?.email || '', doctorName: 'Anita Roy', doctorEmail: 'anita@hospital.com', recordType: 'Vaccination Record', diagnosis: 'Flu Shot Administered', treatment: 'Observation for 15 mins', medications: [], recordDate: new Date(Date.now() - 86400000 * 60).toISOString(), createdAt: new Date().toISOString() }
  ]

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const endpoint = user?.role === 'doctor' ? `/medical/doctor/${user?.email}` : `/medical/patient/${user?.email}`
        const res = await api.get(endpoint)
        const fetched = res.data.records || []
        if (fetched.length === 0 && user?.role === 'patient') setRecords(DEMO_RECORDS)
        else setRecords(fetched)
      } catch {
        if (user?.role === 'patient') setRecords(DEMO_RECORDS)
      } finally { setLoading(false) }
    }
    fetchRecords()
  }, [user])

  const filtered = records.filter(r =>
    r.recordType.toLowerCase().includes(search.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
    r.doctorName.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-teal-600">
      <HeartPulse size={48} className="animate-pulse mb-4" />
      <p className="font-black italic uppercase tracking-widest animate-pulse text-xs">Opening Medical Repository...</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic">Vault Archive</h1>
          <p className="text-slate-500">Secure history of all consultations and diagnostics.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-slate-400" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Search records..." />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-teal-600 transition"><Filter size={18} /></button>
        </div>
      </header>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 italic">No medical records found.</div>
        ) : filtered.map(rec => (
          <div key={rec._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-teal-50 p-3 rounded-xl text-teal-600"><FileText size={22} /></div>
              <span className="text-xs font-black uppercase bg-slate-100 px-2 py-1 rounded tracking-widest text-slate-500">
                {new Date(rec.recordDate).toLocaleDateString()}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">{rec.recordType}</h3>
            <p className="text-slate-500 text-sm mb-4">Provider: <span className="font-semibold text-slate-700">Dr. {rec.doctorName}</span></p>
            <div className="bg-slate-50 p-4 rounded-xl mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Primary Diagnosis</p>
              <p className="text-sm text-slate-700 italic">"{rec.diagnosis}"</p>
            </div>
            {rec.medications?.length > 0 && (
              <div className="space-y-1 mb-4">
                {rec.medications.map((m, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">{m.name}</span>
                    <span className="text-slate-400">{m.dosage} • {m.frequency}</span>
                  </div>
                ))}
              </div>
            )}
            <button className="w-full py-3 flex items-center justify-center gap-2 text-teal-600 font-bold border-2 border-teal-50 rounded-xl hover:bg-teal-50 transition">
              <Download size={16} /> View Document
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MedicalRecords
