'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search, Eye, X, AlertCircle, Clock, CheckCircle, Loader2,
  PackagePlus, CalendarDays, Trash2,
} from 'lucide-react';
import { api, type BackendComplaint } from '@/lib/api-client';

const priorityStyle: Record<string, string> = {
  Urgent: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};
const statusStyle: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Resolved: 'bg-green-100 text-green-700',
};

function fmt(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function parseDesc(description: string) {
  const lines = description.split('\n');
  return {
    wasteType: lines.find(l => l.startsWith('Waste type:'))?.replace('Waste type: ', '') ?? '',
    prefDate:  lines.find(l => l.startsWith('Preferred date:'))?.replace('Preferred date: ', '') ?? '',
    prefTime:  lines.find(l => l.startsWith('Preferred time:'))?.replace('Preferred time: ', '') ?? '',
    notes:     lines.find(l => l.startsWith('Notes:'))?.replace('Notes: ', '') ?? '',
  };
}

export default function PickupRequestsPage() {
  const [requests, setRequests] = useState<BackendComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const [modal, setModal] = useState<'view' | 'manage' | null>(null);
  const [selected, setSelected] = useState<BackendComplaint | null>(null);
  const [resolveNote, setResolveNote] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.complaints.all();
      setRequests(data.filter(c => c.issue_type === 'Pickup Request'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pickup requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = requests.filter(c =>
    (filterStatus === 'All' || c.status === filterStatus) &&
    (filterPriority === 'All' || c.priority === filterPriority) &&
    (
      (c.full_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (c.zone ?? '').toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    )
  );

  const updateStatus = async (status: BackendComplaint['status']) => {
    if (!selected) return;
    setSaving(true);
    setSaveError('');
    try {
      const res = await api.complaints.updateStatus(selected.id, {
        status,
        assigned_to: assignTo || undefined,
        resolution_note: resolveNote || undefined,
      });
      setRequests(prev => prev.map(c => c.id === selected.id ? res.complaint : c));
      setModal(null);
      setResolveNote('');
      setAssignTo('');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update request.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: BackendComplaint) => {
    setRequests(prev => prev.filter(r => r.id !== c.id));
    try {
      await api.complaints.remove(c.id);
    } catch {
      setRequests(prev => [c, ...prev].sort((a, b) =>
        new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
      ));
    }
  };

  const stats = [
    { label: 'Total',       value: requests.length,                                         icon: <PackagePlus size={18} className="text-amber-600" />,  bg: 'bg-amber-50' },
    { label: 'Pending',     value: requests.filter(c => c.status === 'Pending').length,     icon: <Clock size={18} className="text-yellow-600" />,       bg: 'bg-yellow-50' },
    { label: 'In Progress', value: requests.filter(c => c.status === 'In Progress').length, icon: <AlertCircle size={18} className="text-blue-600" />,   bg: 'bg-blue-50' },
    { label: 'Resolved',    value: requests.filter(c => c.status === 'Resolved').length,    icon: <CheckCircle size={18} className="text-green-600" />,  bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">{s.icon}</div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="font-bold text-gray-800 text-lg">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by citizen, zone, waste type…"
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {['All', 'Pending', 'In Progress', 'Resolved'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {['All', 'Urgent', 'High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
        </select>
        <button onClick={load} className="ml-auto text-sm text-gray-500 hover:text-amber-700 underline">
          Refresh
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={32} className="animate-spin text-amber-600" />
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <AlertCircle size={36} className="mx-auto mb-3 text-red-400" />
          <p className="text-red-600 text-sm mb-3">{error}</p>
          <button onClick={load} className="text-sm text-amber-700 underline">Try again</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => {
            const { wasteType, prefDate, prefTime, notes } = parseDesc(c.description);
            return (
              <div key={c.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-mono text-xs text-gray-400">#{c.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityStyle[c.priority] ?? ''}`}>{c.priority}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyle[c.status] ?? ''}`}>{c.status}</span>
                      {wasteType && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">{wasteType}</span>
                      )}
                    </div>

                    {/* Citizen */}
                    <p className="font-bold text-gray-900">{c.full_name ?? 'Unknown citizen'}</p>
                    <p className="text-sm text-gray-500">{c.zone ?? 'N/A'} • {fmt(c.created_at)}</p>

                    {/* Pickup details */}
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                      {prefDate && (
                        <span className="flex items-center gap-1">
                          <CalendarDays size={12} className="text-amber-500" /> Preferred: {prefDate}
                          {prefTime && ` · ${prefTime}`}
                        </span>
                      )}
                    </div>

                    {notes && (
                      <p className="text-xs text-gray-500 mt-1 italic">"{notes}"</p>
                    )}

                    {c.assigned_to && (
                      <p className="text-xs text-green-700 mt-1">Assigned to: {c.assigned_to}</p>
                    )}
                    {c.resolution_note && (
                      <p className="text-xs text-blue-700 mt-1 bg-blue-50 rounded px-2 py-1 inline-block">Note: {c.resolution_note}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => { setSelected(c); setModal('view'); }}
                      className="px-3 py-1.5 text-blue-600 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-50 transition flex items-center gap-1"
                    >
                      <Eye size={13} /> View
                    </button>
                    {c.status !== 'Resolved' && (
                      <button
                        onClick={() => { setSelected(c); setAssignTo(c.assigned_to ?? ''); setResolveNote(c.resolution_note ?? ''); setSaveError(''); setModal('manage'); }}
                        className="px-3 py-1.5 text-amber-700 border border-amber-200 rounded-lg text-xs font-medium hover:bg-amber-50 transition flex items-center gap-1"
                      >
                        <CheckCircle size={13} /> Manage
                      </button>
                    )}
                    <button
                      onClick={() => void handleDelete(c)}
                      className="px-3 py-1.5 text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-50 transition flex items-center gap-1"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && !loading && (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">
              <PackagePlus size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium text-gray-500">No pickup requests found</p>
              <p className="text-sm mt-1">Citizens haven&apos;t submitted any pickup requests yet, or none match your filters.</p>
            </div>
          )}
        </div>
      )}

      {/* View Modal */}
      {modal === 'view' && selected && (() => {
        const { wasteType, prefDate, prefTime, notes } = parseDesc(selected.description);
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <PackagePlus size={18} className="text-amber-600" /> Pickup Request Details
                </h3>
                <button onClick={() => setModal(null)}><X size={20} className="text-gray-400" /></button>
              </div>
              <div className="p-6 space-y-3">
                {([
                  ['ID',          `#${selected.id}`],
                  ['Citizen',     selected.full_name ?? '—'],
                  ['Phone',       selected.telephone ?? '—'],
                  ['Zone',        selected.zone ?? '—'],
                  ['Waste Type',  wasteType || '—'],
                  ['Pref. Date',  prefDate || '—'],
                  ['Pref. Time',  prefTime || 'Any time'],
                  ['Priority',    selected.priority],
                  ['Status',      selected.status],
                  ['Assigned To', selected.assigned_to ?? 'Unassigned'],
                  ['Submitted',   fmt(selected.created_at)],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-gray-500">{k}</span>
                    <span className="font-medium text-gray-800 text-right">{v}</span>
                  </div>
                ))}
                {notes && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Citizen Notes</p>
                    <p className="text-sm text-gray-800 bg-amber-50 rounded-lg p-3 italic">"{notes}"</p>
                  </div>
                )}
                {selected.resolution_note && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Resolution Note</p>
                    <p className="text-sm text-gray-800 bg-green-50 rounded-lg p-3">{selected.resolution_note}</p>
                  </div>
                )}
              </div>
              <div className="px-6 pb-6">
                <button onClick={() => setModal(null)} className="w-full py-2 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Manage Modal */}
      {modal === 'manage' && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-800">Manage Pickup Request</h3>
              <button onClick={() => setModal(null)} disabled={saving}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="font-medium text-gray-800 text-sm">{selected.full_name ?? '—'}</p>
                <p className="text-xs text-gray-500">{selected.zone ?? 'N/A'} • {parseDesc(selected.description).wasteType || 'Pickup Request'}</p>
                {parseDesc(selected.description).prefDate && (
                  <p className="text-xs text-amber-700 mt-1">
                    Preferred: {parseDesc(selected.description).prefDate}
                    {parseDesc(selected.description).prefTime && ` · ${parseDesc(selected.description).prefTime}`}
                  </p>
                )}
              </div>

              {saveError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-xl">
                  {saveError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Assign To (driver / company)</label>
                <input
                  value={assignTo}
                  onChange={e => setAssignTo(e.target.value)}
                  placeholder="Driver or company name"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Response / Resolution Note</label>
                <textarea
                  value={resolveNote}
                  onChange={e => setResolveNote(e.target.value)}
                  rows={3}
                  placeholder="e.g. Collection confirmed for requested date..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => void updateStatus('In Progress')}
                  disabled={saving}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                  In Progress
                </button>
                <button
                  onClick={() => void updateStatus('Resolved')}
                  disabled={saving}
                  className="flex-1 py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
