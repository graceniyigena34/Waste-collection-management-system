"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import RoleGuard from "@/components/auth/RoleGuard";

import {
  Bell,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Truck,
  MapPin,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function DriverDashboardLayout({ children }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("Driver");

  useEffect(() => {
    const userInfoStr = localStorage.getItem("user_info");
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        setUserName(userInfo.fullName || userInfo.email || "Driver");
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(false);
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdownOpen]);

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, route: "/driverDashboard" },
    { label: "My Sessions", icon: Truck, route: "/driverDashboard/sessions" },
  ];

  return (
    <RoleGuard allowedRoles={["COMPANY_DRIVER"]}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-green-900 text-white p-6 space-y-6 hidden md:block h-screen fixed left-0 top-0 overflow-y-auto z-30">
          <ul className="space-y-3 text-sm">
            {menuItems.map((item) => (
              <li
                key={item.label}
                onClick={() => item.route && router.push(item.route)}
                className={`px-3 py-2 rounded flex items-center gap-3 cursor-pointer transition-colors ${pathname === item.route ? "bg-green-700" : "hover:bg-green-800"
                  }`}
              >
                <item.icon size={18} />
                {item.label}
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1 ml-64">
          {/* Header */}
          <nav className="sticky top-0 z-40 bg-white shadow-sm border-b px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Driver Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome, {userName}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button className="text-gray-600 hover:text-gray-800 p-2">
                    <Bell size={20} />
                  </button>
                </div>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(!dropdownOpen);
                    }}
                    className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center font-semibold hover:bg-green-500 transition-colors"
                    title={userName}
                  >
                    {userName.substring(0, 2).toUpperCase()}
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
                        <button
                          onClick={() => {
                            localStorage.removeItem("auth_token");
                            localStorage.removeItem("user_info");
                            router.push("/signin");
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <section className="overflow-y-auto">
            {children}
          </section>
        </div>
      </div>
    </RoleGuard>
  );
}
