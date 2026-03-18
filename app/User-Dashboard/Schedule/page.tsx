import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';

export default function SchedulePage() {
  const schedules = [
    { id: 1, date: '2024-01-15', time: '08:00 AM', location: 'Kigali City Center', status: 'Scheduled', type: 'Regular Collection' },
    { id: 2, date: '2024-01-17', time: '10:30 AM', location: 'Nyamirambo', status: 'Completed', type: 'Organic Waste' },
    { id: 3, date: '2024-01-20', time: '09:15 AM', location: 'Kimisagara', status: 'Pending', type: 'Recyclables' },
    { id: 4, date: '2024-01-22', time: '07:45 AM', location: 'Remera', status: 'Scheduled', type: 'Regular Collection' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Collection Schedule</h1>
        <p className="text-gray-600">View and manage your waste collection schedule</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-600" size={20} />
            <div>
              <p className="text-sm text-gray-600">Next Collection</p>
              <p className="font-semibold">Jan 15, 8:00 AM</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={20} />
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="font-semibold">12 Collections</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Clock className="text-orange-600" size={20} />
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="font-semibold">2 Collections</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Collections</h2>
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <Calendar className="text-green-600" size={20} />
                  <div>
                    <p className="font-medium">{schedule.date}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{schedule.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{schedule.location}</span>
                      </div>
                      <span className="text-blue-600">{schedule.type}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  schedule.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  schedule.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {schedule.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
