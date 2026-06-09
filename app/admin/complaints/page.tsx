'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Eye, X, MessageSquare, AlertCircle, Clock, CheckCircle, Loader2 } from 'lucide-react';
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

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<BackendComplaint[]>([]);
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

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.complaints.all();
      setComplaints(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const filtered = complaints.filter((c) =>
    (filterStatus === 'All' || c.status === filterStatus) &&
    (filterPriority === 'All' || c.priority === filterPriority) &&
    (
      (c.full_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      c.issue_type.toLowerCase().includes(search.toLowerCase())
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
      setComplaints((prev) => prev.map((c) => c.id === selected.id ? res.complaint : c));
      setModal(null);
      setResolveNote('');
      setAssignTo('');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update complaint.');
    } finally {
      setSaving(false);
    }
  };

  const stats = [
    { label: 'Total', value: complaints.length, icon: <MessageSquare size={18} className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Pending', value: complaints.filter((c) => c.status === 'Pending').length, icon: <Clock size={18} className="text-yellow-600" />, bg: 'bg-yellow-50' },
    { label: 'In Progress', value: complaints.filter((c) => c.status === 'In Progress').length, icon: <AlertCircle size={18} className="text-orange-600" />, bg: 'bg-orange-50' },
    { label: 'Resolved', value: complaints.filter((c) => c.status === 'Resolved').length, icon: <CheckCircle size={18} className="text-green-600" />, bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search complaints..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-56"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {['All', 'Pending', 'In Progress', 'Resolved'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {['All', 'Urgent', 'High', 'Medium', 'Low'].map((p) => <option key={p}>{p}</option>)}
        </select>
        <button onClick={loadComplaints} className="ml-auto text-sm text-gray-500 hover:text-green-700 underline">
          Refresh
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={32} className="animate-spin text-green-600" />
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <AlertCircle size={36} className="mx-auto mb-3 text-red-400" />
          <p className="text-red-600 text-sm mb-3">{error}</p>
          <button onClick={loadComplaints} className="text-sm text-green-700 underline">Try again</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-gray-400">#{c.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityStyle[c.priority] ?? ''}`}>{c.priority}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyle[c.status] ?? ''}`}>{c.status}</span>
                  </div>
                  <p className="font-bold text-gray-800">{c.issue_type}</p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {c.full_name ?? 'Unknown'} • {c.zone ?? 'N/A'} • {formatDate(c.created_at)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{c.description}</p>
                  {c.assigned_to && (
                    <p className="text-xs text-green-700 mt-1">Assigned to: {c.assigned_to}</p>
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
                      onClick={() => { setSelected(c); setAssignTo(c.assigned_to ?? ''); setResolveNote(''); setSaveError(''); setModal('manage'); }}
                      className="px-3 py-1.5 text-green-700 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-50 transition flex items-center gap-1"
                    >
                      <CheckCircle size={13} /> Manage
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center text-gray-400 shadow-sm border border-gray-100">
              <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
              <p>No complaints found.</p>
            </div>
          )}
        </div>
      )}

      {/* View Modal */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-800">Complaint Details</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-3">
              {([
                ['ID', `#${selected.id}`],
                ['Household', selected.full_name ?? '—'],
                ['Phone', selected.telephone ?? '—'],
                ['Zone', selected.zone ?? '—'],
                ['Issue', selected.issue_type],
                ['Date', formatDate(selected.created_at)],
                ['Assigned To', selected.assigned_to ?? 'Unassigned'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-800">{v}</span>
                </div>
              ))}
              <div>
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-800 bg-gray-50 rounded-lg p-3">{selected.description}</p>
              </div>
              {selected.resolution_note && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Resolution Note</p>
                  <p className="text-sm text-gray-800 bg-green-50 rounded-lg p-3">{selected.resolution_note}</p>
                </div>
              )}
              <div className="flex gap-3">
                <div className="flex-1 text-center">
                  <p className="text-xs text-gray-500 mb-1">Priority</p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${priorityStyle[selected.priority] ?? ''}`}>{selected.priority}</span>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[selected.status] ?? ''}`}>{selected.status}</span>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6">
              <button onClick={() => setModal(null)} className="w-full py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Modal */}
      {modal === 'manage' && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-800">Manage Complaint</h3>
              <button onClick={() => setModal(null)} disabled={saving}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-medium text-gray-800 text-sm">{selected.issue_type}</p>
                <p className="text-xs text-gray-500">{selected.full_name ?? '—'} • {selected.zone ?? 'N/A'}</p>
              </div>

              {saveError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-xl">
                  {saveError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Assign To</label>
                <input
                  value={assignTo}
                  onChange={(e) => setAssignTo(e.target.value)}
                  placeholder="Driver or staff name"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Resolution Note</label>
                <textarea
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                  rows={3}
                  placeholder="Add a note..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => updateStatus('In Progress')}
                  disabled={saving}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                  Mark In Progress
                </button>
                <button
                  onClick={() => updateStatus('Resolved')}
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
