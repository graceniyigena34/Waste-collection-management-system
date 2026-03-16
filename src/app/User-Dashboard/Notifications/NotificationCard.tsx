import React from 'react';

interface NotificationCardProps {
  title: string;
  subtitle: string;
  status?: string;
  statusColor?: 'orange' | 'red' | 'green';
  iconBgColor?: string;
  iconTextColor?: string;
  variant?: 'default' | 'bordered';
}

export default function NotificationCard({
  title,
  subtitle,
  status,
  statusColor = 'orange',
  iconBgColor = 'orange-100',
  iconTextColor = 'orange-600',
  variant = 'default'
}: NotificationCardProps) {
  const statusStyles = {
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    green: 'bg-green-500'
  };

  const containerClass = variant === 'bordered'
    ? 'flex items-center justify-between py-3 border border-gray-200 rounded-lg px-4'
    : 'flex items-center justify-between py-3 border-b border-gray-100';

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 bg-${iconBgColor} rounded-full flex items-center justify-center`}>
          <span className={`text-${iconTextColor} text-sm`}></span>
        </div>
        <div>
          <p className="font-semibold text-gray-800">{title}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      {status && (
        <span className={`px-3 py-1 ${statusStyles[statusColor]} text-white text-xs rounded font-semibold`}>
          {status}
        </span>
      )}
    </div>
  );
}