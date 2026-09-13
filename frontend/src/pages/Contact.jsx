import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import api from '../services/api'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setErr('')
    try {
      await api.post('/contact', formData)
      setSent(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch {
      setErr('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid lg:grid-cols-2 gap-20">
        <div>
          <h1 className="text-5xl font-black text-slate-900 mb-6 leading-tight italic">
            Get in <span className="text-teal-600">Touch</span>
          </h1>
          <p className="text-slate-600 text-lg mb-12 leading-relaxed">
            Our support team is available 24/7 to assist with your medical inquiries and technical difficulties.
          </p>
          <div className="space-y-8">
            {[
              { icon: <Mail size={22} />, label: 'Email Us', value: 'support@medicare.com' },
              { icon: <Phone size={22} />, label: 'Call Support', value: '+1 (555) 010-9988' },
              { icon: <MapPin size={22} />, label: 'Office Location', value: '123 Healthcare Blvd, Medical Suite 500, NY 10001' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex gap-4">
                <div className="bg-teal-50 p-4 rounded-2xl text-teal-600 shrink-0 h-fit">{icon}</div>
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest mb-1">{label}</h4>
                  <p className="text-slate-600">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="mt-12 bg-slate-100 rounded-3xl h-48 flex items-center justify-center border border-slate-200">
            <div className="text-center">
              <MapPin size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-sm font-medium">123 Healthcare Blvd, New York</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 hover:-translate-y-1 transition-all duration-300">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="bg-teal-50 p-5 rounded-full mb-6"><CheckCircle size={48} className="text-teal-500" /></div>
              <h3 className="text-2xl font-black text-slate-900 italic mb-3">Message Sent!</h3>
              <p className="text-slate-500 mb-6">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
              <button onClick={() => setSent(false)} className="px-6 py-3 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 italic mb-6">Send a Message</h2>
              {err && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">{err}</div>}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Full Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-2xl outline-none font-medium transition" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Email</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-2xl outline-none font-medium transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Phone (Optional)</label>
                <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-2xl outline-none font-medium transition" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Subject</label>
                <input required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-2xl outline-none font-medium transition" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Message</label>
                <textarea required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-2xl outline-none font-medium transition resize-none" />
              </div>
              <button disabled={sending}
                className="w-full bg-teal-600 text-white font-bold py-4 rounded-2xl hover:bg-teal-700 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-xl shadow-teal-100">
                {sending ? 'Sending...' : <><Send size={18} /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
