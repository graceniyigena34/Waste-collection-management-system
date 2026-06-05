'use client';

import React, { useState, useEffect } from 'react';
import { Home, Users, MapPin, Calendar, X, Printer, Download, CheckCircle, Clock, Truck, Receipt } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HouseholdDetails {
  district: string;
  sector: string;
  cell: string;
  village: string;
  streetAddress: string;
  houseType: string;
  residents: string;
}

interface UserInfo {
  fullName: string;
  email: string;
  userId: string;
}

const MONTHLY_FEE = 3000;

const bills = [
  { id: 'BILL-2025-01', month: 'January 2025', dueDate: 'Jan 15, 2025', amount: 3000, status: 'PAID', paidDate: 'Jan 12, 2025', method: 'MTN Mobile Money', ref: 'TXN-240115-001' },
  { id: 'BILL-2024-12', month: 'December 2024', dueDate: 'Dec 15, 2024', amount: 3000, status: 'PAID', paidDate: 'Dec 10, 2024', method: 'Airtel Money', ref: 'TXN-241210-002' },
  { id: 'BILL-2025-02', month: 'February 2025', dueDate: 'Feb 15, 2025', amount: 3000, status: 'PENDING', paidDate: null, method: null, ref: null },
];

const now = new Date();
const currentMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' });
const currentBill = bills.find(b => b.month === currentMonth) || bills[0];

