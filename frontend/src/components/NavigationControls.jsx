import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, LogOut, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function NavigationControls() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const hideOnPaths = ['/', '/login', '/register']
  if (hideOnPaths.includes(location.pathname)) return null

  const handleBack = () => {
    if (location.pathname === '/dashboard') setShowLogoutModal(true)
    else navigate(-1)
  }

  const confirmLogout = () => {
    logout()
    setShowLogoutModal(false)
    navigate('/')
  }

  return (
    <>
      <div className="bg-white/50 backdrop-blur-sm border-b border-slate-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3">
          <button onClick={handleBack} className="p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-teal-600 hover:border-teal-200 transition shadow-sm">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => navigate(1)} className="p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-teal-600 hover:border-teal-200 transition shadow-sm">
            <ChevronRight size={16} />
          </button>
          <div className="h-4 w-px bg-slate-200"></div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 italic">
            {location.pathname.substring(1) || 'home'}
          </span>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowLogoutModal(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl">
            <button onClick={() => setShowLogoutModal(false)} className="absolute top-5 right-5 text-slate-400"><X size={18} /></button>
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-50 p-4 rounded-2xl text-red-500 mb-4"><LogOut size={28} /></div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Exit Session?</h3>
              <p className="text-slate-500 text-sm mb-6">This will log you out and return you to the home page.</p>
              <div className="flex flex-col w-full gap-3">
                <button onClick={confirmLogout} className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition">Yes, Logout</button>
                <button onClick={() => setShowLogoutModal(false)} className="w-full py-3 rounded-xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
