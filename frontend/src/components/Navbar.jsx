import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Heart, LogOut, User as UserIcon, Bell, Stethoscope, Shield } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const isDoctor = user?.role === 'doctor'
  const isAdmin  = user?.role === 'admin'

  const confirmLogout = () => {
    logout()
    setShowLogoutModal(false)
    navigate('/login')
  }

  const roleColor = isAdmin ? 'text-slate-900' : isDoctor ? 'text-purple-600' : 'text-teal-600'
  const roleBg    = isAdmin ? 'bg-slate-900 hover:bg-slate-700' : isDoctor ? 'bg-purple-600 hover:bg-purple-700' : 'bg-teal-600 hover:bg-teal-700'

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo + Nav Links */}
          <div className="flex items-center">
            <Link to={user ? '/dashboard' : '/'} className={`flex items-center gap-2 font-bold text-xl ${roleColor}`}>
              <Heart fill="currentColor" size={22} />
              <span>Medicare</span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              <Link to={user ? '/dashboard' : '/'} className="text-slate-600 hover:text-teal-600 px-3 py-2 rounded-md font-medium text-sm">
                {user ? 'Dashboard' : 'Home'}
              </Link>
              {user?.role === 'patient' && <>
                <Link to="/book" className="text-slate-600 hover:text-teal-600 px-3 py-2 rounded-md font-medium text-sm">Book Appointment</Link>
                <Link to="/doctors" className="text-slate-600 hover:text-teal-600 px-3 py-2 rounded-md font-medium text-sm">Doctors</Link>
              </>}
              {user?.role === 'doctor' && <>
                <Link to="/records" className="text-slate-600 hover:text-purple-600 px-3 py-2 rounded-md font-medium text-sm">Records</Link>
              </>}
              <Link to="/contact" className="text-slate-600 hover:text-teal-600 px-3 py-2 rounded-md font-medium text-sm">Contact</Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <Link to="/login" className="text-slate-600 hover:text-teal-600 font-medium text-sm">Login</Link>
                <Link to="/register" className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-teal-700 transition">Register</Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                  <button onClick={() => setShowNotifs(!showNotifs)} className="p-2 text-slate-400 hover:text-teal-600 relative">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>
                  {showNotifs && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
                      <h5 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-3">Notifications</h5>
                      <div className="space-y-2">
                        <div className="p-3 bg-slate-50 rounded-xl text-xs font-bold">
                          <p className="text-slate-900 mb-1">New medical report available</p>
                          <p className="text-teal-500">2 mins ago</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl text-xs font-bold">
                          <p className="text-slate-900 mb-1">Appointment status updated</p>
                          <p className="text-teal-500">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* User info */}
                <div className="flex items-center gap-2 border-r pr-4">
                  <div className={`p-1.5 rounded-lg ${isDoctor ? 'bg-purple-50 text-purple-600' : isAdmin ? 'bg-slate-100 text-slate-600' : 'bg-teal-50 text-teal-600'}`}>
                    {isDoctor ? <Stethoscope size={14} /> : isAdmin ? <Shield size={14} /> : <UserIcon size={14} />}
                  </div>
                  <span className="text-slate-700 text-sm font-bold">{user.username}</span>
                </div>

                <button onClick={() => setShowLogoutModal(true)} className="flex items-center gap-1 text-red-500 hover:text-red-700 font-bold text-xs uppercase">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b px-4 pt-2 pb-4 space-y-1">
          <Link to={user ? '/dashboard' : '/'} className="block px-3 py-2 text-slate-600 font-medium" onClick={() => setIsOpen(false)}>
            {user ? 'Dashboard' : 'Home'}
          </Link>
          {!user ? (
            <>
              <Link to="/login" className="block px-3 py-2 text-slate-600 font-medium" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="block px-3 py-2 text-teal-600 font-medium" onClick={() => setIsOpen(false)}>Register</Link>
            </>
          ) : (
            <>
              {user.role === 'patient' && <>
                <Link to="/book" className="block px-3 py-2 text-slate-600 font-medium" onClick={() => setIsOpen(false)}>Book Appointment</Link>
                <Link to="/doctors" className="block px-3 py-2 text-slate-600 font-medium" onClick={() => setIsOpen(false)}>Doctors</Link>
              </>}
              <button onClick={() => { setIsOpen(false); setShowLogoutModal(true) }} className="w-full text-left px-3 py-2 text-red-500 font-medium">Logout</button>
            </>
          )}
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowLogoutModal(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl border border-slate-100">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-50 p-4 rounded-2xl text-red-500 mb-4"><LogOut size={28} /></div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Sign Out?</h3>
              <p className="text-slate-500 text-sm mb-6">Are you sure you want to end your session?</p>
              <div className="flex flex-col w-full gap-3">
                <button onClick={confirmLogout} className="w-full py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition">Yes, Logout</button>
                <button onClick={() => setShowLogoutModal(false)} className="w-full py-3 rounded-xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
