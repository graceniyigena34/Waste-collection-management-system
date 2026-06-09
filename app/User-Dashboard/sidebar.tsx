"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Route, CreditCard, Users, Truck, FileText, Bell, MessageCircle } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/User-Dashboard', icon: Home, label: 'Home' },
    { href: '/User-Dashboard/Schedule', icon: Calendar, label: 'Schedule' },
    { href: '/User-Dashboard/Route', icon: Route, label: 'Route' },
    { href: '/User-Dashboard/Payments', icon: CreditCard, label: 'Payments' },
    { href: '/User-Dashboard/Complaints', icon: FileText, label: 'Complaints' },
    { href: '/User-Dashboard/Notifications', icon: Bell, label: 'Notifications' },
    { href: '/User-Dashboard/Chat', icon: MessageCircle, label: 'Chat' },
    { href: '/User-Dashboard/Customer', icon: Users, label: 'Personal Info' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-green-800 to-green-900 text-white flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-green-700">
        <Truck size={28} className="text-green-300 flex-shrink-0" />
        <span className="text-xl font-bold">EcoTrack</span>
      </div>

      <nav className="p-4 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition-colors ${
                isActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-green-300'} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
