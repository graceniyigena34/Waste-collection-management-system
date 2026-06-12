"use client";
import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { Truck, Menu } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

function getStoredProfile() {
  if (typeof window === 'undefined') {
    return { userName: 'User', userInitials: 'U' };
  }
  const userInfoStr = localStorage.getItem('user_info');
  if (!userInfoStr) return { userName: 'User', userInitials: 'U' };
  try {
    const userInfo = JSON.parse(userInfoStr) as { fullName?: string; email?: string };
    const name = userInfo.fullName || userInfo.email || 'User';
    return { userName: name, userInitials: name.substring(0, 2).toUpperCase() };
  } catch {
    return { userName: 'User', userInitials: 'U' };
  }
}

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState({ userName: 'User', userInitials: 'U' });
  const [registrationDate, setRegistrationDate] = useState("");

  useEffect(() => {
    setMounted(true);
    setProfile(getStoredProfile());

    const token = typeof window !== 'undefined' ? window.localStorage.getItem('auth_token') : null;
    if (!token) return;

    let alive = true;
    api.auth.profile()
      .then((user) => {
        if (!alive) return;
        if (user?.created_at) {
          const d = new Date(user.created_at);
          setRegistrationDate(
            `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
          );
        }
      })
      .catch(() => {});

    return () => { alive = false; };
  }, []);

  return (
    <div className="bg-gradient-to-r from-green-900 to-green-700 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
      {/* Left: hamburger + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Truck size={28} className="text-green-300" />
            <h1 className="text-lg sm:text-xl font-bold">EcoTrack</h1>
          </div>
          <p className="text-xs text-teal-100 ml-9 hidden sm:block">Smart Waste Collection</p>
        </div>
      </div>

      {/* Right: name + bell + avatar */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="text-right hidden sm:block">
          {mounted && (
            <>
              <p className="font-semibold text-sm">{profile.userName}</p>
              <p className="text-xs text-teal-100">Registered: {registrationDate || '—'}</p>
            </>
          )}
        </div>
        <NotificationBell mode="link" buttonClassName="text-white hover:bg-white/10" />
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-400 rounded-full flex items-center justify-center font-bold text-sm hover:opacity-90 transition-opacity text-white"
            title={profile.userName}
          >
            {profile.userInitials}
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-12 w-44 bg-white rounded-md shadow-lg border z-50">
              <button
                onClick={() => {
                  localStorage.removeItem("auth_token");
                  localStorage.removeItem("user_info");
                  window.location.href = "/signin";
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
