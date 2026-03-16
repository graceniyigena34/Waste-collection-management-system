import React from 'react';
import { Calendar, MapPin, CheckCircle, Clock, Truck } from 'lucide-react';

export default function HistoryPage() {
  const collections = [
    { id: 1, date: '2024-01-10', location: 'Kigali City Center', status: 'Completed', time: '08:30 AM', weight: '15 kg' },
    { id: 2, date: '2024-01-08', location: 'Nyamirambo', status: 'Completed', time: '09:15 AM', weight: '12 kg' },
    { id: 3, date: '2024-01-05', location: 'Kimisagara', status: 'Completed', time: '10:00 AM', weight: '18 kg' },
    { id: 4, date: '2024-01-03', location: 'Remera', status: 'Missed', time: '08:00 AM', weight: '0 kg' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Collection History</h1>
        <p className="text-gray-600">View your past waste collections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={20} />
            <div>
              <p className="text-sm text-gray-600">Total Collections</p>
              <p className="font-semibold">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Truck className="text-blue-600" size={20} />
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="font-semibold">4</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Clock className="text-orange-600" size={20} />
            <div>
              <p className="text-sm text-gray-600">Missed</p>
              <p className="font-semibold">1</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-600 rounded" />
            <div>
              <p className="text-sm text-gray-600">Total Waste</p>
              <p className="font-semibold">180 kg</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Collections</h2>
          <div className="space-y-4">
            {collections.map((collection) => (
              <div key={collection.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Calendar className="text-gray-500" size={20} />
                  <div>
                    <p className="font-medium">{collection.date}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{collection.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{collection.time}</span>
                      </div>
                      <span>Weight: {collection.weight}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  collection.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {collection.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
