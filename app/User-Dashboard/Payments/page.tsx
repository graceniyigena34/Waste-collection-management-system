'use client';

import React, { useState } from 'react';
import {
  CreditCard, Calendar, CheckCircle, Clock, ArrowRight,
  Smartphone, Building2, Banknote, ChevronRight, X,
  Shield, AlertCircle, Check, Loader2, Receipt, TrendingUp,
} from 'lucide-react';

/* ── Types ── */
type PayMethod = 'mtn' | 'airtel' | 'bank' | 'card';
type Step = 1 | 2 | 3 | 4;

interface Payment {
  id: number;
  month: string;
  date: string;
  amount: string;
  amountNum: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  method: string;
  ref: string;
}

/* ── Mock data ── */
const MONTHLY_FEE = 3000;

const payments: Payment[] = [
  { id: 1, month: 'January 2025', date: '2025-01-15', amount: '3,000 RWF', amountNum: 3000, status: 'Paid', method: 'MTN Mobile Money', ref: 'TXN-240115-001' },
  { id: 2, month: 'December 2024', date: '2024-12-15', amount: '3,000 RWF', amountNum: 3000, status: 'Paid', method: 'Airtel Money', ref: 'TXN-241215-002' },
  { id: 3, month: 'November 2024', date: '2024-11-15', amount: '3,000 RWF', amountNum: 3000, status: 'Paid', method: 'Bank Transfer', ref: 'TXN-241115-003' },
  { id: 4, month: 'February 2025', date: '2025-02-15', amount: '3,000 RWF', amountNum: 3000, status: 'Pending', method: '—', ref: '—' },
];

const now = new Date();
const thisMonthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
const nextMonthName = nextMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
const nextDueDate = new Date(now.getFullYear(), now.getMonth() + 1, 15)
  .toLocaleDateString('en-RW', { day: 'numeric', month: 'short', year: 'numeric' });
const thisDueDate = new Date(now.getFullYear(), now.getMonth(), 15)
  .toLocaleDateString('en-RW', { day: 'numeric', month: 'short', year: 'numeric' });

const payMethods = [
  { id: 'mtn' as PayMethod, name: 'MTN Mobile Money', icon: '🟡', color: 'border-yellow-400 bg-yellow-50', desc: 'Pay via MTN MoMo', placeholder: '078XXXXXXX' },
  { id: 'airtel' as PayMethod, name: 'Airtel Money', icon: '🔴', color: 'border-red-400 bg-red-50', desc: 'Pay via Airtel Money', placeholder: '073XXXXXXX' },
  { id: 'bank' as PayMethod, name: 'Bank Transfer', icon: '🏦', color: 'border-blue-400 bg-blue-50', desc: 'Transfer from your bank', placeholder: 'Account number' },
  { id: 'card' as PayMethod, name: 'Debit / Credit Card', icon: '💳', color: 'border-purple-400 bg-purple-50', desc: 'Visa, Mastercard', placeholder: '1234 5678 9012 3456' },
];

const statusStyle: Record<string, string> = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Overdue: 'bg-red-100 text-red-700',
};

