'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, Building2, DollarSign, AlertTriangle,
  BarChart3, FileText, MapPin, CreditCard, MessageSquare,
  ClipboardList, Loader2,
} from 'lucide-react';
import {
  api,
  BackendHousehold,
  BackendComplaint,
  BackendCompanyProfile,
  BackendDriverWithCompany,
  BackendPayment,
} from '@/lib/api-client';

const priorityStyle: Record<string, string> = {
  Urgent: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};
const statusStyle: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Resolved: 'bg-green-100 text-green-700',
};

function fmtRwf(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M RWF`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K RWF`;
  return `${n} RWF`;
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

const ZONE_COLORS = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500'];

export default function AdminDashboard() {
  const router = useRouter();

  const [households, setHouseholds] = useState<BackendHousehold[]>([]);
  const [complaints, setComplaints] = useState<BackendComplaint[]>([]);
  const [companies, setCompanies] = useState<BackendCompanyProfile[]>([]);
  const [drivers, setDrivers] = useState<BackendDriverWithCompany[]>([]);
  const [payments, setPayments] = useState<BackendPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.households.all(),
      api.complaints.all(),
      api.companies.all(),
      api.drivers.listAll(),
      api.payments.all(),
    ]).then(([h, c, co, d, p]) => {
      if (h.status === 'fulfilled') setHouseholds(h.value);
      if (c.status === 'fulfilled') setComplaints(c.value);
      if (co.status === 'fulfilled') setCompanies(co.value.data ?? []);
      if (d.status === 'fulfilled') setDrivers(d.value.drivers ?? []);
      if (p.status === 'fulfilled') setPayments(p.value);
      setLoading(false);
    });
  }, []);

  const totalHouseholds = households.length;
  const activeComplaints = complaints.filter(c => c.status !== 'Resolved').length;
  const urgentComplaints = complaints.filter(c => c.priority === 'Urgent' && c.status !== 'Resolved').length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const totalCompanies = companies.length;
  const approvedCompanies = companies.filter(c => c.status === 'approved').length;
  const totalDrivers = drivers.length;
  const paidPayments = payments.filter(p => p.status === 'Paid');
  const totalRevenue = paidPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
    .slice(0, 5);

  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
    .slice(0, 5);

  const districtCounts = households.reduce((acc, h) => {
    acc[h.district] = (acc[h.district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topDistricts = Object.entries(districtCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([district, count], i) => ({
      district,
      count,
      pct: Math.round((count / Math.max(totalHouseholds, 1)) * 100),
      color: ZONE_COLORS[i] ?? 'bg-gray-500',
    }));

  const v = (n: number) => (loading ? '…' : n.toLocaleString());

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading dashboard data…
        </div>
      )}

      {/* Top stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          {
            label: 'Total Households',
            value: v(totalHouseholds),
            sub: 'Registered households',
            icon: <Users size={22} className="text-blue-600" />,
            iconBg: 'bg-blue-100',
            valueColor: 'text-blue-600',
          },
          {
            label: 'Active Complaints',
            value: v(activeComplaints),
            sub: loading ? '' : `${urgentComplaints} marked urgent`,
            icon: <AlertTriangle size={22} className="text-orange-500" />,
            iconBg: 'bg-orange-100',
            valueColor: 'text-orange-500',
          },
          {
            label: 'Total Revenue',
            value: loading ? '…' : fmtRwf(totalRevenue),
            sub: loading ? '' : `${paidPayments.length} paid payments`,
            icon: <DollarSign size={22} className="text-purple-600" />,
            iconBg: 'bg-purple-100',
            valueColor: 'text-purple-600',
          },
          {
            label: 'Waste Companies',
            value: v(totalCompanies),
            sub: loading ? '' : `${approvedCompanies} approved`,
            icon: <Building2 size={22} className="text-green-600" />,
            iconBg: 'bg-green-100',
            valueColor: 'text-green-600',
          },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 ${s.iconBg} rounded-xl flex items-center justify-center`}>{s.icon}</div>
            </div>
            <p className={`text-2xl font-bold ${s.valueColor}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Waste Collectors', value: v(totalDrivers), icon: <Users size={18} className="text-blue-500" />, bg: 'bg-blue-50' },
          { label: 'Approved Companies', value: v(approvedCompanies), icon: <Building2 size={18} className="text-emerald-600" />, bg: 'bg-emerald-50' },
          { label: 'Pending Complaints', value: v(pendingComplaints), icon: <AlertTriangle size={18} className="text-orange-500" />, bg: 'bg-orange-50' },
          { label: 'Paid Payments', value: v(paidPayments.length), icon: <CreditCard size={18} className="text-purple-500" />, bg: 'bg-purple-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 flex items-center gap-3 border border-white`}>
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">{s.icon}</div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="font-bold text-gray-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* District breakdown + Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-5">
            <MapPin size={18} className="text-green-600" /> Households by District
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-24 text-gray-400 text-sm">
              <Loader2 size={16} className="animate-spin mr-2" /> Loading…
            </div>
          ) : topDistricts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No household data yet</p>
          ) : (
            <div className="space-y-4">
              {topDistricts.map((z) => (
                <div key={z.district}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700">{z.district}</span>
                    <span className="text-gray-500">{z.count} ({z.pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className={`${z.color} h-2.5 rounded-full`} style={{ width: `${z.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-5">
            <CreditCard size={18} className="text-blue-600" /> Recent Payments
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-24 text-gray-400 text-sm">
              <Loader2 size={16} className="animate-spin mr-2" /> Loading…
            </div>
          ) : recentPayments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No payments yet</p>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      p.status === 'Paid' ? 'bg-green-500' : p.status === 'Pending' ? 'bg-yellow-400' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{p.full_name || `User #${p.user_id}`}</p>
                      <p className="text-xs text-gray-500">{p.month}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">{Number(p.amount).toLocaleString()} RWF</p>
                    <p className="text-xs text-gray-400">{timeAgo(p.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Complaints table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare size={18} className="text-orange-500" /> Recent Complaints
          </h2>
          <button onClick={() => router.push('/admin/complaints')} className="text-xs text-green-700 font-medium hover:underline">View all</button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-24 text-gray-400 text-sm">
            <Loader2 size={16} className="animate-spin mr-2" /> Loading…
          </div>
        ) : recentComplaints.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No complaints yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  {['ID', 'User', 'Zone', 'Issue', 'Priority', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-6 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">C-{String(c.id).padStart(3, '0')}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{c.full_name || `User #${c.user_id}`}</td>
                    <td className="px-6 py-4 text-gray-600">{c.zone || '–'}</td>
                    <td className="px-6 py-4 text-gray-600">{c.issue_type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${priorityStyle[c.priority] ?? 'bg-gray-100 text-gray-600'}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[c.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : '–'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-purple-600" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {[
            { label: 'Households', icon: Users, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100', href: '/admin/households' },
            { label: 'Waste Companies', icon: Building2, color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100', href: '/admin/company-approvals' },
            { label: 'Applications', icon: ClipboardList, color: 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100', href: '/admin/applications' },
            { label: 'Routes', icon: MapPin, color: 'text-purple-600 bg-purple-50 hover:bg-purple-100', href: '/admin/routes' },
            { label: 'Payments', icon: CreditCard, color: 'text-orange-600 bg-orange-50 hover:bg-orange-100', href: '/admin/payments' },
            { label: 'Complaints', icon: MessageSquare, color: 'text-red-600 bg-red-50 hover:bg-red-100', href: '/admin/complaints' },
            { label: 'Reports', icon: FileText, color: 'text-gray-600 bg-gray-50 hover:bg-gray-100', href: '/admin/reports' },
          ].map(({ label, icon: Icon, color, href }) => (
            <button key={label} onClick={() => router.push(href)} className={`flex flex-col items-center gap-2 p-4 rounded-xl font-medium text-sm transition ${color}`}>
              <Icon size={22} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
