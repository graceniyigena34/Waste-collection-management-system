'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, Truck, AlertCircle, Filter, RefreshCw, User } from 'lucide-react';
import { api, BackendCompanySchedule } from '@/lib/api-client';

const statusStyle: Record<string, string> = {
  Scheduled: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const typeColor: Record<string, string> = {
  'General Waste': 'bg-gray-100 text-gray-700',
  'Recyclables': 'bg-blue-50 text-blue-700',
  'Organic Waste': 'bg-green-50 text-green-700',
  'Hazardous': 'bg-orange-50 text-orange-700',
};

const FILTERS = ['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'];

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<BackendCompanySchedule[]>([]);
  const [district, setDistrict] = useState('');
  const [sector, setSector] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.companySchedules.forCitizen();
      setSchedules(res.schedules);
      setDistrict(res.district);
      setSector(res.sector);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load schedules.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const upcoming = schedules.filter(s => s.status === 'Scheduled' || s.status === 'In Progress');
  const completed = schedules.filter(s => s.status === 'Completed').length;
  const cancelled = schedules.filter(s => s.status === 'Cancelled').length;
  const next = upcoming[0];

  const filtered = filter === 'All' ? schedules : schedules.filter(s => s.status === filter);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collection Schedule</h1>
          {district && (
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
              <MapPin size={13} /> {sector ? `${sector}, ` : ''}{district} District
            </p>
          )}
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-700 transition px-3 py-1.5 rounded-lg hover:bg-green-50 disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Upcoming', value: upcoming.length, icon: <Calendar size={16} className="text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Completed', value: completed, icon: <CheckCircle size={16} className="text-green-600" />, bg: 'bg-green-50' },
          { label: 'Cancelled', value: cancelled, icon: <AlertCircle size={16} className="text-red-500" />, bg: 'bg-red-50' },
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
          <p className="text-2xl font-bold">{formatDate(next.schedule_date)}</p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-green-200">
            {next.start_time && (
              <span className="flex items-center gap-1"><Clock size={13} /> {next.start_time}</span>
            )}
            {next.sector_name && (
              <span className="flex items-center gap-1"><MapPin size={13} /> {next.sector_name}</span>
            )}
            <span className="flex items-center gap-1"><Truck size={13} /> {next.waste_type}</span>
            {next.driver && (
              <span className="flex items-center gap-1"><User size={13} /> {next.driver}</span>
            )}
          </div>
        </div>
      )}

      {/* Loading / error states */}
      {loading && (
        <div className="text-center py-10 text-gray-400">
          <RefreshCw size={28} className="mx-auto mb-2 animate-spin opacity-40" />
          <p className="text-sm">Loading schedules…</p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center text-red-600">
          <AlertCircle size={24} className="mx-auto mb-2 opacity-60" />
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={load}
            className="mt-3 text-xs underline text-red-500 hover:text-red-700"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={15} className="text-gray-400" />
            {FILTERS.map(f => (
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
                  <p className="text-sm">
                    {schedules.length === 0
                      ? 'No schedules have been published for your area yet.'
                      : `No ${filter.toLowerCase()} collections.`}
                  </p>
                </div>
              ) : (
                filtered.map(s => (
                  <div key={s.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        s.status === 'Completed' ? 'bg-green-100'
                        : s.status === 'Cancelled' ? 'bg-red-100'
                        : s.status === 'In Progress' ? 'bg-yellow-100'
                        : 'bg-blue-100'
                      }`}>
                        <Truck size={18} className={
                          s.status === 'Completed' ? 'text-green-600'
                          : s.status === 'Cancelled' ? 'text-red-500'
                          : s.status === 'In Progress' ? 'text-yellow-600'
                          : 'text-blue-600'
                        } />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{formatDate(s.schedule_date)}</p>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                          {s.start_time && <span className="flex items-center gap-1"><Clock size={11} />{s.start_time}</span>}
                          {s.sector_name && <span className="flex items-center gap-1"><MapPin size={11} />{s.sector_name}</span>}
                          {s.driver && <span className="flex items-center gap-1"><User size={11} />{s.driver}</span>}
                        </div>
                        {s.cells && s.cells.length > 0 && (
                          <p className="text-xs text-gray-400 mt-0.5">Cells: {s.cells.join(', ')}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[s.status] || 'bg-gray-100 text-gray-600'}`}>
                        {s.status}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor[s.waste_type] || 'bg-gray-100 text-gray-600'}`}>
                        {s.waste_type}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
