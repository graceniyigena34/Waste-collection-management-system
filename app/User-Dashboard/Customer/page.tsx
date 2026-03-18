import React from 'react';
import { User, Phone, Mail, MapPin, Calendar, Edit } from 'lucide-react';

export default function CustomerPage() {
  const customerInfo = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+250 788 123 456',
    address: 'KG 123 St, Kigali City Center',
    registrationDate: '01-05-2024',
    customerID: 'CUS-2024-001',
    zone: 'Zone A - Gasabo'
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Customer Profile</h1>
        <p className="text-gray-600">Manage your personal information and account details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <User className="text-green-600" size={20} />
              Personal Information
            </h2>
            <button className="flex items-center gap-2 px-3 py-1 text-sm text-green-600 border border-green-600 rounded hover:bg-green-50">
              <Edit size={16} />
              Edit
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Full Name</p>
              <p className="font-medium">{customerInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Customer ID</p>
              <p className="font-medium">{customerInfo.customerID}</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{customerInfo.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{customerInfo.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{customerInfo.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-6">Account Details</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Registration Date</p>
                <p className="font-medium">{customerInfo.registrationDate}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Service Zone</p>
              <p className="font-medium">{customerInfo.zone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Account Status</p>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                Active
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50">
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-gray-600">Update your account password</p>
              </button>
              <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50">
                <p className="font-medium">Update Contact Info</p>
                <p className="text-sm text-gray-600">Change phone or email</p>
              </button>
              <button className="w-full p-3 text-left border rounded-lg hover:bg-gray-50">
                <p className="font-medium">Download Account Statement</p>
                <p className="text-sm text-gray-600">Get your account summary</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
