"use client";
import React, { useState, useEffect } from 'react';
import { Truck } from "lucide-react";

import { useRouter } from 'next/navigation';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userInitials, setUserInitials] = useState("U");
  const [registrationDate, setRegistrationDate] = useState("");

  useEffect(() => {
    const userInfoStr = localStorage.getItem("user_info");
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        const name = userInfo.fullName || userInfo.email || "User";
        setUserName(name);
        setUserInitials(name.substring(0, 2).toUpperCase());
        setRegistrationDate("01-05-2024");
      } catch (error) {
        // Silent error handling
      }
    }
  }, []);
  return (
    <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-6 flex items-center justify-between">
      <div className="flex flex-col">
        {/* Row 1: Logo + Title */}
        <div className="flex items-center gap-3">
          <Truck size={40} className="text-secondary-green" />
          <h1 className="text-xl font-bold">GreenEX</h1>
        </div>

        {/* Row 2: Subtitle */}
        <p className="text-sm text-teal-100 ml-13">Smart Waste Collection</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="font-semibold">{userName}</p>
          <p className="text-sm text-teal-100">Registered: {registrationDate}</p>
        </div>
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center font-bold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer text-white"
            title={userName}
          >
            {userInitials}
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-md shadow-lg border z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="py-1">
                <button
                  onClick={() => {
                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("user_info");
                    window.location.href = "/signin";
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
