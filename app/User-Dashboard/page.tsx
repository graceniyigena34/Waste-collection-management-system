'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar, CreditCard, Bell, MessageSquare,
  TrendingUp, AlertCircle, CheckCircle, Trash2,
  MapPin, Route, User, ArrowRight, Truck,
  Clock, DollarSign, Leaf,
} from 'lucide-react';

interface UserInfo { fullName: string; email: string; userId: string; role: string; }
interface HouseholdDetails { district: string; sector: string; cell: string; village: string; streetAddress: string; houseType: string; residents: string; }

const schedules = [
  { id: '1', date: 'Wed, Dec 4, 2025', time: '08:00 AM', wasteType: 'General Waste', status: 'scheduled', zone: 'Gasabo' },
  { id: '2', date: 'Wed, Dec 11, 2025', time: '08:00 AM', wasteType: 'Recyclables', status: 'scheduled', zone: 'Gasabo' },
  { id: '3', date: 'Wed, Nov 27, 2025', time: '08:00 AM', wasteType: 'General Waste', status: 'completed', zone: 'Gasabo' },
];

const payments = [
  { id: '1', amount: '3,000 RWF', date: 'Jan 12, 2025', status: 'paid', description: 'January 2025' },
  { id: '2', amount: '3,000 RWF', date: 'Dec 10, 2024', status: 'paid', description: 'December 2024' },
  { id: '3', amount: '3,000 RWF', date: 'Feb 15, 2025', status: 'pending', description: 'February 2025' },
];

const notifications = [
  { id: '1', title: 'Collection Tomorrow', message: 'Your waste collection is scheduled for tomorrow at 8:00 AM', time: '2 hrs ago', read: false, type: 'info' },
  { id: '2', title: 'Payment Due', message: 'Your monthly payment of 3,000 RWF is due on Feb 15', time: '1 day ago', read: false, type: 'warning' },
  { id: '3', title: 'Collection Completed', message: 'Your Nov 27 collection was completed successfully', time: '3 days ago', read: true, type: 'success' },
];

