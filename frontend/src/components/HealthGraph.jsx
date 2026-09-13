import React, { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, CalendarDays, CalendarRange, Calendar, CheckCircle2, Circle, Plus, Trash2, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'

const daysData = [
  { name: 'Mon', health: 65 }, { name: 'Tue', health: 72 }, { name: 'Wed', health: 68 },
  { name: 'Thu', health: 75 }, { name: 'Fri', health: 82 }, { name: 'Sat', health: 78 }, { name: 'Sun', health: 60 }
]
const weeksData = [
  { name: 'Week 1', health: 55 }, { name: 'Week 2', health: 62 },
  { name: 'Week 3', health: 48 }, { name: 'Week 4', health: 60 }
]
const monthsData = [
  { name: 'Jan', health: 70 }, { name: 'Feb', health: 45 }, { name: 'Mar', health: 80 },
  { name: 'Apr', health: 85 }, { name: 'May', health: 40 }, { name: 'Jun', health: 60 }
]

const defaultActivities = [
  { id: 1, label: 'Morning Medication', impact: 20, completed: false },
  { id: 2, label: '30 Min Physical Therapy', impact: 20, completed: false },
  { id: 3, label: 'Hydration Goal (2L)', impact: 20, completed: false },
  { id: 4, label: '8 Hours Sleep', impact: 20, completed: false },
  { id: 5, label: 'Evening Meditation', impact: 20, completed: false }
]

export default function HealthGraph() {
  const [timeRange, setTimeRange] = useState('days')
  const [data, setData] = useState(daysData)
  const [activities, setActivities] = useState(defaultActivities)
  const [currentScore, setCurrentScore] = useState(0)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [history, setHistory] = useState({})
  const [newActivity, setNewActivity] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('health_history')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  const dateKey = currentDate.toISOString().split('T')[0]

  useEffect(() => {
    if (history[dateKey]) {
      setActivities(history[dateKey].activities)
      setCurrentScore(history[dateKey].score)
    } else {
      setActivities(defaultActivities.map(a => ({ ...a, completed: false })))
      setCurrentScore(0)
    }
  }, [dateKey])

  useEffect(() => {
    if (timeRange === 'days') setData(daysData)
    else if (timeRange === 'weeks') setData(weeksData)
    else setData(monthsData)
  }, [timeRange])

  const toggleActivity = (id) => {
    const updated = activities.map(a => a.id === id ? { ...a, completed: !a.completed } : a)
    setActivities(updated)
    const score = updated.filter(a => a.completed).reduce((sum, a) => sum + a.impact, 0)
    setCurrentScore(score)
    const newHistory = { ...history, [dateKey]: { activities: updated, score } }
    setHistory(newHistory)
    localStorage.setItem('health_history', JSON.stringify(newHistory))
  }

  const addActivity = () => {
    if (!newActivity.trim()) return
    const act = { id: Date.now(), label: newActivity.trim(), impact: 10, completed: false }
    const updated = [...activities, act]
    setActivities(updated)
    setNewActivity('')
    setIsAdding(false)
    const newHistory = { ...history, [dateKey]: { activities: updated, score: currentScore } }
    setHistory(newHistory)
    localStorage.setItem('health_history', JSON.stringify(newHistory))
  }

  const removeActivity = (id) => {
    const updated = activities.filter(a => a.id !== id)
    setActivities(updated)
    const score = updated.filter(a => a.completed).reduce((sum, a) => sum + a.impact, 0)
    setCurrentScore(score)
    const newHistory = { ...history, [dateKey]: { activities: updated, score } }
    setHistory(newHistory)
    localStorage.setItem('health_history', JSON.stringify(newHistory))
  }

  const resetDay = () => {
    const reset = activities.map(a => ({ ...a, completed: false }))
    setActivities(reset)
    setCurrentScore(0)
    const newHistory = { ...history, [dateKey]: { activities: reset, score: 0 } }
    setHistory(newHistory)
    localStorage.setItem('health_history', JSON.stringify(newHistory))
  }

  const changeDate = (offset) => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + offset)
    if (d <= new Date()) setCurrentDate(d)
  }

  const getDisplayDate = () => {
    const today = new Date()
    if (currentDate.toDateString() === today.toDateString()) return 'Today'
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
    if (currentDate.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const scoreColor = currentScore >= 80 ? 'text-emerald-500' : currentScore >= 50 ? 'text-amber-500' : 'text-red-500'

  return (
    <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 italic">
          <Activity className="text-teal-500" size={24} /> Health Score
        </h2>
        <div className="flex gap-2">
          {[['days', <CalendarDays size={14} />], ['weeks', <CalendarRange size={14} />], ['months', <Calendar size={14} />]].map(([range, icon]) => (
            <button key={range} onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide flex items-center gap-1 transition ${timeRange === range ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              {icon} {range}
            </button>
          ))}
        </div>
      </div>

      <div className="h-40 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Area type="monotone" dataKey="health" stroke="#14b8a6" strokeWidth={2} fill="url(#healthGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => changeDate(-1)} className="p-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition"><ChevronLeft size={14} /></button>
            <span className="text-sm font-black text-slate-700">{getDisplayDate()}</span>
            <button onClick={() => changeDate(1)} disabled={currentDate.toDateString() === new Date().toDateString()} className="p-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition disabled:opacity-30"><ChevronRight size={14} /></button>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-2xl font-black ${scoreColor}`}>{currentScore}%</span>
            <button onClick={resetDay} className="p-1.5 bg-slate-100 rounded-lg hover:bg-red-50 hover:text-red-500 transition" title="Reset"><RotateCcw size={14} /></button>
            <button onClick={() => setIsAdding(!isAdding)} className="p-1.5 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition"><Plus size={14} /></button>
          </div>
        </div>

        {isAdding && (
          <div className="flex gap-2 mb-3">
            <input value={newActivity} onChange={e => setNewActivity(e.target.value)} onKeyDown={e => e.key === 'Enter' && addActivity()}
              placeholder="New activity..." className="flex-1 px-3 py-2 bg-slate-50 rounded-xl text-xs font-medium outline-none border-2 border-transparent focus:border-teal-500 transition" />
            <button onClick={addActivity} className="px-3 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition">Add</button>
          </div>
        )}

        <div className="space-y-2">
          {activities.map(act => (
            <div key={act.id} className={`flex items-center justify-between p-3 rounded-2xl border transition cursor-pointer group ${act.completed ? 'bg-teal-50 border-teal-100' : 'bg-slate-50 border-slate-100 hover:border-teal-200'}`}
              onClick={() => toggleActivity(act.id)}>
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${act.completed ? 'bg-teal-500 border-teal-500' : 'border-slate-300'}`}>
                  {act.completed && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <span className={`text-xs font-bold ${act.completed ? 'text-teal-700 line-through' : 'text-slate-700'}`}>{act.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-400">+{act.impact}%</span>
                <button onClick={e => { e.stopPropagation(); removeActivity(act.id) }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
