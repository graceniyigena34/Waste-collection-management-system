'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar, CreditCard, Bell,
  AlertCircle, CheckCircle, Trash2,
  MapPin, User, ArrowRight, Truck,
  DollarSign, MessageSquare, Loader2,
} from 'lucide-react';
import {
  api,
  getStoredUserInfo,
  type BackendCompanySchedule,
  type BackendPayment,
  type BackendNotification,
  type BackendHousehold,
} from '@/lib/api-client';

const statusStyle: Record<string, string> = {
  Paid:      'bg-green-100 text-green-700',
  Pending:   'bg-yellow-100 text-yellow-700',
  Overdue:   'bg-red-100 text-red-700',
  Failed:    'bg-red-100 text-red-700',
  Scheduled: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-gray-100 text-gray-500',
};

function fmtScheduleDate(d: string) {
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtTime(t?: string) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h, 10);
  return `${hour % 12 || 12}:${m} ${hour < 12 ? 'AM' : 'PM'}`;
}

function timeAgo(d?: string) {
  if (!d) return '';
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

export default function UserDashboard() {
  const router = useRouter();
  const user = getStoredUserInfo();

  const [household, setHousehold] = useState<BackendHousehold | null>(null);
  const [schedules, setSchedules] = useState<BackendCompanySchedule[]>([]);
  const [payments, setPayments] = useState<BackendPayment[]>([]);
  const [notifications, setNotifications] = useState<BackendNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [hRes, sRes, pRes, nRes] = await Promise.allSettled([
          api.households.me(),
          api.companySchedules.forCitizen(),
          api.payments.me(),
          api.notifications.list(),
        ]);
        if (hRes.status === 'fulfilled') setHousehold(hRes.value);
        if (sRes.status === 'fulfilled') setSchedules(sRes.value.schedules ?? []);
        if (pRes.status === 'fulfilled') setPayments(Array.isArray(pRes.value) ? pRes.value : []);
        if (nRes.status === 'fulfilled') setNotifications(Array.isArray(nRes.value) ? nRes.value : []);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const address = household
    ? `${household.sector}, ${household.district}`
    : user?.fullName ? 'Kigali' : '';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingSchedules = schedules
    .filter(s => new Date(s.schedule_date) >= today && s.status !== 'Cancelled')
    .sort((a, b) => new Date(a.schedule_date).getTime() - new Date(b.schedule_date).getTime());

  const completedSchedules = schedules.filter(s => s.status === 'Completed');
  const nextCollection = upcomingSchedules[0];

  const pendingPayment = payments.find(p => p.status === 'Pending' || p.status === 'Overdue');
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
    .slice(0, 4);

  const unread = notifications.filter(n => !n.read).length;
  const recentNotifs = [...notifications]
    .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
    .slice(0, 3);

  const getNotifIcon = (type: string) => {
    if (type === 'info')    return <Bell className="text-blue-500" size={15} />;
    if (type === 'warning') return <AlertCircle className="text-yellow-500" size={15} />;
    return <CheckCircle className="text-green-500" size={15} />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">

      {/* Welcome header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {firstName}! 👋</h1>
          {address && (
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
              <MapPin size={13} /> {address}
            </p>
          )}
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
        {/* Next collection */}
        <div
          onClick={() => router.push('/User-Dashboard/Schedule')}
          className="bg-green-50 rounded-2xl p-4 cursor-pointer hover:shadow-md transition border border-white"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Calendar size={20} className="text-green-600" />
            </div>
            <ArrowRight size={14} className="text-gray-400" />
          </div>
          <p className="font-bold text-gray-800 text-base leading-tight">
            {nextCollection
              ? new Date(nextCollection.schedule_date).toLocaleDateString('en-US', { weekday: 'short' })
              : 'None'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Next Collection</p>
          <p className="text-xs text-gray-400">
            {nextCollection ? fmtTime(nextCollection.start_time) || '—' : 'No upcoming'}
          </p>
        </div>

        {/* Pending payment */}
        <div
          onClick={() => router.push('/User-Dashboard/Payments')}
          className="bg-orange-50 rounded-2xl p-4 cursor-pointer hover:shadow-md transition border border-white"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <CreditCard size={20} className="text-orange-600" />
            </div>
            <ArrowRight size={14} className="text-gray-400" />
          </div>
          <p className="font-bold text-gray-800 text-base leading-tight">
            {pendingPayment ? `${pendingPayment.amount.toLocaleString()} RWF` : '0 RWF'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Pending Payment</p>
          <p className="text-xs text-gray-400">
            {pendingPayment ? pendingPayment.month : 'Up to date'}
          </p>
        </div>

        {/* Total collections */}
        <div
          onClick={() => router.push('/User-Dashboard/Schedule')}
          className="bg-blue-50 rounded-2xl p-4 cursor-pointer hover:shadow-md transition border border-white"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Trash2 size={20} className="text-blue-600" />
            </div>
            <ArrowRight size={14} className="text-gray-400" />
          </div>
          <p className="font-bold text-gray-800 text-base leading-tight">{completedSchedules.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Collections</p>
          <p className="text-xs text-gray-400">All time</p>
        </div>

        {/* Account status */}
        <div
          onClick={() => router.push('/User-Dashboard/Customer')}
          className="bg-purple-50 rounded-2xl p-4 cursor-pointer hover:shadow-md transition border border-white"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <User size={20} className="text-purple-600" />
            </div>
            <ArrowRight size={14} className="text-gray-400" />
          </div>
          <p className="font-bold text-gray-800 text-base leading-tight">Active</p>
          <p className="text-xs text-gray-500 mt-0.5">Account Status</p>
          <p className="text-xs text-gray-400">
            {household?.sector ? `Zone — ${household.sector}` : household?.district ? `District — ${household.district}` : 'Set your location'}
          </p>
        </div>
      </div>

      {/* Upcoming collections + Notifications */}
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
          {upcomingSchedules.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Truck size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No upcoming collections scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSchedules.slice(0, 3).map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Truck size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{s.waste_type}</p>
                      <p className="text-xs text-gray-500">{fmtScheduleDate(s.schedule_date)}{s.start_time ? ` · ${fmtTime(s.start_time)}` : ''}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[s.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {s.status}
                  </span>
                </div>
              ))}
              {completedSchedules.slice(0, 1).map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                      <Truck size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{s.waste_type}</p>
                      <p className="text-xs text-gray-500">{fmtScheduleDate(s.schedule_date)}{s.start_time ? ` · ${fmtTime(s.start_time)}` : ''}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[s.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          )}
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
          {recentNotifs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Bell size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentNotifs.map(n => (
                <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl ${!n.read ? 'bg-blue-50/60' : 'bg-gray-50'}`}>
                  <div className="mt-0.5">{getNotifIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.created_at)}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
        {recentPayments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <CreditCard size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No payment records yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPayments.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${p.status === 'Paid' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    <CreditCard size={16} className={p.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{p.month}</p>
                    <p className="text-xs text-gray-500">
                      {p.payment_date ? new Date(p.payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : p.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">{p.amount.toLocaleString()} RWF</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[p.status] ?? 'bg-gray-100 text-gray-500'}`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {pendingPayment && (
          <button
            onClick={() => router.push('/User-Dashboard/Payments')}
            className="mt-4 w-full py-2.5 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition flex items-center justify-center gap-2"
          >
            Pay Now – {pendingPayment.amount.toLocaleString()} RWF <ArrowRight size={15} />
          </button>
        )}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Schedule',   icon: Calendar,      color: 'text-blue-600 bg-blue-50 hover:bg-blue-100',      href: '/User-Dashboard/Schedule' },
            { label: 'Payments',   icon: CreditCard,    color: 'text-orange-600 bg-orange-50 hover:bg-orange-100', href: '/User-Dashboard/Payments' },
            { label: 'Complaints', icon: MessageSquare, color: 'text-red-600 bg-red-50 hover:bg-red-100',          href: '/User-Dashboard/Complaints' },
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
