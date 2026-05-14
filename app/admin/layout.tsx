'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Truck, Users, DollarSign, MapPin, CreditCard,
  MessageSquare, BarChart3, Settings, Home,
  LogOut, Bell, Menu, X, ChevronRight, ClipboardList,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: Home, href: '/admin' },
  { label: 'Households', icon: Users, href: '/admin/households' },
  { label: 'Waste Collectors', icon: Truck, href: '/admin/waste-collectors' },
  { label: 'Applications', icon: ClipboardList, href: '/admin/applications' },
  { label: 'Routes', icon: MapPin, href: '/admin/routes' },
  { label: 'Payments', icon: CreditCard, href: '/admin/payments' },
  { label: 'Complaints', icon: MessageSquare, href: '/admin/complaints' },
  { label: 'Reports', icon: BarChart3, href: '/admin/reports' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    router.push('/signin');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} transition-all duration-300 bg-gradient-to-b from-green-900 to-green-800 text-white flex flex-col flex-shrink-0`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-green-700">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Truck size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-wide">EcoTrack</span>
        </div>

        <div className="px-6 py-4 border-b border-green-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-400 rounded-full flex items-center justify-center font-bold text-sm">AD</div>
            <div>
              <p className="text-sm font-semibold">Administrator</p>
              <p className="text-xs text-green-300">admin@EcoTrack.rw</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, href }) => {
            const active = pathname === href;
            return (
              <button
                key={href}
                onClick={() => router.push(href)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-white/20 text-white' : 'text-green-200 hover:bg-white/10 hover:text-white'}`}
              >
                <Icon size={18} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-green-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 transition">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {navItems.find(n => n.href === pathname)?.label ?? 'Admin'}
              </h1>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString('en-RW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
