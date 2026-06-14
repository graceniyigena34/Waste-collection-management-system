"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, BadgeCheck, Users, MapPin,
  Car, LogOut, Phone, Mail, User, Truck,
  LayoutDashboard, ClipboardList, Route, Settings, ArrowUpRight,
  Clock, AlertTriangle, Bell, Plus,
  CalendarDays, CheckCircle2, Check, Edit3, Trash2, X, MessageSquare, Eye, MessageCircle, Send, PackagePlus, Zap,
} from "lucide-react";
import { isWasteCollectorRole } from "@/lib/company-application";
import { api, type BackendCompanyProfile, type BackendDriver, type BackendVehicle, type BackendComplaint, type BackendPickupRequest, type BackendAssignment, type BackendChatMessage, type BackendConversationSummary, type BackendHousehold, getStoredUserInfo } from "@/lib/api-client";
import NotificationBell from "@/components/NotificationBell";
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
  published: boolean;
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
  const [assignmentDriverId, setAssignmentDriverId] = useState("");
  const [assignmentVehicleId, setAssignmentVehicleId] = useState("");
  const [assignmentZone, setAssignmentZone] = useState("");
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [assignmentSaving, setAssignmentSaving] = useState(false);
  const [assignmentError, setAssignmentError] = useState("");
  const [assignments, setAssignments] = useState<BackendAssignment[]>([]);
  const [editAssignmentTarget, setEditAssignmentTarget] = useState<BackendAssignment | null>(null);
  const [editAssignmentDriverId, setEditAssignmentDriverId] = useState("");
  const [editAssignmentVehicleId, setEditAssignmentVehicleId] = useState("");
  const [editAssignmentZone, setEditAssignmentZone] = useState("");
  const [editAssignmentNotes, setEditAssignmentNotes] = useState("");
  const [editAssignmentSaving, setEditAssignmentSaving] = useState(false);
  const [editAssignmentError, setEditAssignmentError] = useState("");
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

  const [autoScheduleModal, setAutoScheduleModal] = useState(false);
  const [autoScheduleTab, setAutoScheduleTab] = useState<"requests" | "citizens">("requests");
  const [autoScheduleSelected, setAutoScheduleSelected] = useState<Set<number>>(new Set());
  const [autoScheduleDriver, setAutoScheduleDriver] = useState("");
  const [autoScheduleVehicle, setAutoScheduleVehicle] = useState("");
  const [autoScheduleSaving, setAutoScheduleSaving] = useState(false);
  const [autoScheduleError, setAutoScheduleError] = useState("");
  const [autoScheduleCitizenDate, setAutoScheduleCitizenDate] = useState(new Date().toISOString().slice(0, 10));
  const [autoScheduleCitizenTime, setAutoScheduleCitizenTime] = useState("08:00");
  const [autoScheduleCitizenSearch, setAutoScheduleCitizenSearch] = useState("");
  const [autoScheduleCitizenSelected, setAutoScheduleCitizenSelected] = useState<Set<number>>(new Set());

  const [complaints, setComplaints] = useState<BackendComplaint[]>([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [complaintsError, setComplaintsError] = useState("");
  const [viewedComplaint, setViewedComplaint] = useState<BackendComplaint | null>(null);
  const [respondTarget, setRespondTarget] = useState<BackendComplaint | null>(null);
  const [respondNote, setRespondNote] = useState("");
  const [respondStatus, setRespondStatus] = useState<"In Progress" | "Resolved">("In Progress");
  const [respondSaving, setRespondSaving] = useState(false);
  const [respondError, setRespondError] = useState("");

  const [pickupRequests, setPickupRequests] = useState<BackendPickupRequest[]>([]);
  const [pickupRequestsLoading, setPickupRequestsLoading] = useState(false);
  const [pickupRequestsError, setPickupRequestsError] = useState("");
  const [pickupRespondTarget, setPickupRespondTarget] = useState<BackendPickupRequest | null>(null);
  const [pickupRespondNote, setPickupRespondNote] = useState("");
  const [pickupRespondStatus, setPickupRespondStatus] = useState<"In Progress" | "Resolved">("In Progress");
  const [pickupRespondDriver, setPickupRespondDriver] = useState("");
  const [pickupRespondSaving, setPickupRespondSaving] = useState(false);
  const [pickupRespondError, setPickupRespondError] = useState("");

  const [citizens, setCitizens] = useState<BackendHousehold[]>([]);
  const [citizensLoading, setCitizensLoading] = useState(false);
  const [citizensError, setCitizensError] = useState("");
  const [citizenSearch, setCitizenSearch] = useState("");

  const [chatConversations, setChatConversations] = useState<BackendConversationSummary[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [selectedCitizenId, setSelectedCitizenId] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<BackendChatMessage[]>([]);
  const [chatMessagesLoading, setChatMessagesLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatSending, setChatSending] = useState(false);
  const [chatError, setChatError] = useState("");
  const [chatHoveredMsgId, setChatHoveredMsgId] = useState<number | null>(null);
  const [chatEditingId, setChatEditingId] = useState<number | null>(null);
  const [chatEditText, setChatEditText] = useState("");

  const [addDriverModal, setAddDriverModal] = useState(false);
  const [addDriverForm, setAddDriverForm] = useState({ name: "", phone: "", email: "", licenseNumber: "", nationalId: "", zone: "Kicukiro", yearsOfExperience: "" });
  const [addDriverSaving, setAddDriverSaving] = useState(false);
  const [addDriverError, setAddDriverError] = useState("");
  const [companyDrivers, setCompanyDrivers] = useState<BackendDriver[]>([]);
  const [editDriverModal, setEditDriverModal] = useState(false);
  const [editDriverTarget, setEditDriverTarget] = useState<BackendDriver | null>(null);
  const [editDriverForm, setEditDriverForm] = useState({ name: "", phone: "", email: "", licenseNumber: "", nationalId: "", zone: "Kicukiro", yearsOfExperience: "" });
  const [editDriverSaving, setEditDriverSaving] = useState(false);
  const [editDriverError, setEditDriverError] = useState("");

  const [companyVehicles, setCompanyVehicles] = useState<BackendVehicle[]>([]);
  const [addVehicleModal, setAddVehicleModal] = useState(false);
  const [addVehicleForm, setAddVehicleForm] = useState({ plate_number: "", model: "", year: "", capacity: "", assigned_zone: "Kicukiro", insurance_number: "" });
  const [addVehicleSaving, setAddVehicleSaving] = useState(false);
  const [addVehicleError, setAddVehicleError] = useState("");
  const [editVehicleModal, setEditVehicleModal] = useState(false);
  const [editVehicleTarget, setEditVehicleTarget] = useState<BackendVehicle | null>(null);
  const [editVehicleForm, setEditVehicleForm] = useState({ plate_number: "", model: "", year: "", capacity: "", assigned_zone: "Kicukiro", insurance_number: "" });
  const [editVehicleSaving, setEditVehicleSaving] = useState(false);
  const [editVehicleError, setEditVehicleError] = useState("");

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

  useEffect(() => {
    if (!application?.id) return;
    api.drivers.list(application.id)
      .then(res => setCompanyDrivers(res.drivers))
      .catch(() => {});
    api.assignments.list(application.id)
      .then(res => setAssignments(res.assignments))
      .catch(() => {});
  }, [application?.id]);

  useEffect(() => {
    if (!application?.id) return;
    api.vehicles.list(application.id)
      .then(res => setCompanyVehicles(res.vehicles))
      .catch(() => {});
  }, [application?.id]);

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
          published: schedule.published ?? false,
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

  useEffect(() => {
    if (!application?.district) return;
    const loadPickups = async () => {
      setPickupRequestsLoading(true);
      setPickupRequestsError("");
      try {
        const res = await api.pickupRequests.all();
        setPickupRequests(res.requests);
      } catch (err) {
        setPickupRequestsError(err instanceof Error ? err.message : "Failed to load pickup requests.");
      } finally {
        setPickupRequestsLoading(false);
      }
    };
    void loadPickups();
  }, [application?.district]);

  useEffect(() => {
    if (!application?.district) return;
    const loadCitizens = async () => {
      setCitizensLoading(true);
      setCitizensError("");
      try {
        const res = await api.households.byDistrict(application.district!);
        setCitizens(res.households);
      } catch (err) {
        setCitizensError(err instanceof Error ? err.message : "Failed to load citizens.");
      } finally {
        setCitizensLoading(false);
      }
    };
    void loadCitizens();
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

  const handlePickupRespond = async () => {
    if (!pickupRespondTarget || !pickupRespondNote.trim()) {
      setPickupRespondError("Please enter a response note.");
      return;
    }
    setPickupRespondSaving(true);
    setPickupRespondError("");
    try {
      const res = await api.pickupRequests.updateStatus(
        pickupRespondTarget.id,
        pickupRespondStatus,
        pickupRespondDriver.trim() || undefined,
        pickupRespondNote.trim(),
      );
      setPickupRequests(prev => prev.map(r => r.id === pickupRespondTarget.id ? res.request : r));
      setPickupRespondTarget(null);
      setPickupRespondNote("");
      setPickupRespondDriver("");
      setPickupRespondStatus("In Progress");
    } catch (err) {
      setPickupRespondError(err instanceof Error ? err.message : "Failed to send response.");
    } finally {
      setPickupRespondSaving(false);
    }
  };

  useEffect(() => {
    if (!application) return;
    const appId = application.id;
    const load = async () => {
      setChatLoading(true);
      try {
        const res = await api.chat.conversations(appId);
        setChatConversations(res.conversations);
      } catch {
        // silent
      } finally {
        setChatLoading(false);
      }
    };
    void load();
  }, [application?.id]);

  useEffect(() => {
    if (!application || !selectedCitizenId) return;
    const appId = application.id;
    let cancelled = false;

    const load = async (showLoading: boolean) => {
      if (showLoading) setChatMessagesLoading(true);
      try {
        const res = await api.chat.listForCitizen(appId, selectedCitizenId);
        if (!cancelled) setChatMessages(res.messages);
      } catch {
        // silent
      } finally {
        if (showLoading && !cancelled) setChatMessagesLoading(false);
      }
    };

    void load(true);
    const interval = setInterval(() => void load(false), 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [application?.id, selectedCitizenId]);

  const handleChatReply = async () => {
    if (!application || !selectedCitizenId || !chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatSending(true);
    setChatError("");
    try {
      const res = await api.chat.reply(application.id, selectedCitizenId, msg, application.company_name);
      setChatMessages(prev => [...prev, res.chat]);
      // refresh conversations list so last_message updates
      const updated = await api.chat.conversations(application.id);
      setChatConversations(updated.conversations);
    } catch (err) {
      setChatError(err instanceof Error ? err.message : "Failed to send message.");
      setChatInput(msg);
    } finally {
      setChatSending(false);
    }
  };

  const handleDeleteChatMessage = async (msg: BackendChatMessage) => {
    if (!application) return;
    setChatMessages(prev => prev.filter(m => m.id !== msg.id));
    try {
      await api.chat.remove(application.id, msg.id);
    } catch {
      setChatMessages(prev =>
        [...prev, msg].sort((a, b) =>
          new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
        )
      );
    }
  };

  const startChatEdit = (msg: BackendChatMessage) => {
    setChatEditingId(msg.id);
    setChatEditText(msg.message);
  };

  const cancelChatEdit = () => {
    setChatEditingId(null);
    setChatEditText("");
  };

  const saveChatEdit = async (msg: BackendChatMessage) => {
    const text = chatEditText.trim();
    if (!text || !application) return;
    // Optimistic update
    setChatMessages(prev => prev.map(m => m.id === msg.id ? { ...m, message: text } : m));
    cancelChatEdit();
    try {
      const res = await api.chat.edit(application.id, msg.id, text);
      setChatMessages(prev => prev.map(m => m.id === msg.id ? res.chat : m));
    } catch {
      // Rollback
      setChatMessages(prev => prev.map(m => m.id === msg.id ? msg : m));
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
      published: editTask?.published ?? false,
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
          published: updated.schedule.published ?? nextTask.published,
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
          published: created.schedule.published ?? false,
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

  const handlePublishToggle = async (taskId: number, publish: boolean) => {
    if (!application) return;
    setScheduleTasks((current) => current.map((t) => (t.id === taskId ? { ...t, published: publish } : t)));
    try {
      await api.companySchedules.setPublished(application.id, taskId, publish);
      setScheduleMessage(publish ? "Schedule published — citizens can now see it." : "Schedule unpublished.");
    } catch (error) {
      setScheduleTasks((current) => current.map((t) => (t.id === taskId ? { ...t, published: !publish } : t)));
      setScheduleMessage(error instanceof Error ? error.message : "Failed to update publish status.");
    }
  };

  const handleAddDriver = async () => {
    if (!application) return;
    if (!addDriverForm.name.trim() || !addDriverForm.phone.trim()) {
      setAddDriverError("Name and phone are required.");
      return;
    }
    setAddDriverSaving(true);
    setAddDriverError("");
    try {
      const res = await api.drivers.add(application.id, {
        name: addDriverForm.name.trim(),
        phone: addDriverForm.phone.trim(),
        email: addDriverForm.email.trim() || undefined,
        license_number: addDriverForm.licenseNumber.trim() || undefined,
        national_id: addDriverForm.nationalId.trim() || undefined,
        zone: addDriverForm.zone || undefined,
        years_of_experience: addDriverForm.yearsOfExperience ? parseInt(addDriverForm.yearsOfExperience, 10) : undefined,
      });
      setCompanyDrivers(prev => [...prev, res.driver]);
      setAddDriverModal(false);
      setAddDriverForm({ name: "", phone: "", email: "", licenseNumber: "", nationalId: "", zone: "Kicukiro", yearsOfExperience: "" });
    } catch (err) {
      setAddDriverError(err instanceof Error ? err.message : "Failed to add driver.");
    } finally {
      setAddDriverSaving(false);
    }
  };

  const openEditDriver = (driver: BackendDriver) => {
    setEditDriverTarget(driver);
    setEditDriverForm({
      name: driver.name,
      phone: driver.phone,
      email: driver.email ?? "",
      licenseNumber: driver.license_number ?? "",
      nationalId: driver.national_id ?? "",
      zone: driver.zone ?? "Kicukiro",
      yearsOfExperience: driver.years_of_experience !== undefined ? String(driver.years_of_experience) : "",
    });
    setEditDriverError("");
    setEditDriverModal(true);
  };

  const handleEditDriver = async () => {
    if (!application || !editDriverTarget) return;
    if (!editDriverForm.name.trim() || !editDriverForm.phone.trim()) {
      setEditDriverError("Name and phone are required.");
      return;
    }
    setEditDriverSaving(true);
    setEditDriverError("");
    try {
      const res = await api.drivers.update(application.id, editDriverTarget.id, {
        name: editDriverForm.name.trim(),
        phone: editDriverForm.phone.trim(),
        email: editDriverForm.email.trim() || undefined,
        license_number: editDriverForm.licenseNumber.trim() || undefined,
        national_id: editDriverForm.nationalId.trim() || undefined,
        zone: editDriverForm.zone || undefined,
        years_of_experience: editDriverForm.yearsOfExperience ? parseInt(editDriverForm.yearsOfExperience, 10) : undefined,
      });
      setCompanyDrivers(prev => prev.map(d => d.id === editDriverTarget.id ? res.driver : d));
      setEditDriverModal(false);
      setEditDriverTarget(null);
    } catch (err) {
      setEditDriverError(err instanceof Error ? err.message : "Failed to update driver.");
    } finally {
      setEditDriverSaving(false);
    }
  };

  const handleDeleteDriver = async (driver: BackendDriver) => {
    if (!application) return;
    if (!confirm(`Delete driver "${driver.name}"? This cannot be undone.`)) return;
    try {
      await api.drivers.remove(application.id, driver.id);
      setCompanyDrivers(prev => prev.filter(d => d.id !== driver.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete driver.");
    }
  };

  const handleAddVehicle = async () => {
    if (!application) return;
    if (!addVehicleForm.plate_number.trim() || !addVehicleForm.model.trim()) {
      setAddVehicleError("Plate number and model are required.");
      return;
    }
    setAddVehicleSaving(true);
    setAddVehicleError("");
    try {
      const res = await api.vehicles.add(application.id, {
        plate_number: addVehicleForm.plate_number.trim(),
        model: addVehicleForm.model.trim(),
        year: addVehicleForm.year.trim() || undefined,
        capacity: addVehicleForm.capacity.trim() || undefined,
        assigned_zone: addVehicleForm.assigned_zone || undefined,
        insurance_number: addVehicleForm.insurance_number.trim() || undefined,
      });
      setCompanyVehicles(prev => [...prev, res.vehicle]);
      setAddVehicleModal(false);
      setAddVehicleForm({ plate_number: "", model: "", year: "", capacity: "", assigned_zone: "Kicukiro", insurance_number: "" });
    } catch (err) {
      setAddVehicleError(err instanceof Error ? err.message : "Failed to add vehicle.");
    } finally {
      setAddVehicleSaving(false);
    }
  };

  const openEditVehicle = (v: BackendVehicle) => {
    setEditVehicleTarget(v);
    setEditVehicleForm({
      plate_number: v.plate_number,
      model: v.model,
      year: v.year ?? "",
      capacity: v.capacity ?? "",
      assigned_zone: v.assigned_zone ?? "Kicukiro",
      insurance_number: v.insurance_number ?? "",
    });
    setEditVehicleError("");
    setEditVehicleModal(true);
  };

  const handleEditVehicle = async () => {
    if (!application || !editVehicleTarget) return;
    if (!editVehicleForm.plate_number.trim() || !editVehicleForm.model.trim()) {
      setEditVehicleError("Plate number and model are required.");
      return;
    }
    setEditVehicleSaving(true);
    setEditVehicleError("");
    try {
      const res = await api.vehicles.update(application.id, editVehicleTarget.id, {
        plate_number: editVehicleForm.plate_number.trim(),
        model: editVehicleForm.model.trim(),
        year: editVehicleForm.year.trim() || undefined,
        capacity: editVehicleForm.capacity.trim() || undefined,
        assigned_zone: editVehicleForm.assigned_zone || undefined,
        insurance_number: editVehicleForm.insurance_number.trim() || undefined,
      });
      setCompanyVehicles(prev => prev.map(v => v.id === editVehicleTarget.id ? res.vehicle : v));
      setEditVehicleModal(false);
      setEditVehicleTarget(null);
    } catch (err) {
      setEditVehicleError(err instanceof Error ? err.message : "Failed to update vehicle.");
    } finally {
      setEditVehicleSaving(false);
    }
  };

  const handleDeleteVehicle = async (v: BackendVehicle) => {
    if (!application) return;
    if (!confirm(`Delete vehicle "${v.plate_number}"? This cannot be undone.`)) return;
    try {
      await api.vehicles.remove(application.id, v.id);
      setCompanyVehicles(prev => prev.filter(x => x.id !== v.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete vehicle.");
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
    serviceAreas: asArray(application.service_areas) as string[],
  };

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
    { id: "1", title: "Drivers Updated", desc: `${companyDrivers.length} drivers available for dispatch`, time: "10 min ago", dot: "bg-green-500" },
    { id: "3", title: "Service Areas Set", desc: mapped.serviceAreas.join(", ") || "No zones selected", time: "5 hrs ago", dot: "bg-purple-500" },
    { id: "4", title: "Fleet Ready", desc: `${companyVehicles.length} vehicles are ready for operation`, time: "6 hrs ago", dot: "bg-orange-500" },
  ];

  const quickActions = [
    { label: "Drivers", icon: Users, color: "text-blue-600 bg-blue-50 hover:bg-blue-100", target: "drivers-section" },
    { label: "Vehicles", icon: Car, color: "text-purple-600 bg-purple-50 hover:bg-purple-100", target: "vehicles-section" },
    { label: "Assignment", icon: Route, color: "text-teal-600 bg-teal-50 hover:bg-teal-100", target: "assignment-section" },
    { label: "Schedule", icon: CalendarDays, color: "text-green-700 bg-green-50 hover:bg-green-100", target: "schedule-section" },
    { label: "Complaints", icon: MessageSquare, color: "text-red-600 bg-red-50 hover:bg-red-100", target: "complaints-section" },
    { label: "Pickup Requests", icon: PackagePlus, color: "text-amber-600 bg-amber-50 hover:bg-amber-100", target: "pickup-requests-section" },
    { label: "Chat", icon: MessageCircle, color: "text-blue-600 bg-blue-50 hover:bg-blue-100", target: "chat-section" },
    { label: "Citizens", icon: Building2, color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100", target: "citizens-section" },
    { label: "Settings", icon: Settings, color: "text-gray-600 bg-gray-50 hover:bg-gray-100", target: "settings-section" },
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

  const handleAutoSchedule = async () => {
    if (!application || !companyDistrict) return;
    const pending = pickupRequests.filter(r => autoScheduleSelected.has(r.id) && r.preferred_date);
    if (pending.length === 0) { setAutoScheduleError("Select at least one request that has a preferred date."); return; }
    setAutoScheduleSaving(true);
    setAutoScheduleError("");
    const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let created = 0;
    for (const r of pending) {
      try {
        const d = new Date(r.preferred_date!);
        const rawDay = DAY_NAMES[d.getDay()];
        const safeDay: Day = (WEEK_DAYS as readonly string[]).includes(rawDay) ? rawDay as Day : "Monday";
        const sectorMatch = districtSectors.find(s => s.name.toLowerCase() === (r.sector ?? "").toLowerCase());
        const payload = {
          district_id: companyDistrict.id,
          district_name: companyDistrict.name,
          schedule_date: r.preferred_date!,
          day: safeDay,
          sector_id: sectorMatch?.id ?? "",
          sector_name: sectorMatch?.name ?? r.sector ?? "",
          cells: [] as string[],
          driver: autoScheduleDriver,
          vehicle: autoScheduleVehicle,
          start_time: r.preferred_time ?? "08:00",
          waste_type: "General Waste" as WasteType,
          status: "Scheduled" as TaskStatus,
          notes: `Auto from pickup request #${r.id}${r.notes ? `: ${r.notes}` : ""}`,
        };
        const res = await api.companySchedules.create(application.id, payload);
        const saved: ScheduleTask = {
          id: res.schedule.id,
          districtId: res.schedule.district_id || companyDistrict.id,
          districtName: res.schedule.district_name || companyDistrict.name,
          scheduleDate: res.schedule.schedule_date || r.preferred_date!,
          day: (res.schedule.day as Day) || safeDay,
          sectorId: res.schedule.sector_id || payload.sector_id,
          sectorName: res.schedule.sector_name || payload.sector_name,
          cells: res.schedule.cells || [],
          driver: res.schedule.driver || autoScheduleDriver,
          vehicle: res.schedule.vehicle || autoScheduleVehicle,
          startTime: res.schedule.start_time || payload.start_time,
          wasteType: (res.schedule.waste_type as WasteType) || "General Waste",
          status: (res.schedule.status as TaskStatus) || "Scheduled",
          published: res.schedule.published ?? false,
          notes: res.schedule.notes || payload.notes,
        };
        setScheduleTasks(prev => [saved, ...prev]);
        created++;
      } catch { /* skip individually failed requests */ }
    }
    setAutoScheduleSaving(false);
    if (created > 0) {
      setAutoScheduleModal(false);
      setAutoScheduleSelected(new Set());
      setAutoScheduleDriver("");
      setAutoScheduleVehicle("");
      setScheduleMessage(`${created} schedule${created > 1 ? "s" : ""} auto-generated from pickup requests.`);
    } else {
      setAutoScheduleError("Failed to create schedules. Check your district is set correctly.");
    }
  };

  const handleAutoScheduleFromCitizens = async () => {
    if (!application || !companyDistrict) return;
    const selected = citizens.filter(c => autoScheduleCitizenSelected.has(c.id));
    if (selected.length === 0) { setAutoScheduleError("Select at least one citizen."); return; }
    if (!autoScheduleCitizenDate) { setAutoScheduleError("Pick a date for the schedule."); return; }
    setAutoScheduleSaving(true);
    setAutoScheduleError("");

    // Group citizens by sector → one schedule per sector
    const bySector = new Map<string, { sectorName: string; cells: string[] }>();
    selected.forEach(c => {
      const key = c.sector || "Unknown";
      if (!bySector.has(key)) bySector.set(key, { sectorName: c.sector || key, cells: [] });
      if (c.cell && !bySector.get(key)!.cells.includes(c.cell)) bySector.get(key)!.cells.push(c.cell);
    });

    const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date(autoScheduleCitizenDate);
    const rawDay = DAY_NAMES[d.getDay()];
    const safeDay: Day = (WEEK_DAYS as readonly string[]).includes(rawDay) ? rawDay as Day : "Monday";

    let created = 0;
    for (const [, info] of bySector) {
      try {
        const sectorMatch = districtSectors.find(s => s.name.toLowerCase() === info.sectorName.toLowerCase());
        const citizenCount = selected.filter(c => (c.sector || "Unknown") === info.sectorName).length;
        const payload = {
          district_id: companyDistrict.id,
          district_name: companyDistrict.name,
          schedule_date: autoScheduleCitizenDate,
          day: safeDay,
          sector_id: sectorMatch?.id ?? "",
          sector_name: sectorMatch?.name ?? info.sectorName,
          cells: info.cells,
          driver: autoScheduleDriver,
          vehicle: autoScheduleVehicle,
          start_time: autoScheduleCitizenTime,
          waste_type: "General Waste" as WasteType,
          status: "Scheduled" as TaskStatus,
          notes: `Covers ${citizenCount} citizen${citizenCount !== 1 ? "s" : ""} in ${info.sectorName}`,
        };
        const res = await api.companySchedules.create(application.id, payload);
        const saved: ScheduleTask = {
          id: res.schedule.id,
          districtId: res.schedule.district_id || companyDistrict.id,
          districtName: res.schedule.district_name || companyDistrict.name,
          scheduleDate: res.schedule.schedule_date || autoScheduleCitizenDate,
          day: (res.schedule.day as Day) || safeDay,
          sectorId: res.schedule.sector_id || payload.sector_id,
          sectorName: res.schedule.sector_name || info.sectorName,
          cells: res.schedule.cells || info.cells,
          driver: res.schedule.driver || autoScheduleDriver,
          vehicle: res.schedule.vehicle || autoScheduleVehicle,
          startTime: res.schedule.start_time || autoScheduleCitizenTime,
          wasteType: (res.schedule.waste_type as WasteType) || "General Waste",
          status: (res.schedule.status as TaskStatus) || "Scheduled",
          published: res.schedule.published ?? false,
          notes: res.schedule.notes || payload.notes,
        };
        setScheduleTasks(prev => [saved, ...prev]);
        created++;
      } catch { /* skip failed sector */ }
    }
    setAutoScheduleSaving(false);
    if (created > 0) {
      setAutoScheduleModal(false);
      setAutoScheduleCitizenSelected(new Set());
      setAutoScheduleDriver("");
      setAutoScheduleVehicle("");
      setScheduleMessage(`${created} sector schedule${created > 1 ? "s" : ""} created for ${selected.length} citizens.`);
    } else {
      setAutoScheduleError("Failed to create schedules. Check your district is set correctly.");
    }
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

  const handleCreateAssignment = async () => {
    if (!application?.id || !assignmentDriverId || !assignmentVehicleId || !assignmentZone) {
      setAssignmentError("Please select a driver, vehicle and zone.");
      return;
    }
    setAssignmentSaving(true);
    setAssignmentError("");
    try {
      const res = await api.assignments.create({
        company_id: application.id,
        driver_id: Number(assignmentDriverId),
        vehicle_id: Number(assignmentVehicleId),
        zone: assignmentZone,
        notes: assignmentNotes.trim() || undefined,
      });
      setAssignments(prev => [res.assignment, ...prev]);
      setAssignmentDriverId("");
      setAssignmentVehicleId("");
      setAssignmentZone("");
      setAssignmentNotes("");
    } catch (err) {
      setAssignmentError(err instanceof Error ? err.message : "Failed to save assignment.");
    } finally {
      setAssignmentSaving(false);
    }
  };

  const handleEditAssignment = async () => {
    if (!editAssignmentTarget || !application?.id) return;
    if (!editAssignmentDriverId || !editAssignmentVehicleId || !editAssignmentZone) {
      setEditAssignmentError("Please select a driver, vehicle and zone.");
      return;
    }
    setEditAssignmentSaving(true);
    setEditAssignmentError("");
    try {
      const res = await api.assignments.update(editAssignmentTarget.id, {
        company_id: application.id,
        driver_id: Number(editAssignmentDriverId),
        vehicle_id: Number(editAssignmentVehicleId),
        zone: editAssignmentZone,
        notes: editAssignmentNotes.trim() || undefined,
      });
      setAssignments(prev => prev.map(a => a.id === editAssignmentTarget.id ? res.assignment : a));
      setEditAssignmentTarget(null);
    } catch (err) {
      setEditAssignmentError(err instanceof Error ? err.message : "Failed to update assignment.");
    } finally {
      setEditAssignmentSaving(false);
    }
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
            { label: "Pickup Requests", icon: PackagePlus, target: "pickup-requests-section" },
            { label: "Chat", icon: MessageCircle, target: "chat-section" },
            { label: "Citizens", icon: Building2, target: "citizens-section" },
            { label: "Settings", icon: Settings, target: "settings-section" },
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
          <div className="flex items-center gap-3">
            <NotificationBell mode="dropdown" buttonClassName="text-gray-600 hover:bg-gray-100" />
            <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition">
              <LogOut size={15} /> Logout
            </button>
          </div>
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
              Your company profile has been approved. Use this dashboard to manage drivers, vehicles, routes, and daily company activities.
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
              { label: "Total Drivers", value: companyDrivers.length, sub: "Registered drivers", icon: <Users size={22} className="text-blue-600" />, iconBg: "bg-blue-100", valueColor: "text-blue-600", trend: "+12% this month" },
              { label: "Vehicles Ready", value: companyVehicles.length, sub: "Fleet available", icon: <Truck size={22} className="text-green-600" />, iconBg: "bg-green-100", valueColor: "text-green-600", trend: "+5% vs yesterday" },
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

            <Card title="Citizens Overview" icon={<Building2 size={16} className="text-green-600" />}>
              <InfoRow label="District" value={companyDistrict?.name || application.district || "—"} />
              <InfoRow label="Service areas" value={mapped.serviceAreas.join(", ") || "—"} />
              <InfoRow label="Drivers" value={String(companyDrivers.length)} />
              <InfoRow label="Vehicles" value={String(companyVehicles.length)} />
              {application.description && (
                <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600 mt-1">
                  {application.description}
                </div>
              )}
            </Card>
            </div>
          </div>

          <div className={`scroll-mt-28 ${activeSection !== 'top-section' && activeSection !== 'drivers-section' ? 'hidden' : ''}`} id="drivers-section">
            <Card title="Driver Roster" icon={<Users size={16} className="text-blue-600" />}>
              {companyDrivers.length === 0 ? (
                <p className="text-sm text-gray-400">No drivers on record. Go to Settings to add drivers.</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {companyDrivers.map((driver) => (
                    <div key={driver.id} className="rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-1">
                      <p className="font-semibold text-gray-900">{driver.name}</p>
                      <p className="text-xs text-gray-500">{driver.email ?? ""} • {driver.phone}</p>
                      <p className="text-xs text-gray-500">License: {driver.license_number || "N/A"} • ID: {driver.national_id || "N/A"}</p>
                      <p className="text-xs text-gray-500">Zone: {driver.zone ?? "—"} • Truck: {driver.truck_id || "Unassigned"} • Exp: {driver.years_of_experience ?? "N/A"} yrs</p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${driver.status === "active" ? "bg-green-100 text-green-700" : driver.status === "suspended" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{driver.status ?? "active"}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
            </div>

          <div className={`scroll-mt-28 ${activeSection !== 'top-section' && activeSection !== 'vehicles-section' ? 'hidden' : ''}`} id="vehicles-section">
            <Card title="Fleet / Vehicles" icon={<Car size={16} className="text-purple-600" />}>
              {companyVehicles.length === 0 ? (
                <p className="text-sm text-gray-400">No vehicles on record. Go to Settings to add vehicles.</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {companyVehicles.map((v) => (
                    <div key={v.id} className="rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-1">
                      <p className="font-semibold text-gray-900">{v.plate_number} — {v.model}</p>
                      <p className="text-xs text-gray-500">Year: {v.year || "N/A"} • Capacity: {v.capacity || "N/A"}</p>
                      <p className="text-xs text-gray-500">Zone: {v.assigned_zone || "—"} • Insurance: {v.insurance_number || "N/A"}</p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${v.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{v.status ?? "active"}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
            </div>

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
                      <button
                        onClick={() => { setAutoScheduleModal(true); setAutoScheduleError(""); setAutoScheduleSelected(new Set()); }}
                        className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition"
                        title="Auto-generate schedule entries from pending citizen pickup requests"
                      >
                        <Zap size={15} /> Auto from requests
                        {(() => { const cIds = new Set(citizens.map(c => c.user_id)); const n = pickupRequests.filter(r => r.status === "Pending" && r.preferred_date && cIds.has(r.user_id)).length; return n > 0 ? <span className="ml-1 bg-white text-amber-700 text-xs font-bold rounded-full px-1.5 py-0.5 leading-none">{n}</span> : null; })()}
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
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${task.status === "Completed" ? "bg-emerald-100 text-emerald-700" : task.status === "In Progress" ? "bg-blue-100 text-blue-700" : task.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                                    {task.status}
                                  </span>
                                  <div className="flex items-center gap-1 flex-wrap justify-end">
                                    <button
                                      onClick={() => handlePublishToggle(task.id, !task.published)}
                                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold border transition ${task.published ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                                    >
                                      {task.published ? <><Check size={11} /> Published</> : <><Bell size={11} /> Publish</>}
                                    </button>
                                    <button onClick={() => openScheduleModal(task)} className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 border border-gray-200 hover:bg-gray-100 transition">
                                      <Edit3 size={11} /> Edit
                                    </button>
                                    <button onClick={() => handleDeleteScheduleTask(task.id)} className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-red-600 border border-red-100 hover:bg-red-50 transition">
                                      <Trash2 size={11} /> Delete
                                    </button>
                                  </div>
                                </div>
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
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          <button
                            onClick={() => handlePublishToggle(task.id, !task.published)}
                            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold border transition ${task.published ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                          >
                            {task.published ? <><Check size={12} /> Published</> : <><Bell size={12} /> Publish</>}
                          </button>
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
                {assignmentError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-xl">{assignmentError}</div>
                )}
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Driver</label>
                    <select value={assignmentDriverId} onChange={(e) => setAssignmentDriverId(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option value="">Select driver</option>
                      {companyDrivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>{driver.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Vehicle</label>
                    <select value={assignmentVehicleId} onChange={(e) => setAssignmentVehicleId(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option value="">Select vehicle</option>
                      {companyVehicles.map((v) => (
                        <option key={v.id} value={v.id}>{v.plate_number} — {v.model}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Zone</label>
                    <select value={assignmentZone} onChange={(e) => setAssignmentZone(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option value="">Select zone</option>
                      {assignmentZones.map((zone) => <option key={zone}>{zone}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Notes (optional)</label>
                    <input
                      type="text"
                      value={assignmentNotes}
                      onChange={e => setAssignmentNotes(e.target.value)}
                      placeholder="e.g. Morning shift, heavy loads..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => void handleCreateAssignment()}
                  disabled={assignmentSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition disabled:opacity-60"
                >
                  {assignmentSaving
                    ? <><div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" /> Saving…</>
                    : <><Plus size={15} /> Save assignment</>}
                </button>
              </div>
            </Card>

            <Card title="Saved Assignments" icon={<ClipboardList size={16} className="text-indigo-600" />}>
              {assignments.length === 0 ? (
                <p className="text-sm text-gray-400">No assignments saved yet.</p>
              ) : (
                <div className="space-y-3">
                  {assignments.map((a) => (
                    <div key={a.id} className="rounded-2xl bg-gray-50 border border-gray-100 p-4 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900">{a.driver_name ?? `Driver #${a.driver_id}`}</p>
                          <p className="text-xs text-gray-500">Vehicle: {a.vehicle_plate ?? `#${a.vehicle_id}`}{a.vehicle_model ? ` — ${a.vehicle_model}` : ""}</p>
                          <p className="text-xs text-gray-500">Zone: {a.zone}</p>
                          {a.notes && <p className="text-xs text-gray-400 italic">"{a.notes}"</p>}
                          <p className="text-[11px] text-gray-400">
                            Saved {a.created_at ? new Date(a.created_at).toLocaleString() : "—"}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => {
                              setEditAssignmentTarget(a);
                              setEditAssignmentDriverId(String(a.driver_id));
                              setEditAssignmentVehicleId(String(a.vehicle_id));
                              setEditAssignmentZone(a.zone);
                              setEditAssignmentNotes(a.notes ?? "");
                              setEditAssignmentError("");
                            }}
                            className="px-2.5 py-1 text-teal-700 border border-teal-200 rounded-lg text-xs font-medium hover:bg-teal-50 transition flex items-center gap-1"
                          >
                            <Edit3 size={11} /> Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (!application?.id) return;
                              setAssignments(prev => prev.filter(x => x.id !== a.id));
                              try { await api.assignments.remove(a.id, application.id); }
                              catch { setAssignments(prev => [a, ...prev]); }
                            }}
                            className="px-2.5 py-1 text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-50 transition flex items-center gap-1"
                          >
                            <Trash2 size={11} /> Delete
                          </button>
                        </div>
                      </div>
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
                          <button
                            onClick={async () => {
                              setComplaints(prev => prev.filter(x => x.id !== c.id));
                              try { await api.complaints.remove(c.id); }
                              catch { setComplaints(prev => [c, ...prev].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())); }
                            }}
                            className="px-3 py-1.5 text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-50 transition flex items-center gap-1"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* ── Pickup Requests Section ── */}
          <div className={`scroll-mt-28 ${activeSection !== "top-section" && activeSection !== "pickup-requests-section" ? "hidden" : ""}`} id="pickup-requests-section">
            <Card
              title={`Pickup Requests — ${companyDistrict?.name || application.district || "Your District"}`}
              icon={<PackagePlus size={16} className="text-amber-600" />}
            >
              {/* Stats row */}
              <>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Total", value: pickupRequests.length, color: "text-amber-600 bg-amber-50" },
                    { label: "New", value: pickupRequests.filter(r => r.status === "Pending").length, color: "text-orange-600 bg-orange-50" },
                    { label: "In Progress", value: pickupRequests.filter(r => r.status === "In Progress").length, color: "text-blue-600 bg-blue-50" },
                    { label: "Completed", value: pickupRequests.filter(r => r.status === "Resolved").length, color: "text-green-600 bg-green-50" },
                  ].map(s => (
                    <div key={s.label} className={`${s.color} rounded-xl p-3 text-center`}>
                      <p className="text-xl font-bold">{s.value}</p>
                      <p className="text-xs">{s.label}</p>
                    </div>
                  ))}
                </div>

                {pickupRequestsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-500" />
                  </div>
                ) : pickupRequestsError ? (
                  <p className="text-sm text-red-500">{pickupRequestsError}</p>
                ) : !application.district ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    Set your working district to see pickup requests from citizens in your area.
                  </div>
                ) : pickupRequests.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
                    <PackagePlus size={32} className="mx-auto mb-2 opacity-30" />
                    No pickup requests yet from citizens in {companyDistrict?.name || application.district}.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[...pickupRequests].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()).map(r => (
                      <div key={r.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {/* Header row */}
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-mono text-xs text-gray-400">#{r.id}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                r.priority === "Urgent" ? "bg-red-100 text-red-700" :
                                r.priority === "High" ? "bg-orange-100 text-orange-700" :
                                r.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                "bg-green-100 text-green-700"
                              }`}>{r.priority}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                r.status === "Resolved" ? "bg-green-100 text-green-700" :
                                r.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                                r.status === "Cancelled" ? "bg-gray-100 text-gray-500" :
                                "bg-yellow-100 text-yellow-700"
                              }`}>{r.status}</span>
                            </div>

                            {/* Citizen info */}
                            <p className="font-semibold text-gray-900 text-sm">{r.full_name ?? "Unknown citizen"}</p>
                            <p className="text-xs text-gray-500">{[r.zone, r.sector, r.district].filter(Boolean).join(", ") || "—"}</p>

                            {/* Pickup details */}
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                              {r.preferred_date && (
                                <span className="flex items-center gap-1">
                                  <CalendarDays size={11} className="text-amber-500" />
                                  {new Date(r.preferred_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </span>
                              )}
                              {r.preferred_time && (
                                <span className="flex items-center gap-1">
                                  <Clock size={11} className="text-amber-500" /> {r.preferred_time}
                                </span>
                              )}
                            </div>

                            {r.notes && (
                              <p className="text-xs text-gray-500 mt-1.5 italic">"{r.notes}"</p>
                            )}

                            {r.assigned_driver && (
                              <p className="text-xs text-green-700 mt-1">Assigned driver: {r.assigned_driver}</p>
                            )}
                            {r.resolution_note && (
                              <p className="text-xs text-blue-700 mt-1 bg-blue-50 rounded px-2 py-1">Response: {r.resolution_note}</p>
                            )}

                            <p className="text-xs text-gray-400 mt-1">
                              Submitted: {r.created_at ? new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 flex-shrink-0">
                            {r.status !== "Resolved" && r.status !== "Cancelled" && (
                              <button
                                onClick={() => {
                                  setPickupRespondTarget(r);
                                  setPickupRespondNote(r.resolution_note ?? "");
                                  setPickupRespondDriver(r.assigned_driver ?? "");
                                  setPickupRespondStatus("In Progress");
                                  setPickupRespondError("");
                                }}
                                className="px-3 py-1.5 text-amber-700 border border-amber-200 rounded-lg text-xs font-medium hover:bg-amber-50 transition flex items-center gap-1"
                              >
                                <CheckCircle2 size={12} /> Respond
                              </button>
                            )}
                            <button
                              onClick={async () => {
                                setPickupRequests(prev => prev.filter(x => x.id !== r.id));
                                try { await api.pickupRequests.remove(r.id); }
                                catch { setPickupRequests(prev => [r, ...prev].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())); }
                              }}
                              className="px-3 py-1.5 text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-50 transition flex items-center gap-1"
                            >
                              <Trash2 size={12} /> Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            </Card>
          </div>

          {/* ── Chat Section ── */}
          <div className={`scroll-mt-28 ${activeSection !== "top-section" && activeSection !== "chat-section" ? "hidden" : ""}`} id="chat-section">
            <Card title="Citizen Chat" icon={<MessageCircle size={16} className="text-blue-500" />}>
              <div className="flex gap-0 h-[520px] -m-2">
                {/* Left: conversation list */}
                <div className="w-60 flex-shrink-0 flex flex-col border-r border-gray-100 p-2 pr-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Conversations</p>
                    <button
                      onClick={() => {
                        if (!application) return;
                        void api.chat.conversations(application.id).then(r => setChatConversations(r.conversations)).catch(() => undefined);
                      }}
                      className="text-xs text-green-700 hover:underline"
                    >
                      Refresh
                    </button>
                  </div>
                  {chatLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-green-600" />
                    </div>
                  ) : chatConversations.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                      <MessageCircle size={28} className="mx-auto mb-2 opacity-25" />
                      <p className="text-xs">No messages yet.<br />Citizens can message you from their dashboard.</p>
                    </div>
                  ) : (
                    <div className="space-y-1 overflow-y-auto flex-1">
                      {chatConversations.map(conv => (
                        <button
                          key={conv.citizen_user_id}
                          onClick={() => { setSelectedCitizenId(conv.citizen_user_id); setChatMessages([]); setChatError(""); }}
                          className={`w-full text-left p-3 rounded-xl transition ${selectedCitizenId === conv.citizen_user_id ? "bg-green-50 border border-green-200" : "hover:bg-gray-50 border border-transparent"}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs flex-shrink-0">
                              {conv.citizen_name[0]?.toUpperCase() ?? "C"}
                            </div>
                            <p className="text-sm font-medium text-gray-800 truncate">{conv.citizen_name}</p>
                          </div>
                          <p className="text-xs text-gray-500 truncate pl-9">{conv.last_message}</p>
                          <p className="text-xs text-gray-400 pl-9 mt-0.5">
                            {conv.last_at ? new Date(conv.last_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: message thread */}
                <div className="flex-1 flex flex-col min-w-0 p-2 pl-4">
                  {!selectedCitizenId ? (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <MessageCircle size={44} className="mx-auto mb-3 opacity-15" />
                        <p className="text-sm">Select a conversation to view messages</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Header */}
                      <div className="pb-3 mb-3 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                            {(chatConversations.find(c => c.citizen_user_id === selectedCitizenId)?.citizen_name ?? "C")[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {chatConversations.find(c => c.citizen_user_id === selectedCitizenId)?.citizen_name ?? `Citizen #${selectedCitizenId}`}
                            </p>
                            <p className="text-xs text-gray-400">Citizen</p>
                          </div>
                        </div>
                        <button onClick={() => { setSelectedCitizenId(null); setChatMessages([]); }} className="text-gray-400 hover:text-gray-600 transition">
                          <X size={16} />
                        </button>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                        {chatMessagesLoading && chatMessages.length === 0 ? (
                          <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-green-600" />
                          </div>
                        ) : chatMessages.length === 0 ? (
                          <p className="text-sm text-gray-400 text-center py-4">No messages yet. Send the first reply.</p>
                        ) : (
                          chatMessages.map(msg => {
                            const isCompany = msg.sender_role === "company";
                            const isHovered = chatHoveredMsgId === msg.id;
                            const isEditing = chatEditingId === msg.id;
                            return (
                              <div
                                key={msg.id}
                                className={`flex items-end gap-1 ${isCompany ? "justify-end" : "justify-start"}`}
                                onMouseEnter={() => setChatHoveredMsgId(msg.id)}
                                onMouseLeave={() => setChatHoveredMsgId(null)}
                              >
                                {/* Edit + Delete toolbar — left of company bubble, appears on hover */}
                                {isCompany && !isEditing && (
                                  <div className={`flex gap-0.5 flex-shrink-0 transition-opacity ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                                    <button
                                      onClick={() => startChatEdit(msg)}
                                      title="Edit message"
                                      className="p-1 rounded-lg text-gray-400 hover:text-green-700 hover:bg-green-50 transition"
                                    >
                                      <Edit3 size={13} />
                                    </button>
                                    <button
                                      onClick={() => void handleDeleteChatMessage(msg)}
                                      title="Delete message"
                                      className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                )}

                                {isEditing ? (
                                  /* Inline edit mode */
                                  <div className="flex flex-col gap-1 max-w-[78%]">
                                    <textarea
                                      value={chatEditText}
                                      onChange={e => setChatEditText(e.target.value)}
                                      onKeyDown={e => {
                                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void saveChatEdit(msg); }
                                        if (e.key === "Escape") cancelChatEdit();
                                      }}
                                      autoFocus
                                      rows={2}
                                      className="w-full px-3 py-2 text-sm border border-green-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 resize-none"
                                    />
                                    <div className="flex gap-1 justify-end">
                                      <button
                                        onClick={() => void saveChatEdit(msg)}
                                        title="Save"
                                        className="p-1.5 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
                                      >
                                        <Check size={13} />
                                      </button>
                                      <button
                                        onClick={cancelChatEdit}
                                        title="Cancel"
                                        className="p-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition"
                                      >
                                        <X size={13} />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${isCompany ? "bg-green-700 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                                    <p className="text-sm leading-relaxed">{msg.message}</p>
                                    <p className={`text-[11px] mt-1 ${isCompany ? "text-green-200" : "text-gray-400"}`}>
                                      {msg.sender_name ?? (isCompany ? application.company_name : "Citizen")}
                                      {msg.created_at ? ` · ${new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Reply input */}
                      {chatError && <p className="text-xs text-red-500 mt-1">{chatError}</p>}
                      <div className="mt-3 flex gap-2">
                        <input
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void handleChatReply(); } }}
                          placeholder="Type a reply and press Enter…"
                          disabled={chatSending}
                          className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-60"
                        />
                        <button
                          onClick={() => void handleChatReply()}
                          disabled={chatSending || !chatInput.trim()}
                          className="rounded-xl bg-green-700 px-4 py-2.5 text-white hover:bg-green-800 transition disabled:opacity-50 flex items-center gap-1.5 text-sm font-semibold flex-shrink-0"
                        >
                          {chatSending ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" /> : <Send size={15} />}
                          Send
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* ── Citizens Section ── */}
          <div className={`scroll-mt-28 ${activeSection !== "top-section" && activeSection !== "citizens-section" ? "hidden" : ""}`} id="citizens-section">
            <Card title={`Citizens — ${companyDistrict?.name || application.district || "Your District"}`} icon={<Users size={16} className="text-emerald-600" />}>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Total", value: citizens.length, color: "text-emerald-600 bg-emerald-50" },
                  { label: "Active", value: citizens.filter(c => c.status === "Active").length, color: "text-green-600 bg-green-50" },
                  { label: "Residents", value: citizens.reduce((sum, c) => sum + (c.residents ?? 0), 0), color: "text-blue-600 bg-blue-50" },
                ].map(s => (
                  <div key={s.label} className={`${s.color} rounded-xl p-3 text-center`}>
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <input
                  value={citizenSearch}
                  onChange={e => setCitizenSearch(e.target.value)}
                  placeholder="Search by name, email, sector or cell…"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {citizensLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-600" />
                </div>
              ) : citizensError ? (
                <p className="text-sm text-red-500">{citizensError}</p>
              ) : !application.district ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  Set your working district above to see citizens registered in your area.
                </div>
              ) : citizens.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
                  <Users size={32} className="mx-auto mb-2 opacity-30" />
                  No citizens found in {companyDistrict?.name || application.district}.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                      <tr>
                        {["Name", "Email", "Phone", "Sector", "Cell", "House Type", "Residents", "Status"].map(h => (
                          <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {citizens
                        .filter(c => {
                          const q = citizenSearch.toLowerCase();
                          return !q || c.full_name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q) || c.cell.toLowerCase().includes(q);
                        })
                        .map(c => (
                          <tr key={c.id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{c.full_name}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.email}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.telephone}</td>
                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.sector}</td>
                            <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.cell}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap capitalize">{c.house_type.toLowerCase()}</td>
                            <td className="px-4 py-3 text-gray-600 text-center whitespace-nowrap">{c.residents}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.status === "Active" ? "bg-green-100 text-green-700" : c.status === "Suspended" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
                                {c.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          {/* ── Settings Section ── */}
          <div className={`scroll-mt-28 ${activeSection !== "top-section" && activeSection !== "settings-section" ? "hidden" : ""}`} id="settings-section">
            <Card title="Settings — Driver Management" icon={<Settings size={16} className="text-gray-600" />}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">{companyDrivers.length} driver{companyDrivers.length !== 1 ? "s" : ""} registered</p>
                <button
                  onClick={() => setAddDriverModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition"
                >
                  <Plus size={15} /> Add Driver
                </button>
              </div>

              {companyDrivers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-400">
                  No drivers yet. Click &quot;Add Driver&quot; to get started.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                      <tr>
                        {["Name", "Phone", "Email", "License", "Zone", "Experience", "Status", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {companyDrivers.map(driver => (
                        <tr key={driver.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{driver.name}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{driver.phone}</td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{driver.email ?? "—"}</td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{driver.license_number ?? "—"}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{driver.zone ?? "—"}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{driver.years_of_experience ?? 0} yrs</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${driver.status === "active" ? "bg-green-100 text-green-700" : driver.status === "suspended" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {driver.status ?? "active"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => openEditDriver(driver)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition" title="Edit"><Edit3 size={14} /></button>
                              <button onClick={() => void handleDeleteDriver(driver)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* Vehicle Management — same layout as drivers */}
            <Card title="Settings — Vehicle Management" icon={<Car size={16} className="text-purple-600" />}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">{companyVehicles.length} vehicle{companyVehicles.length !== 1 ? "s" : ""} registered</p>
                <button
                  onClick={() => setAddVehicleModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition"
                >
                  <Plus size={15} /> Add Vehicle
                </button>
              </div>

              {companyVehicles.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-400">
                  No vehicles yet. Click &quot;Add Vehicle&quot; to get started.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                      <tr>
                        {["Plate", "Model", "Year", "Capacity", "Zone", "Insurance", "Status", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {companyVehicles.map(v => (
                        <tr key={v.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{v.plate_number}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{v.model}</td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{v.year ?? "—"}</td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{v.capacity ?? "—"}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{v.assigned_zone ?? "—"}</td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{v.insurance_number ?? "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${v.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {v.status ?? "active"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => openEditVehicle(v)} className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition" title="Edit"><Edit3 size={14} /></button>
                              <button onClick={() => void handleDeleteVehicle(v)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

          {/* Edit assignment modal */}
          {editAssignmentTarget && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="font-bold text-gray-800">Edit Assignment</h3>
                  <button onClick={() => setEditAssignmentTarget(null)} disabled={editAssignmentSaving}>
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {editAssignmentError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-xl">{editAssignmentError}</div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Driver</label>
                    <select
                      value={editAssignmentDriverId}
                      onChange={e => setEditAssignmentDriverId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select driver</option>
                      {companyDrivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Vehicle</label>
                    <select
                      value={editAssignmentVehicleId}
                      onChange={e => setEditAssignmentVehicleId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select vehicle</option>
                      {companyVehicles.map(v => <option key={v.id} value={v.id}>{v.plate_number} — {v.model}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Zone</label>
                    <select
                      value={editAssignmentZone}
                      onChange={e => setEditAssignmentZone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select zone</option>
                      {assignmentZones.map(zone => <option key={zone}>{zone}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Notes (optional)</label>
                    <input
                      type="text"
                      value={editAssignmentNotes}
                      onChange={e => setEditAssignmentNotes(e.target.value)}
                      placeholder="e.g. Morning shift..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditAssignmentTarget(null)}
                      disabled={editAssignmentSaving}
                      className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => void handleEditAssignment()}
                      disabled={editAssignmentSaving}
                      className="flex-1 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {editAssignmentSaving ? <><div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" /> Saving…</> : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Respond to pickup request modal */}
          {pickupRespondTarget && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="font-bold text-gray-800">Respond to Pickup Request</h3>
                  <button onClick={() => setPickupRespondTarget(null)} disabled={pickupRespondSaving}>
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-amber-50 rounded-xl p-3">
                    <p className="font-medium text-gray-800 text-sm">
                      Pickup Request #{pickupRespondTarget.id}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {pickupRespondTarget.full_name ?? "—"} • {pickupRespondTarget.zone ?? pickupRespondTarget.district ?? "—"}
                    </p>
                    {pickupRespondTarget.preferred_date && (
                      <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                        <CalendarDays size={11} className="text-amber-500" />
                        {new Date(pickupRespondTarget.preferred_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        {pickupRespondTarget.preferred_time && ` · ${pickupRespondTarget.preferred_time}`}
                      </p>
                    )}
                    {pickupRespondTarget.notes && (
                      <p className="text-xs text-gray-500 mt-1 italic">"{pickupRespondTarget.notes}"</p>
                    )}
                  </div>

                  {pickupRespondError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-xl">
                      {pickupRespondError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Update Status</label>
                    <select
                      value={pickupRespondStatus}
                      onChange={e => setPickupRespondStatus(e.target.value as "In Progress" | "Resolved")}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Assigned Driver (optional)</label>
                    <input
                      type="text"
                      value={pickupRespondDriver}
                      onChange={e => setPickupRespondDriver(e.target.value)}
                      placeholder="Driver name..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Response Note <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={pickupRespondNote}
                      onChange={e => setPickupRespondNote(e.target.value)}
                      rows={3}
                      placeholder="Confirm pickup time, provide instructions, or explain next steps..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setPickupRespondTarget(null)}
                      disabled={pickupRespondSaving}
                      className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePickupRespond}
                      disabled={pickupRespondSaving}
                      className="flex-1 py-2 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {pickupRespondSaving ? <><div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" /> Sending…</> : "Send Response"}
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
                    <select
                      value={scheduleForm.driver}
                      onChange={(e) => setScheduleForm((current) => ({ ...current, driver: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select driver</option>
                      {companyDrivers.map((driver) => <option key={driver.id} value={driver.name}>{driver.name}</option>)}
                    </select>
                    {scheduleForm.driver && (() => {
                      const d = companyDrivers.find(x => x.name === scheduleForm.driver);
                      return d?.phone ? (
                        <p className="text-xs text-gray-500 flex items-center gap-1 pl-1">
                          <Phone size={12} className="text-gray-400" /> {d.phone}
                        </p>
                      ) : null;
                    })()}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Vehicle</label>
                    <select value={scheduleForm.vehicle} onChange={(e) => setScheduleForm((current) => ({ ...current, vehicle: e.target.value }))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">Select vehicle</option>
                      {companyVehicles.map((v, index) => <option key={`${v.plate_number || "vehicle"}-${index}`} value={v.plate_number || `Vehicle ${index + 1}`}>{v.plate_number || `Vehicle ${index + 1}`}</option>)}
                    </select>
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Start time</label>
                    <input value={scheduleForm.startTime} onChange={(e) => setScheduleForm((current) => ({ ...current, startTime: e.target.value }))} type="time" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
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

      {editDriverModal && editDriverTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="font-bold text-gray-900">Edit Driver</h3>
              <button onClick={() => { setEditDriverModal(false); setEditDriverError(""); }} className="rounded-lg p-1 hover:bg-gray-100 transition">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {editDriverError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{editDriverError}</p>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input value={editDriverForm.name} onChange={(e) => setEditDriverForm(f => ({ ...f, name: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                  <input value={editDriverForm.phone} onChange={(e) => setEditDriverForm(f => ({ ...f, phone: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={editDriverForm.email} onChange={(e) => setEditDriverForm(f => ({ ...f, email: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">License No.</label>
                  <input value={editDriverForm.licenseNumber} onChange={(e) => setEditDriverForm(f => ({ ...f, licenseNumber: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">National ID</label>
                  <input value={editDriverForm.nationalId} onChange={(e) => setEditDriverForm(f => ({ ...f, nationalId: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Years of Experience</label>
                  <input type="number" min="0" value={editDriverForm.yearsOfExperience} onChange={(e) => setEditDriverForm(f => ({ ...f, yearsOfExperience: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Zone</label>
                  <select value={editDriverForm.zone} onChange={(e) => setEditDriverForm(f => ({ ...f, zone: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    {(mapped.serviceAreas.length > 0 ? mapped.serviceAreas : ["Kicukiro", "Gasabo", "Nyarugenge", "Remera", "Bugesera", "Huye"]).map((z) => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end border-t px-6 py-4">
              <button onClick={() => { setEditDriverModal(false); setEditDriverError(""); }} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleEditDriver} disabled={editDriverSaving} className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 transition disabled:opacity-60">
                {editDriverSaving && <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                {editDriverSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editVehicleModal && editVehicleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="font-bold text-gray-900">Edit Vehicle</h3>
              <button onClick={() => { setEditVehicleModal(false); setEditVehicleError(""); }} className="rounded-lg p-1 hover:bg-gray-100 transition"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {editVehicleError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{editVehicleError}</p>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Plate Number <span className="text-red-500">*</span></label>
                  <input value={editVehicleForm.plate_number} onChange={e => setEditVehicleForm(f => ({ ...f, plate_number: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Model <span className="text-red-500">*</span></label>
                  <input value={editVehicleForm.model} onChange={e => setEditVehicleForm(f => ({ ...f, model: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                  <input value={editVehicleForm.year} onChange={e => setEditVehicleForm(f => ({ ...f, year: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Capacity</label>
                  <input value={editVehicleForm.capacity} onChange={e => setEditVehicleForm(f => ({ ...f, capacity: e.target.value }))} placeholder="e.g. 5 tons" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Insurance No.</label>
                  <input value={editVehicleForm.insurance_number} onChange={e => setEditVehicleForm(f => ({ ...f, insurance_number: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Assigned Zone</label>
                  <select value={editVehicleForm.assigned_zone} onChange={e => setEditVehicleForm(f => ({ ...f, assigned_zone: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {(mapped.serviceAreas.length > 0 ? mapped.serviceAreas : ["Kicukiro", "Gasabo", "Nyarugenge", "Remera", "Bugesera", "Huye"]).map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end border-t px-6 py-4">
              <button onClick={() => { setEditVehicleModal(false); setEditVehicleError(""); }} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleEditVehicle} disabled={editVehicleSaving} className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition disabled:opacity-60">
                {editVehicleSaving && <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                {editVehicleSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {addVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="font-bold text-gray-900">Add Vehicle</h3>
              <button onClick={() => { setAddVehicleModal(false); setAddVehicleError(""); }} className="rounded-lg p-1 hover:bg-gray-100 transition"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {addVehicleError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{addVehicleError}</p>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Plate Number <span className="text-red-500">*</span></label>
                  <input value={addVehicleForm.plate_number} onChange={e => setAddVehicleForm(f => ({ ...f, plate_number: e.target.value }))} placeholder="e.g. RAB 123 A" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Model <span className="text-red-500">*</span></label>
                  <input value={addVehicleForm.model} onChange={e => setAddVehicleForm(f => ({ ...f, model: e.target.value }))} placeholder="e.g. Isuzu NPR" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                  <input value={addVehicleForm.year} onChange={e => setAddVehicleForm(f => ({ ...f, year: e.target.value }))} placeholder="e.g. 2020" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Capacity</label>
                  <input value={addVehicleForm.capacity} onChange={e => setAddVehicleForm(f => ({ ...f, capacity: e.target.value }))} placeholder="e.g. 5 tons" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Insurance No.</label>
                  <input value={addVehicleForm.insurance_number} onChange={e => setAddVehicleForm(f => ({ ...f, insurance_number: e.target.value }))} placeholder="INS-2024-001" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Assigned Zone</label>
                  <select value={addVehicleForm.assigned_zone} onChange={e => setAddVehicleForm(f => ({ ...f, assigned_zone: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {(mapped.serviceAreas.length > 0 ? mapped.serviceAreas : ["Kicukiro", "Gasabo", "Nyarugenge", "Remera", "Bugesera", "Huye"]).map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end border-t px-6 py-4">
              <button onClick={() => { setAddVehicleModal(false); setAddVehicleError(""); }} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleAddVehicle} disabled={addVehicleSaving} className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition disabled:opacity-60">
                {addVehicleSaving && <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                {addVehicleSaving ? "Saving..." : "Add Vehicle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Auto-Schedule Modal ── */}
      {autoScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-amber-600" />
                <h3 className="font-bold text-gray-900">Auto-generate Schedule</h3>
              </div>
              <button onClick={() => setAutoScheduleModal(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-4">
              {(["requests", "citizens"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => { setAutoScheduleTab(tab); setAutoScheduleError(""); }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${autoScheduleTab === tab ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {tab === "requests" ? (() => { const cIds = new Set(citizens.map(c => c.user_id)); const n = pickupRequests.filter(r => r.status === "Pending" && r.preferred_date && cIds.has(r.user_id)).length; return `From Pickup Requests${n > 0 ? ` (${n})` : ""}`; })() : `From My Citizens${citizens.length > 0 ? ` (${citizens.length})` : ""}`}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Shared: Driver + Vehicle */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Assign Driver (optional)</label>
                  <select value={autoScheduleDriver} onChange={e => setAutoScheduleDriver(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="">No driver assigned</option>
                    {companyDrivers.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Assign Vehicle (optional)</label>
                  <select value={autoScheduleVehicle} onChange={e => setAutoScheduleVehicle(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="">No vehicle assigned</option>
                    {companyVehicles.map(v => <option key={v.id} value={v.plate_number}>{v.plate_number} — {v.model}</option>)}
                  </select>
                </div>
              </div>

              {/* ── Tab: From Pickup Requests ── */}
              {autoScheduleTab === "requests" && (() => {
                const citizenUserIds = new Set(citizens.map(c => c.user_id));
                const eligible = pickupRequests.filter(r => r.status === "Pending" && r.preferred_date && citizenUserIds.has(r.user_id));
                if (eligible.length === 0) return (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-400">
                    <PackagePlus size={32} className="mx-auto mb-2 opacity-30" />
                    No pending pickup requests from your citizens yet.
                  </div>
                );
                return (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{eligible.length} eligible request{eligible.length !== 1 ? "s" : ""}</p>
                      <button onClick={() => setAutoScheduleSelected(autoScheduleSelected.size === eligible.length ? new Set() : new Set(eligible.map(r => r.id)))} className="text-xs text-amber-700 font-medium hover:underline">
                        {autoScheduleSelected.size === eligible.length ? "Deselect all" : "Select all"}
                      </button>
                    </div>
                    {eligible.map(r => {
                      const checked = autoScheduleSelected.has(r.id);
                      return (
                        <label key={r.id} className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${checked ? "border-amber-300 bg-amber-50" : "border-gray-100 bg-gray-50 hover:bg-gray-100"}`}>
                          <input type="checkbox" checked={checked} onChange={() => { const n = new Set(autoScheduleSelected); checked ? n.delete(r.id) : n.add(r.id); setAutoScheduleSelected(n); }} className="mt-0.5 accent-amber-600" />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900 text-sm">{r.full_name ?? "Unknown"}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.priority === "Urgent" ? "bg-red-100 text-red-700" : r.priority === "High" ? "bg-orange-100 text-orange-700" : "bg-yellow-100 text-yellow-700"}`}>{r.priority}</span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><CalendarDays size={11} className="text-amber-500" />{new Date(r.preferred_date!).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                              {r.preferred_time && <span className="flex items-center gap-1"><Clock size={11} className="text-amber-500" />{r.preferred_time}</span>}
                              {r.sector && <span>{r.sector}</span>}
                            </div>
                            {r.notes && <p className="text-xs text-gray-400 mt-1 italic">&ldquo;{r.notes}&rdquo;</p>}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                );
              })()}

              {/* ── Tab: From Citizens ── */}
              {autoScheduleTab === "citizens" && (() => {
                const filteredCitizens = citizens.filter(c =>
                  !autoScheduleCitizenSearch ||
                  c.full_name?.toLowerCase().includes(autoScheduleCitizenSearch.toLowerCase()) ||
                  c.sector?.toLowerCase().includes(autoScheduleCitizenSearch.toLowerCase()) ||
                  c.cell?.toLowerCase().includes(autoScheduleCitizenSearch.toLowerCase())
                );
                return (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">Select citizens from your district. One schedule entry will be created per sector on the date you choose.</p>

                    {/* Date + Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Schedule Date</label>
                        <input type="date" value={autoScheduleCitizenDate} onChange={e => setAutoScheduleCitizenDate(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Start Time</label>
                        <input type="time" value={autoScheduleCitizenTime} onChange={e => setAutoScheduleCitizenTime(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      </div>
                    </div>

                    {citizensLoading ? (
                      <div className="flex justify-center py-6"><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-amber-500" /></div>
                    ) : citizens.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-400">
                        <Users size={32} className="mx-auto mb-2 opacity-30" />
                        No citizens found in your district yet.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Search + Select all */}
                        <div className="flex gap-3 items-center">
                          <input
                            type="text"
                            placeholder="Search by name, sector or cell…"
                            value={autoScheduleCitizenSearch}
                            onChange={e => setAutoScheduleCitizenSearch(e.target.value)}
                            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <button onClick={() => setAutoScheduleCitizenSelected(autoScheduleCitizenSelected.size === filteredCitizens.length ? new Set() : new Set(filteredCitizens.map(c => c.id)))} className="text-xs text-amber-700 font-medium hover:underline whitespace-nowrap">
                            {autoScheduleCitizenSelected.size === filteredCitizens.length ? "Deselect all" : "Select all"}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">{autoScheduleCitizenSelected.size} of {citizens.length} selected</p>
                        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                          {filteredCitizens.map(c => {
                            const checked = autoScheduleCitizenSelected.has(c.id);
                            return (
                              <label key={c.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${checked ? "border-amber-300 bg-amber-50" : "border-gray-100 bg-gray-50 hover:bg-gray-100"}`}>
                                <input type="checkbox" checked={checked} onChange={() => { const n = new Set(autoScheduleCitizenSelected); checked ? n.delete(c.id) : n.add(c.id); setAutoScheduleCitizenSelected(n); }} className="accent-amber-600 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{c.full_name}</p>
                                  <p className="text-xs text-gray-500">{[c.sector, c.cell, c.village].filter(Boolean).join(" · ") || "—"}</p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {autoScheduleError && (
                <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{autoScheduleError}</div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 gap-3">
              <span className="text-sm text-gray-500">
                {autoScheduleTab === "requests"
                  ? `${autoScheduleSelected.size} request${autoScheduleSelected.size !== 1 ? "s" : ""} selected`
                  : `${autoScheduleCitizenSelected.size} citizen${autoScheduleCitizenSelected.size !== 1 ? "s" : ""} selected`}
              </span>
              <div className="flex gap-3">
                <button onClick={() => setAutoScheduleModal(false)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                <button
                  onClick={() => void (autoScheduleTab === "requests" ? handleAutoSchedule() : handleAutoScheduleFromCitizens())}
                  disabled={autoScheduleSaving || (autoScheduleTab === "requests" ? autoScheduleSelected.size === 0 : autoScheduleCitizenSelected.size === 0)}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {autoScheduleSaving
                    ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating…</>
                    : <><Zap size={15} /> Generate Schedules</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {addDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="font-bold text-gray-900">Add Driver</h3>
              <button onClick={() => { setAddDriverModal(false); setAddDriverError(""); }} className="rounded-lg p-1 hover:bg-gray-100 transition">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {addDriverError && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{addDriverError}</p>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input value={addDriverForm.name} onChange={(e) => setAddDriverForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Jean Baptiste" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                  <input value={addDriverForm.phone} onChange={(e) => setAddDriverForm((f) => ({ ...f, phone: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. 0788000000" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={addDriverForm.email} onChange={(e) => setAddDriverForm((f) => ({ ...f, email: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="driver@email.com" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">License No.</label>
                  <input value={addDriverForm.licenseNumber} onChange={(e) => setAddDriverForm((f) => ({ ...f, licenseNumber: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. RW-2024-001" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">National ID</label>
                  <input value={addDriverForm.nationalId} onChange={(e) => setAddDriverForm((f) => ({ ...f, nationalId: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="16-digit ID" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Years of Experience</label>
                  <input type="number" min="0" value={addDriverForm.yearsOfExperience} onChange={(e) => setAddDriverForm((f) => ({ ...f, yearsOfExperience: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. 3" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Zone</label>
                  <select value={addDriverForm.zone} onChange={(e) => setAddDriverForm((f) => ({ ...f, zone: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    {(mapped.serviceAreas.length > 0 ? mapped.serviceAreas : ["Kicukiro", "Gasabo", "Nyarugenge", "Remera", "Bugesera", "Huye"]).map((z) => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end border-t px-6 py-4">
              <button onClick={() => { setAddDriverModal(false); setAddDriverError(""); }} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleAddDriver} disabled={addDriverSaving} className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 transition disabled:opacity-60">
                {addDriverSaving && <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                {addDriverSaving ? "Saving..." : "Add Driver"}
              </button>
            </div>
          </div>
        </div>
      )}
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

