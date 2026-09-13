import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Users, FileText, HelpCircle, Briefcase, Newspaper } from 'lucide-react'

const CONTENT = {
  about: {
    title: 'Our Mission', icon: <Users size={44} className="text-teal-500" />,
    body: [
      'At Medicare, we are dedicated to revolutionizing the healthcare experience. Our mission is to bridge the gap between patients and providers through innovative technology.',
      'We believe that quality healthcare should be accessible, efficient, and transparent. By leveraging cutting-edge digital solutions, we empower individuals to take control of their health journey while enabling medical professionals to focus on what they do best: caring for patients.',
      'Founded in 2022, Medicare has grown to serve over 10,000 patients and 500 healthcare professionals across the country.'
    ]
  },
  team: {
    title: 'Leadership Team', icon: <Users size={44} className="text-blue-500" />,
    body: ['Our team consists of world-class medical experts, technology veterans, and compassionate care coordinators.'],
    list: ['Dr. Rajesh Verma — Chief Medical Officer', 'Priya Sharma — Head of Patient Experience', 'Amit Patel — Chief Technology Officer', 'Anita Roy — VP of Clinical Operations', 'Vikram Singh — Head of Engineering']
  },
  careers: {
    title: 'Join Our Team', icon: <Briefcase size={44} className="text-purple-500" />,
    body: ['We are always looking for passionate individuals to join our mission. If you want to make a real impact in healthcare, we want to hear from you.'],
    list: ['Senior Full Stack Developer', 'Clinical Data Analyst', 'Customer Success Manager', 'UI/UX Designer (Healthcare)', 'DevOps Engineer']
  },
  press: {
    title: 'Press & Media', icon: <Newspaper size={44} className="text-orange-500" />,
    body: ['Medicare has been featured in leading publications for its innovative approach to digital healthcare. For press inquiries, contact press@medicare.com.'],
    list: ['"Medicare Raises $50M Series B" — TechCrunch', '"Top 10 HealthTech Startups of 2024" — Forbes', '"Revolutionizing Patient Care" — Wired']
  },
  privacy: {
    title: 'Privacy Policy', icon: <ShieldCheck size={44} className="text-green-500" />,
    body: [
      'Your privacy is our top priority. We adhere to strict HIPAA guidelines and use bank-grade encryption to protect your personal health information.',
      'We do not sell your data to third parties. Your medical records are accessible only to you and your authorized healthcare providers.',
      'All data is stored in encrypted, HIPAA-compliant servers. You can request deletion of your account and associated data at any time by contacting support@medicare.com.'
    ]
  },
  terms: {
    title: 'Terms of Service', icon: <FileText size={44} className="text-slate-500" />,
    body: [
      'By using Medicare, you agree to these terms. Our services are provided "as is" and we make no warranties regarding their availability or accuracy.',
      'Users are responsible for maintaining the confidentiality of their account credentials. Medicare is not liable for unauthorized access resulting from user negligence.',
      'We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of the updated terms.'
    ]
  },
  cookie: {
    title: 'Cookie Policy', icon: <FileText size={44} className="text-yellow-500" />,
    body: [
      'Medicare uses cookies to enhance your experience, analyze site traffic, and personalize content.',
      'Essential cookies are required for the platform to function correctly. Analytics cookies help us understand how users interact with the platform. You can opt out of non-essential cookies in your browser settings.',
      'We do not use cookies for advertising or to track you across third-party websites.'
    ]
  },
  support: {
    title: 'Support Center', icon: <HelpCircle size={44} className="text-teal-500" />,
    body: [
      'Welcome to the Medicare Support Center. We offer 24/7 support via live chat, email, and phone.',
      'For technical issues: support@medicare.com | For billing: billing@medicare.com | Emergency: +1 (555) 010-9988'
    ],
    list: ['How to book an appointment', 'How to view medical records', 'How to message your doctor', 'How to update your profile', 'How to cancel an appointment']
  }
}

export default function InfoPage() {
  const location = useLocation()
  const path = location.pathname.substring(1)
  const content = CONTENT[path] || { title: 'Page Not Found', icon: <HelpCircle size={44} className="text-slate-400" />, body: ['This page does not exist.'] }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold text-sm mb-10 group transition-colors">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
      </Link>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-br from-slate-50 to-teal-50/30 p-12 border-b border-slate-100">
          <div className="mb-6">{content.icon}</div>
          <h1 className="text-4xl font-black text-slate-900 italic tracking-tighter">{content.title}</h1>
        </div>

        <div className="p-12 space-y-6">
          {content.body.map((para, i) => (
            <p key={i} className="text-slate-600 leading-relaxed text-lg">{para}</p>
          ))}

          {content.list && (
            <div className="mt-8 bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <ul className="space-y-3">
                {content.list.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                    <span className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-6 border-t border-slate-100 mt-8">
            <p className="text-slate-400 text-sm">Last updated: January 2025</p>
            <p className="text-slate-400 text-sm mt-1">Questions? <Link to="/contact" className="text-teal-600 font-bold hover:underline">Contact our team</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
