"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, BadgeCheck, Users, FileText, MapPin,
  Car, ShieldCheck, LogOut, Phone, Mail, User, Truck,
} from "lucide-react";
import { useCurrentCompanyApplication, useCompanyUserInfo } from "@/lib/company-application";

export default function WasteCompanyDashboard() {
  const router = useRouter();
  const userInfo = useCompanyUserInfo();
  const application = useCurrentCompanyApplication();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token || !userInfo || userInfo.role !== "WASTE_COLLECTOR") {
      router.push("/signin");
      return;
    }
    if (!application) { router.push("/company-onboarding"); return; }
    if (application.status === "pending" || application.status === "denied") {
      router.push("/company-status");
    }
  }, [router, userInfo, application]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
    router.push("/signin");
  };

  if (!userInfo || userInfo.role !== "WASTE_COLLECTOR" || !application || application.status !== "approved") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600" />
      </div>
    );
  }

  const totalDocs = application.certificates.length + application.rdbCertificates.length + (application.taxCertificates?.length ?? 0);

  const metrics = [
    { label: "Drivers", value: application.drivers.length, icon: <Users size={20} className="text-blue-600" />, bg: "bg-blue-50" },
    { label: "Vehicles", value: application.cars?.length ?? 0, icon: <Car size={20} className="text-purple-600" />, bg: "bg-purple-50" },
    { label: "Service areas", value: application.serviceAreas.length, icon: <MapPin size={20} className="text-emerald-600" />, bg: "bg-emerald-50" },
    { label: "Documents", value: totalDocs, icon: <FileText size={20} className="text-orange-500" />, bg: "bg-orange-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center">
            <Truck size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">EcoTrack</p>
            <p className="text-xs text-gray-500">Waste Collector Dashboard</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition">
          <LogOut size={15} /> Logout
        </button>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Hero banner */}
        <div className="rounded-3xl bg-gradient-to-r from-green-900 via-emerald-800 to-teal-700 p-8 text-white shadow-lg">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm mb-4">
            <BadgeCheck size={15} /> Approved — Active Company
          </div>
          <h1 className="text-3xl font-bold">{application.companyName}</h1>
          <p className="mt-2 text-green-100 text-sm max-w-2xl">
            Your company profile has been approved by the admin. Manage your drivers, vehicles, and operations from this dashboard.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-green-200">
            <span className="flex items-center gap-1"><Mail size={13} /> {application.companyEmail}</span>
            <span className="flex items-center gap-1"><Phone size={13} /> {application.companyPhone}</span>
            <span className="flex items-center gap-1"><MapPin size={13} /> {application.companyAddress || "Address not set"}</span>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
              <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mb-3`}>{m.icon}</div>
              <p className="text-2xl font-bold text-gray-900">{m.value}</p>
              <p className="text-sm text-gray-500">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Owner/Manager + Company overview */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Card title="Owner & Manager Information" icon={<User size={16} className="text-emerald-600" />}>
            <InfoRow label="Owner" value={application.ownerName || "—"} />
            <InfoRow label="Owner email" value={application.ownerEmail || "—"} />
            <InfoRow label="Owner phone" value={application.ownerPhone || "—"} />
            <InfoRow label="Name" value={application.managerName} />
            <InfoRow label="Position" value={application.managerPosition || "—"} />
            <InfoRow label="Email" value={application.managerEmail} />
            <InfoRow label="Phone" value={application.managerPhone} />
            <InfoRow label="National ID" value={application.managerNationalId || "—"} />
            <InfoRow label="TIN / Reg. no." value={application.managerIdNumber || "—"} />
          </Card>

          <Card title="Company Overview" icon={<Building2 size={16} className="text-green-600" />}>
            <InfoRow label="Service areas" value={application.serviceAreas.join(", ")} />
            <InfoRow label="Drivers" value={String(application.drivers.length)} />
            <InfoRow label="Vehicles" value={String(application.cars?.length ?? 0)} />
            <InfoRow label="Certificates" value={String(application.certificates.length)} />
            <InfoRow label="Tax documents" value={String(application.taxCertificates?.length ?? 0)} />
            {application.companyDescription && (
              <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600 mt-1">
                {application.companyDescription}
              </div>
            )}
          </Card>
        </div>

        {/* Drivers */}
        <Card title="Driver Roster" icon={<Users size={16} className="text-blue-600" />}>
          {application.drivers.length === 0 ? (
            <p className="text-sm text-gray-400">No drivers on record.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {application.drivers.map((driver, i) => (
                <div key={i} className="rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-1">
                  <p className="font-semibold text-gray-900">{driver.name}</p>
                  <p className="text-xs text-gray-500">{driver.email} • {driver.phone}</p>
                  <p className="text-xs text-gray-500">License: {driver.licenseNumber || "N/A"} • ID: {driver.nationalId || "N/A"}</p>
                  <p className="text-xs text-gray-500">Zone: {driver.zone} • Truck: {driver.truckId || "Unassigned"} • Exp: {driver.yearsOfExperience || "N/A"} yrs</p>
                  <p className="text-xs text-gray-500">Emergency: {driver.emergencyContactName || "N/A"} ({driver.emergencyContactPhone || "N/A"})</p>
                  <p className="text-xs text-gray-500">Address: {driver.address || "N/A"}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Vehicles */}
        <Card title="Fleet / Vehicles" icon={<Car size={16} className="text-purple-600" />}>
          {!application.cars || application.cars.length === 0 ? (
            <p className="text-sm text-gray-400">No vehicles on record.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {application.cars.map((car, i) => (
                <div key={i} className="rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-1">
                  <p className="font-semibold text-gray-900">{car.plateNumber} — {car.model}</p>
                  <p className="text-xs text-gray-500">Year: {car.year || "N/A"} • Capacity: {car.capacity || "N/A"} tons</p>
                  <p className="text-xs text-gray-500">Zone: {car.assignedZone} • Insurance: {car.insuranceNumber || "N/A"}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Documents */}
        <Card title="Certificates & Documents" icon={<ShieldCheck size={16} className="text-orange-500" />}>
          <div className="grid gap-4 md:grid-cols-3">
            <DocList label="Business Certificates" files={application.certificates} />
            <DocList label="RDB Certificates" files={application.rdbCertificates} />
            <DocList label="Tax Clearance" files={application.taxCertificates ?? []} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        {icon}
        <h2 className="font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-2.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}

function DocList({ label, files }: { label: string; files: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      {files.length === 0 ? (
        <p className="text-xs text-gray-400">None uploaded</p>
      ) : (
        <ul className="space-y-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
              <FileText size={12} className="text-gray-400 flex-shrink-0" /> {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
