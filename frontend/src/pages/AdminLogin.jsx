import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, ArrowRight, AlertCircle, Lock } from 'lucide-react'
import { API_BASE_URL } from '../config'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Admin login failed')
      login(data.user, data.token)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setErr(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-700">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-teal-500/20 flex items-center justify-center rounded-2xl mx-auto mb-4 border border-teal-500/30">
              <Shield className="text-teal-400" size={32} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter italic">Admin Portal</h1>
            <p className="text-slate-400 mt-2 font-medium">Restricted access. Authorized personnel only.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {err && (
              <div className="bg-red-900/30 text-red-400 p-4 rounded-2xl text-sm font-bold border border-red-800 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" /> {err}
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Admin Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-slate-700 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-bold text-white text-sm transition placeholder:text-slate-500"
                placeholder="admin@medicare.com"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-slate-700 border-2 border-transparent focus:border-teal-500 rounded-2xl outline-none font-bold text-white text-sm transition placeholder:text-slate-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full bg-teal-600 text-white py-5 rounded-2xl font-black hover:bg-teal-500 disabled:opacity-50 shadow-xl shadow-teal-900/50 transition flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
            >
              {isLoading
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Verifying...</>
                : <><Lock size={16} /> Access Admin Panel <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <Link to="/login" className="text-slate-400 text-sm font-bold hover:text-teal-400 transition flex items-center justify-center gap-2">
              ← Back to Login
            </Link>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6 font-medium">
          Medicare Healthcare Portal — Admin Access
        </p>
      </div>
    </div>
  )
}
