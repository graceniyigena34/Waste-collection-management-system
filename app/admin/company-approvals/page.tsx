"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck, Ban, Building2, Car, CheckCircle2,
  ChevronDown, ChevronUp, FileText, ShieldCheck, Users,
} from "lucide-react";
import { api, type BackendCompanyProfile } from "@/lib/api-client";

export default function CompanyApprovalsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<BackendCompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userInfo = localStorage.getItem("user_info");
    if (!token || !userInfo) { router.push("/signin"); }

    const loadApplications = async () => {
      try {
        const response = await api.companies.all(500, 0);
        setApplications(response.data);
      } catch {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    void loadApplications();
  }, [router]);

  const reloadApplications = async () => {
    const response = await api.companies.all(500, 0);
    setApplications(response.data);
  };

  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const handleApprove = async (id: number) => {
    await api.companies.approveWithNotes(id, reviewNotes[String(id)] ?? "Approved by admin");
    await reloadApplications();
  };

  const handleDeny = async (id: number) => {
    await api.companies.reject(id, reviewNotes[String(id)] ?? "Rejected by admin");
    await reloadApplications();
  };

  const pending = applications.filter((a) => a.status === "pending").length;

  const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Company Approvals</h1>
            <p className="text-sm text-gray-500 mt-1">Review waste company applications and approve or deny them.</p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
              <BadgeCheck size={15} /> {pending} pending
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
              {applications.length} total
            </span>
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-400">
          No company applications submitted yet.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const appKey = String(app.id);
            const isOpen = expanded[appKey] ?? false;
            const certificates = asArray(app.certificates) as string[];
            const rdbCertificates = asArray(app.rdb_certificates) as string[];
            const taxCertificates = asArray(app.tax_certificates) as string[];
            const drivers = asArray(app.drivers) as Array<Record<string, string>>;
            const cars = asArray(app.vehicles) as Array<Record<string, string>>;
            const serviceAreas = asArray(app.service_areas) as string[];
            const totalDocs = certificates.length + rdbCertificates.length + taxCertificates.length;

            return (
              <div key={app.id} className="rounded-3xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                {/* Collapsed header — always visible */}
                <div className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Building2 size={18} className="text-green-600 flex-shrink-0" />
                    <h2 className="text-lg font-bold text-gray-900">{app.company_name || "Unnamed company"}</h2>
                    <StatusBadge status={app.status} />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-1.5">
                      <Users size={11} className="inline mr-1" />{drivers.length} drivers
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-1.5">
                      <Car size={11} className="inline mr-1" />{cars.length} vehicles
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-1.5">
                      <FileText size={11} className="inline mr-1" />{totalDocs} docs
                    </span>
                    <button onClick={() => toggle(appKey)} className="flex items-center gap-1 text-sm text-green-700 font-medium hover:underline ml-2">
                      {isOpen ? <><ChevronUp size={15} /> Hide</> : <><ChevronDown size={15} /> Review</>}
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-gray-100 p-6 space-y-5">
                    {/* Company + Manager */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <Section title="Company Info">
                        <InfoRow label="Email" value={app.email} />
                        <InfoRow label="Phone" value={app.phone} />
                        <InfoRow label="Address" value={app.address || "—"} />
                        <InfoRow label="TIN / Reg." value={app.tin || "—"} />
                        <InfoRow label="Service areas" value={serviceAreas.join(", ") || "—"} />
                        {app.description && (
                          <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2 mt-1">{app.description}</p>
                        )}
                      </Section>
                      <Section title="Manager Info">
                        <InfoRow label="Name" value={app.manager_name || "—"} />
                        <InfoRow label="Email" value={app.manager_email || "—"} />
                        <InfoRow label="Phone" value={app.manager_phone || "—"} />
                        <InfoRow label="Position" value={app.manager_position || "—"} />
                        <InfoRow label="National ID" value={app.manager_national_id || "—"} />
                      </Section>
                    </div>

                    {/* Drivers */}
                    <Section title={`Drivers (${drivers.length})`} icon={<Users size={14} className="text-blue-600" />}>
                      {drivers.length === 0 ? (
                        <p className="text-xs text-gray-400">No drivers submitted.</p>
                      ) : (
                        <div className="grid gap-2 md:grid-cols-2">
                          {drivers.map((d, i) => (
                            <div key={i} className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5 space-y-0.5">
                              <p className="font-semibold text-gray-900 text-sm">{d.name}</p>
                              <p className="text-xs text-gray-500">{d.email} • {d.phone}</p>
                              <p className="text-xs text-gray-500">License: {d.licenseNumber || "N/A"} • ID: {d.nationalId || "N/A"}</p>
                              <p className="text-xs text-gray-500">Zone: {d.zone} • Truck: {d.truckId || "N/A"} • Exp: {d.yearsOfExperience || "N/A"} yrs</p>
                              <p className="text-xs text-gray-500">Emergency: {d.emergencyContactName || "N/A"} ({d.emergencyContactPhone || "N/A"})</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </Section>

                    {/* Vehicles */}
                    <Section title={`Vehicles (${cars.length})`} icon={<Car size={14} className="text-purple-600" />}>
                      {cars.length === 0 ? (
                        <p className="text-xs text-gray-400">No vehicles submitted.</p>
                      ) : (
                        <div className="grid gap-2 md:grid-cols-2">
                          {cars.map((c, i) => (
                            <div key={i} className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5 space-y-0.5">
                              <p className="font-semibold text-gray-900 text-sm">{c.plateNumber} — {c.model}</p>
                              <p className="text-xs text-gray-500">Year: {c.year || "N/A"} • Capacity: {c.capacity || "N/A"} tons</p>
                              <p className="text-xs text-gray-500">Zone: {c.assignedZone} • Insurance: {c.insuranceNumber || "N/A"}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </Section>

                    {/* Documents */}
                    <Section title="Certificates & Documents" icon={<ShieldCheck size={14} className="text-orange-500" />}>
                      <div className="grid gap-4 md:grid-cols-3">
                        <DocList label="Business Certificates" files={certificates} />
                        <DocList label="RDB Certificates" files={rdbCertificates} />
                        <DocList label="Tax Clearance" files={taxCertificates} />
                      </div>
                    </Section>

                    {/* Review notes + actions */}
                    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Review notes</label>
                        <textarea
                          value={reviewNotes[appKey] ?? app.review_notes ?? ""}
                          onChange={(e) => setReviewNotes((p) => ({ ...p, [appKey]: e.target.value }))}
                          rows={3}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Add notes for the applicant"
                        />
                        {app.reviewed_at && (
                          <p className="mt-1 text-xs text-gray-400">
                            Reviewed {new Date(app.reviewed_at).toLocaleDateString()} by admin
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 min-w-40">
                        <button
                          onClick={() => { void handleApprove(app.id); }}
                          disabled={app.status === "approved"}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          <CheckCircle2 size={15} /> Approve
                        </button>
                        <button
                          onClick={() => { void handleDeny(app.id); }}
                          disabled={app.status === "rejected"}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          <Ban size={15} /> Deny
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-amber-100 text-amber-700",
    draft: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status] ?? styles.draft}`}>
      {status}
    </span>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-sm font-semibold text-gray-700">{title}</p>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2 text-xs">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right break-all">{value}</span>
    </div>
  );
}

function DocList({ label, files }: { label: string; files: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</p>
      {files.length === 0 ? (
        <p className="text-xs text-gray-400">None</p>
      ) : (
        <ul className="space-y-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-1.5 text-xs text-gray-700 bg-gray-50 rounded-lg px-2.5 py-1.5">
              <FileText size={11} className="text-gray-400 flex-shrink-0" /> {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
