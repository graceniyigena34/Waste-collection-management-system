"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, BadgeCheck, Ban, Building2, Clock3, FileText } from "lucide-react";
import { useCompanyApplication, useCompanyUserInfo } from "@/lib/company-application";

export default function CompanyStatusPage() {
  const router = useRouter();
  const userInfo = useCompanyUserInfo();
  const application = useCompanyApplication(userInfo?.email ?? null);

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

  if (!userInfo || userInfo.role !== "WASTE_COLLECTOR") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600" />
      </div>
    );
  }

  const status = application?.status ?? "draft";
  const reviewNotes = application?.reviewNotes || "The admin has not added notes yet.";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className={`rounded-3xl p-8 text-white shadow-lg ${status === 'approved' ? 'bg-gradient-to-r from-green-900 via-emerald-800 to-teal-700' : status === 'denied' ? 'bg-gradient-to-r from-red-600 via-rose-600 to-orange-500' : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500'}`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm">
              {status === 'approved' ? <BadgeCheck size={16} /> : status === 'denied' ? <Ban size={16} /> : <Clock3 size={16} />}
              {status === 'approved' ? 'Approved' : status === 'denied' ? 'Denied' : 'Pending review'}
            </div>
            <h1 className="text-3xl font-bold">Company application status</h1>
            <p className="mt-2 max-w-2xl text-white/90">Your company profile has been submitted and is now waiting for the admin decision. Once approved, you can go directly to the dashboard.</p>
          </div>
          <button onClick={() => router.push("/company-onboarding")} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/15">
            Edit profile <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2"><Building2 size={18} className="text-green-600" /> Submitted profile</h2>
          <SummaryRow label="Company" value={application?.companyName || 'Not submitted yet'} />
          <SummaryRow label="Company email" value={application?.companyEmail || userInfo.email || ''} />
          <SummaryRow label="Owner" value={application?.ownerName || 'Not provided'} />
          <SummaryRow label="Owner email" value={application?.ownerEmail || 'Not provided'} />
          <SummaryRow label="Owner phone" value={application?.ownerPhone || 'Not provided'} />
          <SummaryRow label="Manager" value={application?.managerName || userInfo.fullName || ''} />
          <SummaryRow label="Drivers" value={String(application?.drivers.length ?? 0)} />
          <SummaryRow label="Vehicles" value={String(application?.cars?.length ?? 0)} />
          <SummaryRow label="Images" value={String(application?.companyImages.length ?? 0)} />
          <SummaryRow label="Certificates" value={String(application?.certificates.length ?? 0)} />
          <SummaryRow label="Tax documents" value={String(application?.taxCertificates?.length ?? 0)} />
          <SummaryRow label="RDB files" value={String(application?.rdbCertificates.length ?? 0)} />
          <SummaryRow label="Service areas" value={(application?.serviceAreas || []).join(', ') || 'Not selected'} />
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 font-bold text-gray-900"><FileText size={18} className="text-green-600" /> Review notes</div>
            <p className="mt-3 text-sm text-gray-600">{reviewNotes}</p>
          </div>

          <div className={`rounded-3xl p-6 ${status === 'approved' ? 'bg-green-50 border border-green-100' : status === 'denied' ? 'bg-red-50 border border-red-100' : 'bg-amber-50 border border-amber-100'}`}>
            <div className="flex items-center gap-2 font-bold text-gray-900">
              {status === 'approved' ? <BadgeCheck size={18} className="text-green-600" /> : status === 'denied' ? <Ban size={18} className="text-red-600" /> : <AlertCircle size={18} className="text-amber-600" />}
              {status === 'approved' ? 'You can access the dashboard now' : status === 'denied' ? 'Application denied' : 'Waiting for admin response'}
            </div>
            <p className="mt-2 text-sm text-gray-700">
              {status === 'approved'
                ? 'Open the dashboard to manage the company account.'
                : status === 'denied'
                  ? 'Update the profile and resubmit after addressing the review notes.'
                  : 'Stay on this page until the admin reviews your application.'}
            </p>
            {status === 'approved' && (
              <button onClick={() => router.push("/wasteCompanyDashboard")} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800">
                Go to dashboard <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 px-4 py-3 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}
