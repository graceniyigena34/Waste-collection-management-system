"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, BadgeCheck, Users, FileText, MapPin,
  Car, ShieldCheck, LogOut, Phone, Mail, User, Truck,
  LayoutDashboard, ClipboardList, Route, Settings, ArrowUpRight,
  Clock, AlertTriangle, Bell, Plus,
  CalendarDays, CheckCircle2, Edit3, Trash2, X, MessageSquare, Eye,
} from "lucide-react";
import { type BackendComplaint } from "@/lib/api-client";
import { isWasteCollectorRole } from "@/lib/company-application";
import { api, type BackendCompanyProfile, getStoredUserInfo } from "@/lib/api-client";
import { rwandaAdminData, getCellsBySector, getSectorsByDistrict } from "@/data/rwanda-admin";

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const DISTRICTS = rwandaAdminData.map((district) => ({ id: district.id, name: district.name }));
type Day = typeof WEEK_DAYS[number];
type WasteType = "General Waste" | "Recyclables" | "Organic Waste" | "Hazardous";
type TaskStatus = "Scheduled" | "In Progress" | "Completed" | "Cancelled";

interface ScheduleTask {
  id: number;
  districtId: string;
  districtName: string;
  scheduleDate: string;
  day: Day;
  sectorId: string;
  sectorName: string;
  cells: string[];
  driver: string;
  vehicle: string;
  startTime: string;
  wasteType: WasteType;
  status: TaskStatus;
  notes: string;
}

const normalizeText = (value: string) => value.trim().toLowerCase();

const getDistrictFromCompany = (district?: string) => {
  if (!district) return undefined;
  const normalized = normalizeText(district);

  return rwandaAdminData.find((item) => normalizeText(item.id) === normalized || normalizeText(item.name) === normalized);
};

