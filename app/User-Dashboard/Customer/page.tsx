'use client';

import React, { useEffect, useState } from 'react';
import {
  User, Phone, Mail, MapPin, Calendar, BadgeCheck,
  Home, Hash, Truck, Shield, Clock,
} from 'lucide-react';

interface UserInfo {
  fullName: string;
  email: string;
  role: string;
  userId: string;
}

interface HouseholdDetails {
  district: string;
  sector: string;
  cell: string;
  village: string;
  streetAddress: string;
  houseType: string;
  residents: string;
}

export default function PersonalInfoPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [household, setHousehold] = useState<HouseholdDetails | null>(null);

  useEffect(() => {
    // Load from localStorage
    try {
      const raw = localStorage.getItem('user_info');
      if (raw) setUser(JSON.parse(raw));

      const hraw = localStorage.getItem('household_details');
      if (hraw) {
        const h = JSON.parse(hraw);
        setHousehold({
          district: h.district || '—',
          sector: h.sector || '—',
          cell: h.cell || '—',
          village: h.village || '—',
          streetAddress: h.streetAddress || '—',
          houseType: h.houseType || '—',
          residents: String(h.residents || '—'),
        });
      }
    } catch {
      // silent
    }
  }, []);

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const roleLabel = (role?: string) => {
    if (!role) return 'Citizen';
    const r = role.toLowerCase();
    if (r === 'citizen') return 'Citizen';
    if (r === 'waste_collector') return 'Waste Collector';
    if (r === 'admin') return 'Administrator';
    return role;
  };

  const Field = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      {icon && <div className="mt-0.5 text-gray-400 flex-shrink-0">{icon}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
        <p className="text-gray-500 text-sm mt-1">Your account details and household information</p>
      </div>

      {/* Profile card */}
      <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-3xl p-6 text-white">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold truncate">{user?.fullName || 'My Account'}</h2>
            <p className="text-green-200 text-sm mt-0.5 truncate">{user?.email || '—'}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                <BadgeCheck size={12} /> {roleLabel(user?.role)}
              </span>
              <span className="flex items-center gap-1 bg-green-500/40 text-white text-xs font-semibold px-3 py-1 rounded-full">
                <Shield size={12} /> Active Account
              </span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { label: 'Account ID', value: user?.userId ? `#${user.userId}` : '—' },
            { label: 'Role', value: roleLabel(user?.role) },
            { label: 'Status', value: 'Active' },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-2xl p-3 text-center">
              <p className="text-white font-bold text-sm truncate">{s.value}</p>
              <p className="text-green-300 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <User size={16} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800">Contact Information</h3>
          </div>
          <div className="space-y-0">
            <Field label="Full Name" value={user?.fullName || '—'} icon={<User size={15} />} />
            <Field label="Email Address" value={user?.email || '—'} icon={<Mail size={15} />} />
            <Field label="Account ID" value={user?.userId ? `#${user.userId}` : '—'} icon={<Hash size={15} />} />
            <Field label="Role" value={roleLabel(user?.role)} icon={<BadgeCheck size={15} />} />
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-green-600" />
            </div>
            <h3 className="font-bold text-gray-800">Account Details</h3>
          </div>
          <div className="space-y-0">
            <Field label="Account Status" value="Active" icon={<BadgeCheck size={15} />} />
            <Field label="Service Type" value="Household Waste Collection" icon={<Truck size={15} />} />
            <Field label="Collection Zone" value={household?.district || '—'} icon={<MapPin size={15} />} />
            <Field label="Member Since" value="2025" icon={<Clock size={15} />} />
          </div>
        </div>

        {/* Household Location */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <MapPin size={16} className="text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-800">Household Location</h3>
          </div>
          {!household ? (
            <div className="text-center py-6">
              <MapPin size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">No household details found.</p>
              <a href="/household-details" className="text-green-700 text-sm font-semibold hover:underline mt-1 inline-block">
                Complete your profile →
              </a>
            </div>
          ) : (
            <div className="space-y-0">
              <Field label="District" value={household.district} icon={<MapPin size={15} />} />
              <Field label="Sector" value={household.sector} icon={<MapPin size={15} />} />
              <Field label="Cell" value={household.cell} icon={<MapPin size={15} />} />
              <Field label="Village" value={household.village} icon={<MapPin size={15} />} />
            </div>
          )}
        </div>

        {/* Address Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <Home size={16} className="text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-800">Address Details</h3>
          </div>
          {!household ? (
            <div className="text-center py-6">
              <Home size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">No address details found.</p>
            </div>
          ) : (
            <div className="space-y-0">
              <Field label="Street Address" value={household.streetAddress} icon={<Home size={15} />} />
              <Field label="House Type" value={household.houseType} icon={<Home size={15} />} />
              <Field label="Number of Residents" value={household.residents} icon={<User size={15} />} />
            </div>
          )}
        </div>

      </div>

      {/* Info note */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
        <Shield size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Read-only profile</p>
          <p className="text-xs text-blue-600 mt-0.5">
            Your personal information is managed by EcoTrack. To update your name, email, or household details, please contact support at <span className="font-semibold">support@ecotrack.rw</span>.
          </p>
        </div>
      </div>

    </div>
  );
}
