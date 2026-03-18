import React from 'react';
import { Home, Users, MapPin, Phone, Mail, Calendar } from 'lucide-react';

export default function HouseholdSection() {
  const householdInfo = {
    code: 'KG-001-2024',
    address: 'Sector / Cell / Village - Pulmotti3',
    residents: 4,
    status: 'Active',
    nextCollection: 'December 4, 2025',
    collectionTime: '8:00 AM - 10 AM',
    route: 'Route A - Gasabo',
    billAmount: '3,000 RWF',
    billStatus: 'PAID'
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Household</h1>
        <p className="text-gray-600">Manage your household details and collection information</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Wednesday</h3>
            <p className="text-gray-600">{householdInfo.nextCollection}</p>
            <p className="text-sm text-gray-500">{householdInfo.collectionTime}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-semibold">
                {householdInfo.status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Household Code</p>
            <p className="font-bold text-gray-800 mb-3">{householdInfo.code}</p>
            <p className="text-sm text-gray-500 mb-1">No. Houses</p>
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-800">1</p>
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">Address</p>
            <p className="text-sm text-gray-700">{householdInfo.address}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar size={16} className="text-green-600" />
              Next Collection Day
            </h4>
            <p className="text-gray-600 mb-1">{householdInfo.nextCollection}</p>
            <p className="text-sm text-gray-500 mb-3">{householdInfo.collectionTime}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">{householdInfo.route}</p>
              <button className="px-4 py-1 bg-green-500 text-white text-sm rounded-full font-semibold hover:bg-green-600">
                Renew All
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Month Bill Status</h4>
            <p className="text-gray-600 mb-1">Amount: <span className="font-bold">{householdInfo.billAmount}</span></p>
            <p className="text-sm mb-3">Status: <span className="font-semibold text-green-600">{householdInfo.billStatus}</span></p>
            <div className="flex items-center justify-between">
              <button className="px-4 py-1 bg-green-500 text-white text-sm rounded-full font-semibold hover:bg-green-600">
                View Full Bill
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Home className="text-green-600" size={20} />
            Household Details
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Users size={16} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Residents</p>
                <p className="font-medium">{householdInfo.residents} people</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Zone</p>
                <p className="font-medium">Zone A - Gasabo</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50">
              <p className="font-medium">Request Special Collection</p>
              <p className="text-sm text-gray-600">Schedule additional pickup</p>
            </button>
            <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50">
              <p className="font-medium">Update Contact Info</p>
              <p className="text-sm text-gray-600">Change phone or email</p>
            </button>
            <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50">
              <p className="font-medium">View Collection History</p>
              <p className="text-sm text-gray-600">See past collections</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}