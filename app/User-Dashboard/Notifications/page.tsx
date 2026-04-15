"use client";

import React, { useState } from "react";
import { Bell, CheckCircle, AlertCircle, Info, Trash2 } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success";
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Collection Reminder",
    message: "Your waste collection is scheduled for tomorrow at 8:00 AM.",
    time: "2 hours ago",
    read: false,
    type: "info",
  },
  {
    id: "2",
    title: "Payment Due",
    message: "Your monthly payment of 3,000 RWF is due soon.",
    time: "1 day ago",
    read: false,
    type: "warning",
  },
  {
    id: "3",
    title: "Collection Completed",
    message: "Your waste was successfully collected on Jan 10, 2024.",
    time: "3 days ago",
    read: true,
    type: "success",
  },
  {
    id: "4",
    title: "Route Change",
    message: "Your collection route has been updated to Route A - Gasabo.",
    time: "1 week ago",
    read: true,
    type: "info",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const deleteNotification = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const getIcon = (type: string) => {
    if (type === "warning") return <AlertCircle className="text-yellow-500" size={20} />;
    if (type === "success") return <CheckCircle className="text-green-500" size={20} />;
    return <Info className="text-blue-500" size={20} />;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Bell className="text-green-600" size={24} />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-600 text-sm mt-1">Stay updated on your waste collection</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-green-700 border border-green-700 px-3 py-1.5 rounded-lg hover:bg-green-50 transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Bell size={48} className="mx-auto mb-3 opacity-30" />
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                n.read ? "bg-white border-gray-200" : "bg-green-50 border-green-200"
              }`}
            >
              <div className="mt-0.5">{getIcon(n.type)}</div>
              <div className="flex-1">
                <p className={`font-semibold text-gray-800 ${!n.read ? "text-green-900" : ""}`}>
                  {n.title}
                </p>
                <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
              {!n.read && (
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(n.id);
                }}
                className="text-gray-300 hover:text-red-400 transition flex-shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
