import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import NavigationControls from './components/NavigationControls'
import Home from './pages/Home'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import Register from './pages/Register'
import PatientDashboard from './pages/PatientDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import BookAppointment from './pages/BookAppointment'
import MedicalRecords from './pages/MedicalRecords'
import DoctorsList from './pages/DoctorsList'
import Contact from './pages/Contact'
import InfoPage from './pages/InfoPage'
import { HeartPulse } from 'lucide-react'

function Loader() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-teal-600 bg-slate-50">
      <HeartPulse size={48} className="animate-pulse mb-4" />
      <p className="font-black italic uppercase tracking-widest animate-pulse text-xs text-slate-400">Loading...</p>
    </div>
  )
}

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function DashboardRouter() {
  const { user } = useAuth()
  if (user?.role === 'patient') return <PatientDashboard />
  if (user?.role === 'doctor')  return <DoctorDashboard />
  if (user?.role === 'admin')   return <AdminDashboard />
  return <Navigate to="/login" replace />
}

function AppContent() {
  const location = useLocation()
  const hideNav = ['/login', '/register', '/admin-login'].includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNav && <Navbar />}
      {!hideNav && <NavigationControls />}
      <main className="flex-grow w-full">
        <Routes>
          {/* Public */}
          <Route path="/"            element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/login"       element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/admin-login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
          <Route path="/register"    element={<PublicRoute><Register /></PublicRoute>} />

          {/* Info & Contact */}
          <Route path="/contact"  element={<Contact />} />
          <Route path="/about"    element={<InfoPage />} />
          <Route path="/team"     element={<InfoPage />} />
          <Route path="/careers"  element={<InfoPage />} />
          <Route path="/press"    element={<InfoPage />} />
          <Route path="/privacy"  element={<InfoPage />} />
          <Route path="/terms"    element={<InfoPage />} />
          <Route path="/cookie"   element={<InfoPage />} />
          <Route path="/support"  element={<InfoPage />} />

          {/* Private */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardRouter /></PrivateRoute>} />
          <Route path="/book"      element={<PrivateRoute roles={['patient']}><BookAppointment /></PrivateRoute>} />
          <Route path="/records"   element={<PrivateRoute roles={['patient','doctor']}><MedicalRecords /></PrivateRoute>} />
          <Route path="/doctors"   element={<PrivateRoute roles={['patient']}><DoctorsList /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}
