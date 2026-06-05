'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, Truck, AlertCircle, Filter } from 'lucide-react';

interface HouseholdDetails { district: string; sector: string; }

const allSchedules = [
  { id: 1, date: 'Wed, Dec 4, 2025', time: '08:00 AM', location: 'Gasabo District', sector: 'Kinyinya', status: 'Scheduled', type: 'General Waste' },
  { id: 2, date: 'Wed, Dec 11, 2025', time: '08:00 AM', location: 'Gasabo District', sector: 'Remera', status: 'Scheduled', type: 'Recyclables' },
  { id: 3, date: 'Wed, Nov 27, 2025', time: '08:00 AM', location: 'Gasabo District', sector: 'Kinyinya', status: 'Completed', type: 'General Waste' },
  { id: 4, date: 'Wed, Nov 20, 2025', time: '08:00 AM', location: 'Gasabo District', sector: 'Remera', status: 'Completed', type: 'Organic Waste' },
  { id: 5, date: 'Wed, Nov 13, 2025', time: '08:00 AM', location: 'Gasabo District', sector: 'Kinyinya', status: 'Missed', type: 'Recyclables' },
  { id: 6, date: 'Wed, Dec 18, 2025', time: '08:00 AM', location: 'Gasabo District', sector: 'Kinyinya', status: 'Scheduled', type: 'Organic Waste' },
];

const statusStyle: Record<string, string> = {
  Scheduled: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Missed: 'bg-red-100 text-red-700',
  Pending: 'bg-yellow-100 text-yellow-700',
};

const typeColor: Record<string, string> = {
  'General Waste': 'bg-gray-100 text-gray-700',
  'Recyclables': 'bg-blue-50 text-blue-700',
  'Organic Waste': 'bg-green-50 text-green-700',
};

export default function SchedulePage() {
  const [filter, setFilter] = useState('All');
  const [household, setHousehold] = useState<HouseholdDetails | null>(null);

  useEffect(() => {
    try {
      const h = localStorage.getItem('household_details');
      if (h) setHousehold(JSON.parse(h));
    } catch { /* silent */ }
  }, []);

  const zone = household?.district || 'Gasabo';
  const upcoming = allSchedules.filter(s => s.status === 'Scheduled');
  const completed = allSchedules.filter(s => s.status === 'Completed').length;
  const missed = allSchedules.filter(s => s.status === 'Missed').length;
  const next = upcoming[0];

  const filtered = filter === 'All' ? allSchedules : allSchedules.filter(s => s.status === filter);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Collection Schedule</h1>
        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
          <MapPin size={13} /> {zone} District
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Upcoming', value: upcoming.length, icon: <Calendar size={16} className="text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Completed', value: completed, icon: <CheckCircle size={16} className="text-green-600" />, bg: 'bg-green-50' },
          { label: 'Missed', value: missed, icon: <AlertCircle size={16} className="text-red-500" />, bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Next collection highlight */}
      {next && (
        <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={18} className="text-green-300" />
            <p className="text-sm font-semibold text-green-200">Next Collection</p>
          </div>
          <p className="text-2xl font-bold">{next.date}</p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-green-200">
            <span className="flex items-center gap-1"><Clock size={13} /> {next.time}</span>
            <span className="flex items-center gap-1"><MapPin size={13} /> {next.sector}, {next.location}</span>
            <span className="flex items-center gap-1"><Truck size={13} /> {next.type}</span>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={15} className="text-gray-400" />
        {['All', 'Scheduled', 'Completed', 'Missed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${filter === f ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Schedule list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Calendar size={36} className="mx-auto mb-2 opacity-30" />
              <p>No {filter.toLowerCase()} collections.</p>
            </div>
          ) : (
            filtered.map(s => (
              <div key={s.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.status === 'Completed' ? 'bg-green-100' : s.status === 'Missed' ? 'bg-red-100' : 'bg-blue-100'}`}>
                    <Truck size={18} className={s.status === 'Completed' ? 'text-green-600' : s.status === 'Missed' ? 'text-red-500' : 'text-blue-600'} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{s.date}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={11} />{s.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} />{s.sector}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[s.status]}`}>{s.status}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor[s.type] || 'bg-gray-100 text-gray-600'}`}>{s.type}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
