"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle, AlertCircle, Info, Trash2, X } from "lucide-react";
import Link from "next/link";
import { api, type BackendNotification } from "@/lib/api-client";

interface Props {
  mode: "dropdown" | "link";
  linkHref?: string;
  buttonClassName?: string;
}

export default function NotificationBell({
  mode,
  linkHref = "/User-Dashboard/Notifications",
  buttonClassName = "text-white hover:bg-white/10",
}: Props) {
  const [notifs, setNotifs] = useState<BackendNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const load = async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    try {
      const data = await api.notifications.list();
      setNotifs(data);
    } catch {
      // silent
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!token) return;
    void load(true);
    const interval = setInterval(() => void load(false), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const markRead = async (id: number) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await api.notifications.markRead(id);
    } catch {
      setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: false } : n)));
    }
  };

  const markAllRead = async () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.notifications.markAllRead();
    } catch {
      void load(false);
    }
  };

  const remove = async (id: number) => {
    const item = notifs.find((n) => n.id === id);
    setNotifs((prev) => prev.filter((n) => n.id !== id));
    try {
      await api.notifications.remove(id);
    } catch {
      if (item) setNotifs((prev) => [...prev, item].sort((a, b) => b.id - a.id));
    }
  };

  const getIcon = (type: string) => {
    if (type === "warning") return <AlertCircle size={15} className="text-yellow-500 flex-shrink-0 mt-0.5" />;
    if (type === "success") return <CheckCircle size={15} className="text-green-500 flex-shrink-0 mt-0.5" />;
    return <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />;
  };

  const formatTime = (ts?: string) => {
    if (!ts) return "";
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const bellBtn = (
    <button
      onClick={mode === "dropdown" ? () => setOpen((o) => !o) : undefined}
      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition ${buttonClassName}`}
      title="Notifications"
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );

  if (mode === "link") {
    return <Link href={linkHref}>{bellBtn}</Link>;
  }

  return (
    <div className="relative" ref={containerRef}>
      {bellBtn}
      {open && (
        <div className="absolute right-0 top-12 w-80 max-h-[420px] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 sticky top-0 bg-white">
            <span className="font-semibold text-gray-800 text-sm flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                  {unreadCount}
                </span>
              )}
            </span>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-green-700 hover:underline">
                  Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-10 flex justify-center">
              <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notifs.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">
              <Bell size={32} className="mx-auto mb-2 opacity-25" />
              No notifications
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifs.slice(0, 20).map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read && markRead(n.id)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${
                    !n.read ? "bg-green-50/60" : ""
                  }`}
                >
                  {getIcon(n.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{formatTime(n.created_at)}</p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      void remove(n.id);
                    }}
                    className="text-gray-300 hover:text-red-400 transition flex-shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
