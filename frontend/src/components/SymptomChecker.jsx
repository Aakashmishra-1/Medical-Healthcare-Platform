import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bot, Send, Sparkles, AlertCircle, CheckCircle, Loader2, X, Activity } from 'lucide-react'

const symptomDB = {
  'headache': { causes: ['Tension headache', 'Dehydration', 'Migraine', 'Sinus pressure'], advice: 'Rest in a quiet, dark room. Stay hydrated. If severe or persistent, consult a doctor.', specialist: 'Neurologist' },
  'fever': { causes: ['Viral infection', 'Bacterial infection', 'Flu', 'COVID-19'], advice: 'Stay hydrated, rest, and monitor temperature. If above 103°F or lasting more than 3 days, see a doctor.', specialist: 'General Physician' },
  'stomach pain': { causes: ['Indigestion', 'Gastritis', 'Food poisoning', 'Appendicitis'], advice: 'Avoid heavy foods, stay hydrated. If pain is severe or accompanied by vomiting, seek immediate care.', specialist: 'Gastroenterologist' },
  'fatigue': { causes: ['Sleep deprivation', 'Anemia', 'Thyroid issues', 'Stress'], advice: 'Ensure 7-9 hours of sleep, maintain a balanced diet, and manage stress levels.', specialist: 'General Physician' },
  'cough': { causes: ['Common cold', 'Allergies', 'Asthma', 'Bronchitis'], advice: 'Stay hydrated, use honey for soothing. If persistent more than 2 weeks, consult a doctor.', specialist: 'Pulmonologist' },
  'chest pain': { causes: ['Muscle strain', 'Acid reflux', 'Anxiety', 'Cardiac issues'], advice: '⚠️ If accompanied by shortness of breath or radiating pain, call emergency services immediately.', specialist: 'Cardiologist' },
  'back pain': { causes: ['Muscle strain', 'Poor posture', 'Herniated disc', 'Kidney issues'], advice: 'Rest, apply ice/heat, gentle stretching. If severe or with numbness, consult a doctor.', specialist: 'Orthopedic Surgeon' },
  'skin rash': { causes: ['Allergic reaction', 'Eczema', 'Contact dermatitis', 'Psoriasis'], advice: 'Avoid scratching, use gentle soap. If spreading rapidly or accompanied by difficulty breathing, seek care.', specialist: 'Dermatologist' },
}

export default function SymptomChecker({ onClose }) {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([{
    id: '1', type: 'ai',
    text: "Hello! I'm your AI Health Assistant. Describe your symptoms or choose from common ones below.",
    options: ['Headache', 'Fever', 'Stomach Pain', 'Fatigue', 'Cough', 'Chest Pain', 'Back Pain', 'Skin Rash']
  }])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  const analyzeSymptom = (symptom) => {
    const key = symptom.toLowerCase()
    const match = Object.keys(symptomDB).find(k => key.includes(k))
    return match ? symptomDB[match] : null
  }

  const handleSend = async (text) => {
    const msg = text || inputText
    if (!msg.trim()) return
    if (text === 'Book Appointment') { onClose(); navigate('/book'); return }
    if (text === 'Check another symptom') {
      setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', text },
        { id: Date.now() + 1 + '', type: 'ai', text: "Sure! Describe another symptom or choose from below.", options: ['Headache', 'Fever', 'Stomach Pain', 'Fatigue', 'Cough', 'Chest Pain', 'Back Pain', 'Skin Rash'] }])
      setInputText(''); return
    }

    const userMsg = { id: Date.now().toString(), type: 'user', text: msg }
    setMessages(prev => [...prev, userMsg])
    setInputText('')
    setIsTyping(true)

    setTimeout(() => {
      const analysis = analyzeSymptom(msg)
      let aiReply
      if (analysis) {
        aiReply = {
          id: Date.now() + 1 + '',
          type: 'ai',
          text: `Based on your symptom "${msg}", here's what I found:\n\n**Possible Causes:**\n• ${analysis.causes.join('\n• ')}\n\n**Advice:** ${analysis.advice}\n\n**Recommended Specialist:** ${analysis.specialist}`,
          options: ['Book Appointment', 'Check another symptom']
        }
      } else {
        aiReply = {
          id: Date.now() + 1 + '',
          type: 'ai',
          text: `I understand you're experiencing "${msg}". While I don't have specific data for this, I recommend consulting a healthcare professional for an accurate diagnosis. Would you like to book an appointment?`,
          options: ['Book Appointment', 'Check another symptom']
        }
      }
      setMessages(prev => [...prev, aiReply])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col h-[85vh] overflow-hidden">
        <div className="bg-slate-900 p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500 p-2 rounded-xl"><Bot size={20} className="text-white" /></div>
            <div>
              <h3 className="text-white font-black italic tracking-tight">AI Symptom Checker</h3>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">System Ready</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 transition"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-slate-50/50">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[85%]">
                {msg.type === 'ai' && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="bg-teal-500 p-1 rounded-md"><Sparkles size={10} className="text-white" /></div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wide">HealthSync AI</span>
                  </div>
                )}
                <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed whitespace-pre-line ${
                  msg.type === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                {msg.options && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {msg.options.map(opt => (
                      <button key={opt} onClick={() => handleSend(opt)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition border ${
                          opt === 'Book Appointment' ? 'bg-teal-600 text-white border-teal-600 hover:bg-teal-700' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-600'
                        }`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 p-3 rounded-2xl shadow-sm flex items-center gap-2">
                <Loader2 size={14} className="text-teal-500 animate-spin" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-wide">Analyzing...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border-2 border-transparent focus-within:border-teal-500 transition">
            <input
              type="text" placeholder="Describe your symptoms..."
              className="flex-1 bg-transparent outline-none px-3 py-2 text-sm font-medium text-slate-800 placeholder:text-slate-400"
              value={inputText} onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={() => handleSend()} disabled={!inputText.trim() || isTyping}
              className="bg-teal-600 text-white p-2 rounded-xl hover:bg-teal-700 transition disabled:opacity-30">
              <Send size={16} />
            </button>
          </div>
          <p className="text-center mt-2 text-xs text-slate-400 font-medium italic">AI assistance only. Always consult medical staff for proper diagnosis.</p>
        </div>
      </div>
    </div>
  )
}
