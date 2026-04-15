'use client';

import React, { useState } from 'react';
import { Settings, User, Bell, MapPin, Shield, Save, Plus, Trash2 } from 'lucide-react';

const tabs = ['Profile', 'System', 'Notifications', 'Zones'] as const;
type Tab = typeof tabs[number];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({ name: 'Administrator', email: 'admin@greenex.rw', phone: '+250 799 5586', organization: 'GreenEx Rwanda', role: 'Super Admin' });
  const [system, setSystem] = useState({ collectionFee: '3000', currency: 'RWF', paymentDueDays: '15', maxComplaintsPerHousehold: '5', autoAssignDrivers: true, sendReminders: true });
  const [notifications, setNotifications] = useState({ emailAlerts: true, smsAlerts: true, newComplaint: true, paymentOverdue: true, missedCollection: true, driverOffDuty: false });
  const [zones, setZones] = useState(['Kicukiro', 'Gasabo', 'Nyarugenge', 'Remera']);
  const [newZone, setNewZone] = useState('');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addZone = () => {
    if (newZone.trim() && !zones.includes(newZone.trim())) {
      setZones(prev => [...prev, newZone.trim()]);
      setNewZone('');
    }
  };

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition";
  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-green-600' : 'bg-gray-300'}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <Save size={16} /> Settings saved successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 flex gap-1">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${activeTab === tab ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Profile */}
      {activeTab === 'Profile' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <h2 className="font-bold text-gray-800 flex items-center gap-2"><User size={18} className="text-green-600" /> Admin Profile</h2>
          <div className="flex items-center gap-4 pb-4 border-b">
            <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">AD</div>
            <div>
              <p className="font-semibold text-gray-800">{profile.name}</p>
              <p className="text-sm text-gray-500">{profile.role}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {([['Full Name', 'name', 'text'], ['Email', 'email', 'email'], ['Phone', 'phone', 'tel'], ['Organization', 'organization', 'text']] as [string, keyof typeof profile, string][]).map(([label, k, type]) => (
              <div key={k}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input type={type} value={profile[k]} onChange={e => setProfile(p => ({ ...p, [k]: e.target.value }))} className={inputClass} />
              </div>
            ))}
          </div>
          <div className="pt-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
            <input type="password" placeholder="Enter to change password" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
              <input type="password" placeholder="New password" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Confirm Password</label>
              <input type="password" placeholder="Confirm password" className={inputClass} />
            </div>
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">
            <Save size={16} /> Save Profile
          </button>
        </div>
      )}

      {/* System */}
      {activeTab === 'System' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <h2 className="font-bold text-gray-800 flex items-center gap-2"><Settings size={18} className="text-green-600" /> System Configuration</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Collection Fee (RWF)</label>
              <input type="number" value={system.collectionFee} onChange={e => setSystem(s => ({ ...s, collectionFee: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Currency</label>
              <select value={system.currency} onChange={e => setSystem(s => ({ ...s, currency: e.target.value }))} className={inputClass}>
                {['RWF', 'USD', 'EUR'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Payment Due (days after month start)</label>
              <input type="number" value={system.paymentDueDays} onChange={e => setSystem(s => ({ ...s, paymentDueDays: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Max Complaints per Household</label>
              <input type="number" value={system.maxComplaintsPerHousehold} onChange={e => setSystem(s => ({ ...s, maxComplaintsPerHousehold: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div className="space-y-3 pt-2">
            {([['Auto-assign drivers to routes', 'autoAssignDrivers'], ['Send payment reminders', 'sendReminders']] as [string, keyof typeof system][]).map(([label, k]) => (
              <div key={k} className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-700">{label}</span>
                <Toggle checked={Boolean(system[k])} onChange={() => setSystem(s => ({ ...s, [k]: !s[k] }))} />
              </div>
            ))}
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">
            <Save size={16} /> Save Settings
          </button>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'Notifications' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2"><Bell size={18} className="text-green-600" /> Notification Preferences</h2>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Channels</p>
            {([['Email Alerts', 'emailAlerts'], ['SMS Alerts', 'smsAlerts']] as [string, keyof typeof notifications][]).map(([label, k]) => (
              <div key={k} className="flex items-center justify-between py-3 border-b border-gray-50">
                <span className="text-sm text-gray-700">{label}</span>
                <Toggle checked={notifications[k]} onChange={() => setNotifications(n => ({ ...n, [k]: !n[k] }))} />
              </div>
            ))}
          </div>
          <div className="space-y-1 pt-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Alert Types</p>
            {([['New Complaint Filed', 'newComplaint'], ['Payment Overdue', 'paymentOverdue'], ['Missed Collection', 'missedCollection'], ['Driver Off Duty', 'driverOffDuty']] as [string, keyof typeof notifications][]).map(([label, k]) => (
              <div key={k} className="flex items-center justify-between py-3 border-b border-gray-50">
                <span className="text-sm text-gray-700">{label}</span>
                <Toggle checked={notifications[k]} onChange={() => setNotifications(n => ({ ...n, [k]: !n[k] }))} />
              </div>
            ))}
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">
            <Save size={16} /> Save Preferences
          </button>
        </div>
      )}

      {/* Zones */}
      {activeTab === 'Zones' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2"><MapPin size={18} className="text-green-600" /> Manage Zones</h2>
          <div className="flex gap-2">
            <input value={newZone} onChange={e => setNewZone(e.target.value)} onKeyDown={e => e.key === 'Enter' && addZone()} placeholder="New zone name..." className={`${inputClass} flex-1`} />
            <button onClick={addZone} className="flex items-center gap-2 px-4 py-2.5 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">
              <Plus size={16} /> Add
            </button>
          </div>
          <div className="space-y-2">
            {zones.map(z => (
              <div key={z} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-green-600" />
                  <span className="text-sm font-medium text-gray-800">{z}</span>
                </div>
                <button onClick={() => setZones(prev => prev.filter(zone => zone !== z))} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">
            <Save size={16} /> Save Zones
          </button>
        </div>
      )}
    </div>
  );
}
