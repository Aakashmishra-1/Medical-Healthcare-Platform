import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { User, Shield, UserPlus, ArrowRight, AlertCircle } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'patient' })
  const [err, setErr] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isDoctor = formData.role === 'doctor'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setIsSubmitting(true)
    try {
      const res = await api.post('/auth/register', formData)
      login(res.data.user, res.data.token)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setErr(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 transition-colors duration-500"
      style={{ background: isDoctor ? 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)' : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)' }}
    >
      <div className="max-w-md w-full">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100 transition-all duration-300">

          {/* Header */}
          <div className="text-center mb-10">
            <div className={`w-16 h-16 flex items-center justify-center rounded-2xl mx-auto mb-4 transition-colors duration-300 ${isDoctor ? 'bg-purple-50' : 'bg-teal-50'}`}>
              <UserPlus className={`transition-colors duration-300 ${isDoctor ? 'text-purple-600' : 'text-teal-600'}`} size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Create Account</h1>
            <p className="text-slate-500 mt-2 font-medium">Join the intelligent healthcare network.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {err && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" /> {err}
              </div>
            )}

            {/* Role Switcher */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'patient' })}
                className={`py-4 rounded-2xl border-2 font-black transition-all duration-300 flex flex-col items-center gap-1 ${
                  formData.role === 'patient'
                    ? 'border-teal-600 bg-teal-50 text-teal-600 scale-105 shadow-md shadow-teal-100'
                    : 'border-slate-100 text-slate-300 hover:border-slate-200'
                }`}
              >
                <User size={20} />
                <span className="text-xs uppercase tracking-widest">Patient</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'doctor' })}
                className={`py-4 rounded-2xl border-2 font-black transition-all duration-300 flex flex-col items-center gap-1 ${
                  formData.role === 'doctor'
                    ? 'border-purple-600 bg-purple-50 text-purple-600 scale-105 shadow-md shadow-purple-100'
                    : 'border-slate-100 text-slate-300 hover:border-slate-200'
                }`}
              >
                <Shield size={20} />
                <span className="text-xs uppercase tracking-widest">Doctor</span>
              </button>
            </div>

            {/* Fields */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <input
                type="text" required value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-slate-700 transition-all duration-300 focus:bg-white ${isDoctor ? 'focus:border-purple-500' : 'focus:border-teal-500'}`}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
              <input
                type="email" required value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-slate-700 transition-all duration-300 focus:bg-white ${isDoctor ? 'focus:border-purple-500' : 'focus:border-teal-500'}`}
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input
                type="password" required value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-slate-700 transition-all duration-300 focus:bg-white ${isDoctor ? 'focus:border-purple-500' : 'focus:border-teal-500'}`}
                placeholder="••••••••"
              />
            </div>

            {/* Submit button — teal for patient, purple for doctor */}
            <button
              type="submit" disabled={isSubmitting}
              className={`w-full text-white py-4 rounded-2xl font-black disabled:opacity-50 shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-widest ${
                isDoctor
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-100'
                  : 'bg-teal-600 hover:bg-teal-700 shadow-teal-100'
              }`}
            >
              {isSubmitting
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Registering...</>
                : <> Complete Registration <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className={`font-black hover:underline ${isDoctor ? 'text-purple-600' : 'text-teal-600'}`}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
