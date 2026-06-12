'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Eye, X, Users, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { api, type BackendHousehold, type BackendPayment } from '@/lib/api-client';

const statusStyle: Record<string, string> = {
  Active:    'bg-green-100 text-green-700',
  Inactive:  'bg-gray-100 text-gray-600',
  Suspended: 'bg-red-100 text-red-700',
};
const payStyle: Record<string, string> = {
  Paid:    'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Overdue: 'bg-red-100 text-red-700',
  Failed:  'bg-red-100 text-red-700',
};

const HOUSE_TYPES = ['RESIDENTIAL', 'APARTMENT', 'COMMERCIAL', 'VILLA'];
const STATUSES = ['Active', 'Inactive', 'Suspended'];

interface EditForm {
  district: string; sector: string; cell: string; village: string;
  street_address: string; house_type: string; residents: number; status: string; notes: string;
}

const emptyForm: EditForm = {
  district: '', sector: '', cell: '', village: '',
  street_address: '', house_type: 'RESIDENTIAL', residents: 1, status: 'Active', notes: '',
};

export default function HouseholdsPage() {
  const [households, setHouseholds] = useState<BackendHousehold[]>([]);
  const [payments, setPayments] = useState<BackendPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const [modal, setModal] = useState<'edit' | 'view' | null>(null);
  const [selected, setSelected] = useState<BackendHousehold | null>(null);
  const [form, setForm] = useState<EditForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [hRes, pRes] = await Promise.allSettled([
          api.households.all(),
          api.payments.all(),
        ]);
        if (hRes.status === 'fulfilled') setHouseholds(Array.isArray(hRes.value) ? hRes.value : []);
        if (pRes.status === 'fulfilled') setPayments(Array.isArray(pRes.value) ? pRes.value : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load households.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  // Build user_id → latest payment status map
  const paymentMap = useMemo(() => {
    const map = new Map<number, string>();
    const sorted = [...payments].sort((a, b) =>
      new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
    );
    for (const p of sorted) {
      if (!map.has(p.user_id)) map.set(p.user_id, p.status);
    }
    return map;
  }, [payments]);

  // Unique districts for filter dropdown
  const districts = useMemo(() => {
    const d = Array.from(new Set(households.map(h => h.district).filter(Boolean)));
    return ['All', ...d.sort()];
  }, [households]);

  const filtered = households.filter(h =>
    (filterDistrict === 'All' || h.district === filterDistrict) &&
    (filterStatus === 'All' || h.status === filterStatus) &&
    (
      h.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      h.email?.toLowerCase().includes(search.toLowerCase()) ||
      h.district?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const stats = [
    { label: 'Total',           value: households.length,                                           icon: <Users size={18} className="text-blue-600" />,       bg: 'bg-blue-50' },
    { label: 'Active',          value: households.filter(h => h.status === 'Active').length,        icon: <CheckCircle size={18} className="text-green-600" />, bg: 'bg-green-50' },
    { label: 'Pending Payment', value: [...paymentMap.values()].filter(s => s === 'Pending').length, icon: <Clock size={18} className="text-yellow-600" />,     bg: 'bg-yellow-50' },
    { label: 'Overdue',         value: [...paymentMap.values()].filter(s => s === 'Overdue').length, icon: <AlertCircle size={18} className="text-red-600" />,  bg: 'bg-red-50' },
  ];

  const openEdit = (h: BackendHousehold) => {
    setSelected(h);
    setForm({
      district: h.district, sector: h.sector, cell: h.cell, village: h.village,
      street_address: h.street_address, house_type: h.house_type, residents: h.residents,
      status: h.status, notes: h.notes ?? '',
    });
    setSaveError('');
    setModal('edit');
  };

  const openView = (h: BackendHousehold) => { setSelected(h); setModal('view'); };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    setSaveError('');
    try {
      const res = await api.households.adminUpdate(selected.id, {
        district: form.district, sector: form.sector, cell: form.cell, village: form.village,
        street_address: form.street_address, house_type: form.house_type,
        residents: form.residents, status: form.status, notes: form.notes,
      });
      setHouseholds(prev => prev.map(h => h.id === selected.id
        ? { ...h, ...res.household, full_name: h.full_name, email: h.email, telephone: h.telephone }
        : h
      ));
      setModal(null);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (h: BackendHousehold) => {
    if (!confirm(`Delete household for ${h.full_name}? This cannot be undone.`)) return;
    setDeletingId(h.id);
    setHouseholds(prev => prev.filter(x => x.id !== h.id));
    try {
      await api.households.adminDelete(h.id);
    } catch {
      setHouseholds(prev => [h, ...prev]);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-sm">
        {error}
      </div>
    );
  }

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
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search households..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-56"
            />
          </div>
          <select value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            {districts.map(d => <option key={d}>{d}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            {['All', ...STATUSES].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{filtered.length}</span> of {households.length} households
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                {['ID', 'Name', 'Zone', 'Residents', 'Status', 'Payment', 'Join Date', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(h => {
                const payStatus = paymentMap.get(h.user_id) ?? '—';
                return (
                  <tr key={h.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">HH-{String(h.id).padStart(3, '0')}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">{h.full_name}</p>
                      <p className="text-xs text-gray-500">{h.email}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{h.sector || h.district}</td>
                    <td className="px-5 py-4 text-gray-600">{h.residents}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[h.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {payStatus === '—'
                        ? <span className="text-xs text-gray-400">—</span>
                        : <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${payStyle[payStatus] ?? 'bg-gray-100 text-gray-500'}`}>{payStatus}</span>
                      }
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {h.created_at ? new Date(h.created_at).toLocaleDateString('en-CA') : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openView(h)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Eye size={15} /></button>
                        <button onClick={() => openEdit(h)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"><Edit size={15} /></button>
                        <button
                          onClick={() => void handleDelete(h)}
                          disabled={deletingId === h.id}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-40"
                        >
                          {deletingId === h.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Users size={36} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No households found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {modal === 'edit' && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
              <h3 className="font-bold text-gray-800">Edit Household — {selected.full_name}</h3>
              <button onClick={() => setModal(null)} disabled={saving}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {saveError && (
                <div className="col-span-2 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-xl">{saveError}</div>
              )}
              {([
                ['District', 'district'], ['Sector', 'sector'], ['Cell', 'cell'], ['Village', 'village'],
              ] as [string, keyof EditForm][]).map(([label, key]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  <input
                    value={String(form[key])}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Street Address</label>
                <input
                  value={form.street_address}
                  onChange={e => setForm(f => ({ ...f, street_address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">House Type</label>
                <select
                  value={form.house_type}
                  onChange={e => setForm(f => ({ ...f, house_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {HOUSE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Residents</label>
                <input
                  type="number" min={1}
                  value={form.residents}
                  onChange={e => setForm(f => ({ ...f, residents: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setModal(null)} disabled={saving} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button
                onClick={() => void handleSave()}
                disabled={saving}
                className="flex-1 py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : 'Save Changes'}
              </button>
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
              {([
                ['ID',            `HH-${String(selected.id).padStart(3, '0')}`],
                ['Name',          selected.full_name],
                ['Email',         selected.email],
                ['Phone',         selected.telephone || '—'],
                ['District',      selected.district],
                ['Sector',        selected.sector],
                ['Cell',          selected.cell],
                ['Village',       selected.village],
                ['Street',        selected.street_address],
                ['House Type',    selected.house_type],
                ['Residents',     String(selected.residents)],
                ['Registered',    selected.created_at ? new Date(selected.created_at).toLocaleDateString('en-CA') : '—'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm gap-4">
                  <span className="text-gray-500 shrink-0">{k}</span>
                  <span className="font-medium text-gray-800 text-right">{v}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle[selected.status] ?? 'bg-gray-100 text-gray-600'}`}>{selected.status}</span>
              </div>
              {paymentMap.has(selected.user_id) && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Payment</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${payStyle[paymentMap.get(selected.user_id)!] ?? 'bg-gray-100'}`}>
                    {paymentMap.get(selected.user_id)}
                  </span>
                </div>
              )}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => { setModal(null); openEdit(selected); }}
                className="flex-1 py-2 border border-green-200 text-green-700 rounded-xl text-sm font-medium hover:bg-green-50 transition flex items-center justify-center gap-1"
              >
                <Edit size={14} /> Edit
              </button>
              <button onClick={() => setModal(null)} className="flex-1 py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
