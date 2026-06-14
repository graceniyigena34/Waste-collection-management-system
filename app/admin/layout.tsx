'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Truck, Users, Building2, CreditCard,
  MessageSquare, BarChart3, Settings, Home,
  LogOut, Menu, X, ChevronRight, ClipboardList, PackagePlus,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: Home, href: '/admin' },
  { label: 'Households', icon: Users, href: '/admin/households' },
  { label: 'Waste Companies', icon: Building2, href: '/admin/company-approvals' },
  { label: 'Applications', icon: ClipboardList, href: '/admin/applications' },
  { label: 'Payments', icon: CreditCard, href: '/admin/payments' },
  { label: 'Complaints', icon: MessageSquare, href: '/admin/complaints' },
  { label: 'Pickup Requests', icon: PackagePlus, href: '/admin/pickup-requests' },
  { label: 'Reports', icon: BarChart3, href: '/admin/reports' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // Desktop: open by default; Mobile: closed by default
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(window.innerWidth >= 1024);
  }, []);

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    router.push('/signin');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop: shrinks to w-0; mobile: drawer */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30
          lg:relative lg:z-auto
          flex flex-col flex-shrink-0
          bg-gradient-to-b from-green-900 to-green-800 text-white
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 lg:w-0 -translate-x-full lg:translate-x-0 overflow-hidden'}
        `}
      >
        <div className="w-64 flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-green-700">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Truck size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-wide whitespace-nowrap">EcoTrack</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto lg:hidden p-1.5 rounded-lg hover:bg-white/20 transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-4 border-b border-green-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-400 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">AD</div>
              <div className="min-w-0">
                <p className="text-sm font-semibold whitespace-nowrap">Administrator</p>
                <p className="text-xs text-green-300 truncate">admin@EcoTrack.rw</p>
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
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    active ? 'bg-white/20 text-white' : 'text-green-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {label}
                  {active && <ChevronRight size={14} className="ml-auto flex-shrink-0" />}
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
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-gray-900">
                {navItems.find(n => n.href === pathname)?.label ?? 'Admin'}
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                {new Date().toLocaleDateString('en-RW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 transition"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
