// AdminDashboard.jsx
import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { Shield, MessageSquare, Trash2, CheckSquare, HeartPulse } from 'lucide-react'

export function AdminDashboard() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/contact').then(r => setMessages(r.data.data || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const markRead = async (id) => {
    try { await api.put(`/contact/${id}/mark-read`, {}); setMessages(prev => prev.map(m => m._id === id ? { ...m, status: 'read' } : m)) } catch { alert('Update failed') }
  }
  const deleteMsg = async (id) => {
    if (!window.confirm('Delete this message?')) return
    try { await api.delete(`/contact/${id}`); setMessages(prev => prev.filter(m => m._id !== id)) } catch { alert('Delete failed') }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-teal-600">
      <HeartPulse size={48} className="animate-pulse mb-4" />
      <p className="font-black italic uppercase tracking-widest animate-pulse text-xs">Loading system vault...</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-10 bg-slate-900 text-white p-10 rounded-3xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-teal-500 p-3 rounded-2xl"><Shield size={28} /></div>
          <h1 className="text-4xl font-black italic">System Command</h1>
        </div>
        <p className="text-slate-400">Reviewing system messages, audit trails, and platform integrity.</p>
      </header>
      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2"><MessageSquare className="text-teal-600" size={22} /> Support Queue</h2>
        {messages.length === 0 ? (
          <div className="bg-white p-20 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400">Support queue is empty. No active tickets.</div>
        ) : messages.map(msg => (
          <div key={msg._id} className={`bg-white p-6 rounded-2xl border-2 transition ${msg.status === 'pending' ? 'border-amber-200' : 'border-slate-100 opacity-70'}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-slate-900">{msg.name}</h4>
                  <span className="text-xs text-slate-400">({msg.email})</span>
                </div>
                <p className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4 italic">{msg.subject}</p>
                <p className="text-slate-600 text-sm bg-slate-50 p-4 rounded-xl leading-relaxed">"{msg.message}"</p>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded text-center ${msg.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{msg.status}</span>
                {msg.status === 'pending' && <button onClick={() => markRead(msg._id)} className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition"><CheckSquare size={18} /></button>}
                <button onClick={() => deleteMsg(msg._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
