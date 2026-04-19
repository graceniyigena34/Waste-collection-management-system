'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Users, Truck, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

const monthlyData = [
  { month: 'Jul', collections: 120, revenue: 72000, complaints: 8 },
  { month: 'Aug', collections: 135, revenue: 81000, complaints: 6 },
  { month: 'Sep', collections: 128, revenue: 76800, complaints: 10 },
  { month: 'Oct', collections: 142, revenue: 85200, complaints: 7 },
  { month: 'Nov', collections: 138, revenue: 82800, complaints: 9 },
  { month: 'Dec', collections: 150, revenue: 90000, complaints: 5 },
  { month: 'Jan', collections: 156, revenue: 93600, complaints: 12 },
];

const zoneData = [
  { zone: 'Kicukiro', households: 820, collected: 88, revenue: '24.6K RWF', complaints: 4 },
  { zone: 'Gasabo', households: 950, collected: 72, revenue: '28.5K RWF', complaints: 5 },
  { zone: 'Nyarugenge', households: 680, collected: 65, revenue: '20.4K RWF', complaints: 2 },
  { zone: 'Remera', households: 397, collected: 91, revenue: '11.9K RWF', complaints: 1 },
];

const maxCollections = Math.max(...monthlyData.map(d => d.collections));

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'collections' | 'revenue' | 'complaints'>('collections');

  const kpis = [
    { label: 'Total Collections (YTD)', value: '969', change: '+14%', icon: <Truck size={20} className="text-green-600" />, bg: 'bg-green-50', color: 'text-green-600' },
    { label: 'Total Revenue (YTD)', value: '581K RWF', change: '+11%', icon: <DollarSign size={20} className="text-purple-600" />, bg: 'bg-purple-50', color: 'text-purple-600' },
    { label: 'Avg Completion Rate', value: '85%', change: '+3%', icon: <CheckCircle size={20} className="text-blue-600" />, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Total Complaints', value: '57', change: '-8%', icon: <AlertTriangle size={20} className="text-orange-500" />, bg: 'bg-orange-50', color: 'text-orange-500' },
  ];

  const barValue = (d: typeof monthlyData[0]) => {
    if (activeTab === 'collections') return d.collections;
    if (activeTab === 'revenue') return d.revenue / 1000;
    return d.complaints;
  };
  const maxVal = Math.max(...monthlyData.map(barValue));

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className={`${k.bg} rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">{k.icon}</div>
              <span className={`text-xs font-semibold ${k.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{k.change} vs last year</span>
            </div>
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
        <div className="flex items-end gap-3 h-48">
          {monthlyData.map(d => {
            const val = barValue(d);
            const pct = (val / maxVal) * 100;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">{activeTab === 'revenue' ? `${val}K` : val}</span>
                <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '160px' }}>
                  <div
                    className="absolute bottom-0 w-full bg-green-500 rounded-t-lg transition-all duration-500"
                    style={{ height: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zone breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600" /> Zone Performance Breakdown
          </h2>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-50 transition">
            <Download size={14} /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>{['Zone', 'Households', 'Collection Rate', 'Revenue', 'Complaints', 'Performance'].map(h => <th key={h} className="px-6 py-3 text-left">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {zoneData.map(z => (
                <tr key={z.zone} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">{z.zone}</td>
                  <td className="px-6 py-4 text-gray-600">{z.households.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${z.collected}%` }} />
                      </div>
                      <span className="text-xs text-gray-600">{z.collected}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{z.revenue}</td>
                  <td className="px-6 py-4 text-gray-600">{z.complaints}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${z.collected >= 85 ? 'bg-green-100 text-green-700' : z.collected >= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {z.collected >= 85 ? 'Excellent' : z.collected >= 70 ? 'Good' : 'Needs Attention'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver performance */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Users size={18} className="text-green-600" /> Top Performing Drivers
        </h2>
        <div className="space-y-3">
          {[
            { name: 'Nkurunziza Pierre', routes: 245, rating: 4.8, zone: 'Kicukiro' },
            { name: 'Mutesi Diane', routes: 178, rating: 4.7, zone: 'Remera' },
            { name: 'Uwase Claudine', routes: 198, rating: 4.6, zone: 'Gasabo' },
            { name: 'Hakizimana Robert', routes: 156, rating: 4.5, zone: 'Nyarugenge' },
          ].map((d, i) => (
            <div key={d.name} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-400' : 'bg-green-500'}`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">{d.name}</p>
                <p className="text-xs text-gray-500">{d.zone} • {d.routes} routes completed</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-yellow-500">★ {d.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
