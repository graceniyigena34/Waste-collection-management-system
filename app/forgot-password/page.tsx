"use client";

import { useState } from "react";
import Link from "next/link";
import { Truck, Mail, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) { setError("Email address is required."); return; }
    setError("");
    setLoading(true);
    try {
      await api.auth.forgotPassword(email.trim().toLowerCase());
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center">
            <Truck size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">EcoTrack</span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

          {submitted ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h2>
              <p className="text-sm text-gray-500 mb-6">
                We sent a password reset link to{" "}
                <span className="font-semibold text-gray-700">{email}</span>.
                Check your inbox (and spam folder) — the link expires in 30 minutes.
              </p>

              <p className="text-xs text-gray-400 mb-6">
                Didn&apos;t receive it?{" "}
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-green-700 font-semibold hover:underline"
                >
                  Try again
                </button>
              </p>

              <Link
                href="/signin"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-green-700 transition"
              >
                <ArrowLeft size={15} /> Back to Sign In
              </Link>
            </div>

          ) : (
            /* ── Request form ── */
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Forgot your password?</h2>
                <p className="text-sm text-gray-500">
                  Enter your email and we&apos;ll send you a link to reset it.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(""); }}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : "Send Reset Link"}
                </button>
              </form>

              <p className="text-center mt-5 text-sm text-gray-500">
                <Link href="/signin" className="inline-flex items-center gap-1 text-green-700 font-semibold hover:underline">
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