const statusStyle: Record<string, string> = {
  paid: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700',
  overdue: 'bg-red-100 text-red-700', scheduled: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700', missed: 'bg-red-100 text-red-700',
};

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [household, setHousehold] = useState<HouseholdDetails | null>(null);
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    try {
      const u = localStorage.getItem('user_info');
      if (u) setUser(JSON.parse(u));
      const h = localStorage.getItem('household_details');
      if (h) setHousehold(JSON.parse(h));
    } catch { /* silent */ }
  }, []);

  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const zone = household?.district || 'Gasabo';
  const address = household ? `${household.sector}, ${household.district}` : 'Kigali';
  const pendingPay = payments.find(p => p.status === 'pending');
  const nextCollection = schedules.find(s => s.status === 'scheduled');

  const getNotifIcon = (type: string) => {
    if (type === 'info') return <Bell className="text-blue-500" size={15} />;
    if (type === 'warning') return <AlertCircle className="text-yellow-500" size={15} />;
    return <CheckCircle className="text-green-500" size={15} />;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">

      {/* Welcome header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {firstName}! 👋</h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
            <MapPin size={13} /> {address}
          </p>
        </div>
        <button
          onClick={() => router.push('/User-Dashboard/Notifications')}
          className="relative p-3 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 transition"
        >
          <Bell size={20} className="text-gray-600" />
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {unread}
            </span>
          )}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Next Collection', value: nextCollection?.date.split(',')[0] || 'Wed Dec 4', sub: nextCollection?.time || '8:00 AM', icon: <Calendar size={20} className="text-green-600" />, bg: 'bg-green-50', click: '/User-Dashboard/Schedule' },
          { label: 'Pending Payment', value: pendingPay?.amount || '0 RWF', sub: pendingPay?.description || 'Up to date', icon: <CreditCard size={20} className="text-orange-600" />, bg: 'bg-orange-50', click: '/User-Dashboard/Payments' },
          { label: 'Total Collections', value: '12', sub: 'This year', icon: <Trash2 size={20} className="text-blue-600" />, bg: 'bg-blue-50', click: '/User-Dashboard/Schedule' },
          { label: 'Account Status', value: 'Active', sub: 'Zone – ' + zone, icon: <User size={20} className="text-purple-600" />, bg: 'bg-purple-50', click: '/User-Dashboard/Customer' },
        ].map(s => (
          <div
            key={s.label}
            onClick={() => router.push(s.click)}
            className={`${s.bg} rounded-2xl p-4 cursor-pointer hover:shadow-md transition border border-white`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">{s.icon}</div>
              <ArrowRight size={14} className="text-gray-400" />
            </div>
            <p className="font-bold text-gray-800 text-base leading-tight">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            <p className="text-xs text-gray-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Upcoming collection + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Upcoming collections */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Calendar size={17} className="text-green-600" /> Upcoming Collections
            </h2>
            <button onClick={() => router.push('/User-Dashboard/Schedule')} className="text-xs text-green-700 font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {schedules.slice(0, 3).map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'}`}>
                    <Truck size={16} className={s.status === 'completed' ? 'text-green-600' : 'text-blue-600'} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{s.wasteType}</p>
                    <p className="text-xs text-gray-500">{s.date} · {s.time}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[s.status]}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Bell size={17} className="text-blue-600" /> Notifications
              {unread > 0 && <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unread}</span>}
            </h2>
            <button onClick={() => router.push('/User-Dashboard/Notifications')} className="text-xs text-green-700 font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl ${!n.read ? 'bg-blue-50/60' : 'bg-gray-50'}`}>
                <div className="mt-0.5">{getNotifIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                </div>
                {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent payments + Environmental impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <DollarSign size={17} className="text-orange-600" /> Recent Payments
            </h2>
            <button onClick={() => router.push('/User-Dashboard/Payments')} className="text-xs text-green-700 font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${p.status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    <CreditCard size={16} className={p.status === 'paid' ? 'text-green-600' : 'text-yellow-600'} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{p.description}</p>
                    <p className="text-xs text-gray-500">{p.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">{p.amount}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[p.status]}`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
          {pendingPay && (
            <button
              onClick={() => router.push('/User-Dashboard/Payments')}
              className="mt-4 w-full py-2.5 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition flex items-center justify-center gap-2"
            >
              Pay Now – {pendingPay.amount} <ArrowRight size={15} />
            </button>
          )}
        </div>

        {/* Environmental impact */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Leaf size={17} className="text-green-600" /> Environmental Impact
          </h2>
          <div className="space-y-5">
            {[
              { label: 'Monthly Waste Collected', value: 45, max: 60, unit: 'kg', color: 'bg-green-500' },
              { label: 'Recycling Rate', value: 78, max: 100, unit: '%', color: 'bg-blue-500' },
              { label: 'Collection Completion', value: 92, max: 100, unit: '%', color: 'bg-purple-500' },
            ].map(m => (
              <div key={m.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">{m.label}</span>
                  <span className="font-semibold text-gray-800">{m.value}{m.unit}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className={`${m.color} h-2.5 rounded-full transition-all`} style={{ width: `${(m.value / m.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 bg-green-50 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp size={18} className="text-green-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">Great job!</p>
              <p className="text-xs text-green-700">Your recycling rate is above the district average of 65%.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Schedule', icon: Calendar, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100', href: '/User-Dashboard/Schedule' },
            { label: 'Route', icon: Route, color: 'text-green-600 bg-green-50 hover:bg-green-100', href: '/User-Dashboard/Route' },
            { label: 'Payments', icon: CreditCard, color: 'text-orange-600 bg-orange-50 hover:bg-orange-100', href: '/User-Dashboard/Payments' },
            { label: 'Complaints', icon: MessageSquare, color: 'text-red-600 bg-red-50 hover:bg-red-100', href: '/User-Dashboard/Complaints' },
          ].map(({ label, icon: Icon, color, href }) => (
            <button
              key={label}
              onClick={() => router.push(href)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl font-medium text-sm transition ${color}`}
            >
              <Icon size={22} />
              {label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