export default function WasteCompanyDashboard() {
  const router = useRouter();
  const userInfo = getStoredUserInfo();
  const [application, setApplication] = useState<BackendCompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [assignmentDriver, setAssignmentDriver] = useState("");
  const [assignmentVehicle, setAssignmentVehicle] = useState("");
  const [assignmentZone, setAssignmentZone] = useState("");
  const [assignments, setAssignments] = useState<Array<{ driver: string; vehicle: string; zone: string; createdAt: string }>>([]);
  const [districtDraft, setDistrictDraft] = useState("");
  const [districtSaving, setDistrictSaving] = useState(false);
  const [districtMessage, setDistrictMessage] = useState("");
  const [scheduleMessage, setScheduleMessage] = useState("");
  const [scheduleSaving, setScheduleSaving] = useState(false);

  const [scheduleTasks, setScheduleTasks] = useState<ScheduleTask[]>([]);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [editTask, setEditTask] = useState<ScheduleTask | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    scheduleDate: new Date().toISOString().slice(0, 10),
    day: "Monday" as Day,
    sectorId: "",
    cells: [] as string[],
    driver: "",
    vehicle: "",
    startTime: "08:00",
    wasteType: "General Waste" as WasteType,
    notes: "",
  });
  const [scheduleView, setScheduleView] = useState<"week" | "list">("week");
  const [activeSection, setActiveSection] = useState<string>("top-section");

  const [complaints, setComplaints] = useState<BackendComplaint[]>([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [complaintsError, setComplaintsError] = useState("");
  const [viewedComplaint, setViewedComplaint] = useState<BackendComplaint | null>(null);
  const [respondTarget, setRespondTarget] = useState<BackendComplaint | null>(null);
  const [respondNote, setRespondNote] = useState("");
  const [respondStatus, setRespondStatus] = useState<"In Progress" | "Resolved">("In Progress");
  const [respondSaving, setRespondSaving] = useState(false);
  const [respondError, setRespondError] = useState("");

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

  const companyDistrict = useMemo(() => getDistrictFromCompany(application?.district), [application?.district]);
  const districtSectors = useMemo(() => (companyDistrict ? getSectorsByDistrict(companyDistrict.id) : []), [companyDistrict]);
  const selectedSector = useMemo(
    () => districtSectors.find((sector) => sector.id === scheduleForm.sectorId || sector.name === scheduleForm.sectorId),
    [districtSectors, scheduleForm.sectorId],
  );
  const availableCells = useMemo(
    () => (companyDistrict && selectedSector ? getCellsBySector(companyDistrict.id, selectedSector.id) : []),
    [companyDistrict, selectedSector],
  );

  useEffect(() => {
    setDistrictDraft(companyDistrict?.id ?? application?.district ?? "");
  }, [application?.district, companyDistrict?.id]);

  useEffect(() => {
    const loadSchedules = async () => {
      if (!application) return;

      try {
        const res = await api.companySchedules.list(application.id);
        const nextTasks = res.schedules.map((schedule) => ({
          id: schedule.id,
          districtId: schedule.district_id || companyDistrict?.id || "",
          districtName: schedule.district_name || companyDistrict?.name || application.district || "",
          scheduleDate: schedule.schedule_date || new Date().toISOString().slice(0, 10),
          day: schedule.day as Day,
          sectorId: schedule.sector_id || "",
          sectorName: schedule.sector_name || "",
          cells: schedule.cells || [],
          driver: schedule.driver || "",
          vehicle: schedule.vehicle || "",
          startTime: schedule.start_time || "08:00",
          wasteType: (schedule.waste_type as WasteType) || "General Waste",
          status: (schedule.status as TaskStatus) || "Scheduled",
          notes: schedule.notes || "",
        }));
        setScheduleTasks(nextTasks);
      } catch {
        setScheduleTasks([]);
      }
    };

    void loadSchedules();
  }, [application, companyDistrict?.id, companyDistrict?.name]);

  useEffect(() => {
    if (!application?.district) return;
    const loadComplaints = async () => {
      setComplaintsLoading(true);
      setComplaintsError("");
      try {
        const data = await api.complaints.byDistrict(application.district!);
        setComplaints(data);
      } catch (err) {
        setComplaintsError(err instanceof Error ? err.message : "Failed to load complaints.");
      } finally {
        setComplaintsLoading(false);
      }
    };
    void loadComplaints();
  }, [application?.district]);

  const handleRespond = async () => {
    if (!respondTarget || !respondNote.trim()) {
      setRespondError("Please enter a response note.");
      return;
    }
    setRespondSaving(true);
    setRespondError("");
    try {
      const res = await api.complaints.updateStatus(respondTarget.id, {
        status: respondStatus,
        resolution_note: respondNote.trim(),
      });
      setComplaints(prev => prev.map(c => c.id === respondTarget.id ? res.complaint : c));
      setRespondTarget(null);
      setRespondNote("");
      setRespondStatus("In Progress");
    } catch (err) {
      setRespondError(err instanceof Error ? err.message : "Failed to send response.");
    } finally {
      setRespondSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
    router.push("/signin");
  };

  const mapTaskToPayload = (task: ScheduleTask) => ({
    district_id: task.districtId,
    district_name: task.districtName,
    schedule_date: task.scheduleDate,
    day: task.day,
    sector_id: task.sectorId,
    sector_name: task.sectorName,
    cells: task.cells,
    driver: task.driver,
    vehicle: task.vehicle,
    start_time: task.startTime,
    waste_type: task.wasteType,
    status: task.status,
    notes: task.notes,
  });

  const handleSaveScheduleTask = async () => {
    if (!application || !companyDistrict || !scheduleForm.sectorId || scheduleForm.cells.length === 0) {
      setScheduleMessage("Please select a sector and at least one cell.");
      return;
    }

    const sector = districtSectors.find((item) => item.id === scheduleForm.sectorId || item.name === scheduleForm.sectorId);
    if (!sector) return;

    setScheduleMessage("");
    setScheduleSaving(true);

    const nextTask: ScheduleTask = {
      id: editTask?.id ?? 0,
      districtId: companyDistrict.id,
      districtName: companyDistrict.name,
      scheduleDate: scheduleForm.scheduleDate,
      day: scheduleForm.day,
      sectorId: sector.id,
      sectorName: sector.name,
      cells: scheduleForm.cells,
      driver: scheduleForm.driver,
      vehicle: scheduleForm.vehicle,
      startTime: scheduleForm.startTime,
      wasteType: scheduleForm.wasteType,
      status: editTask?.status ?? "Scheduled",
      notes: scheduleForm.notes.trim(),
    };

    try {
      if (editTask) {
        const updated = await api.companySchedules.update(application.id, editTask.id, mapTaskToPayload(nextTask));
        const saved: ScheduleTask = {
          id: updated.schedule.id,
          districtId: updated.schedule.district_id || nextTask.districtId,
          districtName: updated.schedule.district_name || nextTask.districtName,
          scheduleDate: updated.schedule.schedule_date || nextTask.scheduleDate,
          day: (updated.schedule.day as Day) || nextTask.day,
          sectorId: updated.schedule.sector_id || nextTask.sectorId,
          sectorName: updated.schedule.sector_name || nextTask.sectorName,
          cells: updated.schedule.cells || nextTask.cells,
          driver: updated.schedule.driver || nextTask.driver,
          vehicle: updated.schedule.vehicle || nextTask.vehicle,
          startTime: updated.schedule.start_time || nextTask.startTime,
          wasteType: (updated.schedule.waste_type as WasteType) || nextTask.wasteType,
          status: (updated.schedule.status as TaskStatus) || nextTask.status,
          notes: updated.schedule.notes || nextTask.notes,
        };
        setScheduleTasks((current) => current.map((entry) => (entry.id === editTask.id ? saved : entry)));
      } else {
        const created = await api.companySchedules.create(application.id, mapTaskToPayload(nextTask));
        const saved: ScheduleTask = {
          id: created.schedule.id,
          districtId: created.schedule.district_id || nextTask.districtId,
          districtName: created.schedule.district_name || nextTask.districtName,
          scheduleDate: created.schedule.schedule_date || nextTask.scheduleDate,
          day: (created.schedule.day as Day) || nextTask.day,
          sectorId: created.schedule.sector_id || nextTask.sectorId,
          sectorName: created.schedule.sector_name || nextTask.sectorName,
          cells: created.schedule.cells || nextTask.cells,
          driver: created.schedule.driver || nextTask.driver,
          vehicle: created.schedule.vehicle || nextTask.vehicle,
          startTime: created.schedule.start_time || nextTask.startTime,
          wasteType: (created.schedule.waste_type as WasteType) || nextTask.wasteType,
          status: (created.schedule.status as TaskStatus) || nextTask.status,
          notes: created.schedule.notes || nextTask.notes,
        };
        setScheduleTasks((current) => [saved, ...current]);
      }
      setScheduleMessage("Weekly task saved to the database.");
      closeScheduleModal();
    } catch (error) {
      setScheduleMessage(error instanceof Error ? error.message : "Failed to save weekly task.");
    } finally {
      setScheduleSaving(false);
    }
  };

  const handleDeleteScheduleTask = async (taskId: number) => {
    if (!application) return;
    try {
      await api.companySchedules.remove(application.id, taskId);
      setScheduleTasks((current) => current.filter((task) => task.id !== taskId));
      setScheduleMessage("Weekly task deleted.");
    } catch (error) {
      setScheduleMessage(error instanceof Error ? error.message : "Failed to delete weekly task.");
    }
  };

  const handleStatusChange = async (taskId: number, status: TaskStatus) => {
    if (!application) return;
    const task = scheduleTasks.find((entry) => entry.id === taskId);
    if (!task) return;
    setScheduleTasks((current) => current.map((entry) => (entry.id === taskId ? { ...entry, status } : entry)));
    try {
      await api.companySchedules.update(application.id, taskId, { ...mapTaskToPayload(task), status });
    } catch (error) {
      setScheduleTasks((current) => current.map((entry) => (entry.id === taskId ? task : entry)));
      setScheduleMessage(error instanceof Error ? error.message : "Failed to update task status.");
    }
  };

  const handleDistrictSave = async () => {
    if (!application) return;
    if (!districtDraft.trim()) {
      setDistrictMessage("Please select a district first.");
      return;
    }

    setDistrictSaving(true);
    setDistrictMessage("");

    try {
      const updated = await api.companies.update(application.id, { district: districtDraft });
      setApplication(updated.company);
      setDistrictMessage("District updated successfully.");
    } catch (error) {
      setDistrictMessage(error instanceof Error ? error.message : "Failed to update district.");
    } finally {
      setDistrictSaving(false);
    }
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
    { label: "Schedule", icon: CalendarDays, color: "text-green-700 bg-green-50 hover:bg-green-100", target: "schedule-section" },
    { label: "Complaints", icon: MessageSquare, color: "text-red-600 bg-red-50 hover:bg-red-100", target: "complaints-section" },
    { label: "Documents", icon: FileText, color: "text-orange-600 bg-orange-50 hover:bg-orange-100", target: "documents-section" },
    { label: "Overview", icon: Building2, color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100", target: "overview-section" },
  ];

  const assignmentZones = companyDistrict ? districtSectors.map((sector) => sector.name) : (mapped.serviceAreas.length > 0 ? mapped.serviceAreas : ["Kicukiro", "Gasabo", "Nyarugenge", "Remera"]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToOnboarding = () => {
    router.push("/company-onboarding");
  };

  const resetScheduleForm = () => {
    setScheduleForm({
      scheduleDate: new Date().toISOString().slice(0, 10),
      day: "Monday",
      sectorId: "",
      cells: [],
      driver: "",
      vehicle: "",
      startTime: "08:00",
      wasteType: "General Waste",
      notes: "",
    });
  };

  const openScheduleModal = (task?: ScheduleTask) => {
    setScheduleMessage("");
    if (task) {
      setEditTask(task);
      setScheduleForm({
        scheduleDate: task.scheduleDate,
        day: task.day,
        sectorId: task.sectorId,
        cells: task.cells,
        driver: task.driver,
        vehicle: task.vehicle,
        startTime: task.startTime,
        wasteType: task.wasteType,
        notes: task.notes,
      });
    } else {
      setEditTask(null);
      resetScheduleForm();
    }

    setScheduleModal(true);
  };

  const closeScheduleModal = () => {
    setScheduleModal(false);
    setEditTask(null);
    resetScheduleForm();
  };

  const scheduleByDay = WEEK_DAYS.map((day) => ({
    day,
    tasks: scheduleTasks.filter((task) => task.day === day),
  }));

  const scheduleStats = {
    planned: scheduleTasks.length,
    sectors: new Set(scheduleTasks.map((task) => task.sectorId)).size,
    completed: scheduleTasks.filter((task) => task.status === "Completed").length,
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
            { label: "Dashboard", icon: LayoutDashboard, target: "top-section" },
            { label: "Drivers", icon: Users, target: "drivers-section" },
            { label: "Vehicles", icon: Car, target: "vehicles-section" },
            { label: "Assignment", icon: Route, target: "assignment-section" },
            { label: "Schedule", icon: CalendarDays, target: "schedule-section" },
            { label: "Complaints", icon: MessageSquare, target: "complaints-section" },
            { label: "Documents", icon: FileText, target: "documents-section" },
            { label: "Overview", icon: Building2, target: "overview-section" },
            { label: "Settings", icon: Settings, target: "top-section" },
          ].map(({ label, icon: Icon, target }) => {
            const active = activeSection === target;
            return (
              <button
                key={label}
                onClick={() => scrollToSection(target)}
                className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${active ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
              >
                <Icon size={18} />
                <span>{label}</span>
                <span className="ml-auto opacity-60">›</span>
              </button>
            );
          })}
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
          <div className={activeSection === "top-section" ? "space-y-6" : "hidden"}>
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
              <span className="flex items-center gap-1"><MapPin size={13} /> {companyDistrict?.name || application.district || "District not set"}</span>
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

          <Card title="Working District" icon={<MapPin size={16} className="text-green-600" />}>
            <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Select district</label>
                  <select
                    value={districtDraft}
                    onChange={(e) => setDistrictDraft(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Choose a district</option>
                    {DISTRICTS.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-gray-500">
                  Update the company district here to unlock sector planning, cell selection, and district-scoped assignments.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleDistrictSave}
                    disabled={districtSaving}
                    className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition disabled:cursor-not-allowed disabled:bg-green-300"
                  >
                    <MapPin size={15} /> {districtSaving ? "Saving..." : "Save district"}
                  </button>
                  {districtMessage && <span className="text-sm text-gray-500">{districtMessage}</span>}
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Current district</p>
                <p className="mt-2 text-xl font-bold text-gray-900">{companyDistrict?.name || "Not set"}</p>
                <p className="mt-2 text-sm text-gray-500">
                  {companyDistrict ? "All assignment and scheduling tools use this district." : "Choose a district to start using the assignment and scheduler tools."}
                </p>
              </div>
            </div>
          </Card>

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

          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-5 scroll-mt-28 ${activeSection !== 'top-section' && activeSection !== 'overview-section' ? 'hidden' : ''}`} id="overview-section">
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
              <InfoRow label="District" value={companyDistrict?.name || application.district || "—"} />
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
          </div>

          <div className={`grid grid-cols-1 xl:grid-cols-2 gap-5 scroll-mt-28 ${activeSection !== 'top-section' && activeSection !== 'drivers-section' ? 'hidden' : ''}`} id="drivers-section">
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

          <div className={`grid grid-cols-1 xl:grid-cols-2 gap-5 scroll-mt-28 ${activeSection !== 'top-section' && activeSection !== 'vehicles-section' ? 'hidden' : ''}`} id="vehicles-section">
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
              {complaintsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-green-600" />
                </div>
              ) : complaintsError ? (
                <p className="text-sm text-red-500">{complaintsError}</p>
              ) : complaints.length === 0 ? (
                <p className="text-sm text-gray-400">No complaints in your district yet.</p>
              ) : (
                <div className="space-y-3">
                  {complaints.slice(0, 4).map((c) => (
                    <div key={c.id} className="flex items-start gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${c.status === "Resolved" ? "bg-green-500" : c.status === "In Progress" ? "bg-blue-500" : "bg-red-500"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{c.issue_type}</p>
                        <p className="text-xs text-gray-500 truncate">{c.full_name ?? "Unknown"} — {c.description}</p>
                      </div>
                      <span className={`text-xs font-medium flex-shrink-0 ${c.status === "Resolved" ? "text-green-600" : c.status === "In Progress" ? "text-blue-600" : "text-orange-600"}`}>{c.status}</span>
                    </div>
                  ))}
                  {complaints.length > 4 && (
                    <button onClick={() => scrollToSection("complaints-section")} className="text-xs text-green-700 underline">
                      View all {complaints.length} complaints →
                    </button>
                  )}
                </div>
              )}
            </Card>
            </div>

          <Card title="Certificates & Documents" icon={<ShieldCheck size={16} className="text-orange-500" />}>
            <div className={`grid gap-4 md:grid-cols-3 scroll-mt-28 ${activeSection !== 'top-section' && activeSection !== 'documents-section' ? 'hidden' : ''}`} id="documents-section">
              <DocList label="Business Certificates" files={mapped.certificates} />
              <DocList label="RDB Certificates" files={mapped.rdbCertificates} />
              <DocList label="Tax Clearance" files={mapped.taxCertificates} />
            </div>
          </Card>

          <div className={`grid grid-cols-1 xl:grid-cols-2 gap-5 scroll-mt-28 ${activeSection !== 'top-section' && activeSection !== 'schedule-section' ? 'hidden' : ''}`} id="schedule-section">
            <Card title="Weekly District Scheduler" icon={<CalendarDays size={16} className="text-green-700" />}>
              <div className="space-y-4">
                <div className="rounded-2xl border border-green-100 bg-green-50/70 p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-700 px-3 py-1 text-xs font-semibold text-white">
                      <CheckCircle2 size={12} /> District locked
                    </span>
                    <span className="text-sm font-semibold text-green-900">
                      {companyDistrict ? companyDistrict.name : "District not set"}
                    </span>
                  </div>
                  <p className="text-sm text-green-900/80">
                    Scheduling is limited to one district per company. Use this planner to assign sectors and cells for the week inside {companyDistrict ? companyDistrict.name : "your district"}.
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl bg-white px-3 py-2">
                      <p className="text-lg font-bold text-gray-900">{scheduleStats.planned}</p>
                      <p className="text-[11px] uppercase tracking-wide text-gray-500">Tasks</p>
                    </div>
                    <div className="rounded-xl bg-white px-3 py-2">
                      <p className="text-lg font-bold text-gray-900">{scheduleStats.sectors}</p>
                      <p className="text-[11px] uppercase tracking-wide text-gray-500">Sectors</p>
                    </div>
                    <div className="rounded-xl bg-white px-3 py-2">
                      <p className="text-lg font-bold text-gray-900">{scheduleStats.completed}</p>
                      <p className="text-[11px] uppercase tracking-wide text-gray-500">Done</p>
                    </div>
                  </div>
                </div>

                {!companyDistrict ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    Your company profile does not have a district yet. Use the district panel above to select your working district, then return here to build the weekly schedule.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {districtSectors.map((sector) => (
                        <span key={sector.id} className="rounded-full border border-green-100 bg-white px-3 py-1 text-xs font-medium text-green-800">
                          {sector.name}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button onClick={() => openScheduleModal()} className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition">
                        <Plus size={15} /> Add weekly task
                      </button>
                      <button onClick={() => setScheduleView("week")} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${scheduleView === "week" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                        Week view
                      </button>
                      <button onClick={() => setScheduleView("list")} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${scheduleView === "list" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                        List view
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Weekly Plan Overview" icon={<ClipboardList size={16} className="text-indigo-600" />}>
              {!companyDistrict ? (
                <p className="text-sm text-gray-400">No district available yet, so no weekly plan can be built.</p>
              ) : scheduleTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm text-gray-500">
                  No weekly tasks planned yet. Add the first route to start organizing collections by sector.
                </div>
              ) : scheduleView === "week" ? (
                <div className="space-y-3">
                  {scheduleByDay.map(({ day, tasks }) => (
                    <div key={day} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-gray-900">{day}</p>
                        <span className="text-xs font-medium text-gray-500">{tasks.length} task{tasks.length === 1 ? "" : "s"}</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        {tasks.length === 0 ? (
                          <p className="text-xs text-gray-400">No tasks scheduled.</p>
                        ) : (
                          tasks.map((task) => (
                            <div key={task.id} className="rounded-xl border border-gray-200 bg-white p-3">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-xs text-gray-400">Date: {task.scheduleDate}</p>
                                  <p className="font-semibold text-gray-900">{task.sectorName}</p>
                                  <p className="text-xs text-gray-500">Cells: {task.cells.join(", ")}</p>
                                  <p className="text-xs text-gray-500">{task.driver || "No driver"} • {task.vehicle || "No vehicle"} • {task.startTime}</p>
                                </div>
                                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${task.status === "Completed" ? "bg-emerald-100 text-emerald-700" : task.status === "In Progress" ? "bg-blue-100 text-blue-700" : task.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                                  {task.status}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduleTasks.map((task) => (
                    <div key={task.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{task.day} • {task.sectorName}</p>
                          <p className="text-xs text-gray-500">{task.scheduleDate}</p>
                          <p className="text-xs text-gray-500">{task.districtName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openScheduleModal(task)} className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 border border-gray-200 hover:bg-gray-100 transition">
                            <Edit3 size={12} /> Edit
                          </button>
                          <button onClick={() => handleDeleteScheduleTask(task.id)} className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-100 hover:bg-red-50 transition">
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Cells: {task.cells.join(", ")}</p>
                      <div className="grid gap-3 md:grid-cols-3 text-xs text-gray-500">
                        <InfoRow label="Driver" value={task.driver || "—"} />
                        <InfoRow label="Vehicle" value={task.vehicle || "—"} />
                        <InfoRow label="Time" value={task.startTime} />
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">Status</span>
                          <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="Scheduled">Scheduled</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                        <span className="text-xs text-gray-500">{task.wasteType}</span>
                      </div>
                      {task.notes && <p className="text-xs text-gray-500">{task.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className={`grid grid-cols-1 xl:grid-cols-2 gap-5 scroll-mt-28 ${activeSection !== 'top-section' && activeSection !== 'assignment-section' ? 'hidden' : ''}`} id="assignment-section">
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

          {/* ── Complaints Section ── */}
          <div className={`scroll-mt-28 ${activeSection !== "top-section" && activeSection !== "complaints-section" ? "hidden" : ""}`} id="complaints-section">
            <Card title={`Complaints — ${companyDistrict?.name || application.district || "Your District"}`} icon={<MessageSquare size={16} className="text-red-500" />}>
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-2">
                {[
                  { label: "Total", value: complaints.length, color: "text-blue-600 bg-blue-50" },
                  { label: "Pending", value: complaints.filter(c => c.status === "Pending").length, color: "text-orange-600 bg-orange-50" },
                  { label: "Resolved", value: complaints.filter(c => c.status === "Resolved").length, color: "text-green-600 bg-green-50" },
                ].map(s => (
                  <div key={s.label} className={`${s.color} rounded-xl p-3 text-center`}>
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs">{s.label}</p>
                  </div>
                ))}
              </div>

              {complaintsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-600" />
                </div>
              ) : complaintsError ? (
                <div className="text-center py-6">
                  <p className="text-sm text-red-500 mb-2">{complaintsError}</p>
                </div>
              ) : !application.district ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  Set your working district above to see complaints from households in your area.
                </div>
              ) : complaints.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                  <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
                  No complaints found for {companyDistrict?.name || application.district}.
                </div>
              ) : (
                <div className="space-y-3">
                  {complaints.map(c => (
                    <div key={c.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono text-xs text-gray-400">#{c.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              c.priority === "Urgent" ? "bg-red-100 text-red-700" :
                              c.priority === "High" ? "bg-orange-100 text-orange-700" :
                              c.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                              "bg-green-100 text-green-700"
                            }`}>{c.priority}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              c.status === "Resolved" ? "bg-green-100 text-green-700" :
                              c.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                              "bg-yellow-100 text-yellow-700"
                            }`}>{c.status}</span>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">{c.issue_type}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{c.full_name ?? "Unknown"} • {c.zone ?? "—"}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{c.description}</p>
                          {c.assigned_to && (
                            <p className="text-xs text-green-700 mt-1">Assigned: {c.assigned_to}</p>
                          )}
                          {c.resolution_note && (
                            <p className="text-xs text-blue-700 mt-1 bg-blue-50 rounded px-2 py-1">Note: {c.resolution_note}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button
                            onClick={() => setViewedComplaint(c)}
                            className="px-3 py-1.5 text-blue-600 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-50 transition flex items-center gap-1"
                          >
                            <Eye size={12} /> View
                          </button>
                          {c.status !== "Resolved" && (
                            <button
                              onClick={() => { setRespondTarget(c); setRespondNote(c.resolution_note ?? ""); setRespondStatus("In Progress"); setRespondError(""); }}
                              className="px-3 py-1.5 text-green-700 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-50 transition flex items-center gap-1"
                            >
                              <MessageSquare size={12} /> Respond
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Complaint detail modal */}
          {viewedComplaint && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="font-bold text-gray-800">Complaint Details</h3>
                  <button onClick={() => setViewedComplaint(null)}><X size={20} className="text-gray-400" /></button>
                </div>
                <div className="p-6 space-y-3">
                  {([
                    ["ID", `#${viewedComplaint.id}`],
                    ["Household", viewedComplaint.full_name ?? "—"],
                    ["Zone", viewedComplaint.zone ?? "—"],
                    ["Issue", viewedComplaint.issue_type],
                    ["Priority", viewedComplaint.priority],
                    ["Status", viewedComplaint.status],
                    ["Assigned To", viewedComplaint.assigned_to ?? "Unassigned"],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span className="text-gray-500">{k}</span>
                      <span className="font-medium text-gray-800">{v}</span>
                    </div>
                  ))}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Description</p>
                    <p className="text-sm text-gray-800 bg-gray-50 rounded-lg p-3">{viewedComplaint.description}</p>
                  </div>
                  {viewedComplaint.resolution_note && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Resolution Note</p>
                      <p className="text-sm text-gray-800 bg-green-50 rounded-lg p-3">{viewedComplaint.resolution_note}</p>
                    </div>
                  )}
                </div>
                <div className="px-6 pb-6">
                  <button onClick={() => setViewedComplaint(null)} className="w-full py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition">
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Respond to complaint modal */}
          {respondTarget && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="font-bold text-gray-800">Respond to Complaint</h3>
                  <button onClick={() => setRespondTarget(null)} disabled={respondSaving}>
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="font-medium text-gray-800 text-sm">{respondTarget.issue_type}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{respondTarget.full_name ?? "—"} • {respondTarget.zone ?? "—"}</p>
                    <p className="text-xs text-gray-600 mt-1">{respondTarget.description}</p>
                  </div>

                  {respondError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-xl">
                      {respondError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Update Status</label>
                    <select
                      value={respondStatus}
                      onChange={e => setRespondStatus(e.target.value as "In Progress" | "Resolved")}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Response / Resolution Note <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={respondNote}
                      onChange={e => setRespondNote(e.target.value)}
                      rows={4}
                      placeholder="Explain what action was taken or what the citizen should expect..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setRespondTarget(null)}
                      disabled={respondSaving}
                      className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRespond}
                      disabled={respondSaving}
                      className="flex-1 py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {respondSaving ? <><div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" /> Sending…</> : "Send Response"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {scheduleModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
              <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100 flex flex-col">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Weekly task planner</p>
                    <h3 className="text-lg font-bold text-gray-900">{editTask ? "Edit scheduled task" : "Add new weekly task"}</h3>
                  </div>
                  <button onClick={closeScheduleModal} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition">
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      value={scheduleForm.scheduleDate}
                      onChange={(e) => setScheduleForm((current) => ({ ...current, scheduleDate: e.target.value }))}
                      type="date"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Day</label>
                    <select value={scheduleForm.day} onChange={(e) => setScheduleForm((current) => ({ ...current, day: e.target.value as Day }))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      {WEEK_DAYS.map((day) => <option key={day}>{day}</option>)}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Sector</label>
                    <select value={scheduleForm.sectorId} onChange={(e) => setScheduleForm((current) => ({ ...current, sectorId: e.target.value, cells: [] }))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">Select sector</option>
                      {districtSectors.map((sector) => <option key={sector.id} value={sector.id}>{sector.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <div className="flex items-center justify-between gap-3">
                      <label className="block text-sm font-medium text-gray-700">Cells / locations</label>
                      <span className="text-xs text-gray-400">Choose one or more cells in the selected sector</span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {availableCells.length === 0 ? (
                        <p className="text-sm text-gray-400 sm:col-span-2">Pick a sector to see available cells.</p>
                      ) : (
                        availableCells.map((cell) => {
                          const selected = scheduleForm.cells.includes(cell.name);
                          return (
                            <button
                              key={cell.id}
                              type="button"
                              onClick={() => setScheduleForm((current) => ({
                                ...current,
                                cells: selected ? current.cells.filter((value) => value !== cell.name) : [...current.cells, cell.name],
                              }))}
                              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${selected ? "border-green-600 bg-green-50 text-green-800" : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
                            >
                              {cell.name}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Driver</label>
                    <select value={scheduleForm.driver} onChange={(e) => setScheduleForm((current) => ({ ...current, driver: e.target.value }))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">Select driver</option>
                      {mapped.drivers.map((driver, index) => <option key={`${driver.name || "driver"}-${index}`} value={driver.name || `Driver ${index + 1}`}>{driver.name || `Driver ${index + 1}`}</option>)}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Vehicle</label>
                    <select value={scheduleForm.vehicle} onChange={(e) => setScheduleForm((current) => ({ ...current, vehicle: e.target.value }))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">Select vehicle</option>
                      {mapped.cars.map((car, index) => <option key={`${car.plateNumber || "vehicle"}-${index}`} value={car.plateNumber || `Vehicle ${index + 1}`}>{car.plateNumber || `Vehicle ${index + 1}`}</option>)}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Start time</label>
                    <input value={scheduleForm.startTime} onChange={(e) => setScheduleForm((current) => ({ ...current, startTime: e.target.value }))} type="time" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Waste type</label>
                    <select value={scheduleForm.wasteType} onChange={(e) => setScheduleForm((current) => ({ ...current, wasteType: e.target.value as WasteType }))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option>General Waste</option>
                      <option>Recyclables</option>
                      <option>Organic Waste</option>
                      <option>Hazardous</option>
                    </select>
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea value={scheduleForm.notes} onChange={(e) => setScheduleForm((current) => ({ ...current, notes: e.target.value }))} rows={3} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Route notes, pickup instructions, or special handling details" />
                  </div>
                </div>
                </div>

                <div className="border-t border-gray-100 px-6 py-4 space-y-3">
                  {scheduleMessage && (
                    <p className={`text-sm font-medium ${scheduleMessage.toLowerCase().includes("fail") || scheduleMessage.toLowerCase().includes("error") || scheduleMessage.toLowerCase().includes("select") ? "text-red-600" : "text-green-700"}`}>
                      {scheduleMessage}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <button onClick={closeScheduleModal} disabled={scheduleSaving} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveScheduleTask}
                      disabled={scheduleSaving}
                      className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {scheduleSaving ? (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                      ) : (
                        <CheckCircle2 size={15} />
                      )}
                      {scheduleSaving ? "Saving..." : editTask ? "Update task" : "Save task"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
