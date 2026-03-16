import React from 'react';
import { CreditCard, Calendar, CheckCircle, Clock } from 'lucide-react';

export default function PaymentsPage() {
  const payments = [
    { id: 1, date: '2024-01-15', amount: '3,000 RWF', status: 'Paid', method: 'Mobile Money' },
    { id: 2, date: '2024-12-15', amount: '3,000 RWF', status: 'Paid', method: 'Bank Transfer' },
    { id: 3, date: '2024-11-15', amount: '3,000 RWF', status: 'Paid', method: 'Mobile Money' },
    { id: 4, date: '2024-02-15', amount: '3,000 RWF', status: 'Pending', method: 'Mobile Money' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payments</h1>
        <p className="text-gray-600">Manage your waste collection payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <CreditCard className="text-green-600" size={20} />
            <div>
              <p className="text-sm text-gray-600">Current Balance</p>
              <p className="font-semibold text-green-600">0 RWF</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-blue-600" size={20} />
            <div>
              <p className="text-sm text-gray-600">Paid This Year</p>
              <p className="font-semibold">36,000 RWF</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Clock className="text-orange-600" size={20} />
            <div>
              <p className="text-sm text-gray-600">Next Payment</p>
              <p className="font-semibold">Feb 15, 2024</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Payment History</h2>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Calendar className="text-gray-500" size={20} />
                  <div>
                    <p className="font-medium">{payment.date}</p>
                    <p className="text-sm text-gray-600">{payment.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{payment.amount}</p>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
