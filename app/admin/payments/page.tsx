'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, X, DollarSign, CheckCircle, Clock, AlertCircle, Download, Loader2 } from 'lucide-react';
import { api, BackendPayment } from '@/lib/api-client';

const statusStyle: Record<string, string> = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Overdue: 'bg-red-100 text-red-700',
  Failed: 'bg-gray-100 text-gray-600',
};

function fmtDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-RW', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtMonth(raw?: string) {
  if (!raw) return '—';
  // raw could be "2025-01" or "January 2025" etc.
  if (/^\d{4}-\d{2}$/.test(raw)) {
    const [y, m] = raw.split('-');
    const name = new Date(Number(y), Number(m) - 1).toLocaleString('en-US', { month: 'long' });
    return `${name} ${y}`;
  }
  return raw;
}

function exportCSV(payments: BackendPayment[]) {
  const rows = [
    ['ID', 'Household', 'Zone', 'Amount (RWF)', 'Method', 'Month', 'Date', 'Status'],
    ...payments.map(p => [
      `PAY-${String(p.id).padStart(3, '0')}`,
      p.full_name ?? `User #${p.user_id}`,
      p.zone ?? '—',
      p.amount,
      p.method ?? '—',
      fmtMonth(p.month),
      fmtDate(p.payment_date ?? p.created_at),
      p.status,
    ]),
  ];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'payments.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<BackendPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selected, setSelected] = useState<BackendPayment | null>(null);

  useEffect(() => {
    api.payments.all()
      .then(data => { setPayments(data); setLoading(false); })
      .catch(err => { setError(err instanceof Error ? err.message : 'Failed to load payments'); setLoading(false); });
  }, []);

  const filtered = payments.filter(p =>
    (filterStatus === 'All' || p.status === filterStatus) &&
    (
      (p.full_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      String(p.id).includes(search) ||
      (p.zone ?? '').toLowerCase().includes(search.toLowerCase())
    )
  );

  const paid = payments.filter(p => p.status === 'Paid');
  const totalRevenue = paid.reduce((s, p) => s + Number(p.amount), 0);

  const stats = [
    { label: 'Total Collected', value: totalRevenue >= 1000 ? `${Math.round(totalRevenue / 1000)}K RWF` : `${totalRevenue} RWF`, icon: <DollarSign size={18} className="text-green-600" />, bg: 'bg-green-50' },
    { label: 'Paid', value: paid.length, icon: <CheckCircle size={18} className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Pending', value: payments.filter(p => p.status === 'Pending').length, icon: <Clock size={18} className="text-yellow-600" />, bg: 'bg-yellow-50' },
    { label: 'Overdue', value: payments.filter(p => p.status === 'Overdue').length, icon: <AlertCircle size={18} className="text-red-600" />, bg: 'bg-red-50' },
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
              <p className="font-bold text-gray-800 text-lg">{loading ? '…' : s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search / filter / export */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search payments..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-56"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {['All', 'Paid', 'Pending', 'Overdue', 'Failed'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <button
          onClick={() => exportCSV(filtered)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={24} className="animate-spin mr-2" /> Loading payments…
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500 text-sm">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  {['ID', 'Household', 'Zone', 'Amount', 'Method', 'Month', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">PAY-{String(p.id).padStart(3, '0')}</td>
                    <td className="px-5 py-4 font-medium text-gray-800">{p.full_name ?? `User #${p.user_id}`}</td>
                    <td className="px-5 py-4 text-gray-600">{p.zone ?? '—'}</td>
                    <td className="px-5 py-4 font-semibold text-gray-800">{Number(p.amount).toLocaleString()} RWF</td>
                    <td className="px-5 py-4 text-gray-600">{p.method ?? '—'}</td>
                    <td className="px-5 py-4 text-gray-600 text-xs">{fmtMonth(p.month)}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{fmtDate(p.payment_date ?? p.created_at)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[p.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelected(p)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center py-10 text-gray-400 text-sm">
                {payments.length === 0 ? 'No payments yet.' : 'No payments match your search.'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* View modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-800">Payment Receipt</h3>
              <button onClick={() => setSelected(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-3">
              {[
                ['Payment ID', `PAY-${String(selected.id).padStart(3, '0')}`],
                ['Household', selected.full_name ?? `User #${selected.user_id}`],
                ['Zone', selected.zone ?? '—'],
                ['Amount', `${Number(selected.amount).toLocaleString()} RWF`],
                ['Method', selected.method ?? '—'],
                ['Month', fmtMonth(selected.month)],
                ['Date', fmtDate(selected.payment_date ?? selected.created_at)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-800">{v}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle[selected.status] ?? ''}`}>
                  {selected.status}
                </span>
              </div>
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={() => setSelected(null)}
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
