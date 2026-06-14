'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  BarChart3, TrendingUp, Download, Users, Truck,
  DollarSign, AlertTriangle, CheckCircle, Loader2,
} from 'lucide-react';
import { api, BackendPayment, BackendComplaint, BackendHousehold, BackendDriverWithCompany } from '@/lib/api-client';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function toMonthKey(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'Unknown';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function displayMonth(key: string): string {
  const [year, mon] = key.split('-');
  if (!year || !mon) return key;
  return `${MONTH_NAMES[parseInt(mon) - 1]} '${year.slice(2)}`;
}

interface MonthlyPoint { key: string; label: string; collections: number; revenue: number; complaints: number; }
interface ZoneRow { zone: string; households: number; revenue: number; }

function buildMonthlyData(payments: BackendPayment[], complaints: BackendComplaint[]): MonthlyPoint[] {
  const map = new Map<string, MonthlyPoint>();

  const getOrCreate = (key: string): MonthlyPoint => {
    if (!map.has(key)) map.set(key, { key, label: displayMonth(key), collections: 0, revenue: 0, complaints: 0 });
    return map.get(key)!;
  };

  payments.forEach(p => {
    const raw = p.payment_date ?? p.created_at ?? p.month ?? '';
    const key = raw ? toMonthKey(raw) : 'Unknown';
    const pt = getOrCreate(key);
    if (p.status === 'Paid') { pt.collections += 1; pt.revenue += Number(p.amount); }
  });

  complaints.forEach(c => {
    const key = c.created_at ? toMonthKey(c.created_at) : 'Unknown';
    getOrCreate(key).complaints += 1;
  });

  return Array.from(map.values())
    .filter(p => p.key !== 'Unknown')
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(-8);
}

function buildZoneData(households: BackendHousehold[], payments: BackendPayment[]): ZoneRow[] {
  const zones = new Map<string, ZoneRow>();
  households.forEach(h => {
    const z = h.district || 'Unknown';
    const cur = zones.get(z) ?? { zone: z, households: 0, revenue: 0 };
    cur.households += 1;
    zones.set(z, cur);
  });
  payments.filter(p => p.status === 'Paid').forEach(p => {
    const h = households.find(h => h.id === p.household_id);
    const z = h?.district || 'Unknown';
    const cur = zones.get(z) ?? { zone: z, households: 0, revenue: 0 };
    cur.revenue += Number(p.amount);
    zones.set(z, cur);
  });
  return Array.from(zones.values()).sort((a, b) => b.households - a.households);
}

function exportCSV(zones: ZoneRow[], households: number) {
  const rows = [
    ['District', 'Households', 'Share (%)', 'Revenue (RWF)'],
    ...zones.map(z => [z.zone, z.households, Math.round((z.households / Math.max(households, 1)) * 100), z.revenue]),
  ];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'district-report.csv'; a.click();
  URL.revokeObjectURL(url);
}

const TAB_CONFIG = {
  collections: { label: 'Collections', color: 'rgba(34,197,94,0.85)', border: 'rgb(22,163,74)', yLabel: 'Paid Payments' },
  revenue:     { label: 'Revenue (K RWF)', color: 'rgba(147,51,234,0.85)', border: 'rgb(126,34,206)', yLabel: 'Revenue (K RWF)' },
  complaints:  { label: 'Complaints', color: 'rgba(249,115,22,0.85)', border: 'rgb(234,88,12)', yLabel: 'Complaints' },
} as const;

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
      setPayments(p); setComplaints(c); setHouseholds(h);
      setDrivers(d.drivers ?? []);
      setLoading(false);
    });
  }, []);

  const paidPayments = payments.filter(p => p.status === 'Paid');
  const totalRevenue = paidPayments.reduce((s, p) => s + Number(p.amount), 0);
  const monthlyData = buildMonthlyData(payments, complaints);
  const zoneData = buildZoneData(households, payments);
  const maxHouseholds = Math.max(...zoneData.map(z => z.households), 1);

  const cfg = TAB_CONFIG[activeTab];

  const chartData = {
    labels: monthlyData.map(d => d.label),
    datasets: [{
      label: cfg.label,
      data: monthlyData.map(d =>
        activeTab === 'collections' ? d.collections :
        activeTab === 'revenue' ? Math.round(d.revenue / 1000) :
        d.complaints
      ),
      backgroundColor: cfg.color,
      borderColor: cfg.border,
      borderWidth: 1.5,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { parsed: { y: number } }) =>
            activeTab === 'revenue' ? `${ctx.parsed.y}K RWF` : `${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          color: '#6b7280',
          font: { size: 12 },
          callback: (v: number | string) =>
            activeTab === 'revenue' ? `${v}K` : v,
        },
        title: { display: true, text: cfg.yLabel, color: '#9ca3af', font: { size: 11 } },
      },
    },
  };

  const kpis = [
    { label: 'Total Households', value: households.length.toString(), icon: <Truck size={20} className="text-green-600" />, bg: 'bg-green-50', color: 'text-green-600' },
    { label: 'Total Revenue', value: totalRevenue >= 1000 ? `${Math.round(totalRevenue / 1000)}K RWF` : `${totalRevenue} RWF`, icon: <DollarSign size={20} className="text-purple-600" />, bg: 'bg-purple-50', color: 'text-purple-600' },
    { label: 'Paid Payments', value: paidPayments.length.toString(), icon: <CheckCircle size={20} className="text-blue-600" />, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Total Complaints', value: complaints.length.toString(), icon: <AlertTriangle size={20} className="text-orange-500" />, bg: 'bg-orange-50', color: 'text-orange-500' },
  ];

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

      {/* Chart.js Bar Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 size={18} className="text-purple-600" /> Monthly Overview
          </h2>
          <div className="flex gap-2">
            {(['collections', 'revenue', 'complaints'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                  activeTab === tab ? 'text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={activeTab === tab ? { backgroundColor: TAB_CONFIG[tab].border } : {}}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {monthlyData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <BarChart3 size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No data yet</p>
          </div>
        ) : (
          <div style={{ height: 280 }}>
            <Bar data={chartData} options={chartOptions as Parameters<typeof Bar>[0]['options']} />
          </div>
        )}
      </div>

      {/* District breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600" /> District Breakdown
          </h2>
          <button
            onClick={() => exportCSV(zoneData, households.length)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-50 transition"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
        {zoneData.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-10">No household data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  {['District', 'Households', 'Share', 'Revenue (RWF)'].map(h => (
                    <th key={h} className="px-6 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {zoneData.map(z => (
                  <tr key={z.zone} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">{z.zone}</td>
                    <td className="px-6 py-4 text-gray-600">{z.households}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(z.households / maxHouseholds) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {Math.round((z.households / Math.max(households.length, 1)) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{z.revenue.toLocaleString()}</td>
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                  i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-400' : 'bg-green-500'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.company_name ?? '—'}{d.zone ? ` • ${d.zone}` : ''}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                  d.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
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
