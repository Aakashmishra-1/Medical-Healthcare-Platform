import React, { useState, useEffect, useRef } from 'react'
import { Send, X, MessageSquare, Circle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function ChatHub({ socket, receiverEmail, receiverName, onClose, isOnline }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const scrollRef = useRef(null)

  const getVaultKey = () => {
    if (!user?.email || !receiverEmail) return 'chat_guest'
    const parts = [user.email, receiverEmail].sort()
    return `chat_vault_${parts[0]}_${parts[1]}`
  }

  useEffect(() => {
    const loadMessages = async () => {
      const local = JSON.parse(localStorage.getItem(getVaultKey()) || '[]')
      try {
        const res = await api.get(`/messages/${receiverEmail}?myEmail=${user?.email}`)
        if (res.data?.messages?.length) {
          const combined = [...local, ...res.data.messages]
          const unique = Array.from(new Map(combined.map(m => [m._id, m])).values())
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          setMessages(unique)
          localStorage.setItem(getVaultKey(), JSON.stringify(unique))
          return
        }
      } catch {}
      setMessages(local)
    }
    loadMessages()
  }, [receiverEmail])

  useEffect(() => {
    if (!socket) return
    const handler = (msg) => {
      const relevant =
        (msg.senderEmail === receiverEmail && msg.receiverEmail === user?.email) ||
        (msg.senderEmail === user?.email && msg.receiverEmail === receiverEmail)
      if (relevant) {
        setMessages(prev => {
          if (prev.find(m => m._id === msg._id)) return prev
          const updated = [...prev, msg].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          localStorage.setItem(getVaultKey(), JSON.stringify(updated))
          return updated
        })
      }
    }
    socket.on('receive_direct_message', handler)
    return () => socket.off('receive_direct_message', handler)
  }, [socket, receiverEmail, user?.email])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputText.trim() || !user) return
    const newMsg = {
      _id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      senderEmail: user.email,
      senderName: user.username,
      receiverEmail,
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    }
    if (socket) socket.emit('send_direct_message', newMsg)
    try { await api.post('/messages', newMsg) } catch {}
    setInputText('')
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-[450px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col z-[300] overflow-hidden">
      <div className="bg-slate-900 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-500 rounded-full flex items-center justify-center text-white font-black text-sm">
            {receiverName?.charAt(0)}
          </div>
          <div>
            <p className="text-white font-black text-sm">{receiverName}</p>
            <div className="flex items-center gap-1">
              <Circle size={6} fill={isOnline ? '#10b981' : '#ef4444'} className={isOnline ? 'text-emerald-400' : 'text-red-400'} />
              <span className="text-xs text-slate-400">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1"><X size={18} /></button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 scrollbar-hide">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs font-medium italic">
            <MessageSquare size={28} className="mb-2 opacity-30" />
            Start the conversation
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg._id} className={`flex ${msg.senderEmail === user?.email ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium shadow-sm leading-relaxed ${
              msg.senderEmail === user?.email
                ? 'bg-slate-900 text-white rounded-tr-none'
                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border-2 border-transparent focus-within:border-teal-500 transition">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none px-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} disabled={!inputText.trim()} className="bg-teal-600 text-white p-2 rounded-xl hover:bg-teal-700 transition disabled:opacity-30">
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
