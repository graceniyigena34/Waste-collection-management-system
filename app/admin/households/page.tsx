'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, X, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Household {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  zone: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  joinDate: string;
  residents: number;
}

const initialHouseholds: Household[] = [
  { id: 'HH-001', name: 'Uwimana Marie', email: 'marie@email.com', phone: '+250 788 001 001', address: 'KG 12 St, Kicukiro', zone: 'Kicukiro', status: 'Active', paymentStatus: 'Paid', joinDate: '2024-01-10', residents: 4 },
  { id: 'HH-002', name: 'Habimana Jean', email: 'jean@email.com', phone: '+250 788 002 002', address: 'KN 5 Ave, Gasabo', zone: 'Gasabo', status: 'Active', paymentStatus: 'Pending', joinDate: '2024-02-15', residents: 3 },
  { id: 'HH-003', name: 'Mukamana Alice', email: 'alice@email.com', phone: '+250 788 003 003', address: 'KK 7 Rd, Nyarugenge', zone: 'Nyarugenge', status: 'Inactive', paymentStatus: 'Overdue', joinDate: '2024-03-20', residents: 5 },
  { id: 'HH-004', name: 'Niyonzima Paul', email: 'paul@email.com', phone: '+250 788 004 004', address: 'KG 22 St, Kicukiro', zone: 'Kicukiro', status: 'Active', paymentStatus: 'Paid', joinDate: '2024-04-05', residents: 2 },
  { id: 'HH-005', name: 'Ingabire Grace', email: 'grace@email.com', phone: '+250 788 005 005', address: 'KN 15 Ave, Gasabo', zone: 'Gasabo', status: 'Active', paymentStatus: 'Paid', joinDate: '2024-05-12', residents: 6 },
  { id: 'HH-006', name: 'Bizimana Eric', email: 'eric@email.com', phone: '+250 788 006 006', address: 'KK 3 Rd, Remera', zone: 'Remera', status: 'Suspended', paymentStatus: 'Overdue', joinDate: '2024-06-18', residents: 3 },
];

const statusStyle: Record<string, string> = { Active: 'bg-green-100 text-green-700', Inactive: 'bg-gray-100 text-gray-600', Suspended: 'bg-red-100 text-red-700' };
const payStyle: Record<string, string> = { Paid: 'bg-green-100 text-green-700', Pending: 'bg-yellow-100 text-yellow-700', Overdue: 'bg-red-100 text-red-700' };

const emptyForm: Omit<Household, 'id'> = { name: '', email: '', phone: '', address: '', zone: 'Kicukiro', status: 'Active', paymentStatus: 'Pending', joinDate: '', residents: 1 };