/* ── Component ── */
export default function PaymentsPage() {
  const [showModal, setShowModal] = useState(false);
  const [payingMonth, setPayingMonth] = useState<'this' | 'next'>('this');
  const [step, setStep] = useState<Step>(1);
  const [selectedMethod, setSelectedMethod] = useState<PayMethod | null>(null);
  const [phoneOrAccount, setPhoneOrAccount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paidList, setPaidList] = useState<string[]>([]);
  const [successRef, setSuccessRef] = useState('');

  const thisMonthPaid = paidList.includes('this') || payments.find(p => p.month === thisMonthName)?.status === 'Paid';
  const nextMonthPaid = paidList.includes('next');
  const totalPaidYear = payments.filter(p => p.status === 'Paid').length * MONTHLY_FEE + paidList.length * MONTHLY_FEE;

  const openPayment = (month: 'this' | 'next') => {
    setPayingMonth(month);
    setStep(1);
    setSelectedMethod(null);
    setPhoneOrAccount('');
    setProcessing(false);
    setSuccessRef('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setStep(1);
    setSelectedMethod(null);
    setPhoneOrAccount('');
  };

  const handleNext = () => {
    if (step === 1 && !selectedMethod) return;
    if (step === 2 && !phoneOrAccount.trim()) return;
    if (step < 4) setStep((s) => (s + 1) as Step);
  };

  const handleConfirmPayment = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2500));
    const ref = `TXN-${Date.now().toString().slice(-8)}`;
    setSuccessRef(ref);
    setPaidList(prev => [...prev, payingMonth]);
    setProcessing(false);
    setStep(4);
  };

  const method = payMethods.find(m => m.id === selectedMethod);
  const amount = MONTHLY_FEE.toLocaleString() + ' RWF';
  const monthLabel = payingMonth === 'this' ? thisMonthName : nextMonthName;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your monthly waste collection fee</p>
      </div>

      {/* Monthly billing cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* This month */}
        <div className={`rounded-2xl p-5 border-2 ${thisMonthPaid ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">This Month</p>
              <p className="font-bold text-gray-800 mt-0.5">{thisMonthName}</p>
            </div>
            {thisMonthPaid
              ? <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full"><Check size={12} /> Paid</span>
              : <span className="flex items-center gap-1 text-xs font-semibold text-orange-700 bg-orange-100 px-2.5 py-1 rounded-full"><Clock size={12} /> Due {thisDueDate}</span>
            }
          </div>
          <p className="text-3xl font-bold text-gray-900">{MONTHLY_FEE.toLocaleString()} <span className="text-base font-medium text-gray-500">RWF</span></p>
          <p className="text-xs text-gray-500 mt-1">Monthly waste collection fee</p>
          {!thisMonthPaid && (
            <button
              onClick={() => openPayment('this')}
              className="mt-4 w-full py-2.5 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition flex items-center justify-center gap-2"
            >
              Pay Now <ArrowRight size={15} />
            </button>
          )}
          {thisMonthPaid && (
            <div className="mt-4 flex items-center gap-2 text-green-700 text-sm font-medium">
              <CheckCircle size={16} /> Payment confirmed
            </div>
          )}
        </div>

        {/* Next month */}
        <div className={`rounded-2xl p-5 border-2 ${nextMonthPaid ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Next Month</p>
              <p className="font-bold text-gray-800 mt-0.5">{nextMonthName}</p>
            </div>
            {nextMonthPaid
              ? <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full"><Check size={12} /> Paid</span>
              : <span className="flex items-center gap-1 text-xs font-semibold text-gray-600 bg-gray-200 px-2.5 py-1 rounded-full"><Calendar size={12} /> Due {nextDueDate}</span>
            }
          </div>
          <p className="text-3xl font-bold text-gray-900">{MONTHLY_FEE.toLocaleString()} <span className="text-base font-medium text-gray-500">RWF</span></p>
          <p className="text-xs text-gray-500 mt-1">Pay early to avoid interruptions</p>
          {!nextMonthPaid && (
            <button
              onClick={() => openPayment('next')}
              className="mt-4 w-full py-2.5 border-2 border-green-700 text-green-700 rounded-xl text-sm font-semibold hover:bg-green-50 transition flex items-center justify-center gap-2"
            >
              Pay in Advance <ArrowRight size={15} />
            </button>
          )}
          {nextMonthPaid && (
            <div className="mt-4 flex items-center gap-2 text-green-700 text-sm font-medium">
              <CheckCircle size={16} /> Payment confirmed
            </div>
          )}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Paid This Year', value: `${totalPaidYear.toLocaleString()} RWF`, icon: <TrendingUp size={16} className="text-green-600" />, bg: 'bg-green-50' },
          { label: 'Next Due Date', value: nextDueDate, icon: <Calendar size={16} className="text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Monthly Fee', value: `${MONTHLY_FEE.toLocaleString()} RWF`, icon: <CreditCard size={16} className="text-purple-600" />, bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
            <div className="flex items-center gap-2 mb-1">{s.icon}<p className="text-xs text-gray-500">{s.label}</p></div>
            <p className="font-bold text-gray-800 text-sm">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Payment history */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Receipt size={17} className="text-green-600" /> Payment History
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {payments.map(p => (
            <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Calendar size={18} className="text-gray-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{p.month}</p>
                  <p className="text-xs text-gray-500">{p.method} {p.ref !== '—' && `• ${p.ref}`}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800 text-sm">{p.amount}</p>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusStyle[p.status]}`}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Payment Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Step {step} of 3{step === 4 ? ' — Done' : ''}
                </p>
                <h3 className="font-bold text-gray-900">
                  {step === 1 && 'Choose Payment Method'}
                  {step === 2 && 'Enter Payment Details'}
                  {step === 3 && 'Confirm Payment'}
                  {step === 4 && 'Payment Successful!'}
                </h3>
              </div>
              {step !== 4 && (
                <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-100 transition">
                  <X size={18} className="text-gray-500" />
                </button>
              )}
            </div>

            {/* Step indicators */}
            {step < 4 && (
              <div className="flex items-center gap-0 px-6 pt-4">
                {[1, 2, 3].map((s) => (
                  <React.Fragment key={s}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {step > s ? <Check size={14} /> : s}
                    </div>
                    {s < 3 && <div className={`flex-1 h-1 mx-1 rounded-full ${step > s ? 'bg-green-700' : 'bg-gray-100'}`} />}
                  </React.Fragment>
                ))}
              </div>
            )}

            <div className="px-6 py-5">

              {/* Step 1 — Choose method */}
              {step === 1 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 mb-4">Paying <span className="font-bold text-gray-800">{amount}</span> for <span className="font-bold text-gray-800">{monthLabel}</span></p>
                  {payMethods.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${selectedMethod === m.id ? m.color + ' border-opacity-100' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <span className="text-2xl">{m.icon}</span>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-gray-800 text-sm">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.desc}</p>
                      </div>
                      {selectedMethod === m.id && <Check size={18} className="text-green-700 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2 — Enter details */}
              {step === 2 && method && (
                <div className="space-y-5">
                  <div className={`flex items-center gap-3 p-4 rounded-2xl ${method.color} border-2`}>
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{method.name}</p>
                      <p className="text-xs text-gray-500">{amount} for {monthLabel}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {selectedMethod === 'card' ? 'Card Number' : selectedMethod === 'bank' ? 'Account Number' : 'Phone Number'}
                    </label>
                    <input
                      type={selectedMethod === 'card' ? 'text' : 'tel'}
                      value={phoneOrAccount}
                      onChange={e => setPhoneOrAccount(e.target.value)}
                      placeholder={method.placeholder}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      maxLength={selectedMethod === 'card' ? 19 : 13}
                    />
                  </div>

                  {(selectedMethod === 'mtn' || selectedMethod === 'airtel') && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800 flex items-start gap-2">
                      <Smartphone size={14} className="mt-0.5 flex-shrink-0" />
                      You will receive a USSD prompt on your phone to approve the payment of <strong>{amount}</strong>.
                    </div>
                  )}
                  {selectedMethod === 'bank' && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800 flex items-start gap-2">
                      <Building2 size={14} className="mt-0.5 flex-shrink-0" />
                      Transfer <strong>{amount}</strong> to EcoTrack Bank Account: <strong>100-200-300</strong> — BK Rwanda.
                    </div>
                  )}
                  {selectedMethod === 'card' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                          <input type="text" placeholder="MM / YY" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" maxLength={7} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                          <input type="password" placeholder="•••" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" maxLength={3} />
                        </div>
                      </div>
                      <input type="text" placeholder="Cardholder name" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  )}
                </div>
              )}

              {/* Step 3 — Confirm */}
              {step === 3 && method && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Payment Summary</p>
                    {[
                      ['Month', monthLabel],
                      ['Amount', amount],
                      ['Method', method.name],
                      ['Account', phoneOrAccount],
                      ['Date', new Date().toLocaleDateString('en-RW', { day: 'numeric', month: 'long', year: 'numeric' })],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-gray-500">{k}</span>
                        <span className="font-semibold text-gray-800">{v}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl p-3 text-xs text-green-800">
                    <Shield size={14} className="mt-0.5 flex-shrink-0" />
                    Your payment is secured and encrypted. EcoTrack does not store your payment credentials.
                  </div>
                </div>
              )}

              {/* Step 4 — Success */}
              {step === 4 && (
                <div className="text-center py-4 space-y-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={40} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Payment Successful!</h4>
                    <p className="text-gray-500 text-sm mt-1">Your payment for <strong>{monthLabel}</strong> has been confirmed.</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount paid</span>
                      <span className="font-bold text-gray-800">{amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reference</span>
                      <span className="font-mono text-xs text-gray-800">{successRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Method</span>
                      <span className="font-semibold text-gray-800">{method?.name}</span>
                    </div>
                  </div>
                  <button onClick={closeModal} className="w-full py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition">
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            {step < 4 && (
              <div className="flex gap-3 px-6 pb-6">
                {step > 1 && (
                  <button onClick={() => setStep(s => (s - 1) as Step)} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
                    Back
                  </button>
                )}
                {step < 3 && (
                  <button
                    onClick={handleNext}
                    disabled={(step === 1 && !selectedMethod) || (step === 2 && !phoneOrAccount.trim())}
                    className="flex-1 py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                )}
                {step === 3 && (
                  <button
                    onClick={handleConfirmPayment}
                    disabled={processing}
                    className="flex-1 py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <><Loader2 size={16} className="animate-spin" /> Processing...</>
                    ) : (
                      <><Shield size={15} /> Confirm & Pay</>
                    )}
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
