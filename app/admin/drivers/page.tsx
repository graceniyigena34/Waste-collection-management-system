'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, X, Truck, CheckCircle, Clock, Star } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNo: string;
  zone: string;
  status: 'Active' | 'Off Duty' | 'Suspended';
  truckId: string;
  joinDate: string;
  completedRoutes: number;
  rating: number;
}

const initialDrivers: Driver[] = [
  { id: 'DRV-001', name: 'Nkurunziza Pierre', email: 'pierre@greenex.rw', phone: '+250 788 101 001', licenseNo: 'RW-2021-001', zone: 'Kicukiro', status: 'Active', truckId: 'TRK-01', joinDate: '2023-01-15', completedRoutes: 245, rating: 4.8 },
  { id: 'DRV-002', name: 'Uwase Claudine', email: 'claudine@greenex.rw', phone: '+250 788 102 002', licenseNo: 'RW-2021-002', zone: 'Gasabo', status: 'Active', truckId: 'TRK-02', joinDate: '2023-03-20', completedRoutes: 198, rating: 4.6 },
  { id: 'DRV-003', name: 'Hakizimana Robert', email: 'robert@greenex.rw', phone: '+250 788 103 003', licenseNo: 'RW-2022-003', zone: 'Nyarugenge', status: 'Off Duty', truckId: 'TRK-03', joinDate: '2023-06-10', completedRoutes: 156, rating: 4.5 },
  { id: 'DRV-004', name: 'Mutesi Diane', email: 'diane@greenex.rw', phone: '+250 788 104 004', licenseNo: 'RW-2022-004', zone: 'Remera', status: 'Active', truckId: 'TRK-04', joinDate: '2023-08-05', completedRoutes: 178, rating: 4.7 },
  { id: 'DRV-005', name: 'Bizumuremyi Alex', email: 'alex@greenex.rw', phone: '+250 788 105 005', licenseNo: 'RW-2023-005', zone: 'Kicukiro', status: 'Suspended', truckId: 'N/A', joinDate: '2024-01-12', completedRoutes: 45, rating: 3.2 },
];

const statusStyle: Record<string, string> = { Active: 'bg-green-100 text-green-700', 'Off Duty': 'bg-yellow-100 text-yellow-700', Suspended: 'bg-red-100 text-red-700' };
const emptyForm = { name: '', email: '', phone: '', licenseNo: '', zone: 'Kicukiro', status: 'Active' as Driver['status'], truckId: '', joinDate: '', completedRoutes: 0, rating: 5.0 };

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [modal, setModal] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selected, setSelected] = useState<Driver | null>(null);
  const [form, setForm] = useState<Omit<Driver, 'id'>>(emptyForm);

  const filtered = drivers.filter(d =>
    (filterStatus === 'All' || d.status === filterStatus) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) || d.zone.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => { setForm(emptyForm); setModal('add'); };
  const openEdit = (d: Driver) => { setSelected(d); setForm({ name: d.name, email: d.email, phone: d.phone, licenseNo: d.licenseNo, zone: d.zone, status: d.status, truckId: d.truckId, joinDate: d.joinDate, completedRoutes: d.completedRoutes, rating: d.rating }); setModal('edit'); };
  const openView = (d: Driver) => { setSelected(d); setModal('view'); };

  const handleSave = () => {
    if (modal === 'add') setDrivers(prev => [...prev, { ...form, id: `DRV-${String(prev.length + 1).padStart(3, '0')}` }]);
    else if (modal === 'edit' && selected) setDrivers(prev => prev.map(d => d.id === selected.id ? { ...form, id: d.id } : d));
    setModal(null);
  };

  const handleDelete = (id: string) => { if (confirm('Delete this driver?')) setDrivers(prev => prev.filter(d => d.id !== id)); };

  const stats = [
    { label: 'Total Drivers', value: drivers.length, icon: <Truck size={18} className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Active', value: drivers.filter(d => d.status === 'Active').length, icon: <CheckCircle size={18} className="text-green-600" />, bg: 'bg-green-50' },
    { label: 'Off Duty', value: drivers.filter(d => d.status === 'Off Duty').length, icon: <Clock size={18} className="text-yellow-600" />, bg: 'bg-yellow-50' },
    { label: 'Avg Rating', value: (drivers.reduce((a, d) => a + d.rating, 0) / drivers.length).toFixed(1), icon: <Star size={18} className="text-orange-500" />, bg: 'bg-orange-50' },
  ];

  const Field = ({ label, k, type = 'text' }: { label: string; k: keyof typeof form; type?: string }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} value={String(form[k])} onChange={e => setForm(f => ({ ...f, [k]: type === 'number' ? Number(e.target.value) : e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
    </div>
  );

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

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drivers..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-56" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            {['All', 'Active', 'Off Duty', 'Suspended'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">
          <Plus size={16} /> Add Driver
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>{['ID', 'Driver', 'Zone', 'Truck', 'Routes Done', 'Rating', 'Status', 'Actions'].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 font-mono text-xs text-gray-500">{d.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">{d.name}</p>
                    <p className="text-xs text-gray-500">{d.phone}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{d.zone}</td>
                  <td className="px-5 py-4 text-gray-600">{d.truckId}</td>
                  <td className="px-5 py-4 text-gray-600">{d.completedRoutes}</td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-yellow-500 font-medium"><Star size={13} fill="currentColor" />{d.rating}</span>
                  </td>
                  <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[d.status]}`}>{d.status}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openView(d)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Eye size={15} /></button>
                      <button onClick={() => openEdit(d)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"><Edit size={15} /></button>
                      <button onClick={() => handleDelete(d.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-10 text-gray-400 text-sm">No drivers found.</p>}
        </div>
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-800">{modal === 'add' ? 'Add Driver' : 'Edit Driver'}</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <Field label="Full Name" k="name" /><Field label="Email" k="email" type="email" />
              <Field label="Phone" k="phone" type="tel" /><Field label="License No." k="licenseNo" />
              <Field label="Truck ID" k="truckId" /><Field label="Join Date" k="joinDate" type="date" />
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Zone</label>
                <select value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {['Kicukiro', 'Gasabo', 'Nyarugenge', 'Remera'].map(z => <option key={z}>{z}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Driver['status'] }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {['Active', 'Off Duty', 'Suspended'].map(s => <option key={s}>{s}</option>)}
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

      {modal === 'view' && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-800">Driver Details</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-3">
              {[['ID', selected.id], ['Name', selected.name], ['Email', selected.email], ['Phone', selected.phone], ['License', selected.licenseNo], ['Zone', selected.zone], ['Truck', selected.truckId], ['Routes Done', String(selected.completedRoutes)], ['Rating', String(selected.rating)], ['Join Date', selected.joinDate]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gray-500">{k}</span><span className="font-medium text-gray-800">{v}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle[selected.status]}`}>{selected.status}</span>
              </div>
            </div>
            <div className="px-6 pb-6"><button onClick={() => setModal(null)} className="w-full py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
