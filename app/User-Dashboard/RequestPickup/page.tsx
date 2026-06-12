"use client";

import { useState, useEffect } from "react";
import {
  Truck, CalendarDays, Clock, CheckCircle2, Loader2,
  AlertCircle, ChevronRight, Trash2, Recycle, Package,
  Leaf, Zap, X,
} from "lucide-react";
import { api, type BackendComplaint } from "@/lib/api-client";

const WASTE_TYPES = [
  { label: "General Waste", icon: Trash2, color: "bg-gray-100 text-gray-700 border-gray-300" },
  { label: "Recyclables", icon: Recycle, color: "bg-blue-50 text-blue-700 border-blue-300" },
  { label: "Bulky Items", icon: Package, color: "bg-orange-50 text-orange-700 border-orange-300" },
  { label: "Organic Waste", icon: Leaf, color: "bg-green-50 text-green-700 border-green-300" },
  { label: "Hazardous Waste", icon: Zap, color: "bg-red-50 text-red-700 border-red-300" },
];

const TIME_SLOTS = ["06:00 – 09:00", "09:00 – 12:00", "12:00 – 15:00", "15:00 – 18:00"];

const statusColor: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700",
};

function fmt(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function RequestPickupPage() {
  const [wasteType, setWasteType] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Urgent">("Medium");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  const [requests, setRequests] = useState<BackendComplaint[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Load previous pickup requests
  useEffect(() => {
    api.complaints.me()
      .then(data => setRequests(data.filter(c => c.issue_type === "Pickup Request")))
      .catch(() => {/* silent */})
      .finally(() => setLoadingHistory(false));
  }, []);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!wasteType) { setSubmitError("Please select a waste type."); return; }
    if (!date) { setSubmitError("Please select a preferred date."); return; }
    setSubmitError("");
    setSubmitting(true);

    const description = [
      `Waste type: ${wasteType}`,
      `Preferred date: ${date}`,
      timeSlot ? `Preferred time: ${timeSlot}` : null,
      notes.trim() ? `Notes: ${notes.trim()}` : null,
    ].filter(Boolean).join("\n");

    try {
      const res = await api.complaints.submit({
        issue_type: "Pickup Request",
        description,
        priority,
      });
      setRequests(prev => [res.complaint, ...prev]);
      setSuccess(true);
      setWasteType(""); setDate(""); setTimeSlot(""); setNotes(""); setPriority("Medium");
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (c: BackendComplaint) => {
    setDeletingId(c.id);
    setRequests(prev => prev.filter(r => r.id !== c.id));
    try {
      await api.complaints.remove(c.id);
    } catch {
      setRequests(prev => [c, ...prev].sort((a, b) =>
        new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
      ));
    } finally {
      setDeletingId(null);
    }
  };

  // Min date = today
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
          <Truck size={22} className="text-green-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Request Pickup</h1>
          <p className="text-sm text-gray-500">Ask the waste company to collect your waste</p>
        </div>
      </div>

      {/* Success banner */}
      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-5 py-4 rounded-2xl">
          <CheckCircle2 size={20} className="flex-shrink-0 text-green-600" />
          <div>
            <p className="font-semibold">Pickup request submitted!</p>
            <p className="text-sm text-green-700">The waste company has been notified and will confirm your request.</p>
          </div>
        </div>
      )}

      {/* Request Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
        <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
          <ChevronRight size={18} className="text-green-600" /> New Pickup Request
        </h2>

        {submitError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
            <AlertCircle size={16} className="flex-shrink-0" /> {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Waste type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Waste Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {WASTE_TYPES.map(({ label, icon: Icon, color }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setWasteType(label)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    wasteType === label
                      ? "border-green-600 bg-green-50 text-green-800 shadow-sm"
                      : `border ${color} hover:shadow-sm`
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                <CalendarDays size={14} /> Preferred Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                min={today}
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                <Clock size={14} /> Preferred Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white"
              >
                <option value="">Any time</option>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
            <div className="flex gap-2 flex-wrap">
              {(["Low", "Medium", "High", "Urgent"] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    priority === p
                      ? p === "Urgent" ? "bg-red-600 text-white border-red-600"
                        : p === "High" ? "bg-orange-500 text-white border-orange-500"
                        : p === "Medium" ? "bg-yellow-500 text-white border-yellow-500"
                        : "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Large bags near the gate, special access instructions, amount of waste..."
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <><Loader2 size={16} className="animate-spin" /> Submitting…</>
            ) : (
              <><Truck size={16} /> Submit Pickup Request</>
            )}
          </button>
        </form>
      </div>

      {/* Previous Requests */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <CalendarDays size={17} className="text-green-600" /> My Pickup Requests
          </h2>
        </div>

        {loadingHistory ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-7 h-7 animate-spin text-green-600" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Truck size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium text-gray-500">No pickup requests yet</p>
            <p className="text-sm">Submit your first request above</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {requests.map(r => {
              // Parse description fields back out for display
              const lines = r.description.split("\n");
              const wasteTypeLine = lines.find(l => l.startsWith("Waste type:"))?.replace("Waste type: ", "") ?? "";
              const dateLine = lines.find(l => l.startsWith("Preferred date:"))?.replace("Preferred date: ", "") ?? "";
              const timeLine = lines.find(l => l.startsWith("Preferred time:"))?.replace("Preferred time: ", "") ?? "";
              const notesLine = lines.find(l => l.startsWith("Notes:"))?.replace("Notes: ", "") ?? "";

              return (
                <div key={r.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-green-600 flex-shrink-0" />
                      <p className="font-semibold text-gray-800 text-sm">{wasteTypeLine || "Pickup Request"}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${statusColor[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {r.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                    {dateLine && (
                      <span className="flex items-center gap-1">
                        <CalendarDays size={12} /> {dateLine}
                      </span>
                    )}
                    {timeLine && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {timeLine}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full font-medium ${
                      r.priority === "Urgent" ? "bg-red-100 text-red-700"
                      : r.priority === "High" ? "bg-orange-100 text-orange-700"
                      : r.priority === "Medium" ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                    }`}>
                      {r.priority}
                    </span>
                  </div>

                  {notesLine && (
                    <p className="text-xs text-gray-500 mb-2 italic">"{notesLine}"</p>
                  )}

                  {r.resolution_note && (
                    <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2 text-xs text-green-800 mb-2">
                      <span className="font-semibold">Company response: </span>{r.resolution_note}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">Submitted: {fmt(r.created_at)}</p>
                    {r.status === "Pending" && (
                      <button
                        onClick={() => void handleCancel(r)}
                        disabled={deletingId === r.id}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deletingId === r.id
                          ? <Loader2 size={12} className="animate-spin" />
                          : <X size={12} />}
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
