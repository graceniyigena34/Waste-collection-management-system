"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Route, CreditCard, History, Users, Truck, FileText } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/User-Dashboard', icon: Home, label: 'Home' },
    { href: '/User-Dashboard/Schedule', icon: Calendar, label: 'Schedule' },
    { href: '/User-Dashboard/Route', icon: Route, label: 'Route' },
    { href: '/User-Dashboard/Household', icon: FileText, label: 'Household' },
    { href: '/User-Dashboard/Payments', icon: CreditCard, label: 'Payments' },
    { href: '/User-Dashboard/History', icon: History, label: 'History' },
    { href: '/User-Dashboard/Customer', icon: Users, label: 'Customer' },
    { href: '/User-Dashboard/Complaints', icon: FileText, label: 'Complaints' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-green-800 to-green-900 text-white">
      <div className="p-6 flex items-center gap-3 border-b border-green-700">
        <div className="flex items-center gap-3 mb-6">
          <Truck size={40} className="text-secondary-green" />
        </div>
        <span className="text-xl font-bold">GreenEX</span>
      </div>

      <nav className="p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                isActive ? 'bg-green-700' : 'hover:bg-green-700'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
