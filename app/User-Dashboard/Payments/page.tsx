'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CreditCard, CheckCircle, Clock, AlertCircle, Loader2, Phone, X, RefreshCw } from 'lucide-react';

interface Payment {
  id: number;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Failed';
  method: string;
  month: string;
  payment_date?: string;
  transaction_ref?: string;
  paypack_ref?: string;
  created_at?: string;
}

interface Summary {
  paid_count: string;
  pending_count: string;
  overdue_count: string;
  total_paid: string;
}

type Step = 'form' | 'waiting' | 'success' | 'failed';

const STATUS_STYLES: Record<string, string> = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Overdue: 'bg-red-100 text-red-700',
  Failed: 'bg-gray-100 text-gray-500',
};

const BACKEND = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://backend-waste-collection-management.onrender.com').replace(/\/+$/, '');

function getToken(): string | null {
  return typeof window !== 'undefined' ? window.localStorage.getItem('auth_token') : null;
}

async function backendFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BACKEND}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);
  return data as T;
}

function formatMonth(value: string): string {
  if (!value) return '';
  const [year, month] = value.split('-');
  return new Date(Number(year), Number(month) - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState({ number: '', month: '', amount: '3000' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [activeRef, setActiveRef] = useState('');
  const [pollSeconds, setPollSeconds] = useState(0);
  const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const countInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadPayments = useCallback(async () => {
    try {
      const [p, s] = await Promise.all([
        backendFetch<Payment[]>('/api/payments/me'),
        backendFetch<Summary>('/api/payments/me/summary'),
      ]);
      setPayments(p);
      setSummary(s);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadPayments(); }, [loadPayments]);

  const stopPolling = useCallback(() => {
    if (pollInterval.current) { clearInterval(pollInterval.current); pollInterval.current = null; }
    if (countInterval.current) { clearInterval(countInterval.current); countInterval.current = null; }
  }, []);

  const startPolling = useCallback((ref: string) => {
    stopPolling();
    setPollSeconds(0);

    countInterval.current = setInterval(() => setPollSeconds(s => s + 1), 1000);

    pollInterval.current = setInterval(async () => {
      try {
        const token = getToken();
        const res = await fetch(`${BACKEND}/api/paypack/status/${encodeURIComponent(ref)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.status === 'Paid') {
          stopPolling();
          setStep('success');
          await loadPayments();
        } else if (data.status === 'Failed') {
          stopPolling();
          setStep('failed');
          await loadPayments();
        }
      } catch { /* keep polling */ }
    }, 4000);
  }, [stopPolling, loadPayments]);

  // Auto-timeout after 3 minutes
  useEffect(() => {
    if (step !== 'waiting') return;
    const timeout = setTimeout(() => {
      stopPolling();
      setStep('failed');
      setError('Payment timed out. The USSD prompt was not confirmed within 3 minutes.');
    }, 3 * 60 * 1000);
    return () => clearTimeout(timeout);
  }, [step, stopPolling]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const openModal = () => {
    setStep('form');
    setError('');
    setActiveRef('');
    setShowModal(true);
  };

  const closeModal = () => {
    if (step === 'waiting') {
      stopPolling();
      loadPayments();
    }
    setShowModal(false);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^07[2389]\d{7}$/.test(form.number)) {
      setError('Enter a valid Rwanda mobile number (MTN: 078/079, Airtel: 072/073)');
      return;
    }
    if (!form.month) { setError('Please select a payment month'); return; }
    const amount = Number(form.amount);
    if (!amount || amount < 100) { setError('Minimum amount is 100 RWF'); return; }

    setSubmitting(true);
    try {
      const data = await backendFetch<{ message: string; payment: Payment; paypack: { ref: string } }>(
        '/api/paypack/cashin',
        {
          method: 'POST',
          body: JSON.stringify({ number: form.number, month: formatMonth(form.month), amount }),
        }
      );
      setActiveRef(data.paypack.ref);
      setStep('waiting');
      startPolling(data.paypack.ref);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Payment failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-green-600" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
          <p className="text-gray-500 text-sm">Pay your monthly waste collection fee via Mobile Money</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition"
        >
          <CreditCard size={16} /> Pay Now
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Paid', value: `${Number(summary?.total_paid ?? 0).toLocaleString()} RWF`, icon: <CreditCard size={18} className="text-green-600" />, bg: 'bg-green-50' },
          { label: 'Paid', value: summary?.paid_count ?? '0', icon: <CheckCircle size={18} className="text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Pending', value: summary?.pending_count ?? '0', icon: <Clock size={18} className="text-yellow-600" />, bg: 'bg-yellow-50' },
          { label: 'Overdue', value: summary?.overdue_count ?? '0', icon: <AlertCircle size={18} className="text-red-600" />, bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">{s.icon}</div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="font-bold text-gray-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Payment history */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Payment History</h2>
          <button onClick={loadPayments} className="text-gray-400 hover:text-gray-600 transition">
            <RefreshCw size={15} />
          </button>
        </div>
        {payments.length === 0 ? (
          <p className="text-center py-10 text-gray-400 text-sm">No payments yet.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {payments.map(p => (
              <div key={p.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{p.month}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {p.method}
                    {p.transaction_ref ? ` · ${p.transaction_ref.slice(0, 16)}…` : ''}
                  </p>
                  {p.payment_date && (
                    <p className="text-xs text-gray-400">{new Date(p.payment_date).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 text-sm">{Number(p.amount).toLocaleString()} RWF</p>
                  <span className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[p.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">

            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-gray-800">
                {step === 'form' && 'Pay via Mobile Money'}
                {step === 'waiting' && 'Confirm on Your Phone'}
                {step === 'success' && 'Payment Successful'}
                {step === 'failed' && 'Payment Failed'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Step: Form */}
            {step === 'form' && (
              <form onSubmit={handlePay} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number (MTN / Airtel)</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0781234567"
                      value={form.number}
                      onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Payment Month</label>
                  <input
                    type="month"
                    required
                    value={form.month}
                    onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Amount (RWF)</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Standard fee: 3,000 RWF/month</p>
                </div>
                {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={closeModal} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submitting ? <><Loader2 size={14} className="animate-spin" /> Sending…</> : 'Send USSD Prompt'}
                  </button>
                </div>
              </form>
            )}

            {/* Step: Waiting for USSD confirmation */}
            {step === 'waiting' && (
              <div className="p-6 text-center space-y-5">
                <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto">
                  <Phone size={28} className="text-yellow-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Check your phone!</p>
                  <p className="text-sm text-gray-500 mt-1">
                    A USSD prompt has been sent to <span className="font-semibold text-gray-700">{form.number}</span>.
                    Enter your Mobile Money PIN to confirm.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 space-y-1">
                  <p>Amount: <span className="font-semibold text-gray-700">{Number(form.amount).toLocaleString()} RWF</span></p>
                  <p>Month: <span className="font-semibold text-gray-700">{formatMonth(form.month)}</span></p>
                  <p className="font-mono text-gray-400">Ref: {activeRef}</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Loader2 size={14} className="animate-spin text-green-600" />
                  Waiting for confirmation… {pollSeconds}s
                </div>
                <button onClick={closeModal} className="text-xs text-gray-400 hover:text-gray-600 underline">
                  Close (payment will complete in background)
                </button>
              </div>
            )}

            {/* Step: Success */}
            {step === 'success' && (
              <div className="p-6 text-center space-y-5">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-lg">Payment Confirmed!</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Your payment of <span className="font-semibold">{Number(form.amount).toLocaleString()} RWF</span> for{' '}
                    <span className="font-semibold">{formatMonth(form.month)}</span> was successful.
                  </p>
                </div>
                <p className="font-mono text-xs text-gray-400">Ref: {activeRef}</p>
                <button
                  onClick={closeModal}
                  className="w-full py-2.5 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition"
                >
                  Done
                </button>
              </div>
            )}

            {/* Step: Failed */}
            {step === 'failed' && (
              <div className="p-6 text-center space-y-5">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                  <X size={32} className="text-red-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-lg">Payment Failed</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {error || 'The payment was not completed. You may have declined or the request timed out.'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
                    Close
                  </button>
                  <button
                    onClick={() => { setStep('form'); setError(''); }}
                    className="flex-1 py-2.5 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
