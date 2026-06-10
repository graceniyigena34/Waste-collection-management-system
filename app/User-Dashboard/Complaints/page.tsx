"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, AlertCircle, Clock, Truck, FileText, Loader2, Trash2, Pencil } from "lucide-react";
import { api, type BackendComplaint } from "@/lib/api-client";

const ISSUE_TYPES = [
  "Missed Collection",
  "Late Collection",
  "Incomplete Collection",
  "Equipment Issue",
  "Service Quality",
  "Billing Issue",
  "Schedule Change Request",
  "Other",
];

const statusColor: Record<string, string> = {
  Pending: "text-orange-600 bg-orange-100",
  "In Progress": "text-blue-600 bg-blue-100",
  Resolved: "text-green-600 bg-green-100",
};

const priorityColor: Record<string, string> = {
  Urgent: "text-red-600 bg-red-100",
  High: "text-orange-600 bg-orange-100",
  Medium: "text-yellow-600 bg-yellow-100",
  Low: "text-green-600 bg-green-100",
};

const statusIcon: Record<string, React.ReactNode> = {
  Pending: <Clock className="w-4 h-4" />,
  "In Progress": <Truck className="w-4 h-4" />,
  Resolved: <FileText className="w-4 h-4" />,
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

type ComplaintForm = {
  issueType: string;
  description: string;
  priority: BackendComplaint["priority"];
};

const emptyForm = (): ComplaintForm => ({ issueType: "", description: "", priority: "Medium" });

export default function ComplaintsSection() {
  const [complaints, setComplaints] = useState<BackendComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New complaint
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState<ComplaintForm>(emptyForm());

  // Edit complaint
  const [editTarget, setEditTarget] = useState<BackendComplaint | null>(null);
  const [editForm, setEditForm] = useState<ComplaintForm>(emptyForm());
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => { void loadComplaints(); }, []);

  const loadComplaints = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.complaints.me();
      setComplaints(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  // ── Submit new ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!formData.issueType || !formData.description.trim()) {
      setSubmitError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await api.complaints.submit({
        issue_type: formData.issueType,
        description: formData.description.trim(),
        priority: formData.priority,
      });
      setComplaints(prev => [res.complaint, ...prev]);
      setFormData(emptyForm());
      setShowForm(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  const openEdit = (c: BackendComplaint) => {
    setEditTarget(c);
    setEditForm({ issueType: c.issue_type, description: c.description, priority: c.priority });
    setEditError("");
  };

  const handleSaveEdit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!editTarget) return;
    if (!editForm.issueType || !editForm.description.trim()) {
      setEditError("Please fill in all required fields.");
      return;
    }
    setEditSaving(true);
    setEditError("");
    try {
      const res = await api.complaints.editMine(editTarget.id, {
        issue_type: editForm.issueType,
        description: editForm.description.trim(),
        priority: editForm.priority,
      });
      setComplaints(prev => prev.map(c => c.id === editTarget.id ? res.complaint : c));
      setEditTarget(null);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to update complaint.");
    } finally {
      setEditSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (complaint: BackendComplaint) => {
    setDeletingId(complaint.id);
    // Optimistic remove
    setComplaints(prev => prev.filter(c => c.id !== complaint.id));
    try {
      await api.complaints.remove(complaint.id);
    } catch (err) {
      // Rollback
      setComplaints(prev => [complaint, ...prev].sort((a, b) =>
        new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
      ));
      setError(err instanceof Error ? err.message : "Failed to delete complaint.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Complaints</h2>
        <button
          onClick={() => { setFormData(emptyForm()); setSubmitError(""); setShowForm(true); }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Complaint
        </button>
      </div>

      {/* ── New Complaint Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">New Complaint</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                  {submitError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.issueType}
                    onChange={e => setFormData(p => ({ ...p, issueType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select an issue type</option>
                    {ISSUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData(p => ({ ...p, priority: e.target.value as BackendComplaint["priority"] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {["Low", "Medium", "High", "Urgent"].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Please describe the issue in detail..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    disabled={submitting}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Complaint Modal ── */}
      {editTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Edit Complaint</h3>
                <button onClick={() => setEditTarget(null)} disabled={editSaving} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              {editError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                  {editError}
                </div>
              )}
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editForm.issueType}
                    onChange={e => setEditForm(p => ({ ...p, issueType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select an issue type</option>
                    {ISSUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={editForm.priority}
                    onChange={e => setEditForm(p => ({ ...p, priority: e.target.value as BackendComplaint["priority"] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {["Low", "Medium", "High", "Urgent"].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditTarget(null)}
                    disabled={editSaving}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editSaving}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {editSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Complaints List ── */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Complaints</h3>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="w-10 h-10 mx-auto mb-2 text-red-400" />
              <p className="text-red-600 text-sm">{error}</p>
              <button onClick={() => void loadComplaints()} className="mt-3 text-sm text-green-700 underline">
                Try again
              </button>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No complaints submitted yet</p>
              <p className="text-sm">Click &quot;New Complaint&quot; to submit your first complaint</p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map(c => (
                <div key={c.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${(statusColor[c.status] ?? "text-gray-600 bg-gray-100").split(" ")[1]}`}>
                        {statusIcon[c.status] ?? <AlertCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{c.issue_type}</h4>
                        <p className="text-xs text-gray-400">#{c.id}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[c.status] ?? "text-gray-600 bg-gray-100"}`}>
                        {c.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColor[c.priority] ?? "text-gray-600 bg-gray-100"}`}>
                        {c.priority}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{c.description}</p>

                  {c.resolution_note && (
                    <div className="bg-green-50 border border-green-100 rounded p-2 mb-3 text-sm text-green-800">
                      <span className="font-medium">Resolution: </span>{c.resolution_note}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="text-sm text-gray-500 space-y-0.5">
                      <p>Submitted: {formatDate(c.created_at)}</p>
                      {c.assigned_to && <p className="text-xs text-blue-600">Assigned: {c.assigned_to}</p>}
                    </div>

                    {/* Edit + Delete — only on Pending complaints */}
                    {c.status === "Pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => void handleDelete(c)}
                          disabled={deletingId === c.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {deletingId === c.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5" />}
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
