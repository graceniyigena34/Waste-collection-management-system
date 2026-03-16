'use client';

import { useState } from 'react';
import { Bell, X } from 'lucide-react';

interface CompanyNotification {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  registrationDate: string;
  registrationTime: string;
}

interface NotificationDropdownProps {
  notifications: CompanyNotification[];
  onDismiss: (id: string) => void;
}

export function NotificationDropdown({ notifications, onDismiss }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        <Bell size={22} />
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-3 border-b">
            <h3 className="font-medium">New Company Registrations</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No new registrations
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="p-3 border-b hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-sm">{notification.companyName}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">Email: {notification.email}</p>
                      <p className="text-xs text-gray-600 mb-1">Phone: {notification.phone}</p>
                      <p className="text-xs text-gray-400">
                        {notification.registrationDate} at {notification.registrationTime}
                      </p>
                    </div>
                    <button
                      onClick={() => onDismiss(notification.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}