export default function HouseholdPage() {
  const router = useRouter();
  const [showBill, setShowBill] = useState(false);
  const [selectedBill, setSelectedBill] = useState(currentBill);
  const [household, setHousehold] = useState<HouseholdDetails | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    try {
      const hraw = localStorage.getItem('household_details');
      if (hraw) setHousehold(JSON.parse(hraw));
      const uraw = localStorage.getItem('user_info');
      if (uraw) setUser(JSON.parse(uraw));
    } catch { /* silent */ }
  }, []);

  const openBill = (bill = currentBill) => {
    setSelectedBill(bill);
    setShowBill(true);
  };

  const zone = household?.district || 'Gasabo';
  const address = household
    ? `${household.streetAddress}, ${household.sector}, ${household.district}`
    : 'KG 001 St, Kicukiro';
  const residents = household?.residents || '4';
  const houseCode = user?.userId ? `HH-${user.userId}` : 'KG-001-2025';
  const ownerName = user?.fullName || 'Citizen';

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Household</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your household details and collection information</p>
      </div>

      {/* Main info card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Truck size={18} className="text-green-600" />
              <h3 className="text-lg font-bold text-gray-800">Next Collection</h3>
            </div>
            <p className="text-gray-600 font-medium">Wednesday, December 4, 2025</p>
            <p className="text-sm text-gray-500">8:00 AM – 10:00 AM</p>
            <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
              <CheckCircle size={11} /> Active
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-0.5">Household Code</p>
            <p className="font-bold text-gray-800 font-mono text-sm">{houseCode}</p>
            <p className="text-xs text-gray-400 mt-2 mb-0.5">Address</p>
            <p className="text-sm text-gray-700 max-w-[200px] text-right">{address}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Next collection */}
          <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar size={15} className="text-green-600" /> Collection Schedule
            </h4>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">Dec 4, 2025</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Time</span>
                <span className="font-medium">8:00 AM – 10:00 AM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Route</span>
                <span className="font-medium">Route A – {zone}</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/User-Dashboard/Schedule')}
              className="mt-3 w-full py-2 bg-green-700 text-white text-sm rounded-xl font-semibold hover:bg-green-800 transition"
            >
              View Full Schedule
            </button>
          </div>

          {/* Current bill */}
          <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Receipt size={15} className="text-green-600" /> Current Month Bill
            </h4>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Month</span>
                <span className="font-medium">{currentBill.month}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-gray-800">{currentBill.amount.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={`font-semibold ${currentBill.status === 'PAID' ? 'text-green-600' : 'text-orange-500'}`}>
                  {currentBill.status}
                </span>
              </div>
            </div>
            <button
              onClick={() => openBill(currentBill)}
              className="mt-3 w-full py-2 bg-green-700 text-white text-sm rounded-xl font-semibold hover:bg-green-800 transition flex items-center justify-center gap-2"
            >
              <Receipt size={15} /> View Full Bill
            </button>
          </div>
        </div>
      </div>

      {/* Household details + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Home size={17} className="text-green-600" /> Household Details
          </h2>
          <div className="space-y-3">
            {[
              { icon: <Users size={15} />, label: 'Residents', value: `${residents} people` },
              { icon: <MapPin size={15} />, label: 'Zone', value: `Zone A – ${zone}` },
              { icon: <Home size={15} />, label: 'House Type', value: household?.houseType || 'Residential' },
              { icon: <MapPin size={15} />, label: 'Sector', value: household?.sector || '—' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <span className="text-gray-400">{icon}</span>
                <div className="flex-1 flex justify-between">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-semibold text-gray-800">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">Billing History</h2>
          <div className="space-y-2">
            {bills.map(bill => (
              <div key={bill.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{bill.month}</p>
                  <p className="text-xs text-gray-500">Due {bill.dueDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${bill.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {bill.status}
                  </span>
                  <button
                    onClick={() => openBill(bill)}
                    className="text-xs font-semibold text-green-700 hover:underline flex items-center gap-1"
                  >
                    <Receipt size={12} /> View Bill
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push('/User-Dashboard/Payments')}
            className="mt-4 w-full py-2.5 border-2 border-green-700 text-green-700 text-sm rounded-xl font-semibold hover:bg-green-50 transition"
          >
            Go to Payments
          </button>
        </div>
      </div>

      {/* ── Bill Modal ── */}
      {showBill && selectedBill && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

            {/* Modal header */}
            <div className="bg-gradient-to-r from-green-800 to-green-700 px-6 py-5 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Truck size={20} className="text-green-300" />
                  <span className="font-bold text-lg">EcoTrack</span>
                </div>
                <button onClick={() => setShowBill(false)} className="p-1.5 rounded-full hover:bg-white/20 transition">
                  <X size={18} />
                </button>
              </div>
              <h2 className="text-xl font-bold">Waste Collection Bill</h2>
              <p className="text-green-200 text-sm mt-0.5">{selectedBill.month}</p>
              <div className="mt-3">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${selectedBill.status === 'PAID' ? 'bg-green-500 text-white' : 'bg-yellow-400 text-yellow-900'}`}>
                  {selectedBill.status === 'PAID' ? <CheckCircle size={12} /> : <Clock size={12} />}
                  {selectedBill.status === 'PAID' ? 'PAID' : 'PAYMENT PENDING'}
                </span>
              </div>
            </div>

            {/* Bill body */}
            <div className="px-6 py-5 space-y-5">

              {/* Bill ID + dates */}
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-xs text-gray-400">Bill Number</p>
                  <p className="font-mono font-bold text-gray-800">{selectedBill.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Due Date</p>
                  <p className="font-semibold text-gray-800">{selectedBill.dueDate}</p>
                </div>
              </div>

              {/* Household info */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Household Information</p>
                {[
                  ['Owner', ownerName],
                  ['Household Code', houseCode],
                  ['Address', address],
                  ['Zone', `Zone A – ${zone}`],
                  ['Residents', `${residents} people`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-gray-500">{k}</span>
                    <span className="font-medium text-gray-800 text-right max-w-[55%] truncate">{v}</span>
                  </div>
                ))}
              </div>

              {/* Bill breakdown */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2.5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Bill Breakdown</p>
                </div>
                <div className="px-4 py-3 space-y-2">
                  {[
                    ['Waste Collection Fee', `${selectedBill.amount.toLocaleString()} RWF`],
                    ['Service Tax (0%)', '0 RWF'],
                    ['Late Fee', '0 RWF'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span className="text-gray-500">{k}</span>
                      <span className="font-medium text-gray-800">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 px-4 py-3 flex justify-between">
                  <span className="font-bold text-gray-800">Total Amount</span>
                  <span className="font-bold text-green-700 text-lg">{selectedBill.amount.toLocaleString()} RWF</span>
                </div>
              </div>

              {/* Payment info if paid */}
              {selectedBill.status === 'PAID' && selectedBill.paidDate && (
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Payment Confirmation</p>
                  {[
                    ['Paid On', selectedBill.paidDate],
                    ['Method', selectedBill.method!],
                    ['Reference', selectedBill.ref!],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span className="text-green-600">{k}</span>
                      <span className="font-semibold text-green-800 font-mono text-xs">{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Pending — pay button */}
              {selectedBill.status === 'PENDING' && (
                <button
                  onClick={() => { setShowBill(false); router.push('/User-Dashboard/Payments'); }}
                  className="w-full py-3 bg-green-700 text-white rounded-xl font-bold text-sm hover:bg-green-800 transition flex items-center justify-center gap-2"
                >
                  Pay Now – {selectedBill.amount.toLocaleString()} RWF
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 pb-5">
              <button
                onClick={() => setShowBill(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
              >
                <Printer size={15} /> Print Bill
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
