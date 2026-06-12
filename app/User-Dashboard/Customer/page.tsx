'use client';

import React, { useEffect, useState } from 'react';
import {
  User, Mail, MapPin, BadgeCheck,
  Home, Hash, Truck, Shield, Clock, Loader2, RefreshCw,
} from 'lucide-react';
import { api, type BackendAuthUser } from '@/lib/api-client';

interface HouseholdData {
  district: string;
  sector: string;
  cell: string;
  village: string;
  street_address: string;
  house_type: string;
  residents: string;
  created_at?: string;
}

const roleLabel = (role?: string) => {
  if (!role) return 'Citizen';
  const r = role.toLowerCase();
  if (r === 'citizen') return 'Citizen';
  if (r === 'waste_collector') return 'Waste Collector';
  if (r === 'admin') return 'Administrator';
  return role;
};

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      {icon && <div className="mt-0.5 text-gray-400 flex-shrink-0">{icon}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5 break-words">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function PersonalInfoPage() {
  const [user, setUser] = useState<BackendAuthUser | null>(null);
  const [household, setHousehold] = useState<HouseholdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch both in parallel
      const [profileRes, householdRes] = await Promise.allSettled([
        api.auth.profile(),
        api.households.me(),
      ]);

      if (profileRes.status === 'fulfilled') {
        setUser(profileRes.value);
      } else {
        // Fallback to localStorage
        const raw = localStorage.getItem('user_info');
        if (raw) {
          const parsed = JSON.parse(raw) as { fullName?: string; email?: string; role?: string; userId?: string };
          setUser({
            id: Number(parsed.userId ?? 0),
            full_name: parsed.fullName ?? '',
            email: parsed.email ?? '',
            role: (parsed.role ?? 'citizen') as BackendAuthUser['role'],
          });
        }
      }

      if (householdRes.status === 'fulfilled') {
        const h = householdRes.value as { household?: Record<string, string> };
        const raw = h.household ?? (householdRes.value as Record<string, string>);
        setHousehold({
          district: String(raw.district ?? ''),
          sector: String(raw.sector ?? ''),
          cell: String(raw.cell ?? ''),
          village: String(raw.village ?? ''),
          street_address: String(raw.street_address ?? raw.streetAddress ?? ''),
          house_type: String(raw.house_type ?? raw.houseType ?? ''),
          residents: String(raw.residents ?? ''),
          created_at: String(raw.created_at ?? ''),
        });
      } else {
        // Fallback to localStorage
        const hraw = localStorage.getItem('household_details');
        if (hraw) {
          const h = JSON.parse(hraw) as Record<string, string>;
          setHousehold({
            district: h.district ?? '',
            sector: h.sector ?? '',
            cell: h.cell ?? '',
            village: h.village ?? '',
            street_address: h.streetAddress ?? h.street_address ?? '',
            house_type: h.houseType ?? h.house_type ?? '',
            residents: String(h.residents ?? ''),
          });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadData(); }, []);

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const memberSince = household?.created_at
    ? new Date(household.created_at).getFullYear().toString()
    : user?.created_at
    ? new Date(user.created_at).getFullYear().toString()
    : '2025';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
          <p className="text-gray-500 text-sm mt-1">Your account details and household information</p>
        </div>
        <button
          onClick={() => void loadData()}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Profile hero card */}
      <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-3xl p-6 text-white">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold truncate">{user?.full_name || 'My Account'}</h2>
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          {[
            { label: 'Account ID', value: user?.id ? `#${user.id}` : '—' },
            { label: 'Role', value: roleLabel(user?.role) },
            { label: 'Member Since', value: memberSince },
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
          <Field label="Full Name" value={user?.full_name ?? '—'} icon={<User size={15} />} />
          <Field label="Email Address" value={user?.email ?? '—'} icon={<Mail size={15} />} />
          <Field label="Account ID" value={user?.id ? `#${user.id}` : '—'} icon={<Hash size={15} />} />
          <Field label="Role" value={roleLabel(user?.role)} icon={<BadgeCheck size={15} />} />
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-green-600" />
            </div>
            <h3 className="font-bold text-gray-800">Account Details</h3>
          </div>
          <Field label="Account Status" value="Active" icon={<BadgeCheck size={15} />} />
          <Field label="Service Type" value="Household Waste Collection" icon={<Truck size={15} />} />
          <Field label="Collection Zone" value={household?.district || '—'} icon={<MapPin size={15} />} />
          <Field label="Member Since" value={memberSince} icon={<Clock size={15} />} />
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
            <>
              <Field label="District" value={household.district} icon={<MapPin size={15} />} />
              <Field label="Sector" value={household.sector} icon={<MapPin size={15} />} />
              <Field label="Cell" value={household.cell} icon={<MapPin size={15} />} />
              <Field label="Village" value={household.village} icon={<MapPin size={15} />} />
            </>
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
            <>
              <Field label="Street Address" value={household.street_address} icon={<Home size={15} />} />
              <Field label="House Type" value={household.house_type} icon={<Home size={15} />} />
              <Field label="Number of Residents" value={household.residents} icon={<User size={15} />} />
            </>
          )}
        </div>

      </div>

      {/* Info note */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
        <Shield size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Read-only profile</p>
          <p className="text-xs text-blue-600 mt-0.5">
            Your personal information is managed by EcoTrack. To update your name, email, or household details, please contact support at{' '}
            <span className="font-semibold">support@ecotrack.rw</span>.
          </p>
        </div>
      </div>

    </div>
  );
}
