'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, X, MapPin, CheckCircle, Clock, Truck } from 'lucide-react';

interface Route {
  id: string;
  name: string;
  zone: string;
  driver: string;
  truck: string;
  stops: number;
  distance: string;
  schedule: string;
  status: 'Active' | 'Completed' | 'Scheduled' | 'Suspended';
  progress: number;
}

const initialRoutes: Route[] = [
  { id: 'RT-001', name: 'Route A-1', zone: 'Kicukiro', driver: 'Nkurunziza Pierre', truck: 'TRK-01', stops: 15, distance: '12.5 km', schedule: '08:00 AM', status: 'Active', progress: 65 },
  { id: 'RT-002', name: 'Route B-2', zone: 'Gasabo', driver: 'Uwase Claudine', truck: 'TRK-02', stops: 12, distance: '18.2 km', schedule: '09:00 AM', status: 'Completed', progress: 100 },
  { id: 'RT-003', name: 'Route C-3', zone: 'Nyarugenge', driver: 'Hakizimana Robert', truck: 'TRK-03', stops: 18, distance: '22.8 km', schedule: '10:00 AM', status: 'Scheduled', progress: 0 },
  { id: 'RT-004', name: 'Route D-4', zone: 'Remera', driver: 'Mutesi Diane', truck: 'TRK-04', stops: 10, distance: '9.4 km', schedule: '07:30 AM', status: 'Completed', progress: 100 },
  { id: 'RT-005', name: 'Route E-5', zone: 'Kicukiro', driver: 'Unassigned', truck: 'TRK-05', stops: 8, distance: '7.1 km', schedule: '11:00 AM', status: 'Suspended', progress: 0 },
];

const statusStyle: Record<string, string> = { Active: 'bg-blue-100 text-blue-700', Completed: 'bg-green-100 text-green-700', Scheduled: 'bg-yellow-100 text-yellow-700', Suspended: 'bg-red-100 text-red-700' };
const progressColor: Record<string, string> = { Active: 'bg-blue-500', Completed: 'bg-green-500', Scheduled: 'bg-gray-300', Suspended: 'bg-red-400' };
const emptyForm = { name: '', zone: 'Kicukiro', driver: '', truck: '', stops: 10, distance: '', schedule: '', status: 'Scheduled' as Route['status'], progress: 0 };

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const [search, setSearch] = useState('');
  const [filterZone, setFilterZone] = useState('All');
  const [modal, setModal] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selected, setSelected] = useState<Route | null>(null);
  const [form, setForm] = useState<Omit<Route, 'id'>>(emptyForm);

  const filtered = routes.filter(r =>
    (filterZone === 'All' || r.zone === filterZone) &&
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.driver.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => { setForm(emptyForm); setModal('add'); };
  const openEdit = (r: Route) => { setSelected(r); setForm({ name: r.name, zone: r.zone, driver: r.driver, truck: r.truck, stops: r.stops, distance: r.distance, schedule: r.schedule, status: r.status, progress: r.progress }); setModal('edit'); };
  const openView = (r: Route) => { setSelected(r); setModal('view'); };

  const handleSave = () => {
    if (modal === 'add') setRoutes(prev => [...prev, { ...form, id: `RT-${String(prev.length + 1).padStart(3, '0')}` }]);
    else if (modal === 'edit' && selected) setRoutes(prev => prev.map(r => r.id === selected.id ? { ...form, id: r.id } : r));
    setModal(null);
  };

  const handleDelete = (id: string) => { if (confirm('Delete this route?')) setRoutes(prev => prev.filter(r => r.id !== id)); };

  const stats = [
    { label: 'Total Routes', value: routes.length, icon: <MapPin size={18} className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Active', value: routes.filter(r => r.status === 'Active').length, icon: <Truck size={18} className="text-green-600" />, bg: 'bg-green-50' },
    { label: 'Completed Today', value: routes.filter(r => r.status === 'Completed').length, icon: <CheckCircle size={18} className="text-purple-600" />, bg: 'bg-purple-50' },
    { label: 'Scheduled', value: routes.filter(r => r.status === 'Scheduled').length, icon: <Clock size={18} className="text-yellow-600" />, bg: 'bg-yellow-50' },
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

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search routes..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-56" />
          </div>
          <select value={filterZone} onChange={e => setFilterZone(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            {['All', 'Kicukiro', 'Gasabo', 'Nyarugenge', 'Remera'].map(z => <option key={z}>{z}</option>)}
          </select>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">
          <Plus size={16} /> Add Route
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-gray-800">{r.name}</p>
                <p className="text-xs text-gray-500">{r.zone} • {r.driver}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[r.status]}`}>{r.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-500">Stops</p><p className="font-bold text-gray-800">{r.stops}</p></div>
              <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-500">Distance</p><p className="font-bold text-gray-800">{r.distance}</p></div>
              <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-500">Schedule</p><p className="font-bold text-gray-800">{r.schedule}</p></div>
            </div>
            <div className="mb-1 flex justify-between text-xs text-gray-500">
              <span>Progress</span><span>{r.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
              <div className={`${progressColor[r.status]} h-2 rounded-full transition-all`} style={{ width: `${r.progress}%` }} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => openView(r)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Eye size={15} /></button>
              <button onClick={() => openEdit(r)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"><Edit size={15} /></button>
              <button onClick={() => handleDelete(r.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-800">{modal === 'add' ? 'Add Route' : 'Edit Route'}</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {([['Route Name', 'name', 'text'], ['Driver', 'driver', 'text'], ['Truck ID', 'truck', 'text'], ['Distance', 'distance', 'text'], ['Schedule', 'schedule', 'text']] as [string, keyof typeof form, string][]).map(([label, k, type]) => (
                <div key={String(k)}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  <input type={type} value={String(form[k])} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Stops</label>
                <input type="number" value={form.stops} onChange={e => setForm(f => ({ ...f, stops: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Zone</label>
                <select value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {['Kicukiro', 'Gasabo', 'Nyarugenge', 'Remera'].map(z => <option key={z}>{z}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Route['status'] }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {['Active', 'Completed', 'Scheduled', 'Suspended'].map(s => <option key={s}>{s}</option>)}
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
              <h3 className="font-bold text-gray-800">Route Details</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-3">
              {[['ID', selected.id], ['Name', selected.name], ['Zone', selected.zone], ['Driver', selected.driver], ['Truck', selected.truck], ['Stops', String(selected.stops)], ['Distance', selected.distance], ['Schedule', selected.schedule], ['Progress', `${selected.progress}%`]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm"><span className="text-gray-500">{k}</span><span className="font-medium text-gray-800">{v}</span></div>
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
