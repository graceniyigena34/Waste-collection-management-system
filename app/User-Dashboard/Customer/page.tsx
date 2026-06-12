'use client';

import { useEffect, useState } from 'react';
import {
  User, Mail, MapPin, BadgeCheck,
  Home, Hash, Truck, Shield, Clock, Loader2, RefreshCw,
  Pencil, Check, X, Phone, Save,
} from 'lucide-react';
import { api, type BackendAuthUser, type BackendHousehold } from '@/lib/api-client';

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

const DISTRICTS = [
  'Gasabo','Kicukiro','Nyarugenge','Bugesera','Gatsibo','Kayonza','Kirehe','Ngoma',
  'Nyagatare','Rwamagana','Burera','Gakenke','Gicumbi','Musanze','Rulindo',
  'Gisagara','Huye','Kamonyi','Muhanga','Nyamagabe','Nyanza','Nyaruguru','Ruhango',
  'Karongi','Ngororero','Nyabihu','Nyamasheke','Rubavu','Rutsiro','Rusizi',
];

const HOUSE_TYPES = ['RESIDENTIAL', 'APARTMENT', 'COMMERCIAL', 'VILLA'];

export default function PersonalInfoPage() {
  const [user, setUser] = useState<BackendAuthUser | null>(null);
  const [household, setHousehold] = useState<BackendHousehold | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ full_name: '', telephone: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Household edit state
  const [editingHousehold, setEditingHousehold] = useState(false);
  const [householdForm, setHouseholdForm] = useState({
    district: '', sector: '', cell: '', village: '',
    street_address: '', house_type: '', residents: '',
  });
  const [householdSaving, setHouseholdSaving] = useState(false);
  const [householdError, setHouseholdError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profileRes, householdRes] = await Promise.allSettled([
        api.auth.profile(),
        api.households.me(),
      ]);

      if (profileRes.status === 'fulfilled') {
        setUser(profileRes.value);
        setProfileForm({
          full_name: profileRes.value.full_name ?? '',
          telephone: profileRes.value.telephone ?? '',
        });
      } else {
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
        const h = householdRes.value;
        setHousehold(h);
        setHouseholdForm({
          district: h.district ?? '',
          sector: h.sector ?? '',
          cell: h.cell ?? '',
          village: h.village ?? '',
          street_address: h.street_address ?? '',
          house_type: h.house_type ?? '',
          residents: String(h.residents ?? ''),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadData(); }, []);

  const saveProfile = async () => {
    setProfileSaving(true);
    setProfileError('');
    try {
      const res = await api.auth.updateProfile({
        full_name: profileForm.full_name.trim() || undefined,
        telephone: profileForm.telephone.trim() || undefined,
      });
      setUser(res.user);
      setEditingProfile(false);
      // Update localStorage too
      const raw = localStorage.getItem('user_info');
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, string>;
        localStorage.setItem('user_info', JSON.stringify({ ...parsed, fullName: res.user.full_name }));
      }
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const saveHousehold = async () => {
    setHouseholdSaving(true);
    setHouseholdError('');
    try {
      await api.households.update({
        district: householdForm.district || undefined,
        sector: householdForm.sector || undefined,
        cell: householdForm.cell || undefined,
        village: householdForm.village || undefined,
        street_address: householdForm.street_address || undefined,
        house_type: householdForm.house_type || undefined,
        residents: householdForm.residents ? Number(householdForm.residents) : undefined,
      });
      await loadData();
      setEditingHousehold(false);
    } catch (err) {
      setHouseholdError(err instanceof Error ? err.message : 'Failed to update household.');
    } finally {
      setHouseholdSaving(false);
    }
  };

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

      {/* Profile hero */}
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
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <User size={16} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800">Contact Information</h3>
            </div>
            {!editingProfile ? (
              <button
                onClick={() => setEditingProfile(true)}
                className="flex items-center gap-1 text-xs text-green-700 hover:text-green-900 border border-green-200 bg-green-50 rounded-lg px-2.5 py-1.5 transition"
              >
                <Pencil size={12} /> Edit
              </button>
            ) : (
              <div className="flex gap-1">
                <button
                  onClick={() => void saveProfile()}
                  disabled={profileSaving}
                  className="flex items-center gap-1 text-xs text-white bg-green-700 hover:bg-green-800 rounded-lg px-2.5 py-1.5 transition disabled:opacity-60"
                >
                  {profileSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  Save
                </button>
                <button
                  onClick={() => { setEditingProfile(false); setProfileError(''); }}
                  className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg px-2.5 py-1.5 transition"
                >
                  <X size={12} /> Cancel
                </button>
              </div>
            )}
          </div>

          {profileError && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">{profileError}</p>
          )}

          {editingProfile ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Full Name</label>
                <input
                  value={profileForm.full_name}
                  onChange={e => setProfileForm(f => ({ ...f, full_name: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Phone Number</label>
                <input
                  value={profileForm.telephone}
                  onChange={e => setProfileForm(f => ({ ...f, telephone: e.target.value }))}
                  placeholder="+250 7XX XXX XXX"
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <p className="text-xs text-gray-400">Email address cannot be changed here.</p>
            </div>
          ) : (
            <>
              <Field label="Full Name" value={user?.full_name ?? '—'} icon={<User size={15} />} />
              <Field label="Email Address" value={user?.email ?? '—'} icon={<Mail size={15} />} />
              <Field label="Phone Number" value={user?.telephone ?? household?.telephone ?? '—'} icon={<Phone size={15} />} />
              <Field label="Account ID" value={user?.id ? `#${user.id}` : '—'} icon={<Hash size={15} />} />
              <Field label="Role" value={roleLabel(user?.role)} icon={<BadgeCheck size={15} />} />
            </>
          )}
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
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <MapPin size={16} className="text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-800">Household Location</h3>
            </div>
            {household && !editingHousehold && (
              <button
                onClick={() => setEditingHousehold(true)}
                className="flex items-center gap-1 text-xs text-green-700 hover:text-green-900 border border-green-200 bg-green-50 rounded-lg px-2.5 py-1.5 transition"
              >
                <Pencil size={12} /> Edit
              </button>
            )}
            {editingHousehold && (
              <div className="flex gap-1">
                <button
                  onClick={() => void saveHousehold()}
                  disabled={householdSaving}
                  className="flex items-center gap-1 text-xs text-white bg-green-700 hover:bg-green-800 rounded-lg px-2.5 py-1.5 transition disabled:opacity-60"
                >
                  {householdSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                  Save
                </button>
                <button
                  onClick={() => { setEditingHousehold(false); setHouseholdError(''); }}
                  className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg px-2.5 py-1.5 transition"
                >
                  <X size={12} /> Cancel
                </button>
              </div>
            )}
          </div>

          {householdError && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">{householdError}</p>
          )}

          {!household ? (
            <div className="text-center py-6">
              <MapPin size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">No household details found.</p>
              <a href="/household-details" className="text-green-700 text-sm font-semibold hover:underline mt-1 inline-block">
                Complete your profile →
              </a>
            </div>
          ) : editingHousehold ? (
            <div className="space-y-3">
              {([
                { key: 'district' as const, label: 'District', type: 'select' as const, options: DISTRICTS },
                { key: 'sector' as const, label: 'Sector', type: 'text' as const, options: [] as string[] },
                { key: 'cell' as const, label: 'Cell', type: 'text' as const, options: [] as string[] },
                { key: 'village' as const, label: 'Village', type: 'text' as const, options: [] as string[] },
              ]).map(({ key, label, type, options }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</label>
                  {type === 'select' ? (
                    <select
                      value={householdForm[key]}
                      onChange={e => setHouseholdForm(f => ({ ...f, [key]: e.target.value }))}
                      className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      <option value="">Select district</option>
                      {options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      value={householdForm[key]}
                      onChange={e => setHouseholdForm(f => ({ ...f, [key]: e.target.value }))}
                      className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  )}
                </div>
              ))}
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
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <Home size={16} className="text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-800">Address Details</h3>
            </div>
            {household && !editingHousehold && (
              <button
                onClick={() => setEditingHousehold(true)}
                className="flex items-center gap-1 text-xs text-green-700 hover:text-green-900 border border-green-200 bg-green-50 rounded-lg px-2.5 py-1.5 transition"
              >
                <Pencil size={12} /> Edit
              </button>
            )}
          </div>

          {!household ? (
            <div className="text-center py-6">
              <Home size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">No address details found.</p>
            </div>
          ) : editingHousehold ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Street Address</label>
                <input
                  value={householdForm.street_address}
                  onChange={e => setHouseholdForm(f => ({ ...f, street_address: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">House Type</label>
                <select
                  value={householdForm.house_type}
                  onChange={e => setHouseholdForm(f => ({ ...f, house_type: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  {HOUSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Number of Residents</label>
                <input
                  type="number"
                  min="1"
                  value={householdForm.residents}
                  onChange={e => setHouseholdForm(f => ({ ...f, residents: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>
          ) : (
            <>
              <Field label="Street Address" value={household.street_address} icon={<Home size={15} />} />
              <Field label="House Type" value={household.house_type} icon={<Home size={15} />} />
              <Field label="Number of Residents" value={String(household.residents)} icon={<User size={15} />} />
            </>
          )}
        </div>

      </div>
    </div>
  );
}
