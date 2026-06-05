'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, CheckCircle, Clock, Truck, AlertCircle, Filter, Leaf, TrendingUp } from 'lucide-react';

const collections = [
  { id: 1, date: 'Wed, Jan 10, 2025', time: '08:30 AM', location: 'Kinyinya Sector', district: 'Gasabo', status: 'Completed', type: 'General Waste', weight: '15 kg' },
  { id: 2, date: 'Wed, Jan 8, 2025', time: '09:15 AM', location: 'Remera Sector', district: 'Gasabo', status: 'Completed', type: 'Recyclables', weight: '12 kg' },
  { id: 3, date: 'Wed, Jan 5, 2025', time: '10:00 AM', location: 'Kinyinya Sector', district: 'Gasabo', status: 'Completed', type: 'Organic Waste', weight: '18 kg' },
  { id: 4, date: 'Wed, Jan 3, 2025', time: '08:00 AM', location: 'Remera Sector', district: 'Gasabo', status: 'Missed', type: 'General Waste', weight: '0 kg' },
  { id: 5, date: 'Wed, Dec 27, 2024', time: '08:30 AM', location: 'Kinyinya Sector', district: 'Gasabo', status: 'Completed', type: 'Recyclables', weight: '10 kg' },
  { id: 6, date: 'Wed, Dec 20, 2024', time: '08:00 AM', location: 'Kinyinya Sector', district: 'Gasabo', status: 'Completed', type: 'General Waste', weight: '20 kg' },
];

const statusStyle: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  Missed: 'bg-red-100 text-red-700',
};

const typeColor: Record<string, string> = {
  'General Waste': 'bg-gray-100 text-gray-700',
  'Recyclables': 'bg-blue-50 text-blue-700',
  'Organic Waste': 'bg-green-50 text-green-700',
};

export default function HistoryPage() {
  const [filter, setFilter] = useState('All');

  const completed = collections.filter(c => c.status === 'Completed');
  const missed = collections.filter(c => c.status === 'Missed').length;
  const totalWeight = completed.reduce((acc, c) => acc + parseInt(c.weight), 0);
  const filtered = filter === 'All' ? collections : collections.filter(c => c.status === filter);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Collection History</h1>
        <p className="text-gray-500 text-sm mt-1">Your past waste collection records</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Collections', value: collections.length, icon: <Truck size={16} className="text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Completed', value: completed.length, icon: <CheckCircle size={16} className="text-green-600" />, bg: 'bg-green-50' },
          { label: 'Missed', value: missed, icon: <AlertCircle size={16} className="text-red-500" />, bg: 'bg-red-50' },
          { label: 'Total Waste', value: `${totalWeight} kg`, icon: <Leaf size={16} className="text-teal-600" />, bg: 'bg-teal-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Impact banner */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-2xl p-5 text-white flex items-center gap-4">
        <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
          <TrendingUp size={22} className="text-green-200" />
        </div>
        <div>
          <p className="font-bold text-lg">{totalWeight} kg collected</p>
          <p className="text-green-200 text-sm">Great contribution to Kigali's waste management this year!</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={15} className="text-gray-400" />
        {['All', 'Completed', 'Missed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${filter === f ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Collection list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Calendar size={36} className="mx-auto mb-2 opacity-30" />
              <p>No {filter.toLowerCase()} collections found.</p>
            </div>
          ) : (
            filtered.map(c => (
              <div key={c.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.status === 'Completed' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <Truck size={18} className={c.status === 'Completed' ? 'text-green-600' : 'text-red-500'} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{c.date}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={11} />{c.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} />{c.location}</span>
                      {c.status === 'Completed' && <span className="font-medium text-gray-600">{c.weight}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[c.status]}`}>{c.status}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor[c.type] || 'bg-gray-100 text-gray-600'}`}>{c.type}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
