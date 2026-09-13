import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowRight, AlertCircle, User, Shield, HeartPulse, Lock } from 'lucide-react'
import { API_BASE_URL } from '../config'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('patient')   // 'patient' | 'doctor'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isDoctor = role === 'doctor'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      // Verify role matches
      if (data.user.role !== role && data.user.role !== 'admin') {
        throw new Error(`This account is registered as a ${data.user.role}, not a ${role}. Please select the correct role.`)
      }
      login(data.user, data.token)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setErr(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row transition-colors duration-500">

      {/* Left Panel — changes color based on role */}
      <div
        className="md:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 text-white relative overflow-hidden transition-all duration-500"
        style={{ background: isDoctor ? 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' : 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)' }}
      >
        <div className="relative z-10 max-w-md w-full">
          <div className="bg-white/20 p-5 rounded-[2rem] w-fit mb-10 shadow-2xl backdrop-blur-xl border border-white/20">
            <HeartPulse size={48} className="text-white animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight italic tracking-tighter">Unified Care.</h2>
          <p className="text-white/80 text-xl mb-12 font-medium leading-relaxed max-w-sm">
            The intelligent clinical engine for modern providers and patients.
          </p>
          <div className="flex items-center gap-4 bg-black/20 p-5 rounded-3xl border border-white/10">
            <div className={`w-3 h-3 rounded-full animate-ping ${isDoctor ? 'bg-purple-300' : 'bg-teal-300'}`}></div>
            <p className="text-xs font-black uppercase tracking-[0.25em]">WELCOME TO MEDICAL CARE</p>
          </div>
        </div>
        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full blur-[150px] opacity-30"
          style={{ background: isDoctor ? '#7c3aed' : '#0d9488' }}></div>
      </div>

      {/* Right Panel */}
      <div
        className="md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto transition-colors duration-500"
        style={{ background: isDoctor ? '#faf5ff' : '#f0fdf9' }}
      >
        <div className="max-w-md w-full">
          <header className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter italic">Clinical Login</h1>
            <p className="text-slate-500 font-medium">Sign in to access your healthcare portal.</p>
          </header>

          {/* Role Switcher */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              type="button"
              onClick={() => { setRole('patient'); setErr('') }}
              className={`py-3.5 rounded-2xl border-2 font-black transition-all duration-300 flex items-center justify-center gap-2 ${
                role === 'patient'
                  ? 'border-teal-600 bg-teal-50 text-teal-700 shadow-md shadow-teal-100'
                  : 'border-slate-200 text-slate-400 hover:border-slate-300 bg-white'
              }`}
            >
              <User size={18} /> <span className="text-sm uppercase tracking-widest">Patient</span>
            </button>
            <button
              type="button"
              onClick={() => { setRole('doctor'); setErr('') }}
              className={`py-3.5 rounded-2xl border-2 font-black transition-all duration-300 flex items-center justify-center gap-2 ${
                role === 'doctor'
                  ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-md shadow-purple-100'
                  : 'border-slate-200 text-slate-400 hover:border-slate-300 bg-white'
              }`}
            >
              <Shield size={18} /> <span className="text-sm uppercase tracking-widest">Doctor</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-6">
            {err && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" /> {err}
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className={`w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-slate-800 text-sm transition-all duration-300 focus:bg-white ${isDoctor ? 'focus:border-purple-500' : 'focus:border-teal-500'}`}
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className={`w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-slate-800 text-sm transition-all duration-300 focus:bg-white ${isDoctor ? 'focus:border-purple-500' : 'focus:border-teal-500'}`}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit" disabled={isLoading}
              className={`w-full text-white py-5 rounded-2xl font-black disabled:opacity-50 shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-xs uppercase tracking-widest ${
                isDoctor
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-100'
                  : 'bg-slate-900 hover:bg-teal-700 shadow-slate-200'
              }`}
            >
              {isLoading
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Signing in...</>
                : <> SIGN IN <ArrowRight size={18} /></>
              }
            </button>
          </form>

          {/* Admin Login Link */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              No account?{' '}
              <Link to="/register" className={`font-black hover:underline ${isDoctor ? 'text-purple-600' : 'text-teal-600'}`}>Register</Link>
            </p>
            <Link
              to="/admin-login"
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition shadow-lg"
              title="Admin Portal"
            >
              <Lock size={14} /> Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
