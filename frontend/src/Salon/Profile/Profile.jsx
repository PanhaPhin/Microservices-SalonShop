import React, { useState } from 'react'
import ProfileFieldCard from '../Profile/ProfileFildCard'

function SalonDetails() {
  const salonInfo = [
    { keys: 'Type',        value: 'Hair & Beauty Salon',    icon: '✂️' },
    { keys: 'Location',    value: 'Phnom Penh, Cambodia',   icon: '📍' },
    { keys: 'Phone',       value: '+855 12 345 678',        icon: '📞' },
    { keys: 'Walk-ins',    value: 'Welcome',                icon: '🚶' },
    { keys: 'Founded',     value: '2019',                   icon: '📅' },
  ]

  const ownerInfo = [
    { keys: 'Owner',       value: 'Nika Chan',              icon: '👤' },
    { keys: 'Email',       value: 'nika@nikasalon.com',     icon: '✉️' },
    { keys: 'Role',        value: 'Owner & Head Stylist',   icon: '💼' },
  ]

  const hoursInfo = [
    { keys: 'Open',        value: 'Mon – Sat  8:00 AM',     icon: '🕗' },
    { keys: 'Close',       value: 'Mon – Sat  7:00 PM',     icon: '🔒' },
    { keys: 'Sunday',      value: 'Closed',                 icon: '❌' },
  ]

  return (
    <div className="mt-4 flex flex-col gap-4">

      {/* ── Salon Info ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <span className="text-green-700 font-bold text-sm">Salon Info</span>
          <div className="flex-1 h-px bg-gray-100 ml-1" />
        </div>
        <div className="divide-y divide-gray-100">
          {salonInfo.map(item => (
            <ProfileFieldCard
              key={item.keys}
              keys={item.keys}
              value={item.value}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

      {/* ── Owner Details ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <span className="text-green-700 font-bold text-sm">Owner Details</span>
          <div className="flex-1 h-px bg-gray-100 ml-1" />
        </div>
        <div className="divide-y divide-gray-100">
          {ownerInfo.map(item => (
            <ProfileFieldCard
              key={item.keys}
              keys={item.keys}
              value={item.value}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

      {/* ── Opening Hours ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <span className="text-green-700 font-bold text-sm">Opening Hours</span>
          <div className="flex-1 h-px bg-gray-100 ml-1" />
        </div>
        <div className="divide-y divide-gray-100">
          {hoursInfo.map(item => (
            <ProfileFieldCard
              key={item.keys}
              keys={item.keys}
              value={item.value}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

function Profile() {
  const [activeTab, setActiveTab] = useState('services')
  const [followed, setFollowed] = useState(false)

  const stats = [
    { label: 'Services', value: '24' },
    { label: 'Reviews',  value: '4.9★' },
    { label: 'Clients',  value: '1.2K' },
  ]

  const services = [
    { name: 'Classic Haircut',  duration: '30 min', price: '$25', tag: 'Popular' },
    { name: 'Hair Coloring',    duration: '90 min', price: '$80', tag: 'Premium' },
    { name: 'Facial Treatment', duration: '60 min', price: '$55', tag: null },
    { name: 'Shaving & Trim',   duration: '45 min', price: '$35', tag: null },
  ]

  const tabs = ['services', 'details', 'gallery', 'reviews']

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter,system-ui]">

      {/* ── Top Nav ── */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="#111" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="text-sm font-semibold text-gray-900">Salon Profile</span>
        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5"  r="1.5" fill="#111"/>
            <circle cx="12" cy="12" r="1.5" fill="#111"/>
            <circle cx="12" cy="19" r="1.5" fill="#111"/>
          </svg>
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-10">

        {/* ── Hero ── */}
        <div className="relative mt-0 -mx-4">
          <div className="w-full h-64 bg-gradient-to-br from-green-800 to-emerald-600 overflow-hidden">
            <img
              className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
              src=""
              alt="Nika Salon"
              onError={e => { e.target.style.display = 'none' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-1.5">
              ✦ Verified Salon
            </span>
            <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow">Nika Salon</h1>
            <p className="text-sm text-white/70 mt-0.5">📍 Phnom Penh, Cambodia</p>
          </div>
          <div className="absolute -bottom-6 right-5 w-14 h-14 rounded-2xl bg-white shadow-lg border-2 border-white flex items-center justify-center text-2xl">
            ✂️
          </div>
        </div>

        <div className="mt-10" />

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm py-3 text-center">
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Bio ── */}
        <div className="mt-4 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            Premium hair & beauty salon with 5+ years of experience. Specializing in cuts, coloring, facials and more. Walk-ins welcome!
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Hair Care', 'Coloring', 'Facial', 'Shaving'].map(tag => (
              <span key={tag} className="text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setFollowed(!followed)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all
              ${followed
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-green-700 text-white hover:bg-green-800 shadow-sm shadow-green-700/20'}`}
          >
            {followed ? '✓ Following' : '+ Follow'}
          </button>
          <button className="flex-1 py-2.5 text-sm font-semibold bg-white border border-gray-200 text-gray-800 rounded-xl hover:bg-gray-50 transition shadow-sm">
            Book Now
          </button>
          <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="18" cy="5"  r="2.5" stroke="currentColor" strokeWidth="1.75"/>
              <circle cx="6"  cy="12" r="2.5" stroke="currentColor" strokeWidth="1.75"/>
              <circle cx="18" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.75"/>
              <path d="M8.5 10.5l7-4M8.5 13.5l7 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="mt-6 flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition
                ${activeTab === tab
                  ? 'border-b-2 border-green-700 text-green-700 -mb-px'
                  : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Tab: Services ── */}
        {activeTab === 'services' && (
          <div className="mt-4 flex flex-col gap-3">
            {services.map(s => (
              <div key={s.name} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                    {s.tag && (
                      <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {s.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">⏱ {s.duration}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-green-700">{s.price}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Tab: Details ── */}
        {activeTab === 'details' && <SalonDetails />}

        {/* ── Tab: Gallery ── */}
        {activeTab === 'gallery' && (
          <div className="mt-4 grid grid-cols-3 gap-1.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gradient-to-br from-gray-200 to-gray-100 rounded-lg hover:opacity-80 transition cursor-pointer" />
            ))}
          </div>
        )}

        {/* ── Tab: Reviews ── */}
        {activeTab === 'reviews' && (
          <div className="mt-4 flex flex-col gap-3">
            {[
              { name: 'Sophea K.', rating: 5, text: 'Amazing haircut! Very clean and professional.', date: '2 days ago' },
              { name: 'Dara M.',   rating: 5, text: 'Best salon in Phnom Penh. Will come back!',     date: '1 week ago' },
              { name: 'Lina T.',   rating: 4, text: 'Great service, friendly staff.',                date: '2 weeks ago' },
            ].map(r => (
              <div key={r.name} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                      <p className="text-[10px] text-gray-400">{r.date}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-yellow-500">{'★'.repeat(r.rating)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Profile