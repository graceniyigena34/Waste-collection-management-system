'use client';

import React, { useState } from 'react';
import { Search, Plus, Eye, X, DollarSign, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';

interface Payment {
  id: string;
  household: string;
  zone: string;
  amount: string;
  method: 'Mobile Money' | 'Bank Transfer' | 'Cash';
  status: 'Paid' | 'Pending' | 'Overdue' | 'Failed';
  date: string;
  month: string;
}

const initialPayments: Payment[] = [
  { id: 'PAY-001', household: 'Uwimana Marie', zone: 'Kicukiro', amount: '3,000 RWF', method: 'Mobile Money', status: 'Paid', date: 'Jan 15, 2025', month: 'January 2025' },
  { id: 'PAY-002', household: 'Habimana Jean', zone: 'Gasabo', amount: '3,000 RWF', method: 'Bank Transfer', status: 'Pending', date: 'Jan 14, 2025', month: 'January 2025' },
  { id: 'PAY-003', household: 'Mukamana Alice', zone: 'Nyarugenge', amount: '3,000 RWF', method: 'Mobile Money', status: 'Overdue', date: 'Dec 15, 2024', month: 'December 2024' },
  { id: 'PAY-004', household: 'Niyonzima Paul', zone: 'Kicukiro', amount: '3,000 RWF', method: 'Cash', status: 'Paid', date: 'Jan 10, 2025', month: 'January 2025' },
  { id: 'PAY-005', household: 'Ingabire Grace', zone: 'Gasabo', amount: '3,000 RWF', method: 'Mobile Money', status: 'Paid', date: 'Jan 12, 2025', month: 'January 2025' },
  { id: 'PAY-006', household: 'Bizimana Eric', zone: 'Remera', amount: '3,000 RWF', method: 'Mobile Money', status: 'Failed', date: 'Jan 8, 2025', month: 'January 2025' },
];

const statusStyle: Record<string, string> = { Paid: 'bg-green-100 text-green-700', Pending: 'bg-yellow-100 text-yellow-700', Overdue: 'bg-red-100 text-red-700', Failed: 'bg-gray-100 text-gray-600' };

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [modal, setModal] = useState<'add' | 'view' | null>(null);
  const [selected, setSelected] = useState<Payment | null>(null);
  const [form, setForm] = useState({ household: '', zone: 'Kicukiro', amount: '3,000 RWF', method: 'Mobile Money' as Payment['method'], status: 'Paid' as Payment['status'], date: '', month: '' });

  const filtered = payments.filter(p =>
    (filterStatus === 'All' || p.status === filterStatus) &&
    (p.household.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = () => {
    setPayments(prev => [...prev, { ...form, id: `PAY-${String(prev.length + 1).padStart(3, '0')}` }]);
    setModal(null);
  };

  const totalCollected = payments.filter(p => p.status === 'Paid').length * 3000;

  const stats = [
    { label: 'Total Collected', value: `${(totalCollected / 1000).toFixed(0)}K RWF`, icon: <DollarSign size={18} className="text-green-600" />, bg: 'bg-green-50' },
    { label: 'Paid', value: payments.filter(p => p.status === 'Paid').length, icon: <CheckCircle size={18} className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Pending', value: payments.filter(p => p.status === 'Pending').length, icon: <Clock size={18} className="text-yellow-600" />, bg: 'bg-yellow-50' },
    { label: 'Overdue', value: payments.filter(p => p.status === 'Overdue').length, icon: <AlertCircle size={18} className="text-red-600" />, bg: 'bg-red-50' },
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
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search payments..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-56" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
            {['All', 'Paid', 'Pending', 'Overdue', 'Failed'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
            <Download size={16} /> Export
          </button>
          <button onClick={() => setModal('add')} className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">
            <Plus size={16} /> Record Payment
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>{['ID', 'Household', 'Zone', 'Amount', 'Method', 'Month', 'Date', 'Status', 'Actions'].map(h => <th key={h} className="px-5 py-3 text-left">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 font-mono text-xs text-gray-500">{p.id}</td>
                  <td className="px-5 py-4 font-medium text-gray-800">{p.household}</td>
                  <td className="px-5 py-4 text-gray-600">{p.zone}</td>
                  <td className="px-5 py-4 font-semibold text-gray-800">{p.amount}</td>
                  <td className="px-5 py-4 text-gray-600">{p.method}</td>
                  <td className="px-5 py-4 text-gray-600 text-xs">{p.month}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{p.date}</td>
                  <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[p.status]}`}>{p.status}</span></td>
                  <td className="px-5 py-4">
                    <button onClick={() => { setSelected(p); setModal('view'); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Eye size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-10 text-gray-400 text-sm">No payments found.</p>}
        </div>
      </div>

      {modal === 'add' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-800">Record Payment</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              {([['Household Name', 'household', 'text'], ['Amount', 'amount', 'text'], ['Date', 'date', 'date'], ['Month', 'month', 'text']] as [string, keyof typeof form, string][]).map(([label, k, type]) => (
                <div key={String(k)}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  <input type={type} value={String(form[k])} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Zone</label>
                <select value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {['Kicukiro', 'Gasabo', 'Nyarugenge', 'Remera'].map(z => <option key={z}>{z}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Method</label>
                <select value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value as Payment['method'] }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {['Mobile Money', 'Bank Transfer', 'Cash'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Payment['status'] }))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  {['Paid', 'Pending', 'Overdue', 'Failed'].map(s => <option key={s}>{s}</option>)}
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
              <h3 className="font-bold text-gray-800">Payment Receipt</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-3">
              {[['Payment ID', selected.id], ['Household', selected.household], ['Zone', selected.zone], ['Amount', selected.amount], ['Method', selected.method], ['Month', selected.month], ['Date', selected.date]].map(([k, v]) => (
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
