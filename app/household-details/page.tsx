"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Home, Users, CheckCircle2, ChevronDown, Truck, FileText, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  rwandaAdminData,
  getSectorsByDistrict,
  getCellsBySector,
  getVillagesByCell,
} from "@/data/rwanda-admin";

function getStoredUserFirstName() {
  if (typeof window === "undefined") return "there";
  const raw = localStorage.getItem("user_info");
  if (!raw) return "there";
  try {
    const user = JSON.parse(raw) as { fullName?: string };
    return user.fullName ? user.fullName.split(" ")[0] : "there";
  } catch {
    return "there";
  }
}

export default function HouseholdDetailsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const userName = getStoredUserFirstName();
  const [submitted, setSubmitted] = useState(false);

  /* ── location fields ── */
  const [districtId, setDistrictId] = useState("");
  const [sectorId, setSectorId] = useState("");
  const [cellId, setCellId] = useState("");
  const [villageId, setVillageId] = useState("");

  /* ── address fields ── */
  const [streetAddress, setStreetAddress] = useState("");
  const [houseType, setHouseType] = useState("RESIDENTIAL");
  const [residents, setResidents] = useState(1);
  const [notes, setNotes] = useState("");

  /* ── derived lists (stable — only recalculate when parent changes) ── */
  const sectors = districtId ? getSectorsByDistrict(districtId) : [];
  const cells = sectorId ? getCellsBySector(districtId, sectorId) : [];
  const villages = cellId ? getVillagesByCell(districtId, sectorId, cellId) : [];

  /* ── display names ── */
  const districtName = rwandaAdminData.find(d => d.id === districtId)?.name ?? "";
  const sectorName = sectors.find(s => s.id === sectorId)?.name ?? "";
  const cellName = cells.find(c => c.id === cellId)?.name ?? "";
  const villageName = villages.find(v => v.id === villageId)?.name ?? "";

  /* ── auth guard ── */
  useEffect(() => {
    const raw = localStorage.getItem("user_info");
    if (!raw) { router.push("/signin"); return; }
    try {
      const user = JSON.parse(raw);
      if (user.role !== "CITIZEN") { router.push("/"); return; }
    } catch {
      router.push("/signin");
    }
  }, [router]);

  /* ── cascade resets ── */
  const onDistrictChange = (val: string) => {
    setDistrictId(val);
    setSectorId("");
    setCellId("");
    setVillageId("");
  };
  const onSectorChange = (val: string) => {
    setSectorId(val);
    setCellId("");
    setVillageId("");
  };
  const onCellChange = (val: string) => {
    setCellId(val);
    setVillageId("");
  };

  /* ── validation ── */
  const errors = {
    district: submitted && !districtId,
    sector: submitted && !sectorId,
    cell: submitted && !cellId,
    village: submitted && !villageId,
    street: submitted && streetAddress.trim().length < 5,
  };

  const isValid =
    districtId && sectorId && cellId && villageId &&
    streetAddress.trim().length >= 5;

  /* ── submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));

    localStorage.setItem("household_details", JSON.stringify({
      district: districtName, sector: sectorName,
      cell: cellName, village: villageName,
      streetAddress: streetAddress.trim(),
      houseType, residents,
      notes: notes.trim() || undefined,
    }));
    localStorage.setItem("household_details_submitted", "true");
    setIsLoading(false);
    toast.success("Household details saved! Redirecting to dashboard...");
    setTimeout(() => router.push("/User-Dashboard"), 1000);
  };

  /* ── shared classes ── */
  const sel = (err: boolean) =>
    `w-full px-4 py-3 border rounded-xl text-sm bg-white appearance-none focus:outline-none focus:ring-2 transition cursor-pointer
     ${err ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-green-500"}
     disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed`;

  const inp = (err: boolean) =>
    `w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition
     ${err ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-green-500"}`;

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Left: form ── */}
      <div className="w-full lg:w-1/2 flex items-start justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-lg py-6">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <Truck size={26} className="text-green-700" />
            <span className="text-lg font-bold text-green-700">EcoTrack</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Hi, {userName}! 👋</h1>
            <p className="text-gray-500 text-sm mt-1">
              Tell us where you live so we can assign your waste collection zone.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-8">

            {/* ── Section 1: Location ── */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
              <h2 className="font-bold text-gray-800 flex items-center gap-2 text-base">
                <MapPin size={17} className="text-green-600" /> Location
              </h2>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  District <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={districtId}
                    onChange={e => onDistrictChange(e.target.value)}
                    className={sel(errors.district)}
                  >
                    <option value="">Select district</option>
                    {rwandaAdminData.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.district && <p className="text-red-500 text-xs mt-1">Please select a district.</p>}
              </div>

              {/* Sector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Sector <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={sectorId}
                    onChange={e => onSectorChange(e.target.value)}
                    disabled={!districtId}
                    className={sel(errors.sector)}
                  >
                    <option value="">
                      {districtId ? "Select sector" : "Select district first"}
                    </option>
                    {sectors.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.sector && <p className="text-red-500 text-xs mt-1">Please select a sector.</p>}
              </div>

              {/* Cell */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Cell <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={cellId}
                    onChange={e => onCellChange(e.target.value)}
                    disabled={!sectorId}
                    className={sel(errors.cell)}
                  >
                    <option value="">
                      {sectorId ? "Select cell" : "Select sector first"}
                    </option>
                    {cells.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.cell && <p className="text-red-500 text-xs mt-1">Please select a cell.</p>}
              </div>

              {/* Village */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Village <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={villageId}
                    onChange={e => setVillageId(e.target.value)}
                    disabled={!cellId}
                    className={sel(errors.village)}
                  >
                    <option value="">
                      {cellId ? "Select village" : "Select cell first"}
                    </option>
                    {villages.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.village && <p className="text-red-500 text-xs mt-1">Please select a village.</p>}
              </div>
            </div>

            {/* ── Section 2: Address ── */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
              <h2 className="font-bold text-gray-800 flex items-center gap-2 text-base">
                <Home size={17} className="text-green-600" /> Address Details
              </h2>

              {/* Street address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={e => setStreetAddress(e.target.value)}
                  placeholder="e.g. KG 12 St, House No. 5"
                  className={inp(errors.street)}
                />
                {errors.street && <p className="text-red-500 text-xs mt-1">Please enter a valid street address (min 5 characters).</p>}
              </div>

              {/* House type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  House Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["RESIDENTIAL", "🏠", "Residential"],
                    ["APARTMENT",   "🏢", "Apartment"],
                    ["COMMERCIAL",  "🏪", "Commercial"],
                    ["VILLA",       "🏡", "Villa"],
                  ].map(([val, emoji, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setHouseType(val)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all
                        ${houseType === val
                          ? "border-green-600 bg-green-50 text-green-700 shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-green-300 hover:bg-gray-50"
                        }`}
                    >
                      <span className="text-base">{emoji}</span> {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Residents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users size={14} className="inline mr-1 text-green-600" />
                  Number of Residents
                </label>
                <div className="flex items-center gap-4 w-40">
                  <button
                    type="button"
                    onClick={() => setResidents(r => Math.max(1, r - 1))}
                    className="w-10 h-10 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-bold text-xl transition flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-bold text-gray-800 text-xl">{residents}</span>
                  <button
                    type="button"
                    onClick={() => setResidents(r => r + 1)}
                    className="w-10 h-10 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-bold text-xl transition flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <FileText size={14} className="inline mr-1 text-green-600" />
                  Additional Notes{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any special instructions for waste collectors..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
                />
              </div>
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-green-700 text-white rounded-xl font-bold text-base hover:bg-green-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Save & Go to Dashboard
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>
        </div>
      </div>

      {/* ── Right: sticky summary + hero ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col sticky top-0 h-screen overflow-hidden">
        <div className="relative flex-1">
          <Image src="/landingImage.png" alt="EcoTrack" fill sizes="50vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-800/60 to-green-900/90" />

          <div className="relative z-10 flex flex-col h-full px-12 py-10 text-white">
            {/* Top info */}
            <div className="mb-auto">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5">
                <MapPin size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Almost there!</h2>
              <p className="text-white/80 text-base leading-relaxed max-w-sm">
                Fill in your household details so we can assign the right collection route and schedule for your area.
              </p>
            </div>

            {/* Live summary card */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-3">
              <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">Your Details</p>

              {[
                ["District",  districtName  || "—"],
                ["Sector",    sectorName    || "—"],
                ["Cell",      cellName      || "—"],
                ["Village",   villageName   || "—"],
                ["Address",   streetAddress || "—"],
                ["House Type",houseType],
                ["Residents", String(residents)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-white/60">{k}</span>
                  <span className={`font-semibold truncate max-w-[55%] text-right ${v === "—" ? "text-white/30" : "text-white"}`}>
                    {v}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              {[["3 min", "Setup time"], ["Weekly", "Collections"], ["Free", "Registration"]].map(([val, label]) => (
                <div key={label}>
                  <p className="text-xl font-bold">{val}</p>
                  <p className="text-green-300 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
