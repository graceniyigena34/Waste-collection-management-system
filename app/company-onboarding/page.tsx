"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight, Building2, Car, FileImage, FileText,
  MapPin, Plus, ShieldCheck, Trash2, Truck, User2, LogOut,
} from "lucide-react";
import {
  CompanyApplicationProfile, CompanyCarInput, CompanyDriverInput,
  saveCompanyApplication, useCompanyApplication, useCompanyUserInfo,
} from "@/lib/company-application";

const emptyDriver: CompanyDriverInput = {
  name: "", email: "", phone: "", licenseNumber: "", nationalId: "",
  address: "", emergencyContactName: "", emergencyContactPhone: "",
  zone: "Kicukiro", truckId: "", yearsOfExperience: "",
};

const emptyCar: CompanyCarInput = {
  plateNumber: "", model: "", year: "", capacity: "",
  assignedZone: "Kicukiro", insuranceNumber: "",
};

const emptyProfile: CompanyApplicationProfile = {
  companyName: "", companyEmail: "", companyPhone: "", companyAddress: "",
  ownerName: "", ownerEmail: "", ownerPhone: "",
  companyDescription: "", companyLogo: "", companyImages: [],
  certificates: [], rdbCertificates: [], taxCertificates: [],
  managerName: "", managerEmail: "", managerPhone: "",
  managerPosition: "", managerIdNumber: "", managerNationalId: "",
  drivers: [], cars: [], serviceAreas: ["Kicukiro"], notes: "",
};

const ZONES = ["Kicukiro", "Gasabo", "Nyarugenge", "Remera", "Bugesera", "Huye"];

