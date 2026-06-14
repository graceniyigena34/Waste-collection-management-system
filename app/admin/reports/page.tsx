'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Users, Truck, DollarSign, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { api, BackendPayment, BackendComplaint, BackendHousehold, BackendDriverWithCompany } from '@/lib/api-client';

interface MonthlyPoint { month: string; collections: number; revenue: number; complaints: number; }
interface ZoneRow { zone: string; households: number; revenue: number; complaints: number; }

function buildMonthlyData(payments: BackendPayment[], complaints: BackendComplaint[]): MonthlyPoint[] {
  const map = new Map<string, MonthlyPoint>();
  const monthLabel = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
  };

  payments.forEach(p => {
    const key = p.payment_date ? monthLabel(p.payment_date) : p.month?.slice(0, 7) ?? 'Unknown';
    const cur = map.get(key) ?? { month: key, collections: 0, revenue: 0, complaints: 0 };
    if (p.status === 'Paid') { cur.collections += 1; cur.revenue += Number(p.amount); }
    map.set(key, cur);
  });

  complaints.forEach(c => {
    const key = c.created_at ? monthLabel(c.created_at) : 'Unknown';
    const cur = map.get(key) ?? { month: key, collections: 0, revenue: 0, complaints: 0 };
    cur.complaints += 1;
    map.set(key, cur);
  });

  return Array.from(map.values()).slice(-7);
}

function buildZoneData(households: BackendHousehold[], payments: BackendPayment[], complaints: BackendComplaint[]): ZoneRow[] {
  const zones = new Map<string, ZoneRow>();

  households.forEach(h => {
    const z = h.district || 'Unknown';
    const cur = zones.get(z) ?? { zone: z, households: 0, revenue: 0, complaints: 0 };
    cur.households += 1;
    zones.set(z, cur);
  });

  payments.filter(p => p.status === 'Paid').forEach(p => {
    const h = households.find(h => h.id === p.household_id);
    const z = h?.district || 'Unknown';
    const cur = zones.get(z) ?? { zone: z, households: 0, revenue: 0, complaints: 0 };
    cur.revenue += Number(p.amount);
    zones.set(z, cur);
  });

  complaints.forEach(c => {
    const h = households.find(h => h.id === c.household_id);
    const z = h?.district || 'Unknown';
    const cur = zones.get(z) ?? { zone: z, households: 0, revenue: 0, complaints: 0 };
    cur.complaints += 1;
    zones.set(z, cur);
  });

  return Array.from(zones.values()).sort((a, b) => b.households - a.households);
}

function exportCSV(zones: ZoneRow[]) {
  const rows = [
    ['Zone', 'Households', 'Revenue (RWF)', 'Complaints'],
    ...zones.map(z => [z.zone, z.households, z.revenue, z.complaints]),
  ];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'zone-report.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'collections' | 'revenue' | 'complaints'>('collections');
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<BackendPayment[]>([]);
  const [complaints, setComplaints] = useState<BackendComplaint[]>([]);
  const [households, setHouseholds] = useState<BackendHousehold[]>([]);
  const [drivers, setDrivers] = useState<BackendDriverWithCompany[]>([]);

  useEffect(() => {
    Promise.all([
      api.payments.all().catch(() => [] as BackendPayment[]),
      api.complaints.all().catch(() => [] as BackendComplaint[]),
      api.households.all().catch(() => [] as BackendHousehold[]),
      api.drivers.listAll().catch(() => ({ drivers: [] as BackendDriverWithCompany[] })),
    ]).then(([p, c, h, d]) => {
      setPayments(p);
      setComplaints(c);
      setHouseholds(h);
      setDrivers(d.drivers ?? []);
      setLoading(false);
    });
  }, []);

  const paidPayments = payments.filter(p => p.status === 'Paid');
  const totalRevenue = paidPayments.reduce((s, p) => s + Number(p.amount), 0);
  const monthlyData = buildMonthlyData(payments, complaints);
  const zoneData = buildZoneData(households, payments, complaints);
  const maxHouseholds = Math.max(...zoneData.map(z => z.households), 1);

  const kpis = [
    { label: 'Total Households', value: households.length.toString(), icon: <Truck size={20} className="text-green-600" />, bg: 'bg-green-50', color: 'text-green-600' },
    { label: 'Total Revenue', value: `${(totalRevenue / 1000).toFixed(0)}K RWF`, icon: <DollarSign size={20} className="text-purple-600" />, bg: 'bg-purple-50', color: 'text-purple-600' },
    { label: 'Paid Payments', value: paidPayments.length.toString(), icon: <CheckCircle size={20} className="text-blue-600" />, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Total Complaints', value: complaints.length.toString(), icon: <AlertTriangle size={20} className="text-orange-500" />, bg: 'bg-orange-50', color: 'text-orange-500' },
  ];

  const barValue = (d: MonthlyPoint) => {
    if (activeTab === 'collections') return d.collections;
    if (activeTab === 'revenue') return Math.round(d.revenue / 1000);
    return d.complaints;
  };
  const maxVal = Math.max(...monthlyData.map(barValue), 1);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-green-600" size={32} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className={`${k.bg} rounded-2xl p-5`}>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-3">{k.icon}</div>
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-gray-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 size={18} className="text-purple-600" /> Monthly Overview
          </h2>
          <div className="flex gap-2">
            {(['collections', 'revenue', 'complaints'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${activeTab === tab ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        {monthlyData.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-12">No data yet.</p>
        ) : (
          <div className="flex items-end gap-3 h-48">
            {monthlyData.map(d => {
              const val = barValue(d);
              const pct = (val / maxVal) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500 font-medium">{activeTab === 'revenue' ? `${val}K` : val}</span>
                  <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '160px' }}>
                    <div className="absolute bottom-0 w-full bg-green-500 rounded-t-lg transition-all duration-500" style={{ height: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-500">{d.month}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Zone breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600" /> District Breakdown
          </h2>
          <button onClick={() => exportCSV(zoneData)} className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-50 transition">
            <Download size={14} /> Export CSV
          </button>
        </div>
        {zoneData.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-10">No household data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>{['District', 'Households', 'Share', 'Revenue (RWF)', 'Complaints'].map(h => <th key={h} className="px-6 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {zoneData.map(z => (
                  <tr key={z.zone} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">{z.zone}</td>
                    <td className="px-6 py-4 text-gray-600">{z.households}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(z.households / maxHouseholds) * 100}%` }} />
                        </div>
                        <span className="text-xs text-gray-600">{Math.round((z.households / households.length) * 100)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{z.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600">{z.complaints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drivers */}
      {drivers.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={18} className="text-green-600" /> Drivers
          </h2>
          <div className="space-y-3">
            {drivers.slice(0, 5).map((d, i) => (
              <div key={d.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-400' : 'bg-green-500'}`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.company_name ?? '—'} {d.zone ? `• ${d.zone}` : ''}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${d.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {d.status ?? 'active'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
