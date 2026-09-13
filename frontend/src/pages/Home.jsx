import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Calendar, Activity, ArrowRight, CheckCircle2, Star, HeartPulse, Stethoscope, Clock, Smartphone, X, ChevronDown, ChevronUp } from 'lucide-react'
import Footer from '../components/Footer'

export default function Home() {
  const [reviews, setReviews] = useState([
    { id: 1, text: "The best healthcare platform I've ever used. Booking an appointment takes literally seconds.", author: "Priya Sharma", role: "Patient" },
    { id: 2, text: "As a cardiologist, having all patient records in one secure place has transformed my practice.", author: "Dr. Rajesh Verma", role: "Cardiologist" },
    { id: 3, text: "Incredible support team and a very intuitive interface. Highly recommended for families.", author: "Anjali Gupta", role: "Mother of 2" }
  ])
  const [showModal, setShowModal] = useState(false)
  const [newFeedback, setNewFeedback] = useState({ author: '', role: '', text: '' })
  const [showAll, setShowAll] = useState(false)

  const handleAddFeedback = (e) => {
    e.preventDefault()
    if (!newFeedback.author || !newFeedback.text) return
    setReviews([{ id: Date.now(), ...newFeedback }, ...reviews])
    setShowModal(false)
    setNewFeedback({ author: '', role: '', text: '' })
  }

  const displayed = showAll ? reviews : reviews.slice(0, 3)

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20 pb-32 overflow-hidden bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:flex lg:items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-700 font-bold text-xs uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                The Future of Healthcare
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight tracking-tight">
                Healthcare <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Re-imagined</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
                Experience the next generation of medical care. Connect with top-tier specialists, access your records instantly, and take control of your well-being.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/register" className="group bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2 hover:-translate-y-1">
                  Get Started Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="group bg-white text-teal-600 border-2 border-teal-500 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-teal-50 transition-all flex items-center justify-center gap-2 hover:-translate-y-1">
                  Sign In
                </Link>
              </div>
              <div className="pt-8 flex items-center gap-8 text-sm font-bold text-slate-500">
                {['HIPAA Compliant', '24/7 Support', 'Top Specialists'].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="text-teal-500" size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block lg:w-1/2 relative group">
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white transform rotate-2 group-hover:rotate-0 transition-all duration-700 bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center h-[600px] group-hover:scale-[1.02]">
                <Stethoscope size={300} className="text-white/20 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity size={150} className="text-white drop-shadow-2xl" />
                </div>
                <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-xl text-green-600"><Activity size={24} /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Patient Recovery</p>
                    <p className="text-lg font-black text-slate-900">+24%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
            {[['10k+', 'Active Patients', 'text-white'], ['500+', 'Specialists', 'text-teal-400'], ['98%', 'Satisfaction Rate', 'text-white'], ['24/7', 'Emergency Care', 'text-blue-400']].map(([val, label, color]) => (
              <div key={label} className="p-4 group cursor-default">
                <p className={`text-4xl lg:text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300 ${color}`}>{val}</p>
                <p className="text-slate-400 font-medium group-hover:text-white transition-colors">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-teal-600 font-bold tracking-widest uppercase text-sm mb-3">Why Choose Us</h2>
            <h3 className="text-4xl font-black text-slate-900 mb-6">Complete Healthcare Ecosystem</h3>
            <p className="text-slate-600 text-lg">We've built a platform that puts your health first.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Calendar size={32} />, title: "Instant Scheduling", desc: "Book appointments in seconds. No more waiting on hold.", color: "bg-blue-500", bg: "bg-blue-50" },
              { icon: <ShieldCheck size={32} />, title: "Secure Records", desc: "Bank-grade encryption for your entire medical history.", color: "bg-teal-500", bg: "bg-teal-50" },
              { icon: <Smartphone size={32} />, title: "Telemedicine", desc: "Consult with top doctors from the comfort of your home.", color: "bg-purple-500", bg: "bg-purple-50" }
            ].map((f, i) => (
              <div key={i} className="group bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 hover:border-teal-200">
                <div className={`h-32 ${f.bg} flex items-center justify-center`}>
                  <div className={`${f.color} w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>{f.icon}</div>
                </div>
                <div className="p-8">
                  <h4 className="text-2xl font-bold text-slate-900 mb-3">{f.title}</h4>
                  <p className="text-slate-600 leading-relaxed mb-6">{f.desc}</p>
                  <Link to="/register" className="inline-flex items-center gap-2 text-slate-900 font-bold group-hover:text-teal-600 transition-colors">
                    Learn more <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-12 lg:p-20 flex flex-col justify-center">
                <h3 className="text-4xl font-black text-white mb-6">For Patients</h3>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">Take control of your health journey. Book appointments, view lab results, and chat with your doctor.</p>
                <ul className="space-y-4 mb-10">
                  {['24/7 Access to Records', 'Instant Prescription Refills', 'Family Health Management'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-white font-medium">
                      <div className="bg-teal-500/20 p-1 rounded-full"><CheckCircle2 size={16} className="text-teal-400" /></div>{item}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="bg-teal-500 text-white px-8 py-4 rounded-xl font-bold text-center hover:bg-teal-400 transition shadow-lg hover:scale-105">Join as Patient</Link>
              </div>
              <div className="bg-slate-800 p-12 lg:p-20 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-700">
                <h3 className="text-4xl font-black text-white mb-6">For Doctors</h3>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">Streamline your practice. Manage appointments, patient records, and billing with ease.</p>
                <ul className="space-y-4 mb-10">
                  {['Automated Scheduling', 'Digital Health Records (EHR)', 'Secure Patient Messaging'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-white font-medium">
                      <div className="bg-blue-500/20 p-1 rounded-full"><CheckCircle2 size={16} className="text-blue-400" /></div>{item}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-center hover:bg-blue-500 transition shadow-lg hover:scale-105">Join as Doctor</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Trusted by Thousands</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Join the growing community of patients and providers transforming healthcare together.</p>
            <button onClick={() => setShowModal(true)} className="mt-6 bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition">+ Add Your Review</button>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {displayed.map(r => (
              <div key={r.id} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                <div className="flex gap-1 mb-4">{[1,2,3,4,5].map(s => <Star key={s} size={16} className="text-amber-400 fill-amber-400" />)}</div>
                <p className="text-slate-600 leading-relaxed mb-6 italic">"{r.text}"</p>
                <div>
                  <p className="font-black text-slate-900">{r.author}</p>
                  <p className="text-teal-600 text-sm font-bold">{r.role}</p>
                </div>
              </div>
            ))}
          </div>
          {reviews.length > 3 && (
            <div className="text-center mt-10">
              <button onClick={() => setShowAll(!showAll)} className="flex items-center gap-2 mx-auto text-teal-600 font-bold hover:underline">
                {showAll ? <><ChevronUp size={18}/> Show Less</> : <><ChevronDown size={18}/> Show More ({reviews.length - 3} more)</>}
              </button>
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"><X size={20} /></button>
            <h3 className="text-2xl font-black text-slate-900 mb-6">Share Your Experience</h3>
            <form onSubmit={handleAddFeedback} className="space-y-4">
              <input required placeholder="Your Name" value={newFeedback.author} onChange={e => setNewFeedback({...newFeedback, author: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-teal-500 font-medium transition" />
              <input placeholder="Your Role (e.g. Patient, Doctor)" value={newFeedback.role} onChange={e => setNewFeedback({...newFeedback, role: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-teal-500 font-medium transition" />
              <textarea required placeholder="Share your experience..." rows={4} value={newFeedback.text} onChange={e => setNewFeedback({...newFeedback, text: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-teal-500 font-medium transition resize-none" />
              <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-2xl font-bold hover:bg-teal-700 transition">Submit Review</button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}
