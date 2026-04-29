'use client';

import React, { useState } from 'react';
import { Search, Eye, X, CheckCircle, XCircle, Clock, Building2, Phone, Mail, MapPin, FileText, AlertCircle } from 'lucide-react';

type AppStatus = 'Pending' | 'Approved' | 'Rejected';

interface Application {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  zone: string;
  fleetSize: number;
  licenseNo: string;
  experience: string;
  description: string;
  status: AppStatus;
  appliedDate: string;
  reviewNote?: string;
}

const initialApplications: Application[] = [
  {
    id: 'APP-001',
    companyName: 'EcoClean Rwanda Ltd',
    contactPerson: 'Mugisha Emmanuel',
    email: 'info@ecoclean.rw',
    phone: '+250 788 200 001',
    address: 'KG 45 St, Kicukiro',
    zone: 'Kicukiro',
    fleetSize: 5,
    licenseNo: 'RDB-2024-001',
    experience: '3 years',
    description: 'We are a registered waste collection company with 3 years of experience serving Kicukiro district.',
    status: 'Pending',
    appliedDate: 'Jan 10, 2025',
  },
  {
    id: 'APP-002',
    companyName: 'GreenWaste Solutions',
    contactPerson: 'Uwimana Solange',
    email: 'contact@greenwaste.rw',
    phone: '+250 788 200 002',
    address: 'KN 12 Ave, Gasabo',
    zone: 'Gasabo',
    fleetSize: 8,
    licenseNo: 'RDB-2024-002',
    experience: '5 years',
    description: 'Specialized in organic and recyclable waste collection across Gasabo district with certified staff.',
    status: 'Pending',
    appliedDate: 'Jan 12, 2025',
  },
  {
    id: 'APP-003',
    companyName: 'CleanCity Corp',
    contactPerson: 'Habimana Patrick',
    email: 'hello@cleancity.rw',
    phone: '+250 788 200 003',
    address: 'KK 8 Rd, Nyarugenge',
    zone: 'Nyarugenge',
    fleetSize: 3,
    licenseNo: 'RDB-2023-015',
    experience: '2 years',
    description: 'Small but efficient waste collection company focused on Nyarugenge sector.',
    status: 'Approved',
    appliedDate: 'Dec 5, 2024',
    reviewNote: 'All documents verified. License valid.',
  },
  {
    id: 'APP-004',
    companyName: 'WasteAway Ltd',
    contactPerson: 'Niyonzima Jules',
    email: 'wasteaway@gmail.com',
    phone: '+250 788 200 004',
    address: 'KG 99 St, Remera',
    zone: 'Remera',
    fleetSize: 2,
    licenseNo: 'INVALID-000',
    experience: '6 months',
    description: 'New company looking to expand into waste collection services.',
    status: 'Rejected',
    appliedDate: 'Dec 20, 2024',
    reviewNote: 'License number invalid. Insufficient experience.',
  },
];

const statusStyle: Record<AppStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

