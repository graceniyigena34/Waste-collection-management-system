"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, BadgeCheck, Users, FileText, MapPin,
  Car, ShieldCheck, LogOut, Phone, Mail, User, Truck,
  LayoutDashboard, ClipboardList, Route, Settings, ArrowUpRight,
  Clock, AlertTriangle, DollarSign, TrendingUp, Bell, Plus,
} from "lucide-react";
import { isWasteCollectorRole } from "@/lib/company-application";
import { api, type BackendCompanyProfile, getStoredUserInfo } from "@/lib/api-client";

export default function WasteCompanyDashboard() {
  const router = useRouter();
  const userInfo = getStoredUserInfo();
  const [application, setApplication] = useState<BackendCompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [assignmentDriver, setAssignmentDriver] = useState("");
  const [assignmentVehicle, setAssignmentVehicle] = useState("");
  const [assignmentZone, setAssignmentZone] = useState("");
  const [assignments, setAssignments] = useState<Array<{ driver: string; vehicle: string; zone: string; createdAt: string }>>([]);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token || !userInfo || !isWasteCollectorRole(userInfo.role)) {
      router.push("/signin");
      return;
    }
    const loadCompany = async () => {
      if (!userInfo.email) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.companies.byEmail(userInfo.email);
        setApplication(res.company);
        if (res.company.status === "pending" || res.company.status === "rejected") {
          router.push("/company-status");
        }
      } catch {
        router.push("/company-onboarding");
      } finally {
        setLoading(false);
      }
    };

    void loadCompany();
  }, [router, userInfo]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
    router.push("/signin");
  };

  if (loading || !userInfo || !isWasteCollectorRole(userInfo.role) || !application || application.status !== "approved") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600" />
      </div>
    );
  }

  const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

  const mapped = {
    drivers: asArray(application.drivers) as Array<Record<string, string>>,
    cars: asArray(application.vehicles) as Array<Record<string, string>>,
    certificates: asArray(application.certificates) as string[],
    rdbCertificates: asArray(application.rdb_certificates) as string[],
    taxCertificates: asArray(application.tax_certificates) as string[],
    serviceAreas: asArray(application.service_areas) as string[],
  };

  const totalDocs = mapped.certificates.length + mapped.rdbCertificates.length + mapped.taxCertificates.length;

  const zoneProgress = mapped.serviceAreas.length > 0
    ? mapped.serviceAreas.map((zone, index) => ({
        zone,
        pct: Math.max(55, 92 - index * 8),
        color: ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-orange-500"][index % 4],
      }))
    : [
        { zone: "Kicukiro", pct: 88, color: "bg-green-500" },
        { zone: "Gasabo", pct: 72, color: "bg-blue-500" },
        { zone: "Nyarugenge", pct: 65, color: "bg-purple-500" },
        { zone: "Remera", pct: 91, color: "bg-orange-500" },
      ];

  const activities = [
    { id: "1", title: "Drivers Updated", desc: `${mapped.drivers.length} drivers available for dispatch`, time: "10 min ago", dot: "bg-green-500" },
    { id: "2", title: "Documents Reviewed", desc: `${totalDocs} company documents are uploaded`, time: "2 hrs ago", dot: "bg-blue-500" },
    { id: "3", title: "Service Areas Set", desc: mapped.serviceAreas.join(", ") || "No zones selected", time: "5 hrs ago", dot: "bg-purple-500" },
    { id: "4", title: "Fleet Ready", desc: `${mapped.cars.length} vehicles are ready for operation`, time: "6 hrs ago", dot: "bg-orange-500" },
  ];

  const quickActions = [
    { label: "Drivers", icon: Users, color: "text-blue-600 bg-blue-50 hover:bg-blue-100", target: "drivers-section" },
    { label: "Vehicles", icon: Car, color: "text-purple-600 bg-purple-50 hover:bg-purple-100", target: "vehicles-section" },
    { label: "Assignment", icon: Route, color: "text-teal-600 bg-teal-50 hover:bg-teal-100", target: "assignment-section" },
    { label: "Documents", icon: FileText, color: "text-orange-600 bg-orange-50 hover:bg-orange-100", target: "documents-section" },
    { label: "Overview", icon: Building2, color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100", target: "overview-section" },
  ];

  const assignmentZones = mapped.serviceAreas.length > 0 ? mapped.serviceAreas : ["Kicukiro", "Gasabo", "Nyarugenge", "Remera"];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToOnboarding = () => {
    router.push("/company-onboarding");
  };

  const handleCreateAssignment = () => {
    if (!assignmentDriver || !assignmentVehicle || !assignmentZone) {
      return;
    }

    setAssignments((current) => [
      {
        driver: assignmentDriver,
        vehicle: assignmentVehicle,
        zone: assignmentZone,
        createdAt: new Date().toLocaleString(),
      },
      ...current,
    ]);

    setAssignmentDriver("");
    setAssignmentVehicle("");
    setAssignmentZone("");
  };

  const metrics = [
    { label: "Drivers", value: mapped.drivers.length, icon: <Users size={20} className="text-blue-600" />, bg: "bg-blue-50" },
    { label: "Vehicles", value: mapped.cars.length, icon: <Car size={20} className="text-purple-600" />, bg: "bg-purple-50" },
    { label: "Service areas", value: mapped.serviceAreas.length, icon: <MapPin size={20} className="text-emerald-600" />, bg: "bg-emerald-50" },
    { label: "Documents", value: totalDocs, icon: <FileText size={20} className="text-orange-500" />, bg: "bg-orange-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden lg:flex w-72 flex-col bg-gradient-to-b from-green-950 via-emerald-900 to-green-900 text-white">
        <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center">
            <Truck size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-lg leading-none">EcoTrack</p>
            <p className="text-xs text-white/60">Waste Company Dashboard</p>
          </div>
        </div>

        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold">{application.company_name.slice(0, 2).toUpperCase()}</div>
            <div>
              <p className="font-semibold">{application.company_name}</p>
              <p className="text-xs text-emerald-100/70">{application.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-2">
          {[
            { label: "Dashboard", icon: LayoutDashboard, active: true, target: "top-section" },
            { label: "Drivers", icon: Users, target: "drivers-section" },
            { label: "Vehicles", icon: Car, target: "vehicles-section" },
            { label: "Assignment", icon: Route, target: "assignment-section" },
            { label: "Documents", icon: FileText, target: "documents-section" },
            { label: "Overview", icon: Building2, target: "overview-section" },
            { label: "Settings", icon: Settings, target: "top-section" },
          ].map(({ label, icon: Icon, active, target }) => (
            <button
              key={label}
              onClick={() => scrollToSection(target)}
              className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${active ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              <span className="ml-auto opacity-60">›</span>
            </button>
          ))}
        </nav>

        <div className="px-4 py-5 border-t border-white/10">
          <button onClick={handleLogout} className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15 transition flex items-center justify-center gap-2">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <button className="lg:hidden w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600">
                <LayoutDashboard size={18} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-xs text-gray-500">Company operations at a glance</p>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition">
            <LogOut size={15} /> Logout
          </button>
        </header>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6" id="top-section">
          <div className="lg:hidden rounded-2xl bg-white border border-gray-200 shadow-sm p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Sections</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map(({ label, icon: Icon, target }) => (
                <button
                  key={label}
                  onClick={() => scrollToSection(target)}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-r from-green-900 via-emerald-800 to-teal-700 p-8 text-white shadow-lg">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm mb-4">
              <BadgeCheck size={15} /> Approved — Active Company
            </div>
            <h1 className="text-3xl font-bold">{application.company_name}</h1>
            <p className="mt-2 text-green-100 text-sm max-w-2xl">
              Your company profile has been approved. Use this dashboard to manage drivers, vehicles, documents, routes, and daily company activities.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-green-200">
              <span className="flex items-center gap-1"><Mail size={13} /> {application.email}</span>
              <span className="flex items-center gap-1"><Phone size={13} /> {application.phone}</span>
              <span className="flex items-center gap-1"><MapPin size={13} /> {application.address || "Address not set"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {[
              { label: "Total Drivers", value: mapped.drivers.length, sub: "Registered drivers", icon: <Users size={22} className="text-blue-600" />, iconBg: "bg-blue-100", valueColor: "text-blue-600", trend: "+12% this month" },
              { label: "Vehicles Ready", value: mapped.cars.length, sub: "Fleet available", icon: <Truck size={22} className="text-green-600" />, iconBg: "bg-green-100", valueColor: "text-green-600", trend: "+5% vs yesterday" },
              { label: "Documents", value: totalDocs, sub: "Uploaded files", icon: <FileText size={22} className="text-purple-600" />, iconBg: "bg-purple-100", valueColor: "text-purple-600", trend: "+8% this month" },
              { label: "Service Areas", value: mapped.serviceAreas.length, sub: "Zones covered", icon: <MapPin size={22} className="text-orange-500" />, iconBg: "bg-orange-100", valueColor: "text-orange-500", trend: "Active" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 ${s.iconBg} rounded-xl flex items-center justify-center`}>{s.icon}</div>
                  <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                    <ArrowUpRight size={14} /> {s.trend}
                  </span>
                </div>
                <p className={`text-2xl font-bold ${s.valueColor}`}>{s.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
                <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
            <div className="xl:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-5">
                <MapPin size={18} className="text-green-600" /> Zone Collection Progress
              </h2>
              <div className="space-y-4">
                {zoneProgress.map((z) => (
                  <div key={z.zone}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-gray-700">{z.zone}</span>
                      <span className="text-gray-500">{z.pct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className={`${z.color} h-2.5 rounded-full`} style={{ width: `${z.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 xl:col-span-1">
              <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-5">
                <Clock size={18} className="text-blue-600" /> Activity
              </h2>
              <div className="space-y-4">
                {activities.slice(0, 4).map((a) => (
                  <div key={a.id} className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 ${a.dot} rounded-full mt-1.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{a.title}</p>
                      <p className="text-xs text-gray-500 truncate">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 scroll-mt-28" id="overview-section">
            <Card title="Owner & Manager Information" icon={<User size={16} className="text-emerald-600" />}>
              <InfoRow label="Owner" value={application.owner_name || "—"} />
              <InfoRow label="Owner email" value={application.owner_email || "—"} />
              <InfoRow label="Owner phone" value={application.owner_phone || "—"} />
              <InfoRow label="Name" value={application.manager_name || "—"} />
              <InfoRow label="Position" value={application.manager_position || "—"} />
              <InfoRow label="Email" value={application.manager_email || "—"} />
              <InfoRow label="Phone" value={application.manager_phone || "—"} />
              <InfoRow label="National ID" value={application.manager_national_id || "—"} />
              <InfoRow label="TIN / Reg. no." value={application.tin || "—"} />
            </Card>

            <Card title="Company Overview" icon={<Building2 size={16} className="text-green-600" />}>
              <InfoRow label="Service areas" value={mapped.serviceAreas.join(", ") || "—"} />
              <InfoRow label="Drivers" value={String(mapped.drivers.length)} />
              <InfoRow label="Vehicles" value={String(mapped.cars.length)} />
              <InfoRow label="Certificates" value={String(mapped.certificates.length)} />
              <InfoRow label="Tax documents" value={String(mapped.taxCertificates.length)} />
              {application.description && (
                <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600 mt-1">
                  {application.description}
                </div>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 scroll-mt-28" id="drivers-section">
            <Card title="Driver Roster" icon={<Users size={16} className="text-blue-600" />}>
              {mapped.drivers.length === 0 ? (
                <p className="text-sm text-gray-400">No drivers on record.</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {mapped.drivers.map((driver, i) => (
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
              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                <button onClick={goToOnboarding} className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition">
                  <Plus size={15} /> Add driver
                </button>
              </div>
            </Card>

            <Card title="Quick Actions" icon={<ClipboardList size={16} className="text-purple-600" />}>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map(({ label, icon: Icon, color, target }) => (
                  <button key={label} onClick={() => scrollToSection(target)} className={`flex flex-col items-center gap-2 p-4 rounded-xl font-medium text-sm transition ${color}`}>
                    <Icon size={22} />
                    {label}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-2 font-semibold text-gray-800"><Bell size={16} className="text-green-600" /> Recent alerts</div>
                <p className="mt-2 text-sm text-gray-500">You are fully approved. Keep drivers, vehicles, and documents updated to maintain active operations.</p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 scroll-mt-28" id="vehicles-section">
            <Card title="Fleet / Vehicles" icon={<Car size={16} className="text-purple-600" />}>
              {mapped.cars.length === 0 ? (
                <p className="text-sm text-gray-400">No vehicles on record.</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {mapped.cars.map((car, i) => (
                    <div key={i} className="rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-1">
                      <p className="font-semibold text-gray-900">{car.plateNumber} — {car.model}</p>
                      <p className="text-xs text-gray-500">Year: {car.year || "N/A"} • Capacity: {car.capacity || "N/A"} tons</p>
                      <p className="text-xs text-gray-500">Zone: {car.assignedZone} • Insurance: {car.insuranceNumber || "N/A"}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                <button onClick={goToOnboarding} className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition">
                  <Plus size={15} /> Add vehicle
                </button>
              </div>
            </Card>

            <Card title="Recent Complaints" icon={<AlertTriangle size={16} className="text-orange-500" />}>
              <div className="space-y-4">
                {[
                  { title: "Missing pickup follow-up", desc: "Gasabo zone complaint assigned to operations", time: "10 min ago", dot: "bg-red-500" },
                  { title: "Driver schedule updated", desc: "Route review completed for tomorrow's shift", time: "2 hrs ago", dot: "bg-blue-500" },
                  { title: "Monthly billing cleared", desc: "45 households confirmed paid", time: "5 hrs ago", dot: "bg-green-500" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 ${item.dot} rounded-full mt-1.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500 truncate">{item.desc}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card title="Certificates & Documents" icon={<ShieldCheck size={16} className="text-orange-500" />}>
            <div className="grid gap-4 md:grid-cols-3 scroll-mt-28" id="documents-section">
              <DocList label="Business Certificates" files={mapped.certificates} />
              <DocList label="RDB Certificates" files={mapped.rdbCertificates} />
              <DocList label="Tax Clearance" files={mapped.taxCertificates} />
            </div>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 scroll-mt-28" id="assignment-section">
            <Card title="Operations / Assignment" icon={<Route size={16} className="text-teal-600" />}>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Assign a driver to a vehicle and zone. This is the place to manage dispatch planning for daily work.
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Driver</label>
                    <select value={assignmentDriver} onChange={(e) => setAssignmentDriver(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">Select driver</option>
                      {mapped.drivers.map((driver, index) => (
                        <option key={`${driver.name}-${index}`} value={driver.name}>{driver.name || `Driver ${index + 1}`}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Vehicle</label>
                    <select value={assignmentVehicle} onChange={(e) => setAssignmentVehicle(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">Select vehicle</option>
                      {mapped.cars.map((car, index) => (
                        <option key={`${car.plateNumber}-${index}`} value={car.plateNumber}>{car.plateNumber || `Vehicle ${index + 1}`}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Zone</label>
                    <select value={assignmentZone} onChange={(e) => setAssignmentZone(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">Select zone</option>
                      {assignmentZones.map((zone) => <option key={zone}>{zone}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={handleCreateAssignment} className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition">
                  <Plus size={15} /> Save assignment
                </button>
              </div>
            </Card>

            <Card title="Saved Assignments" icon={<ClipboardList size={16} className="text-indigo-600" />}>
              {assignments.length === 0 ? (
                <p className="text-sm text-gray-400">No assignments saved yet.</p>
              ) : (
                <div className="space-y-3">
                  {assignments.map((assignment, index) => (
                    <div key={`${assignment.driver}-${index}`} className="rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-1">
                      <p className="font-semibold text-gray-900">{assignment.driver}</p>
                      <p className="text-xs text-gray-500">Vehicle: {assignment.vehicle}</p>
                      <p className="text-xs text-gray-500">Zone: {assignment.zone}</p>
                      <p className="text-[11px] text-gray-400">Saved {assignment.createdAt}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
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
