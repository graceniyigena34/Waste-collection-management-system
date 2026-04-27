"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BadgeCheck, Building2, FileImage, FileText, Mail, Phone, Truck, User } from "lucide-react";
import {
  CompanyApplicationProfile,
  CompanyDriverInput,
  saveCompanyApplication,
  useCompanyApplication,
  useCompanyUserInfo,
} from "@/lib/company-application";

interface CollectorProfileForm {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  driverName: string;
  driverEmail: string;
  driverPhone: string;
  certificates: string[];
  companyImages: string[];
}

export default function DriverProfilePage() {
  const router = useRouter();
  const userInfo = useCompanyUserInfo();
  const application = useCompanyApplication(userInfo?.email ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<CollectorProfileForm>(() => ({
    companyName: application?.companyName ?? "",
    companyEmail: application?.companyEmail ?? userInfo?.email ?? "",
    companyPhone: application?.companyPhone ?? "",
    ownerName: application?.ownerName ?? userInfo?.fullName ?? "",
    ownerEmail: application?.ownerEmail ?? userInfo?.email ?? "",
    ownerPhone: application?.ownerPhone ?? "",
    managerName: application?.managerName ?? userInfo?.fullName ?? "",
    managerEmail: application?.managerEmail ?? userInfo?.email ?? "",
    managerPhone: application?.managerPhone ?? "",
    driverName: application?.drivers?.[0]?.name ?? "",
    driverEmail: application?.drivers?.[0]?.email ?? "",
    driverPhone: application?.drivers?.[0]?.phone ?? "",
    certificates: application?.certificates ?? [],
    companyImages: application?.companyImages ?? [],
  }));

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token || !userInfo || userInfo.role !== "WASTE_COLLECTOR" || !userInfo.email) {
      router.push("/signin");
      return;
    }

    if (application?.status === "approved") {
      router.push("/wasteCompanyDashboard");
    }
  }, [router, userInfo, application]);

  const handleChange = (field: keyof CollectorProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError("");
  };

  const handleFiles = (field: "certificates" | "companyImages", files: FileList | null) => {
    setForm((current) => ({
      ...current,
      [field]: files ? Array.from(files).map((file) => file.name) : [],
    }));
    if (error) setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requiredValues = [
      form.companyName,
      form.companyEmail,
      form.companyPhone,
      form.ownerName,
      form.ownerEmail,
      form.ownerPhone,
      form.managerName,
      form.managerEmail,
      form.managerPhone,
      form.driverName,
      form.driverEmail,
      form.driverPhone,
    ];

    if (requiredValues.some((value) => !value.trim())) {
      setError("Please complete all profile fields.");
      return;
    }

    if (form.certificates.length === 0) {
      setError("Please upload at least one certificate.");
      return;
    }

    if (form.companyImages.length === 0) {
      setError("Please upload at least one company image.");
      return;
    }

    const primaryDriver: CompanyDriverInput = {
      name: form.driverName,
      email: form.driverEmail,
      phone: form.driverPhone,
      licenseNumber: application?.drivers?.[0]?.licenseNumber ?? "",
      nationalId: application?.drivers?.[0]?.nationalId ?? "",
      address: application?.drivers?.[0]?.address ?? "",
      emergencyContactName: application?.drivers?.[0]?.emergencyContactName ?? "",
      emergencyContactPhone: application?.drivers?.[0]?.emergencyContactPhone ?? "",
      zone: application?.drivers?.[0]?.zone ?? "Kicukiro",
      truckId: application?.drivers?.[0]?.truckId ?? "",
      yearsOfExperience: application?.drivers?.[0]?.yearsOfExperience ?? "",
    };

    const payload: CompanyApplicationProfile = {
      companyName: form.companyName,
      companyEmail: form.companyEmail,
      companyPhone: form.companyPhone,
      ownerName: form.ownerName,
      ownerEmail: form.ownerEmail,
      ownerPhone: form.ownerPhone,
      companyAddress: application?.companyAddress ?? "",
      companyDescription: application?.companyDescription ?? "",
      companyLogo: application?.companyLogo ?? "",
      companyImages: form.companyImages,
      certificates: form.certificates,
      rdbCertificates: application?.rdbCertificates ?? [],
      taxCertificates: application?.taxCertificates ?? [],
      managerName: form.managerName,
      managerEmail: form.managerEmail,
      managerPhone: form.managerPhone,
      managerPosition: application?.managerPosition ?? "",
      managerIdNumber: application?.managerIdNumber ?? "",
      managerNationalId: application?.managerNationalId ?? "",
      drivers: [primaryDriver],
      cars: application?.cars ?? [],
      serviceAreas: application?.serviceAreas ?? ["Kicukiro"],
      notes: application?.notes ?? "",
    };

    setSaving(true);
    saveCompanyApplication(payload);
    setSaving(false);
    router.push("/company-status");
  };

  if (!userInfo || userInfo.role !== "WASTE_COLLECTOR" || !userInfo.email) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-green-900 via-green-800 to-emerald-700 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
              <BadgeCheck size={16} />
              Waste collector company profile
            </div>
            <h1 className="text-3xl font-bold">Create your profile information</h1>
            <p className="mt-2 max-w-2xl text-green-50">
              Add company owner, manager, and driver details, then upload certificates and company images for admin review.
            </p>
          </div>
          <button
            onClick={() => router.push("/company-status")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/15"
          >
            Check status <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

        <Section title="Company Information" icon={<Building2 size={16} />}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Company name" icon={<Building2 size={16} />} value={form.companyName} onChange={(value) => handleChange("companyName", value)} placeholder="Company name" />
            <Field label="Company email" icon={<Mail size={16} />} value={form.companyEmail} onChange={(value) => handleChange("companyEmail", value)} placeholder="company@example.com" />
            <Field label="Company telephone" icon={<Phone size={16} />} value={form.companyPhone} onChange={(value) => handleChange("companyPhone", value)} placeholder="+250 7xx xxx xxx" />
          </div>
        </Section>

        <Section title="Company Owner" icon={<User size={16} />}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Owner name" icon={<User size={16} />} value={form.ownerName} onChange={(value) => handleChange("ownerName", value)} placeholder="Owner full name" />
            <Field label="Owner email" icon={<Mail size={16} />} value={form.ownerEmail} onChange={(value) => handleChange("ownerEmail", value)} placeholder="owner@example.com" />
            <Field label="Owner telephone" icon={<Phone size={16} />} value={form.ownerPhone} onChange={(value) => handleChange("ownerPhone", value)} placeholder="+250 7xx xxx xxx" />
          </div>
        </Section>

        <Section title="Manager" icon={<User size={16} />}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Manager name" icon={<User size={16} />} value={form.managerName} onChange={(value) => handleChange("managerName", value)} placeholder="Manager full name" />
            <Field label="Manager email" icon={<Mail size={16} />} value={form.managerEmail} onChange={(value) => handleChange("managerEmail", value)} placeholder="manager@example.com" />
            <Field label="Manager telephone" icon={<Phone size={16} />} value={form.managerPhone} onChange={(value) => handleChange("managerPhone", value)} placeholder="+250 7xx xxx xxx" />
          </div>
        </Section>

        <Section title="Primary Driver" icon={<Truck size={16} />}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Driver name" icon={<User size={16} />} value={form.driverName} onChange={(value) => handleChange("driverName", value)} placeholder="Driver full name" />
            <Field label="Driver email" icon={<Mail size={16} />} value={form.driverEmail} onChange={(value) => handleChange("driverEmail", value)} placeholder="driver@example.com" />
            <Field label="Driver telephone" icon={<Phone size={16} />} value={form.driverPhone} onChange={(value) => handleChange("driverPhone", value)} placeholder="+250 7xx xxx xxx" />
          </div>
        </Section>

        <Section title="Uploads" icon={<FileText size={16} />}>
          <div className="grid gap-4 md:grid-cols-2">
            <FileField
              label="Upload certificates"
              helper="Upload PDF/image certificates for verification"
              accept=".pdf,image/*"
              multiple
              existing={form.certificates}
              onChange={(files) => handleFiles("certificates", files)}
            />
            <FileField
              label="Image of company"
              helper="Upload company office, truck, or branding images"
              accept="image/*"
              multiple
              existing={form.companyImages}
              onChange={(files) => handleFiles("companyImages", files)}
            />
          </div>
        </Section>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving profile..." : "Submit profile"}
        </button>
      </form>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-3 rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        <span className="text-gray-500">{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>
  );
}

function FileField({
  label,
  helper,
  accept,
  multiple,
  existing,
  onChange,
}: {
  label: string;
  helper: string;
  accept: string;
  multiple?: boolean;
  existing: string[];
  onChange: (files: FileList | null) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <FileImage size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.files)}
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-green-50 file:px-3 file:py-1 file:text-xs file:font-medium file:text-green-700"
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">{helper}</p>
      {existing.length > 0 && <p className="mt-1 text-xs text-gray-500">Saved: {existing.join(", ")}</p>}
    </div>
  );
}