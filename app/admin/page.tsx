'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Truck, Users, DollarSign, AlertTriangle, TrendingUp,
  BarChart3, FileText, MapPin, CreditCard, MessageSquare,
  ArrowUpRight, ArrowDownRight, Clock,
} from 'lucide-react';

const stats = [
  { label: 'Total Households', value: '2,847', sub: 'Registered households', trend: 'up', trendValue: '+12% this month', icon: <Users size={22} className="text-blue-600" />, iconBg: 'bg-blue-100', valueColor: 'text-blue-600' },
  { label: "Today's Collections", value: '156', sub: '85% completion rate', trend: 'up', trendValue: '+5% vs yesterday', icon: <Truck size={22} className="text-green-600" />, iconBg: 'bg-green-100', valueColor: 'text-green-600' },
  { label: 'Monthly Revenue', value: '85K RWF', sub: 'Collected this month', trend: 'up', trendValue: '+8% vs last month', icon: <DollarSign size={22} className="text-purple-600" />, iconBg: 'bg-purple-100', valueColor: 'text-purple-600' },
  { label: 'Active Complaints', value: '12', sub: '3 marked urgent', trend: 'down', trendValue: '-2 since yesterday', icon: <AlertTriangle size={22} className="text-orange-500" />, iconBg: 'bg-orange-100', valueColor: 'text-orange-500' },
];

const secondaryStats = [
  { label: 'Active Drivers', value: '24', icon: <Users size={18} className="text-blue-500" />, bg: 'bg-blue-50' },
  { label: 'Fleet Size', value: '18 trucks', icon: <Truck size={18} className="text-green-500" />, bg: 'bg-green-50' },
  { label: 'Efficiency Rate', value: '87%', icon: <TrendingUp size={18} className="text-purple-500" />, bg: 'bg-purple-50' },
  { label: 'Zones Covered', value: '20', icon: <MapPin size={18} className="text-orange-500" />, bg: 'bg-orange-50' },
];

const activities = [
  { id: '1', title: 'Collection Completed', desc: 'Kicukiro Zone A — 95 households served', time: '10 min ago', dot: 'bg-green-500' },
  { id: '2', title: 'New Complaint Filed', desc: 'Missed pickup reported in Gasabo', time: '2 hrs ago', dot: 'bg-red-500' },
  { id: '3', title: 'Payment Received', desc: 'Monthly payment from 45 households', time: '5 hrs ago', dot: 'bg-blue-500' },
  { id: '4', title: 'Driver Assigned', desc: 'Jean Paul assigned to Route C-3', time: '6 hrs ago', dot: 'bg-purple-500' },
  { id: '5', title: 'Route Updated', desc: 'Route B-2 schedule changed to 10 AM', time: '8 hrs ago', dot: 'bg-yellow-500' },
];

const complaints = [
  { id: 'C-001', household: 'Uwimana Marie', zone: 'Kicukiro', issue: 'Missed Collection', priority: 'Urgent', status: 'Pending', date: 'Jan 15, 2025' },
  { id: 'C-002', household: 'Habimana Jean', zone: 'Gasabo', issue: 'Damaged Bin', priority: 'High', status: 'In Progress', date: 'Jan 14, 2025' },
  { id: 'C-003', household: 'Mukamana Alice', zone: 'Nyarugenge', issue: 'Late Collection', priority: 'Medium', status: 'Pending', date: 'Jan 13, 2025' },
  { id: 'C-004', household: 'Niyonzima Paul', zone: 'Kicukiro', issue: 'Billing Issue', priority: 'Low', status: 'Resolved', date: 'Jan 12, 2025' },
];

const zoneProgress = [
  { zone: 'Kicukiro', pct: 88, color: 'bg-green-500' },
  { zone: 'Gasabo', pct: 72, color: 'bg-blue-500' },
  { zone: 'Nyarugenge', pct: 65, color: 'bg-purple-500' },
  { zone: 'Remera', pct: 91, color: 'bg-orange-500' },
];

const priorityStyle: Record<string, string> = { Urgent: 'bg-red-100 text-red-700', High: 'bg-orange-100 text-orange-700', Medium: 'bg-yellow-100 text-yellow-700', Low: 'bg-green-100 text-green-700' };
const statusStyle: Record<string, string> = { Pending: 'bg-yellow-100 text-yellow-700', 'In Progress': 'bg-blue-100 text-blue-700', Resolved: 'bg-green-100 text-green-700' };

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 ${s.iconBg} rounded-xl flex items-center justify-center`}>{s.icon}</div>
              <span className={`flex items-center gap-1 text-xs font-medium ${s.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                {s.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {s.trendValue}
              </span>
            </div>
            <p className={`text-2xl font-bold ${s.valueColor}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {secondaryStats.map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 flex items-center gap-3 border border-white`}>
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">{s.icon}</div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="font-bold text-gray-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Zone progress + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-5">
            <MapPin size={18} className="text-green-600" /> Zone Collection Progress
          </h2>
          <div className="space-y-4">
            {zoneProgress.map((z) => (
              <div key={z.zone}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700">{z.zone}</span>
                  <span className="text-gray-500">{z.pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className={`${z.color} h-2.5 rounded-full`} style={{ width: `${z.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-5">
            <Clock size={18} className="text-blue-600" /> Recent Activity
          </h2>
          <div className="space-y-4">
            {activities.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <div className={`w-2.5 h-2.5 ${a.dot} rounded-full mt-1.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{a.title}</p>
                  <p className="text-xs text-gray-500 truncate">{a.desc}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complaints table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare size={18} className="text-orange-500" /> Recent Complaints
          </h2>
          <button onClick={() => router.push('/admin/complaints')} className="text-xs text-green-700 font-medium hover:underline">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                {['ID', 'Household', 'Zone', 'Issue', 'Priority', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-6 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {complaints.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{c.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{c.household}</td>
                  <td className="px-6 py-4 text-gray-600">{c.zone}</td>
                  <td className="px-6 py-4 text-gray-600">{c.issue}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${priorityStyle[c.priority]}`}>{c.priority}</span></td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[c.status]}`}>{c.status}</span></td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-purple-600" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Households', icon: Users, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100', href: '/admin/households' },
            { label: 'Drivers', icon: Truck, color: 'text-green-600 bg-green-50 hover:bg-green-100', href: '/admin/drivers' },
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
