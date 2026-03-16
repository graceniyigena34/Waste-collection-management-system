'use client'
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { Bell, User, Settings, LogOut, LayoutDashboard, Route, Home, MapPin, CreditCard, MessageSquare, Truck } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(false);
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [dropdownOpen]);

  const getActiveTab = () => {
    if (pathname.includes('/wasteCompanyDashboard/zones')) return 'Zones';
    if (pathname.includes('/wasteCompanyDashboard/routes')) return 'Routes';
    if (pathname.includes('/wasteCompanyDashboard/households')) return 'Households';
    if (pathname.includes('/wasteCompanyDashboard/tariffs')) return 'Tariffs';
    if (pathname.includes('/wasteCompanyDashboard/payments')) return 'Payments';
    if (pathname.includes('/wasteCompanyDashboard/complaints')) return 'Complaints';
    if (pathname.includes('/wasteCompanyDashboard/pickup-session')) return 'Pickup Session';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-green-900 text-white p-6 space-y-6 hidden md:block h-screen fixed left-0 top-0 overflow-y-auto z-30">
        <ul className="space-y-3 text-sm">
          {[
            { label: 'Dashboard', icon: LayoutDashboard, route: '/wasteCompanyDashboard' },
            { label: 'Routes', icon: Route },
            { label: 'Households', icon: Home, route: '/wasteCompanyDashboard/households' },
            { label: 'Zones', icon: MapPin, route: '/wasteCompanyDashboard/zones' },
            { label: 'Tariffs', icon: CreditCard, route: '/wasteCompanyDashboard/tariffs' },
            { label: 'Payments', icon: CreditCard, route: '/wasteCompanyDashboard/payments' },
            { label: 'Complaints', icon: MessageSquare },
            { label: 'Pickup Session', icon: Truck }
          ].map(item => (
            <SidebarItem 
              key={item.label}
              label={item.label}
              icon={item.icon}
              active={getActiveTab() === item.label}
              onClick={() => {
                if (item.route) {
                  router.push(item.route);
                }
              }}
            />
          ))}
        </ul>
      </aside>

      <div className="flex-1 ml-64">
        <nav className="sticky top-0 z-40 bg-white shadow-sm border-b px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Green Ex Manager</h1>
              <p className="text-sm text-gray-600">Waste Collection Company</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="text-gray-600 hover:text-gray-800 p-2">
                  <Bell size={20} />
                </button>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center font-semibold hover:bg-green-500 transition-colors"
                >
                  CM
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
                    <div className="py-1">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                        <User size={16} /> Profile
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                        <Settings size={16} /> Settings
                      </button>
                      <hr className="my-1" />
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ label, icon: Icon, active, onClick }: { 
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  active?: boolean; 
  onClick: () => void;
}) {
  return (
    <li
      onClick={onClick}
      className={`px-3 py-2 rounded flex items-center gap-3 cursor-pointer transition-colors ${
        active ? "bg-green-700" : "hover:bg-green-800"
      }`}
    >
      <Icon size={18} />
      {label}
    </li>
  );
}