import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { io } from 'socket.io-client'
import { API_BASE_URL } from '../config'
import { Calendar, FileText, Clock, RefreshCw, MessageCircle, Sparkles, Circle, User as UserIcon, Pill, X, Trash2, CalendarDays, ChevronRight, Stethoscope, ClipboardList, HeartPulse, Star, Edit2, Check } from 'lucide-react'
import ChatHub from '../components/ChatHub'
import HealthGraph from '../components/HealthGraph'
import SymptomChecker from '../components/SymptomChecker'
import Footer from '../components/Footer'

const socket = io(API_BASE_URL, { autoConnect: false })

export default function PatientDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeChat, setActiveChat] = useState(null)
  const [selectedReport, setSelectedReport] = useState(null)
  const [showSymptomChecker, setShowSymptomChecker] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(null)
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: '' })
  const [isOnline, setIsOnline] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [patientProfile, setPatientProfile] = useState({ bloodGroup: 'B-Negative', sensitivities: ['Penicillin', 'Latex'] })
  const bloodGroups = ['A-Positive','A-Negative','B-Positive','B-Negative','AB-Positive','AB-Negative','O-Positive','O-Negative']
  const commonSensitivities = ['Penicillin','Latex','Pollen','Peanuts','Dust','Shellfish','Dairy','Soy','Gluten','Aspirin']

  useEffect(() => {
    socket.connect()
    socket.emit('join_room', { email: user?.email, role: 'patient' })
    socket.on('connect', () => setIsOnline(true))
    socket.on('disconnect', () => setIsOnline(false))
    return () => { socket.disconnect() }
  }, [user?.email])

  const fetchData = useCallback(async (silent = false) => {
    if (!user?.email) return
    try {
      if (!silent) setLoading(true); else setRefreshing(true)
      const [apptsRes, recsRes] = await Promise.allSettled([
        api.get(`/appointments/patient/${user.email}`),
        api.get(`/medical/patient/${user.email}`)
      ])
      const appts = apptsRes.status === 'fulfilled' ? (apptsRes.value.data.data || []) : []
      const recs  = recsRes.status  === 'fulfilled' ? (recsRes.value.data.records || [])  : []
      setAppointments([...appts].sort((a,b) => new Date(b.createdAt||0) - new Date(a.createdAt||0)))
      setRecords([...recs].sort((a,b) => new Date(b.recordDate||0) - new Date(a.recordDate||0)))
    } catch {}
    finally { setLoading(false); setRefreshing(false) }
  }, [user?.email])

  useEffect(() => { fetchData() }, [fetchData])

  const cancelAppt = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return
    try { await api.delete(`/appointments/${id}`) } catch {}
    setAppointments(prev => prev.filter(a => a._id !== id))
  }

  const deleteRecord = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Remove this record?')) return
    try { await api.delete(`/medical/${id}`) } catch {}
    setRecords(prev => prev.filter(r => r._id !== id))
  }

  const submitFeedback = (e) => {
    e.preventDefault()
    if (!showFeedbackModal || !user) return
    const review = { id: `rev_${Date.now()}`, doctorId: showFeedbackModal.doctorId, patientName: user.username, ...feedbackForm, date: 'Just now' }
    const existing = JSON.parse(localStorage.getItem('doctor_reviews') || '[]')
    localStorage.setItem('doctor_reviews', JSON.stringify([review, ...existing]))
    alert('Feedback submitted!')
    setShowFeedbackModal(null)
    setFeedbackForm({ rating: 5, comment: '' })
  }

  const toggleSensitivity = (s) => {
    const cur = patientProfile.sensitivities
    setPatientProfile({ ...patientProfile, sensitivities: cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s] })
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-teal-600">
      <HeartPulse size={48} className="animate-spin mb-4" />
      <p className="font-black italic uppercase tracking-widest animate-pulse">Syncing Patient Profile...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none animate-pulse"></div>
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-black text-slate-900 italic tracking-tighter">Patient Profile</h1>
              <RefreshCw size={20} className={`text-teal-500 cursor-pointer hover:rotate-180 transition-transform ${refreshing ? 'animate-spin' : ''}`} onClick={() => fetchData(true)} />
            </div>
            <div className="flex items-center gap-4">
              <p className="text-slate-500 font-medium">{user?.username}</p>
              <span className={`px-4 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 shadow-sm ${isOnline ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                <Circle size={8} fill="currentColor" /> {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          <Link to="/book" className="bg-teal-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-teal-700 transition shadow-xl text-sm uppercase tracking-widest">
            <CalendarDays size={20} /> Book Appointment
          </Link>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <HealthGraph />

            {/* Appointments */}
            <section className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 italic">
                  <Clock className="text-teal-500" size={26} /> My Appointments
                </h2>
                <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">{appointments.length} Total</span>
              </div>
              <div className="space-y-4">
                {appointments.length === 0 ? (
                  <div className="text-center py-14 text-slate-400 italic bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <Calendar className="mx-auto mb-4 opacity-20" size={40} />
                    No appointments scheduled yet.
                  </div>
                ) : appointments.map(appt => (
                  <div key={appt._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-5 mb-4 sm:mb-0">
                      <div className="bg-white p-4 rounded-xl shadow-sm text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all">
                        <UserIcon size={24} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg">Dr. {appt.doctorName}</p>
                        <p className="text-xs font-black text-teal-600 uppercase tracking-widest mt-1">{appt.specialization}</p>
                        <p className="text-xs font-bold text-slate-400 mt-2">{appt.timeSlot} • {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : 'TBD'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${appt.status === 'Scheduled' || appt.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-teal-50 text-teal-600 border-teal-100'}`}>
                        {appt.status}
                      </span>
                      {appt.status === 'Completed' && (
                        <button onClick={() => setShowFeedbackModal({ doctorId: appt.doctorId, doctorName: appt.doctorName })} className="p-3 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition border border-amber-100">
                          <Star size={16} />
                        </button>
                      )}
                      <button onClick={() => setActiveChat({ email: appt.doctorEmail, name: appt.doctorName })} className="p-3 rounded-xl bg-white text-slate-400 hover:text-teal-600 transition border border-slate-100">
                        <MessageCircle size={16} />
                      </button>
                      <button onClick={() => cancelAppt(appt._id)} className="p-3 rounded-xl bg-white text-slate-400 hover:text-red-500 transition border border-slate-100">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Medical Records */}
            <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 italic"><Pill className="text-teal-500" size={22} /> Medical Reports</h2>
                <Link to="/records" className="text-teal-600 font-black text-sm uppercase tracking-widest hover:underline">View All</Link>
              </div>
              <div className="space-y-2">
                {records.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 italic bg-slate-50 rounded-2xl border border-slate-100">No clinical reports found.</div>
                ) : records.slice(0, 4).map(rec => (
                  <div key={rec._id} className="p-4 bg-teal-50/30 rounded-xl border border-teal-100/30 flex justify-between items-center hover:bg-teal-50 transition cursor-pointer group" onClick={() => setSelectedReport(rec)}>
                    <div>
                      <p className="font-black text-slate-900 text-sm">{rec.recordType} <span className="text-xs text-teal-600 ml-1">Dr. {rec.doctorName}</span></p>
                      <p className="text-xs text-slate-500 italic mt-1">"{rec.diagnosis}"</p>
                      <p className="text-xs text-teal-600 font-black uppercase tracking-wide mt-1 flex items-center gap-1 group-hover:translate-x-1 transition-transform">View Report <ChevronRight size={10} /></p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-white px-2 py-1 rounded-lg text-xs font-black text-teal-600 border border-teal-100">{new Date(rec.recordDate).toLocaleDateString()}</span>
                      <button onClick={e => deleteRecord(e, rec._id)} className="p-1.5 bg-white text-slate-400 hover:text-red-500 rounded-lg border border-slate-100 transition"><X size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <section className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl group cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setShowSymptomChecker(true)}>
              <div className="relative z-10">
                <div className="bg-teal-500 w-14 h-14 flex items-center justify-center rounded-2xl mb-6 shadow-xl group-hover:scale-110 transition-transform">
                  <Sparkles size={28} />
                </div>
                <h3 className="text-2xl font-black italic tracking-tighter mb-3">AI Symptom Checker</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">Feeling unwell? Our AI can analyze your symptoms instantly.</p>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-black uppercase tracking-widest text-teal-400">System Ready</span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            </section>

            {/* Clinical Advisory */}
            <section className="bg-red-50 rounded-[3rem] p-8 border border-red-100 hover:shadow-lg transition-all">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-red-900 font-black text-lg italic">Clinical Profile</h3>
                <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="p-2 bg-white text-red-500 rounded-xl shadow-sm hover:bg-red-500 hover:text-white transition border border-red-100">
                  {isEditingProfile ? <Check size={14} /> : <Edit2 size={14} />}
                </button>
              </div>
              <div className="bg-white border border-red-200 p-5 rounded-2xl shadow-sm">
                {isEditingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-red-400 uppercase mb-1 block">Blood Group</label>
                      <select value={patientProfile.bloodGroup} onChange={e => setPatientProfile({...patientProfile, bloodGroup: e.target.value})}
                        className="w-full p-2 bg-red-50 border border-red-100 rounded-xl text-sm font-bold text-red-900 outline-none">
                        {bloodGroups.map(bg => <option key={bg}>{bg}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-red-400 uppercase mb-2 block">Sensitivities</label>
                      <div className="flex flex-wrap gap-1.5">
                        {commonSensitivities.map(s => (
                          <button key={s} onClick={() => toggleSensitivity(s)}
                            className={`px-2 py-1 rounded-lg text-xs font-bold border transition ${patientProfile.sensitivities.includes(s) ? 'bg-red-500 text-white border-red-500' : 'bg-white text-red-400 border-red-100 hover:border-red-300'}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-black uppercase text-red-600 mb-1 tracking-widest">Blood Group</p>
                    <p className="text-lg font-black text-slate-900 mb-4">{patientProfile.bloodGroup}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Known Sensitivities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {patientProfile.sensitivities.length > 0 ? patientProfile.sensitivities.map(s => (
                        <span key={s} className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-black uppercase border border-red-100">{s}</span>
                      )) : <span className="text-xs text-slate-400 italic">None recorded</span>}
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Full Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedReport(null)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto">
            <button onClick={() => setSelectedReport(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 p-2 bg-slate-50 rounded-xl"><X size={18} /></button>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-teal-600 text-white p-3 rounded-2xl shadow-lg"><ClipboardList size={28} /></div>
              <div>
                <h3 className="text-2xl font-black italic text-slate-900">{selectedReport.recordType}</h3>
                <p className="text-xs font-black uppercase text-teal-600 tracking-widest mt-1">Clinical Record</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase mb-1">Practitioner</p>
                <p className="font-black text-slate-900">Dr. {selectedReport.doctorName}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase mb-1">Date</p>
                <p className="font-black text-slate-900">{new Date(selectedReport.recordDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100/50 mb-4">
              <p className="text-xs font-black text-teal-600 uppercase mb-2">Diagnosis</p>
              <p className="text-sm text-slate-700 leading-relaxed italic mb-4">"{selectedReport.diagnosis}"</p>
              {selectedReport.treatment && <>
                <p className="text-xs font-black text-teal-600 uppercase mb-2">Treatment</p>
                <p className="text-sm text-slate-700 leading-relaxed italic">"{selectedReport.treatment}"</p>
              </>}
            </div>
            {selectedReport.medications?.length > 0 && (
              <div>
                <p className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2"><Pill size={14} className="text-teal-600" />Medications</p>
                <div className="space-y-2">
                  {selectedReport.medications.map((med, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl">
                      <div>
                        <p className="font-black text-slate-900 text-sm">{med.name}</p>
                        <p className="text-xs text-slate-400">{med.dosage} • {med.frequency}</p>
                      </div>
                      <span className="bg-slate-50 px-2 py-1 rounded-lg text-xs font-black text-slate-500 border border-slate-100">{med.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => window.print()} className="w-full mt-6 bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition shadow-xl text-xs uppercase tracking-widest">
              Download PDF
            </button>
          </div>
        </div>
      )}

      {activeChat && <ChatHub socket={socket} receiverEmail={activeChat.email} receiverName={activeChat.name} isOnline={isOnline} onClose={() => setActiveChat(null)} />}
      {showSymptomChecker && <SymptomChecker onClose={() => setShowSymptomChecker(false)} />}

      {showFeedbackModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-xl">
          <div className="bg-white w-80 rounded-3xl p-8 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-amber-500 rounded-t-3xl"></div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black italic text-slate-900">Rate Experience</h3>
                <p className="text-xs text-amber-600 font-black uppercase tracking-widest">Dr. {showFeedbackModal.doctorName}</p>
              </div>
              <button onClick={() => setShowFeedbackModal(null)} className="text-slate-400 hover:text-slate-700"><X size={18} /></button>
            </div>
            <form onSubmit={submitFeedback} className="space-y-5">
              <div className="flex justify-center gap-2">
                {[1,2,3,4,5].map(star => (
                  <button key={star} type="button" onClick={() => setFeedbackForm({...feedbackForm, rating: star})}
                    className={`transition hover:scale-110 ${star <= feedbackForm.rating ? 'text-amber-400' : 'text-slate-200'}`}>
                    <Star size={30} fill="currentColor" />
                  </button>
                ))}
              </div>
              <textarea required rows={3} placeholder="Share your experience..." value={feedbackForm.comment} onChange={e => setFeedbackForm({...feedbackForm, comment: e.target.value})}
                className="w-full p-4 bg-slate-50 rounded-2xl text-sm outline-none resize-none focus:bg-slate-100 transition" />
              <button type="submit" className="w-full bg-amber-500 text-white font-black py-3 rounded-2xl hover:bg-amber-600 transition text-sm uppercase tracking-widest">Submit Feedback</button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