const statusIcon: Record<AppStatus, React.ReactNode> = {
  Pending: <Clock size={14} />,
  Approved: <CheckCircle size={14} />,
  Rejected: <XCircle size={14} />,
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | AppStatus>('All');
  const [selected, setSelected] = useState<Application | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [modal, setModal] = useState<'view' | 'review' | null>(null);

  const filtered = applications.filter(a =>
    (filterStatus === 'All' || a.status === filterStatus) &&
    (a.companyName.toLowerCase().includes(search.toLowerCase()) ||
      a.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      a.zone.toLowerCase().includes(search.toLowerCase()))
  );

  const openView = (a: Application) => { setSelected(a); setModal('view'); };
  const openReview = (a: Application) => { setSelected(a); setReviewNote(a.reviewNote || ''); setModal('review'); };

  const handleDecision = (decision: 'Approved' | 'Rejected') => {
    if (!selected) return;
    setApplications(prev => prev.map(a =>
      a.id === selected.id ? { ...a, status: decision, reviewNote } : a
    ));
    setModal(null);
    setReviewNote('');
  };

  const stats = [
    { label: 'Total Applications', value: applications.length, icon: <FileText size={18} className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Pending Review', value: applications.filter(a => a.status === 'Pending').length, icon: <Clock size={18} className="text-yellow-600" />, bg: 'bg-yellow-50' },
    { label: 'Approved', value: applications.filter(a => a.status === 'Approved').length, icon: <CheckCircle size={18} className="text-green-600" />, bg: 'bg-green-50' },
    { label: 'Rejected', value: applications.filter(a => a.status === 'Rejected').length, icon: <XCircle size={18} className="text-red-600" />, bg: 'bg-red-50' },
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

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search companies..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-60"
          />
        </div>
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filterStatus === s ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Applications list */}
      <div className="space-y-3">
        {filtered.map(a => (
          <div key={a.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 size={22} className="text-green-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-bold text-gray-800">{a.companyName}</p>
                    <span className="font-mono text-xs text-gray-400">{a.id}</span>
                    <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle[a.status]}`}>
                      {statusIcon[a.status]} {a.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={12} />{a.zone}</span>
                    <span className="flex items-center gap-1"><Phone size={12} />{a.phone}</span>
                    <span className="flex items-center gap-1"><Mail size={12} />{a.email}</span>
                    <span>Fleet: {a.fleetSize} trucks</span>
                    <span>Experience: {a.experience}</span>
                    <span>Applied: {a.appliedDate}</span>
                  </div>
                  {a.reviewNote && (
                    <p className="text-xs text-gray-500 mt-1.5 italic">Note: {a.reviewNote}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => openView(a)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-50 transition"
                >
                  <Eye size={13} /> View
                </button>
                {a.status === 'Pending' && (
                  <button
                    onClick={() => openReview(a)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-green-700 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-50 transition"
                  >
                    <AlertCircle size={13} /> Review
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">
            <Building2 size={40} className="mx-auto mb-3 opacity-30" />
            <p>No applications found.</p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-800">Application Details</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Company header */}
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Building2 size={22} className="text-green-700" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-lg">{selected.companyName}</p>
                  <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit ${statusStyle[selected.status]}`}>
                    {statusIcon[selected.status]} {selected.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Application ID', selected.id],
                  ['Contact Person', selected.contactPerson],
                  ['Email', selected.email],
                  ['Phone', selected.phone],
                  ['Address', selected.address],
                  ['Zone', selected.zone],
                  ['Fleet Size', `${selected.fleetSize} trucks`],
                  ['License No.', selected.licenseNo],
                  ['Experience', selected.experience],
                  ['Applied Date', selected.appliedDate],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">{k}</p>
                    <p className="text-sm font-semibold text-gray-800">{v}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Company Description</p>
                <p className="text-sm text-gray-700">{selected.description}</p>
              </div>

              {selected.reviewNote && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-xs text-yellow-600 font-semibold mb-1">Review Note</p>
                  <p className="text-sm text-yellow-800">{selected.reviewNote}</p>
                </div>
              )}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              {selected.status === 'Pending' && (
                <>
                  <button
                    onClick={() => { setModal('review'); setReviewNote(selected.reviewNote || ''); }}
                    className="flex-1 py-2.5 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} /> Review Application
                  </button>
                </>
              )}
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review / Decision Modal */}
      {modal === 'review' && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-800">Review Application</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Company summary */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold text-gray-800">{selected.companyName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{selected.zone} • {selected.fleetSize} trucks • {selected.experience}</p>
              </div>

              {/* Review note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Review Note <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={reviewNote}
                  onChange={e => setReviewNote(e.target.value)}
                  rows={3}
                  placeholder="Add a note about your decision..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              {/* Decision buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleDecision('Rejected')}
                  className="flex-1 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition flex items-center justify-center gap-2"
                >
                  <XCircle size={16} /> Reject
                </button>
                <button
                  onClick={() => handleDecision('Approved')}
                  className="flex-1 py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} /> Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