export default function HouseholdsPage() {
  const [households, setHouseholds] = useState<Household[]>(initialHouseholds);
  const [search, setSearch] = useState('');
  const [filterZone, setFilterZone] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [modal, setModal] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selected, setSelected] = useState<Household | null>(null);
  const [form, setForm] = useState<Omit<Household, 'id'>>(emptyForm);

  const zones = ['All', 'Kicukiro', 'Gasabo', 'Nyarugenge', 'Remera'];

  const filtered = households.filter(h =>
    (filterZone === 'All' || h.zone === filterZone) &&
    (filterStatus === 'All' || h.status === filterStatus) &&
    (h.name.toLowerCase().includes(search.toLowerCase()) || h.email.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => { setForm(emptyForm); setModal('add'); };
  const openEdit = (h: Household) => { setSelected(h); setForm({ name: h.name, email: h.email, phone: h.phone, address: h.address, zone: h.zone, status: h.status, paymentStatus: h.paymentStatus, joinDate: h.joinDate, residents: h.residents }); setModal('edit'); };
  const openView = (h: Household) => { setSelected(h); setModal('view'); };

  const handleSave = () => {
    if (modal === 'add') {
      setHouseholds(prev => [...prev, { ...form, id: `HH-${String(prev.length + 1).padStart(3, '0')}` }]);
    } else if (modal === 'edit' && selected) {
      setHouseholds(prev => prev.map(h => h.id === selected.id ? { ...form, id: h.id } : h));
    }
    setModal(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this household?')) setHouseholds(prev => prev.filter(h => h.id !== id));
  };

  const stats = [
    { label: 'Total', value: households.length, icon: <Users size={18} className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Active', value: households.filter(h => h.status === 'Active').length, icon: <CheckCircle size={18} className="text-green-600" />, bg: 'bg-green-50' },
    { label: 'Pending Payment', value: households.filter(h => h.paymentStatus === 'Pending').length, icon: <Clock size={18} className="text-yellow-600" />, bg: 'bg-yellow-50' },
    { label: 'Overdue', value: households.filter(h => h.paymentStatus === 'Overdue').length, icon: <AlertCircle size={18} className="text-red-600" />, bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">{s.icon}</div>
            <div><p className="text-xs text-gray-500">{s.label}</p><p className="font-bold text-gray-800 text-lg">{s.value}</p></div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search households..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-56" />
          </div>
          <select value={filterZone} onChange={e => setFilterZone(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            {zones.map(z => <option key={z}>{z}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            {['All', 'Active', 'Inactive', 'Suspended'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">
          <Plus size={16} /> Add Household
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>{['ID', 'Name', 'Zone', 'Residents', 'Status', 'Payment', 'Join Date', 'Actions'].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(h => (
                <tr key={h.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 font-mono text-xs text-gray-500">{h.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">{h.name}</p>
                    <p className="text-xs text-gray-500">{h.email}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{h.zone}</td>
                  <td className="px-5 py-4 text-gray-600">{h.residents}</td>
                  <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[h.status]}`}>{h.status}</span></td>
                  <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${payStyle[h.paymentStatus]}`}>{h.paymentStatus}</span></td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{h.joinDate}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openView(h)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Eye size={15} /></button>
                      <button onClick={() => openEdit(h)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"><Edit size={15} /></button>
                      <button onClick={() => handleDelete(h.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-10 text-gray-400 text-sm">No households found.</p>}
        </div>
      </div>

      {/* Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-800">{modal === 'add' ? 'Add Household' : 'Edit Household'}</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {([['Full Name', 'name', 'text'], ['Email', 'email', 'email'], ['Phone', 'phone', 'tel'], ['Address', 'address', 'text'], ['Join Date', 'joinDate', 'date']] as [string, keyof typeof form, string][]).map(([label, key, type]) => (
                <div key={key} className={key === 'address' ? 'col-span-2' : ''}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  <input type={type} value={String(form[key])} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Zone</label>
                <select value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {['Kicukiro', 'Gasabo', 'Nyarugenge', 'Remera'].map(z => <option key={z}>{z}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Residents</label>
                <input type="number" min={1} value={form.residents} onChange={e => setForm(f => ({ ...f, residents: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Household['status'] }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {['Active', 'Inactive', 'Suspended'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Payment Status</label>
                <select value={form.paymentStatus} onChange={e => setForm(f => ({ ...f, paymentStatus: e.target.value as Household['paymentStatus'] }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {['Paid', 'Pending', 'Overdue'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setModal(null)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* View modal */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-800">Household Details</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="p-6 space-y-3">
              {[['ID', selected.id], ['Name', selected.name], ['Email', selected.email], ['Phone', selected.phone], ['Address', selected.address], ['Zone', selected.zone], ['Residents', String(selected.residents)], ['Join Date', selected.joinDate]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-800">{v}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle[selected.status]}`}>{selected.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${payStyle[selected.paymentStatus]}`}>{selected.paymentStatus}</span>
              </div>
            </div>
            <div className="px-6 pb-6">
              <button onClick={() => setModal(null)} className="w-full py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
