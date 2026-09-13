import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { ChevronRight, Stethoscope, AlertCircle, HeartPulse, ArrowRight, Loader2, Info, ShieldCheck, Star, Sparkles } from 'lucide-react'

export default function BookAppointment() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [formData, setFormData] = useState({ date: '', time: '', reason: '' })
  const [err, setErr] = useState('')

  useEffect(() => {
    api.get('/doctors')
      .then(r => setDoctors(Array.isArray(r.data) ? r.data : []))
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedDoctor || !formData.date || !formData.time || !formData.reason) return
    setIsSubmitting(true)
    setErr('')
    const payload = {
      patientId: user?.id, patientEmail: user?.email, patientName: user?.username,
      doctorId: selectedDoctor._id, doctorEmail: selectedDoctor.email, doctorName: selectedDoctor.name,
      specialization: selectedDoctor.specialty, appointmentDate: formData.date,
      timeSlot: formData.time, reason: formData.reason, status: 'Pending',
      createdAt: new Date().toISOString()
    }
    try {
      await api.post('/appointments', payload)
      setShowSuccess(true)
      setTimeout(() => navigate('/dashboard'), 3000)
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to book appointment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-teal-600">
      <HeartPulse size={48} className="animate-spin mb-6" />
      <p className="font-black italic uppercase tracking-widest animate-pulse">Loading Doctors...</p>
    </div>
  )

  if (showSuccess) return (
    <div className="flex flex-col items-center justify-center h-[80vh] bg-slate-50">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-teal-100 flex flex-col items-center text-center max-w-sm mx-4">
        <div className="bg-teal-500 p-4 rounded-2xl shadow-xl border-4 border-white animate-bounce mb-6"><HeartPulse size={36} className="text-white" /></div>
        <h2 className="text-2xl font-black italic text-slate-900 mb-2">Appointment Booked!</h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-4">
          Your appointment with <span className="text-teal-600 font-black">Dr. {selectedDoctor?.name}</span> is confirmed for{' '}
          <span className="font-bold text-slate-900">{new Date(formData.date).toLocaleDateString()}</span>.
        </p>
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
          <HeartPulse size={14} className="text-teal-500 animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Redirecting...</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-600 px-5 py-2 rounded-full text-xs font-black uppercase mb-4 border border-teal-100">
          <Sparkles size={14} /> Book Your Appointment
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-4 italic tracking-tighter">Find a Specialist</h1>
        <p className="text-slate-500 font-medium max-w-lg mx-auto">Select your specialist and secure your clinical window instantly.</p>
      </div>

      {doctors.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <Stethoscope size={48} className="mx-auto mb-4 text-slate-200" />
          <h3 className="text-xl font-black text-slate-400 italic mb-2">No Doctors Available</h3>
          <p className="text-slate-400 text-sm">Doctors will appear here once added to the system.</p>
          <p className="text-slate-400 text-sm mt-1">Run <code className="bg-slate-100 px-2 py-0.5 rounded text-xs">node seed_doctors.js</code> in backend to add sample doctors.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Doctor List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4 italic">
              <span className="bg-slate-900 text-white w-10 h-10 flex items-center justify-center rounded-2xl shadow-lg not-italic text-sm">01</span>
              Select Specialist
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
              {doctors.map(doc => (
                <button key={doc._id} onClick={() => setSelectedDoctor(doc)}
                  className={`w-full text-left p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col hover:-translate-y-1 ${selectedDoctor?._id === doc._id ? 'border-teal-600 bg-teal-50/40 shadow-2xl scale-[1.01]' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg'}`}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex gap-4 items-center">
                      <div className={`p-4 rounded-2xl transition-all duration-500 ${selectedDoctor?._id === doc._id ? 'bg-teal-600 text-white rotate-6 shadow-xl' : 'bg-slate-50 text-slate-300'}`}>
                        <Stethoscope size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-black text-slate-900 text-lg italic">Dr. {doc.name}</p>
                          {doc.isVerified && <ShieldCheck size={14} className="text-blue-500" />}
                        </div>
                        <p className="text-xs font-black text-teal-600 uppercase tracking-widest mt-1">{doc.specialty}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs font-bold text-slate-600">{doc.rating}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`transition-transform ${selectedDoctor?._id === doc._id ? 'text-teal-600 translate-x-1' : 'text-slate-200'}`} size={20} />
                  </div>
                  {doc.description && (
                    <div className="mt-4 flex items-start gap-2 pl-1">
                      <div className={`mt-0.5 p-1 rounded-md ${selectedDoctor?._id === doc._id ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-400'}`}><Info size={11} /></div>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed italic">{doc.description}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className={`transition-all duration-700 ${selectedDoctor ? 'opacity-100 translate-y-0' : 'opacity-20 pointer-events-none translate-y-8'}`}>
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4 italic">
              <span className="bg-slate-900 text-white w-10 h-10 flex items-center justify-center rounded-2xl shadow-lg not-italic text-sm">02</span>
              Confirm Details
            </h3>
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 space-y-8">
              {err && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-2"><AlertCircle size={16} /> {err}</div>}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Date</label>
                  <input type="date" required value={formData.date} min={new Date().toISOString().split('T')[0]}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-800 transition" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Time Slot</label>
                  <select required value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-800 transition appearance-none cursor-pointer">
                    <option value="">Select Time</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Reason for Visit</label>
                <textarea required rows={4} placeholder="Describe your symptoms for the specialist..."
                  value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-2xl outline-none text-sm font-medium transition resize-none" />
              </div>
              <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-100 flex gap-3">
                <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                <p className="text-xs font-bold text-amber-700 leading-relaxed">Clinical data is transmitted via secure encrypted channels. Provider dashboard syncs immediately.</p>
              </div>
              <button type="submit" disabled={isSubmitting}
                className="w-full bg-slate-900 text-white font-black py-6 rounded-2xl hover:bg-teal-700 disabled:opacity-50 shadow-2xl transition flex items-center justify-center gap-3 text-xs uppercase tracking-widest">
                {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Booking...</> : <> Confirm Appointment <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
