"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Clock3, PencilLine, ShieldCheck } from "lucide-react";
import { useCompanyApplication, useCompanyUserInfo } from "@/lib/company-application";

export default function DriverStatusPage() {
  const router = useRouter();
  const userInfo = useCompanyUserInfo();
  const application = useCompanyApplication(userInfo?.email ?? null);

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

  if (!userInfo || userInfo.role !== "WASTE_COLLECTOR" || !userInfo.email) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm">
              <Clock3 size={16} />
              Approval pending
            </div>
            <h1 className="text-3xl font-bold">Your profile is waiting for admin review</h1>
            <p className="mt-2 max-w-2xl text-orange-50">
              We received your company profile. Once the admin approves it, you will be able to enter the dashboard automatically.
            </p>
          </div>
          <button onClick={() => router.push("/driver/profile")} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/15">
            Edit profile <PencilLine size={16} />
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-gray-900">Current application</h2>
          <div className="mt-5 space-y-4">
            {[
              ["Company", application?.companyName],
              ["Company Email", application?.companyEmail],
              ["Company Phone", application?.companyPhone],
              ["Owner", application?.ownerName || "Not provided"],
              ["Manager", application?.managerName || "Not provided"],
              ["Drivers", String(application?.drivers.length ?? 0)],
              ["Certificates", String((application?.certificates.length ?? 0) + (application?.rdbCertificates.length ?? 0) + (application?.taxCertificates?.length ?? 0))],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-800 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertCircle size={18} />
              Status: Pending approval
            </div>
            <p className="mt-2 text-sm text-amber-800">An admin must approve your application before dashboard access is granted.</p>
          </div>

          <div className="rounded-3xl border border-green-100 bg-green-50 p-6">
            <div className="flex items-center gap-2 font-bold text-green-900">
              <ShieldCheck size={18} />
              What to expect
            </div>
            <p className="mt-2 text-sm text-green-800">After approval, you will be taken straight to the dashboard the next time you open the app.</p>
          </div>

          <button onClick={() => router.push("/driver/profile")} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800">
            Review profile <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}