export default function CompanyOnboardingPage() {
  const router = useRouter();
  const userInfo = useCompanyUserInfo();
  const application = useCompanyApplication(userInfo?.email ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState<CompanyApplicationProfile>(() => ({
    ...emptyProfile,
    companyEmail: userInfo?.email ?? "",
    ownerEmail: userInfo?.email ?? "",
    managerEmail: userInfo?.email ?? "",
    ownerName: userInfo?.fullName ?? "",
    managerName: userInfo?.fullName ?? "",
    ...(application ?? {}),
    cars: application?.cars ?? [],
    taxCertificates: application?.taxCertificates ?? [],
    managerNationalId: application?.managerNationalId ?? "",
  }));

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token || !userInfo || userInfo.role !== "WASTE_COLLECTOR") {
      router.push("/signin");
      return;
    }
    if (application?.status === "approved") {
      router.push("/wasteCompanyDashboard");
    }
  }, [router, userInfo, application]);

  const set = (field: keyof CompanyApplicationProfile, value: string) => {
    setProfile((p) => ({ ...p, [field]: value }));
    if (error) setError("");
  };

  const setFiles = (field: "companyImages" | "certificates" | "rdbCertificates" | "taxCertificates", files: FileList | null) =>
    setProfile((p) => ({ ...p, [field]: files ? Array.from(files).map((f) => f.name) : [] }));

  // Drivers
  const addDriver = () => setProfile((p) => ({ ...p, drivers: [...p.drivers, { ...emptyDriver }] }));
  const removeDriver = (i: number) => setProfile((p) => ({ ...p, drivers: p.drivers.filter((_, idx) => idx !== i) }));
  const setDriver = (i: number, field: keyof CompanyDriverInput, value: string) =>
    setProfile((p) => ({ ...p, drivers: p.drivers.map((d, idx) => idx === i ? { ...d, [field]: value } : d) }));

  // Cars
  const addCar = () => setProfile((p) => ({ ...p, cars: [...p.cars, { ...emptyCar }] }));
  const removeCar = (i: number) => setProfile((p) => ({ ...p, cars: p.cars.filter((_, idx) => idx !== i) }));
  const setCar = (i: number, field: keyof CompanyCarInput, value: string) =>
    setProfile((p) => ({ ...p, cars: p.cars.map((c, idx) => idx === i ? { ...c, [field]: value } : c) }));

  const toggleArea = (area: string) =>
    setProfile((p) => ({
      ...p,
      serviceAreas: p.serviceAreas.includes(area)
        ? p.serviceAreas.filter((a) => a !== area)
        : [...p.serviceAreas, area],
    }));

  const summary = useMemo(() => ({
    drivers: profile.drivers.length,
    cars: profile.cars.length,
    docs: profile.certificates.length + profile.rdbCertificates.length + profile.taxCertificates.length,
  }), [profile]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile.companyName || !profile.companyEmail || !profile.companyPhone || !profile.ownerName || !profile.ownerEmail || !profile.ownerPhone || !profile.managerName || !profile.managerEmail || !profile.managerPhone) {
      setError("Please complete all required company, owner, and manager fields.");
      return;
    }
    if (profile.drivers.length === 0) {
      setError("Please add at least one driver.");
      return;
    }
    if (profile.certificates.length === 0 && profile.rdbCertificates.length === 0 && profile.taxCertificates.length === 0) {
      setError("Please upload at least one certificate document.");
      return;
    }
    if (profile.companyImages.length === 0) {
      setError("Please upload at least one company image.");
      return;
    }
    if (profile.cars.length === 0) {
      setError("Please add at least one vehicle.");
      return;
    }
    setSaving(true);
    saveCompanyApplication(profile);
    setSaving(false);
    router.push("/company-status");
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
    router.push("/signin");
  };

  if (!userInfo || userInfo.role !== "WASTE_COLLECTOR") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center">
            <Truck size={18} className="text-white" />
          </div>
          <span className="font-bold text-gray-900">GreenEx</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/company-status")} className="text-sm text-green-700 font-medium hover:underline">
            Check status
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-r from-green-900 via-emerald-800 to-teal-700 p-8 text-white shadow-lg">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
            <Building2 size={15} /> Waste Collector — Company Registration
          </div>
          <h1 className="text-3xl font-bold">Create your company profile</h1>
          <p className="mt-2 text-green-100 max-w-2xl text-sm">
            Fill in your company details, manager info, drivers, vehicles, and upload all required certificates. Submit for admin approval to access your dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          {/* ── 1. Company Details ── */}
          <Section title="Company Details" icon={<Building2 size={17} className="text-green-600" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Company name *" value={profile.companyName} onChange={(v) => set("companyName", v)} placeholder="e.g. GreenEx Ltd" />
              <Field label="Company email *" value={profile.companyEmail} onChange={(v) => set("companyEmail", v)} placeholder="company@example.com" />
              <Field label="Company phone *" value={profile.companyPhone} onChange={(v) => set("companyPhone", v)} placeholder="+250 7xx xxx xxx" />
              <Field label="TIN / Registration number" value={profile.managerIdNumber} onChange={(v) => set("managerIdNumber", v)} placeholder="Tax Identification Number" />
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Company address</label>
                <textarea value={profile.companyAddress} onChange={(e) => set("companyAddress", e.target.value)} rows={2} className={ta} placeholder="Office or headquarters address" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Company description</label>
                <textarea value={profile.companyDescription} onChange={(e) => set("companyDescription", e.target.value)} rows={3} className={ta} placeholder="Describe your waste collection services" />
              </div>
            </div>
          </Section>

          {/* ── 2. Company Owner Information ── */}
          <Section title="Company Owner Information" icon={<User2 size={17} className="text-emerald-600" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Owner full name *" value={profile.ownerName} onChange={(v) => set("ownerName", v)} placeholder="Owner full name" />
              <Field label="Owner email *" value={profile.ownerEmail} onChange={(v) => set("ownerEmail", v)} placeholder="owner@example.com" />
              <Field label="Owner phone *" value={profile.ownerPhone} onChange={(v) => set("ownerPhone", v)} placeholder="+250 7xx xxx xxx" />
            </div>
          </Section>

          {/* ── 3. Manager Information ── */}
          <Section title="Manager Information" icon={<User2 size={17} className="text-emerald-600" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Manager full name *" value={profile.managerName} onChange={(v) => set("managerName", v)} placeholder="Full name" />
              <Field label="Manager email *" value={profile.managerEmail} onChange={(v) => set("managerEmail", v)} placeholder="manager@example.com" />
              <Field label="Manager phone *" value={profile.managerPhone} onChange={(v) => set("managerPhone", v)} placeholder="+250 7xx xxx xxx" />
              <Field label="Position / Title" value={profile.managerPosition} onChange={(v) => set("managerPosition", v)} placeholder="e.g. General Manager" />
              <Field label="National ID number" value={profile.managerNationalId} onChange={(v) => set("managerNationalId", v)} placeholder="16-digit national ID" />
            </div>
          </Section>

          {/* ── 4. Drivers ── */}
          <Section title="Drivers" icon={<Truck size={17} className="text-blue-600" />}>
            <div className="space-y-4">
              {profile.drivers.length === 0 && (
                <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">No drivers added yet. Add at least one driver.</p>
              )}
              {profile.drivers.map((driver, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800 text-sm">Driver {i + 1}</span>
                    <button type="button" onClick={() => removeDriver(i)} className="flex items-center gap-1 text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg">
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Full name" value={driver.name} onChange={(v) => setDriver(i, "name", v)} placeholder="Driver name" />
                    <Field label="Email" value={driver.email} onChange={(v) => setDriver(i, "email", v)} placeholder="driver@example.com" />
                    <Field label="Phone" value={driver.phone} onChange={(v) => setDriver(i, "phone", v)} placeholder="+250 7xx xxx xxx" />
                    <Field label="License number" value={driver.licenseNumber} onChange={(v) => setDriver(i, "licenseNumber", v)} placeholder="License no." />
                    <Field label="National ID" value={driver.nationalId} onChange={(v) => setDriver(i, "nationalId", v)} placeholder="National ID" />
                    <Field label="Address" value={driver.address} onChange={(v) => setDriver(i, "address", v)} placeholder="Home address" />
                    <Field label="Emergency contact name" value={driver.emergencyContactName} onChange={(v) => setDriver(i, "emergencyContactName", v)} placeholder="Contact name" />
                    <Field label="Emergency contact phone" value={driver.emergencyContactPhone} onChange={(v) => setDriver(i, "emergencyContactPhone", v)} placeholder="Contact phone" />
                    <Field label="Assigned truck ID" value={driver.truckId} onChange={(v) => setDriver(i, "truckId", v)} placeholder="Truck / vehicle ID" />
                    <Field label="Years of experience" value={driver.yearsOfExperience} onChange={(v) => setDriver(i, "yearsOfExperience", v)} placeholder="e.g. 3" />
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Assigned zone</label>
                      <select value={driver.zone} onChange={(e) => setDriver(i, "zone", e.target.value)} className={inp}>
                        {ZONES.map((z) => <option key={z}>{z}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addDriver} className="inline-flex items-center gap-2 rounded-xl border border-dashed border-green-400 px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50 transition">
                <Plus size={15} /> Add driver
              </button>
            </div>
          </Section>

          {/* ── 5. Vehicles / Cars ── */}
          <Section title="Vehicles" icon={<Car size={17} className="text-purple-600" />}>
            <div className="space-y-4">
              {profile.cars.length === 0 && (
                <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500">No vehicles added yet. Add at least one vehicle.</p>
              )}
              {profile.cars.map((car, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800 text-sm">Vehicle {i + 1}</span>
                    <button type="button" onClick={() => removeCar(i)} className="flex items-center gap-1 text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg">
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Plate number" value={car.plateNumber} onChange={(v) => setCar(i, "plateNumber", v)} placeholder="e.g. RAB 123 A" />
                    <Field label="Model" value={car.model} onChange={(v) => setCar(i, "model", v)} placeholder="e.g. Isuzu NPR" />
                    <Field label="Year" value={car.year} onChange={(v) => setCar(i, "year", v)} placeholder="e.g. 2020" />
                    <Field label="Capacity (tons)" value={car.capacity} onChange={(v) => setCar(i, "capacity", v)} placeholder="e.g. 5" />
                    <Field label="Insurance number" value={car.insuranceNumber} onChange={(v) => setCar(i, "insuranceNumber", v)} placeholder="Insurance policy no." />
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Assigned zone</label>
                      <select value={car.assignedZone} onChange={(e) => setCar(i, "assignedZone", e.target.value)} className={inp}>
                        {ZONES.map((z) => <option key={z}>{z}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addCar} className="inline-flex items-center gap-2 rounded-xl border border-dashed border-purple-400 px-4 py-2.5 text-sm font-medium text-purple-700 hover:bg-purple-50 transition">
                <Plus size={15} /> Add vehicle
              </button>
            </div>
          </Section>

          {/* ── 6. Certificates & Tax Documents ── */}
          <Section title="Certificates & Tax Documents" icon={<ShieldCheck size={17} className="text-orange-500" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <FileField label="Business certificates" helper="Company registration, operating license (PDF/image)" multiple accept=".pdf,image/*" onChange={(f) => setFiles("certificates", f)} existing={profile.certificates} />
              <FileField label="RDB certificates" helper="Rwanda Development Board certificate files" multiple accept=".pdf,image/*" onChange={(f) => setFiles("rdbCertificates", f)} existing={profile.rdbCertificates} />
              <FileField label="Tax clearance certificates" helper="RRA tax compliance / clearance documents" multiple accept=".pdf,image/*" onChange={(f) => setFiles("taxCertificates", f)} existing={profile.taxCertificates} />
              <FileField label="Company images" helper="Office, trucks, or branding photos" multiple accept="image/*" onChange={(f) => setFiles("companyImages", f)} existing={profile.companyImages} />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Company logo</label>
                <input type="file" accept="image/*" onChange={(e) => set("companyLogo", e.target.files?.[0]?.name ?? "")} className={inp} />
                {profile.companyLogo && <p className="mt-1 text-xs text-gray-500">Current: {profile.companyLogo}</p>}
              </div>
            </div>
          </Section>

          {/* ── 7. Service Areas ── */}
          <Section title="Service Areas" icon={<MapPin size={17} className="text-teal-600" />}>
            <div className="flex flex-wrap gap-2">
              {ZONES.map((area) => (
                <button key={area} type="button" onClick={() => toggleArea(area)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${profile.serviceAreas.includes(area) ? "bg-green-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  {area}
                </button>
              ))}
            </div>
          </Section>

          {/* ── 8. Notes ── */}
          <Section title="Additional Notes" icon={<FileText size={17} className="text-gray-500" />}>
            <textarea value={profile.notes} onChange={(e) => set("notes", e.target.value)} rows={3} className={ta} placeholder="Any additional information for the admin" />
          </Section>

          {/* Summary + Submit */}
          <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <SummaryPill label="Drivers" value={summary.drivers} color="bg-blue-50 text-blue-700" />
              <SummaryPill label="Vehicles" value={summary.cars} color="bg-purple-50 text-purple-700" />
              <SummaryPill label="Documents" value={summary.docs} color="bg-orange-50 text-orange-700" />
            </div>
            <button type="submit" disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-8 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed">
              {saving ? "Submitting..." : <>Submit for approval <ArrowRight size={16} /></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Shared styles ──
const inp = "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";
const ta  = "w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
        {icon}
        <h2 className="font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inp} />
    </div>
  );
}

function FileField({ label, helper, multiple, accept, onChange, existing }: {
  label: string; helper: string; multiple?: boolean; accept: string;
  onChange: (f: FileList | null) => void; existing: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <input type="file" multiple={multiple} accept={accept}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.files)}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-green-50 file:px-3 file:py-1 file:text-xs file:font-medium file:text-green-700" />
      <p className="mt-1 text-xs text-gray-400">{helper}</p>
      {existing.length > 0 && (
        <p className="mt-1 text-xs text-gray-500">Saved: {existing.join(", ")}</p>
      )}
    </div>
  );
}

function SummaryPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-xl px-4 py-2 text-center ${color}`}>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs">{label}</p>
    </div>
  );
}
