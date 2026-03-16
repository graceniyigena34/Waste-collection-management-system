import React from 'react';
import { MapPin, Navigation, Clock, Truck } from 'lucide-react';

export default function RoutePage() {
  const routes = [
    { id: 1, name: 'Route A - City Center', distance: '12.5 km', duration: '45 min', stops: 8, status: 'Active' },
    { id: 2, name: 'Route B - Residential', distance: '18.2 km', duration: '1h 15min', stops: 12, status: 'Completed' },
    { id: 3, name: 'Route C - Industrial', distance: '22.8 km', duration: '1h 30min', stops: 6, status: 'Scheduled' },
  ];

  const currentRoute = {
    name: 'Route A - City Center',
    currentStop: 'Kigali City Center',
    nextStop: 'Nyamirambo Market',
    progress: 65,
    estimatedCompletion: '2:30 PM'
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Collection Routes</h1>
        <p className="text-gray-600">Track collection routes and progress</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Truck className="text-green-600" size={20} />
          Current Route Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Active Route</p>
            <p className="font-semibold text-lg">{currentRoute.name}</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-green-600" />
                <span>Current: {currentRoute.currentStop}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Navigation size={16} className="text-blue-600" />
                <span>Next: {currentRoute.nextStop}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-orange-600" />
                <span>ETA: {currentRoute.estimatedCompletion}</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${currentRoute.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{currentRoute.progress}% Complete</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">All Routes</h2>
          <div className="space-y-4">
            {routes.map((route) => (
              <div key={route.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <MapPin className="text-green-600" size={20} />
                  <div>
                    <p className="font-medium">{route.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{route.distance}</span>
                      <span>{route.duration}</span>
                      <span>{route.stops} stops</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  route.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  route.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {route.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
