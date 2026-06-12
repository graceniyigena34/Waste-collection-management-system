"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, CreditCard, Users, Truck, FileText, Bell, MessageCircle, X } from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/User-Dashboard', icon: Home, label: 'Home' },
    { href: '/User-Dashboard/Schedule', icon: Calendar, label: 'Schedule' },
    { href: '/User-Dashboard/Payments', icon: CreditCard, label: 'Payments' },
    { href: '/User-Dashboard/Complaints', icon: FileText, label: 'Complaints' },
    { href: '/User-Dashboard/RequestPickup', icon: Truck, label: 'Request Pickup' },
    { href: '/User-Dashboard/Notifications', icon: Bell, label: 'Notifications' },
    { href: '/User-Dashboard/Chat', icon: MessageCircle, label: 'Chat' },
    { href: '/User-Dashboard/Customer', icon: Users, label: 'Personal Info' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-green-800 to-green-900 text-white flex flex-col h-full">
      <div className="p-5 flex items-center justify-between border-b border-green-700">
        <div className="flex items-center gap-3">
          <Truck size={26} className="text-green-300 flex-shrink-0" />
          <span className="text-xl font-bold">EcoTrack</span>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-white/20 transition"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
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
