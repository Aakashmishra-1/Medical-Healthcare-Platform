import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { io } from 'socket.io-client'
import { API_BASE_URL } from '../config'
import { Calendar, CheckCircle, FilePlus, X, Bell, HeartPulse, RefreshCw, MessageCircle, Circle, ShieldCheck, Star, TrendingUp, Activity, Save } from 'lucide-react'
import ChatHub from '../components/ChatHub'
import Footer from '../components/Footer'

const socket = io(API_BASE_URL, { autoConnect: false })

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [alert, setAlert] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [targetPatient, setTargetPatient] = useState(null)
  const [activeChat, setActiveChat] = useState(null)
  const [isOnline, setIsOnline] = useState(false)
  const [recordForm, setRecordForm] = useState({ recordType: 'Prescription Protocol', diagnosis: '', treatment: '', meds: '' })
  const [profileStats] = useState({ isVerified: true, rating: 4.8, totalReviews: 124, successfulTreatments: 89,
    recentReviews: [
      { id: '1', patientName: 'Sarah J.', rating: 5, comment: 'Very professional and kind.', date: '2 days ago' },
      { id: '2', patientName: 'Mike T.', rating: 4, comment: 'Good diagnosis, wait time was long.', date: '1 week ago' }
    ]
  })

  useEffect(() => {
    socket.connect()
    socket.emit('join_room', { email: user?.email, role: 'doctor' })
    socket.on('connect', () => setIsOnline(true))
    socket.on('disconnect', () => setIsOnline(false))
    socket.on('new_appointment', (appt) => {
      setAppointments(prev => [appt, ...prev])
      setAlert(`New appointment from ${appt.patientName}`)
      setTimeout(() => setAlert(null), 6000)
    })
    return () => { socket.disconnect() }
  }, [user?.email])

  const fetchAppointments = useCallback(async (silent = false) => {
    if (!user?.email) return
    try {
      if (!silent) setLoading(true); else setRefreshing(true)
      const r = await api.get(`/appointments/doctor/${user.email}`)
      const list = r.data.data || []
      setAppointments([...list].sort((a,b) => new Date(b.createdAt||0) - new Date(a.createdAt||0)))
    } catch {}
    finally { setLoading(false); setRefreshing(false) }
  }, [user?.email])

  useEffect(() => { fetchAppointments() }, [fetchAppointments])

  const updateStatus = async (id, status) => {
    setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a))
    try { await api.put(`/appointments/${id}`, { status }) } catch {}
  }

  const createRecord = async (e) => {
    e.preventDefault()
    if (!targetPatient || !user) return
    setIsSubmitting(true)
    const medications = recordForm.meds.split(',').filter(m => m.trim()).map(m => ({ name: m.trim(), dosage: '1 Tab', frequency: 'Daily', duration: '7 Days' }))
    const newRecord = {
      _id: `rec_${Date.now()}`, patientEmail: targetPatient.email,
      doctorName: user.username, doctorEmail: user.email,
      recordType: recordForm.recordType, diagnosis: recordForm.diagnosis,
      treatment: recordForm.treatment, medications,
      recordDate: new Date().toISOString(), createdAt: new Date().toISOString()
    }
    try {
      await api.post('/medical', newRecord)
    } catch (e) {
      console.error('Failed to save record:', e)
    }
    setTimeout(() => {
      setIsSubmitting(false); setShowModal(false)
      setRecordForm({ recordType: 'Prescription Protocol', diagnosis: '', treatment: '', meds: '' })
    }, 1200)
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-blue-600">
      <HeartPulse size={48} className="animate-spin mb-4" />
      <p className="font-black italic uppercase tracking-widest animate-pulse">Scanning Clinical Registry...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {alert && (
          <div className="fixed top-24 right-8 z-[100] bg-slate-900 text-white p-5 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-700">
            <div className="bg-blue-600 p-2.5 rounded-xl animate-pulse"><Bell size={20} /></div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-400 mb-1">Clinic Sync</p>
              <p className="font-bold text-sm">{alert}</p>
            </div>
          </div>
        )}

        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-white p-3 rounded-2xl shadow-lg border border-blue-50"><Activity className="text-blue-600" size={28} /></div>
              <div>
                <h1 className="text-4xl font-black text-slate-900 italic tracking-tighter">Medical Command Center</h1>
                <p className="text-slate-500 font-medium text-sm mt-1">Manage appointments, records, and patient feedback.</p>
              </div>
              <RefreshCw size={18} className={`text-slate-400 cursor-pointer hover:text-blue-600 hover:rotate-180 transition-all ${refreshing ? 'animate-spin text-blue-600' : ''}`} onClick={() => fetchAppointments(true)} />
            </div>
            <div className="flex items-center gap-3 ml-1">
              <span className="px-4 py-1.5 bg-white rounded-full border border-slate-200 text-xs font-bold text-slate-600 shadow-sm">
                {user?.username?.startsWith('Dr.') ? user.username : `Dr. ${user?.username}`}
              </span>
              <span className={`px-4 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 ${isOnline ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                <Circle size={8} fill="currentColor" /> {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          <div className="bg-slate-900 px-8 py-5 rounded-3xl shadow-2xl flex gap-8 items-center border border-slate-800">
            <div className="text-center">
              <p className="text-4xl font-black text-white mb-1">{appointments.length}</p>
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Active Cases</p>
            </div>
            <div className="h-10 w-px bg-slate-700"></div>
            <div className="text-center">
              <p className="text-4xl font-black text-blue-400 mb-1">{appointments.filter(a => a.status === 'Pending').length}</p>
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Pending</p>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 text-white p-3 rounded-2xl"><ShieldCheck size={22} /></div>
              <div>
                <h3 className="font-black text-slate-900 italic">Verification</h3>
                <p className="text-xs font-black uppercase tracking-widest text-blue-600">Verified MD</p>
              </div>
            </div>
            <div className="space-y-3">
              {['Medical License', 'Board Certification'].map(item => (
                <div key={item} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-xs font-bold uppercase">{item}</span>
                  <CheckCircle size={16} className="text-emerald-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl border border-slate-800 hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black italic flex items-center gap-2"><TrendingUp className="text-blue-400" size={18} /> Performance</h3>
              <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold border border-white/5">Monthly</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-slate-400 text-xs font-black uppercase mb-1">Success</p>
                <p className="text-2xl font-black">{Math.round((profileStats.successfulTreatments / Math.max(appointments.length, 1)) * 100)}%</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-slate-400 text-xs font-black uppercase mb-1">Volume</p>
                <p className="text-2xl font-black text-blue-400">{appointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md flex flex-col hover:-translate-y-1 transition-transform">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-t-3xl"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black italic text-slate-900">Patient Voice</h3>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-slate-900">{profileStats.rating}</span>
                <Star size={14} className="text-amber-400 fill-amber-400" />
              </div>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[160px] scrollbar-hide">
              {profileStats.recentReviews.map(r => (
                <div key={r.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-slate-900 text-xs">{r.patientName}</p>
                    <span className="text-xs text-slate-400">{r.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{r.comment}"</p>
                  <div className="flex gap-0.5 mt-1">{[...Array(5)].map((_, i) => <Star key={i} size={9} className={i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Appointment Table */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-white via-slate-50 to-white">
            <h2 className="text-2xl font-black text-slate-900 italic">Appointment Registry</h2>
            <p className="text-slate-500 text-sm mt-1">Real-time patient queue and status monitoring</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  {['Patient', 'Schedule', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-16 text-center text-slate-400 font-medium italic">No appointments synchronized.</td></tr>
                ) : appointments.map(appt => (
                  <tr key={appt._id} className="hover:bg-slate-50/80 transition group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-black text-xs group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white transition-all">
                          {appt.patientName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{appt.patientName}</p>
                          <p className="text-xs text-slate-400 font-bold uppercase">{appt.patientEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-700 text-sm">{appt.timeSlot}</p>
                      <p className="text-xs text-slate-400 font-bold">{appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : 'TBD'}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase border ${(appt.status === 'Scheduled' || appt.status === 'Pending') ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${(appt.status === 'Scheduled' || appt.status === 'Pending') ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setActiveChat({ email: appt.patientEmail, name: appt.patientName })}
                          className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition shadow-sm" title="Message">
                          <MessageCircle size={16} />
                        </button>
                        {(appt.status === 'Scheduled' || appt.status === 'Pending') && (
                          <>
                            <button onClick={() => { setTargetPatient({ name: appt.patientName, email: appt.patientEmail }); setShowModal(true) }}
                              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600 transition" title="Create Record">
                              <FilePlus size={16} />
                            </button>
                            <button onClick={() => updateStatus(appt._id, 'Completed')}
                              className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-500 hover:text-white transition" title="Complete">
                              <CheckCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Record Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-slate-900 p-5 flex justify-between items-center">
              <div>
                <h3 className="font-black italic text-white">Clinical Report</h3>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">Patient: {targetPatient?.name}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1"><X size={16} /></button>
            </div>
            <form onSubmit={createRecord} className="p-5 space-y-3 relative">
              {isSubmitting && (
                <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center">
                  <div className="bg-blue-50 p-3 rounded-full mb-3 animate-bounce"><CheckCircle size={24} className="text-blue-500" /></div>
                  <p className="text-sm font-black text-slate-900 italic">Record Transmitted!</p>
                </div>
              )}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Record Type</label>
                <select disabled={isSubmitting} value={recordForm.recordType} onChange={e => setRecordForm({...recordForm, recordType: e.target.value})}
                  className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 text-sm outline-none border border-slate-100 focus:border-blue-500 transition">
                  <option>Prescription Protocol</option>
                  <option>Diagnostic Review</option>
                  <option>Lab Requisition</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Diagnosis</label>
                <textarea disabled={isSubmitting} required rows={2} value={recordForm.diagnosis} onChange={e => setRecordForm({...recordForm, diagnosis: e.target.value})}
                  placeholder="Clinical diagnosis..." className="w-full p-3 bg-slate-50 rounded-xl font-medium text-slate-700 border border-slate-100 resize-none text-sm outline-none focus:border-blue-500 transition" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Treatment Plan</label>
                <textarea disabled={isSubmitting} required rows={2} value={recordForm.treatment} onChange={e => setRecordForm({...recordForm, treatment: e.target.value})}
                  placeholder="Treatment steps..." className="w-full p-3 bg-slate-50 rounded-xl font-medium text-slate-700 border border-slate-100 resize-none text-sm outline-none focus:border-blue-500 transition" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Medications (comma separated)</label>
                <input disabled={isSubmitting} value={recordForm.meds} onChange={e => setRecordForm({...recordForm, meds: e.target.value})}
                  placeholder="e.g. Amoxicillin 500mg, Paracetamol..." className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 border border-slate-100 text-sm outline-none focus:border-blue-500 transition" />
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full bg-slate-900 text-white font-black py-3 rounded-xl hover:bg-blue-600 transition flex items-center justify-center gap-2 text-xs uppercase tracking-widest disabled:opacity-50">
                {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                {isSubmitting ? 'Processing...' : 'Transmit Record'}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeChat && <ChatHub socket={socket} receiverEmail={activeChat.email} receiverName={activeChat.name} isOnline={isOnline} onClose={() => setActiveChat(null)} />}
      <Footer />
    </div>
  )
}
