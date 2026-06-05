'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Clock, Truck, CheckCircle, Circle, ArrowRight } from 'lucide-react';

interface HouseholdDetails { district: string; sector: string; cell: string; streetAddress: string; }

const routeStops = [
  { id: 1, name: 'Kinyinya Sector Start', time: '08:00 AM', status: 'completed' },
  { id: 2, name: 'Gacuriro Cell', time: '08:20 AM', status: 'completed' },
  { id: 3, name: 'Kagugu Cell', time: '08:40 AM', status: 'active' },
  { id: 4, name: 'Murama Cell', time: '09:00 AM', status: 'pending' },
  { id: 5, name: 'Remera Sector', time: '09:30 AM', status: 'pending' },
  { id: 6, name: 'Gasagara Cell', time: '09:50 AM', status: 'pending' },
];

export default function RoutePage() {
  const [household, setHousehold] = useState<HouseholdDetails | null>(null);

  useEffect(() => {
    try {
      const h = localStorage.getItem('household_details');
      if (h) setHousehold(JSON.parse(h));
    } catch { /* silent */ }
  }, []);

  const zone = household?.district || 'Gasabo';
  const userSector = household?.sector || 'Kinyinya';
  const completed = routeStops.filter(s => s.status === 'completed').length;
  const total = routeStops.length;
  const progress = Math.round((completed / total) * 100);
  const activeStop = routeStops.find(s => s.status === 'active');
  const nextStop = routeStops.find(s => s.status === 'pending');

  const stopStyle: Record<string, string> = {
    completed: 'text-green-600',
    active: 'text-blue-600',
    pending: 'text-gray-400',
  };

  const stopBg: Record<string, string> = {
    completed: 'bg-green-100',
    active: 'bg-blue-100',
    pending: 'bg-gray-100',
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Collection Route</h1>
        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
          <MapPin size={13} /> {zone} District · {userSector} Sector
        </p>
      </div>

      {/* Active route card */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2.5 h-2.5 bg-green-300 rounded-full animate-pulse" />
          <p className="text-sm font-semibold text-green-200">Route In Progress</p>
        </div>
        <h2 className="text-xl font-bold">Route A – {zone}</h2>
        <p className="text-green-200 text-sm mt-1">Wednesday collection · Dec 4, 2025</p>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Stops Done', value: `${completed}/${total}` },
            { label: 'Progress', value: `${progress}%` },
            { label: 'ETA', value: '2:30 PM' },
          ].map(m => (
            <div key={m.label} className="bg-white/15 rounded-xl p-3 text-center">
              <p className="font-bold text-lg">{m.value}</p>
              <p className="text-green-300 text-xs">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-green-300 mb-1.5">
            <span>Route Progress</span><span>{progress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5">
            <div className="bg-white h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Current & next stop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <Truck size={12} /> Current Stop
          </p>
          <p className="font-bold text-gray-800">{activeStop?.name || '—'}</p>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Clock size={13} />{activeStop?.time}</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
            <Navigation size={12} /> Next Stop
          </p>
          <p className="font-bold text-gray-800">{nextStop?.name || 'Final stop'}</p>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Clock size={13} />{nextStop?.time || '—'}</p>
        </div>
      </div>

      {/* Your stop highlight */}
      <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <MapPin size={18} className="text-green-700" />
        </div>
        <div>
          <p className="font-bold text-green-800 text-sm">Your Pickup Location</p>
          <p className="text-xs text-green-700 mt-0.5">{household?.streetAddress || 'Your registered address'} · {userSector} Sector</p>
          <p className="text-xs text-green-600 mt-0.5">Estimated arrival: <strong>08:40 AM – 09:00 AM</strong></p>
        </div>
      </div>

      {/* Route stops timeline */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Navigation size={17} className="text-green-600" /> Route Stops
        </h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />
          <div className="space-y-3">
            {routeStops.map((stop, i) => (
              <div key={stop.id} className="flex items-center gap-4 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${stopBg[stop.status]}`}>
                  {stop.status === 'completed'
                    ? <CheckCircle size={18} className="text-green-600" />
                    : stop.status === 'active'
                    ? <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
                    : <Circle size={18} className="text-gray-300" />
                  }
                </div>
                <div className="flex-1 flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className={`text-sm font-semibold ${stop.status === 'pending' ? 'text-gray-400' : 'text-gray-800'}`}>
                      {stop.name}
                      {stop.status === 'active' && <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">In Progress</span>}
                    </p>
                  </div>
                  <p className={`text-xs font-medium ${stopStyle[stop.status]}`}>{stop.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
