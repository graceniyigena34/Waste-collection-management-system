import React from 'react';
import NotificationCard from '../Notifications/NotificationCard';

export default function ComplaintsSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Complaints</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-3">
          <NotificationCard
            title="Nov 2025"
            subtitle="Nov 2025"
            status="Late"
            statusColor="orange"
            iconBgColor="orange-100"
            iconTextColor="orange-600"
          />

          <NotificationCard
            title="Missed Pickup"
            subtitle="Oct 8, 2025"
            status="Late"
            statusColor="orange"
            iconBgColor="red-100"
            iconTextColor="red-600"
          />

          <NotificationCard
            title="Missed Waste"
            subtitle="Sept 11, 2025"
            status="Late"
            statusColor="orange"
            iconBgColor="red-100"
            iconTextColor="red-600"
          />

          <NotificationCard
            title="Transport not fully loaded"
            subtitle="Oct 8, 11/25"
            status="Overdue"
            statusColor="red"
            iconBgColor="red-100"
            iconTextColor="red-600"
          />

          <div className="grid grid-cols-2 gap-4 pt-2">
            <NotificationCard
              title="Notifications"
              subtitle="01-12-2025"
              status="New"
              statusColor="green"
              iconBgColor="orange-100"
              iconTextColor="orange-600"
              variant="bordered"
            />

            <NotificationCard
              title="Reminder"
              subtitle="Tomorrow pick day"
              status="New"
              statusColor="green"
              iconBgColor="orange-100"
              iconTextColor="orange-600"
              variant="bordered"
            />

            <NotificationCard
              title="Extra Pickup"
              subtitle="Pickup for extra 2-3 PM"
              iconBgColor="blue-100"
              iconTextColor="blue-600"
              variant="bordered"
            />

            <NotificationCard
              title="Bill of waste"
              subtitle="03-12 EM"
              status="Follow"
              statusColor="green"
              iconBgColor="green-100"
              iconTextColor="green-600"
              variant="bordered"
            />
          </div>
        </div>
      </div>
    </div>
  );
}