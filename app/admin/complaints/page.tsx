'use client';

import React, { useState } from 'react';
import { Search, Eye, X, MessageSquare, AlertCircle, Clock, CheckCircle, Filter } from 'lucide-react';

interface Complaint {
  id: string;
  household: string;
  phone: string;
  zone: string;
  issue: string;
  description: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Resolved';
  date: string;
  assignedTo: string;
}

const initialComplaints: Complaint[] = [
  { id: 'C-001', household: 'Uwimana Marie', phone: '+250 788 001 001', zone: 'Kicukiro', issue: 'Missed Collection', description: 'Waste collection was scheduled for Monday but truck did not arrive.', priority: 'Urgent', status: 'Pending', date: 'Jan 15, 2025', assignedTo: 'Unassigned' },
  { id: 'C-002', household: 'Habimana Jean', phone: '+250 788 002 002', zone: 'Gasabo', issue: 'Damaged Bin', description: 'My waste bin was damaged during last collection. Need replacement.', priority: 'High', status: 'In Progress', date: 'Jan 14, 2025', assignedTo: 'Nkurunziza Pierre' },
  { id: 'C-003', household: 'Mukamana Alice', phone: '+250 788 003 003', zone: 'Nyarugenge', issue: 'Late Collection', description: 'Collection arrived 3 hours late causing inconvenience.', priority: 'Medium', status: 'Pending', date: 'Jan 13, 2025', assignedTo: 'Unassigned' },
  { id: 'C-004', household: 'Niyonzima Paul', phone: '+250 788 004 004', zone: 'Kicukiro', issue: 'Billing Issue', description: 'Charged twice for December payment. Need refund.', priority: 'Low', status: 'Resolved', date: 'Jan 12, 2025', assignedTo: 'Admin' },
  { id: 'C-005', household: 'Ingabire Grace', phone: '+250 788 005 005', zone: 'Gasabo', issue: 'Incomplete Collection', description: 'Some waste was left behind during last pickup.', priority: 'High', status: 'In Progress', date: 'Jan 11, 2025', assignedTo: 'Uwase Claudine' },
  { id: 'C-006', household: 'Bizimana Eric', phone: '+250 788 006 006', zone: 'Remera', issue: 'Missed Collection', description: 'No collection for 2 weeks in our area.', priority: 'Urgent', status: 'Pending', date: 'Jan 10, 2025', assignedTo: 'Unassigned' },
];

const priorityStyle: Record<string, string> = { Urgent: 'bg-red-100 text-red-700', High: 'bg-orange-100 text-orange-700', Medium: 'bg-yellow-100 text-yellow-700', Low: 'bg-green-100 text-green-700' };
const statusStyle: Record<string, string> = { Pending: 'bg-yellow-100 text-yellow-700', 'In Progress': 'bg-blue-100 text-blue-700', Resolved: 'bg-green-100 text-green-700' };

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [modal, setModal] = useState<'view' | 'resolve' | null>(null);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [resolveNote, setResolveNote] = useState('');
  const [assignTo, setAssignTo] = useState('');

  const filtered = complaints.filter(c =>
    (filterStatus === 'All' || c.status === filterStatus) &&
    (filterPriority === 'All' || c.priority === filterPriority) &&
    (c.household.toLowerCase().includes(search.toLowerCase()) || c.issue.toLowerCase().includes(search.toLowerCase()))
  );

  const updateStatus = (id: string, status: Complaint['status'], assignedTo?: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status, assignedTo: assignedTo ?? c.assignedTo } : c));
    setModal(null);
    setResolveNote('');
  };

  const stats = [
    { label: 'Total', value: complaints.length, icon: <MessageSquare size={18} className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Pending', value: complaints.filter(c => c.status === 'Pending').length, icon: <Clock size={18} className="text-yellow-600" />, bg: 'bg-yellow-50' },
    { label: 'In Progress', value: complaints.filter(c => c.status === 'In Progress').length, icon: <AlertCircle size={18} className="text-orange-600" />, bg: 'bg-orange-50' },
    { label: 'Resolved', value: complaints.filter(c => c.status === 'Resolved').length, icon: <CheckCircle size={18} className="text-green-600" />, bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">{s.icon}</div>
            <div><p className="text-xs text-gray-500">{s.label}</p><p className="font-bold text-gray-800 text-lg">{s.value}</p></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search complaints..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-56" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
          {['All', 'Pending', 'In Progress', 'Resolved'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
          {['All', 'Urgent', 'High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-gray-400">{c.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityStyle[c.priority]}`}>{c.priority}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyle[c.status]}`}>{c.status}</span>
                </div>
                <p className="font-bold text-gray-800">{c.issue}</p>
                <p className="text-sm text-gray-600 mt-0.5">{c.household} • {c.zone} • {c.date}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{c.description}</p>
                {c.assignedTo !== 'Unassigned' && (
                  <p className="text-xs text-green-700 mt-1">Assigned to: {c.assignedTo}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button onClick={() => { setSelected(c); setModal('view'); }} className="px-3 py-1.5 text-blue-600 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-50 transition flex items-center gap-1">
                  <Eye size={13} /> View
                </button>
                {c.status !== 'Resolved' && (
                  <button onClick={() => { setSelected(c); setAssignTo(c.assignedTo); setModal('resolve'); }} className="px-3 py-1.5 text-green-700 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-50 transition flex items-center gap-1">
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

      {modal === 'view' && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-800">Complaint Details</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-3">
              {[['ID', selected.id], ['Household', selected.household], ['Phone', selected.phone], ['Zone', selected.zone], ['Issue', selected.issue], ['Date', selected.date], ['Assigned To', selected.assignedTo]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm"><span className="text-gray-500">{k}</span><span className="font-medium text-gray-800">{v}</span></div>
              ))}
              <div>
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-800 bg-gray-50 rounded-lg p-3">{selected.description}</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 text-center">
                  <p className="text-xs text-gray-500 mb-1">Priority</p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${priorityStyle[selected.priority]}`}>{selected.priority}</span>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[selected.status]}`}>{selected.status}</span>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6"><button onClick={() => setModal(null)} className="w-full py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">Close</button></div>
          </div>
        </div>
      )}

      {modal === 'resolve' && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-800">Manage Complaint</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-medium text-gray-800 text-sm">{selected.issue}</p>
                <p className="text-xs text-gray-500">{selected.household} • {selected.zone}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Assign To</label>
                <input value={assignTo} onChange={e => setAssignTo(e.target.value)} placeholder="Driver or staff name" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Resolution Note</label>
                <textarea value={resolveNote} onChange={e => setResolveNote(e.target.value)} rows={3} placeholder="Add a note..." className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => updateStatus(selected.id, 'In Progress', assignTo)} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition">Mark In Progress</button>
                <button onClick={() => updateStatus(selected.id, 'Resolved', assignTo)} className="flex-1 py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">Mark Resolved</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
