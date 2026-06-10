'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, X, Truck, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { api, type BackendDriverWithCompany, type BackendCompanyProfile } from '@/lib/api-client';

type DriverStatus = 'active' | 'off_duty' | 'suspended';

interface DriverForm {
  company_id: number;
  name: string;
  email: string;
  phone: string;
  license_number: string;
  national_id: string;
  years_of_experience: number;
  status: DriverStatus;
  zone: string;
  truck_id: string;
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  off_duty: 'Off Duty',
  suspended: 'Suspended',
};

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  off_duty: 'bg-yellow-100 text-yellow-700',
  suspended: 'bg-red-100 text-red-700',
};

const ZONES = ['Kicukiro', 'Gasabo', 'Nyarugenge', 'Remera', 'Kimironko', 'Gikondo'];

const emptyForm: DriverForm = {
  company_id: 0,
  name: '',
  email: '',
  phone: '',
  license_number: '',
  national_id: '',
  years_of_experience: 0,
  status: 'active',
  zone: 'Kicukiro',
  truck_id: '',
};

interface FieldProps {
  label: string;
  value: string | number;
  type?: string;
  onChange: (v: string) => void;
}

function Field({ label, value, type = 'text', onChange }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<BackendDriverWithCompany[]>([]);
  const [companies, setCompanies] = useState<BackendCompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modal, setModal] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selected, setSelected] = useState<BackendDriverWithCompany | null>(null);
  const [form, setForm] = useState<DriverForm>(emptyForm);

  const loadDrivers = useCallback(async () => {
    try {
      setError('');
      const res = await api.drivers.listAll();
      setDrivers(res.drivers);
    } catch {
      setError('Failed to load drivers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDrivers();
    api.companies.all(200).then(res => setCompanies(res.data)).catch(() => {});
  }, [loadDrivers]);

  const filtered = drivers.filter(d => {
    const statusMatch = filterStatus === 'all' || d.status === filterStatus;
    const q = search.toLowerCase();
    const nameMatch = d.name.toLowerCase().includes(q) || (d.zone ?? '').toLowerCase().includes(q) || (d.company_name ?? '').toLowerCase().includes(q);
    return statusMatch && nameMatch;
  });

  const openAdd = () => {
    setForm({ ...emptyForm, company_id: companies[0]?.id ?? 0 });
    setModal('add');
  };

  const openEdit = (d: BackendDriverWithCompany) => {
    setSelected(d);
    setForm({
      company_id: d.company_id,
      name: d.name,
      email: d.email ?? '',
      phone: d.phone,
      license_number: d.license_number ?? '',
      national_id: d.national_id ?? '',
      years_of_experience: d.years_of_experience ?? 0,
      status: (d.status as DriverStatus) ?? 'active',
      zone: d.zone ?? 'Kicukiro',
      truck_id: d.truck_id ?? '',
    });
    setModal('edit');
  };

  const openView = (d: BackendDriverWithCompany) => { setSelected(d); setModal('view'); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and phone are required.');
      return;
    }
    if (form.company_id === 0) {
      setError('Please select a company.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        license_number: form.license_number || undefined,
        national_id: form.national_id || undefined,
        years_of_experience: form.years_of_experience,
        status: form.status,
        zone: form.zone || undefined,
        truck_id: form.truck_id || undefined,
      };

      if (modal === 'add') {
        await api.drivers.add(form.company_id, payload);
      } else if (modal === 'edit' && selected) {
        await api.drivers.update(selected.company_id, selected.id, payload);
      }
      setModal(null);
      await loadDrivers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save driver.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (d: BackendDriverWithCompany) => {
    if (!confirm(`Delete driver "${d.name}"?`)) return;
    try {
      await api.drivers.remove(d.company_id, d.id);
      await loadDrivers();
    } catch {
      setError('Failed to delete driver.');
    }
  };

  const stats = [
    { label: 'Total Drivers', value: drivers.length, icon: <Truck size={18} className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Active', value: drivers.filter(d => d.status === 'active').length, icon: <CheckCircle size={18} className="text-green-600" />, bg: 'bg-green-50' },
    { label: 'Off Duty', value: drivers.filter(d => d.status === 'off_duty').length, icon: <Clock size={18} className="text-yellow-600" />, bg: 'bg-yellow-50' },
    { label: 'Suspended', value: drivers.filter(d => d.status === 'suspended').length, icon: <AlertCircle size={18} className="text-red-500" />, bg: 'bg-red-50' },
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search drivers..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-56"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="off_duty">Off Duty</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition"
        >
          <Plus size={16} /> Add Driver
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading drivers...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  {['ID', 'Driver', 'Company', 'Zone', 'Truck', 'Experience', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">DRV-{String(d.id).padStart(3, '0')}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">{d.name}</p>
                      <p className="text-xs text-gray-500">{d.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-xs">{d.company_name ?? '—'}</td>
                    <td className="px-5 py-4 text-gray-600">{d.zone ?? '—'}</td>
                    <td className="px-5 py-4 text-gray-600">{d.truck_id ?? '—'}</td>
                    <td className="px-5 py-4 text-gray-600">{d.years_of_experience ?? 0} yrs</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[d.status ?? 'active'] ?? 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABEL[d.status ?? 'active'] ?? d.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openView(d)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Eye size={15} /></button>
                        <button onClick={() => openEdit(d)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"><Edit size={15} /></button>
                        <button onClick={() => handleDelete(d)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && !loading && (
              <p className="text-center py-10 text-gray-400 text-sm">No drivers found.</p>
            )}
          </div>
        )}
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-800">{modal === 'add' ? 'Add Driver' : 'Edit Driver'}</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
                <select
                  value={form.company_id}
                  onChange={e => setForm(f => ({ ...f, company_id: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={modal === 'edit'}
                >
                  <option value={0}>— Select company —</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.company_name}</option>
                  ))}
                </select>
              </div>
              <Field label="Full Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
              <Field label="Phone" value={form.phone} type="tel" onChange={v => setForm(f => ({ ...f, phone: v }))} />
              <Field label="Email" value={form.email} type="email" onChange={v => setForm(f => ({ ...f, email: v }))} />
              <Field label="License No." value={form.license_number} onChange={v => setForm(f => ({ ...f, license_number: v }))} />
              <Field label="National ID" value={form.national_id} onChange={v => setForm(f => ({ ...f, national_id: v }))} />
              <Field label="Truck ID" value={form.truck_id} onChange={v => setForm(f => ({ ...f, truck_id: v }))} />
              <Field label="Years of Experience" value={form.years_of_experience} type="number" onChange={v => setForm(f => ({ ...f, years_of_experience: Number(v) }))} />
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Zone</label>
                <select
                  value={form.zone}
                  onChange={e => setForm(f => ({ ...f, zone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {ZONES.map(z => <option key={z}>{z}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as DriverStatus }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="active">Active</option>
                  <option value="off_duty">Off Duty</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            {error && <p className="px-6 text-xs text-red-600">{error}</p>}
            <div className="flex gap-3 px-6 pb-6 pt-2">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? 'Saving…' : 'Save'}
              </button>
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
              {([
                ['ID', `DRV-${String(selected.id).padStart(3, '0')}`],
                ['Name', selected.name],
                ['Email', selected.email ?? '—'],
                ['Phone', selected.phone],
                ['License', selected.license_number ?? '—'],
                ['National ID', selected.national_id ?? '—'],
                ['Zone', selected.zone ?? '—'],
                ['Truck', selected.truck_id ?? '—'],
                ['Experience', `${selected.years_of_experience ?? 0} years`],
                ['Company', selected.company_name ?? '—'],
                ['Joined', selected.created_at ? new Date(selected.created_at).toLocaleDateString() : '—'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-800">{v}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[selected.status ?? 'active']}`}>
                  {STATUS_LABEL[selected.status ?? 'active'] ?? selected.status}
                </span>
              </div>
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={() => setModal(null)}
                className="w-full py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
