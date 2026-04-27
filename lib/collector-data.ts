import { useSyncExternalStore } from 'react';

export interface CitizenComplaint {
  id: string;
  citizenName: string;
  citizenEmail: string;
  zone: string;
  issueType: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'Scheduled' | 'Resolved';
  submittedAt: string;
  scheduledPickup?: string; // ISO date-time assigned by collector
  assignedDriver?: string;
}

export interface PickupSchedule {
  id: string;
  complaintId?: string;
  citizenName: string;
  citizenEmail: string;
  zone: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  assignedDriver: string;
  assignedVehicle: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes: string;
  createdAt: string;
}

export interface CitizenPayment {
  id: string;
  citizenName: string;
  citizenEmail: string;
  zone: string;
  amount: number;
  month: string; // e.g. "January 2025"
  method: 'Mobile Money' | 'Bank Transfer' | 'Cash';
  status: 'Paid' | 'Pending' | 'Overdue';
  paidAt?: string;
}

const COMPLAINTS_KEY = 'collector_citizen_complaints';
const SCHEDULES_KEY  = 'collector_pickup_schedules';
const PAYMENTS_KEY   = 'collector_citizen_payments';
const EVENT          = 'collector-data-change';

const isBrowser = () => typeof window !== 'undefined';

const readJson = <T,>(key: string, fallback: T): T => {
  if (!isBrowser()) return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
};

const writeJson = <T,>(key: string, value: T) => {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(EVENT));
};

// ── Seed demo data on first load ──
const SEED_KEY = 'collector_data_seeded_v2';
export const seedCollectorData = () => {
  if (!isBrowser() || localStorage.getItem(SEED_KEY)) return;

  const complaints: CitizenComplaint[] = [
    { id: 'C1', citizenName: 'Uwimana Marie', citizenEmail: 'marie@example.com', zone: 'Kicukiro', issueType: 'Missed Collection', description: 'Waste was not collected for 3 days in a row.', priority: 'Urgent', status: 'Open', submittedAt: '2025-01-14T08:00:00Z' },
    { id: 'C2', citizenName: 'Habimana Jean', citizenEmail: 'jean@example.com', zone: 'Gasabo', issueType: 'Late Collection', description: 'Collection always arrives 2 hours late.', priority: 'High', status: 'Open', submittedAt: '2025-01-13T10:30:00Z' },
    { id: 'C3', citizenName: 'Mukamana Alice', citizenEmail: 'alice@example.com', zone: 'Nyarugenge', issueType: 'Damaged Bin', description: 'My waste bin was broken during last pickup.', priority: 'Medium', status: 'Scheduled', submittedAt: '2025-01-12T09:00:00Z', scheduledPickup: '2025-01-20T09:00:00Z', assignedDriver: 'John Mutabazi' },
    { id: 'C4', citizenName: 'Niyonzima Paul', citizenEmail: 'paul@example.com', zone: 'Remera', issueType: 'Incomplete Collection', description: 'Some waste was left behind after collection.', priority: 'Low', status: 'Resolved', submittedAt: '2025-01-10T07:00:00Z' },
    { id: 'C5', citizenName: 'Ingabire Grace', citizenEmail: 'grace@example.com', zone: 'Kicukiro', issueType: 'Missed Collection', description: 'No collection for the past week.', priority: 'Urgent', status: 'Open', submittedAt: '2025-01-15T11:00:00Z' },
  ];

  const schedules: PickupSchedule[] = [
    { id: 'S1', complaintId: 'C3', citizenName: 'Mukamana Alice', citizenEmail: 'alice@example.com', zone: 'Nyarugenge', scheduledDate: '2025-01-20', scheduledTime: '09:00', assignedDriver: 'John Mutabazi', assignedVehicle: 'RAB 123 A', status: 'Scheduled', notes: 'Replace bin and collect waste.', createdAt: '2025-01-13T12:00:00Z' },
    { id: 'S2', citizenName: 'Habimana Jean', citizenEmail: 'jean@example.com', zone: 'Gasabo', scheduledDate: '2025-01-18', scheduledTime: '08:00', assignedDriver: 'Eric Niyonzima', assignedVehicle: 'RAB 456 B', status: 'Completed', notes: 'Regular pickup.', createdAt: '2025-01-12T10:00:00Z' },
  ];

  const payments: CitizenPayment[] = [
    { id: 'P1', citizenName: 'Uwimana Marie', citizenEmail: 'marie@example.com', zone: 'Kicukiro', amount: 3000, month: 'January 2025', method: 'Mobile Money', status: 'Paid', paidAt: '2025-01-05T10:00:00Z' },
    { id: 'P2', citizenName: 'Habimana Jean', citizenEmail: 'jean@example.com', zone: 'Gasabo', amount: 3000, month: 'January 2025', method: 'Bank Transfer', status: 'Paid', paidAt: '2025-01-07T14:00:00Z' },
    { id: 'P3', citizenName: 'Mukamana Alice', citizenEmail: 'alice@example.com', zone: 'Nyarugenge', amount: 3000, month: 'January 2025', method: 'Mobile Money', status: 'Pending' },
    { id: 'P4', citizenName: 'Niyonzima Paul', citizenEmail: 'paul@example.com', zone: 'Remera', amount: 3000, month: 'January 2025', method: 'Cash', status: 'Overdue' },
    { id: 'P5', citizenName: 'Ingabire Grace', citizenEmail: 'grace@example.com', zone: 'Kicukiro', amount: 3000, month: 'January 2025', method: 'Mobile Money', status: 'Paid', paidAt: '2025-01-03T09:00:00Z' },
    { id: 'P6', citizenName: 'Uwimana Marie', citizenEmail: 'marie@example.com', zone: 'Kicukiro', amount: 3000, month: 'December 2024', method: 'Mobile Money', status: 'Paid', paidAt: '2024-12-04T10:00:00Z' },
    { id: 'P7', citizenName: 'Habimana Jean', citizenEmail: 'jean@example.com', zone: 'Gasabo', amount: 3000, month: 'December 2024', method: 'Bank Transfer', status: 'Paid', paidAt: '2024-12-06T14:00:00Z' },
  ];

  writeJson(COMPLAINTS_KEY, complaints);
  writeJson(SCHEDULES_KEY, schedules);
  writeJson(PAYMENTS_KEY, payments);
  localStorage.setItem(SEED_KEY, 'true');
};

// ── Getters ──
export const getComplaints  = (): CitizenComplaint[] => readJson(COMPLAINTS_KEY, []);
export const getSchedules   = (): PickupSchedule[]   => readJson(SCHEDULES_KEY, []);
export const getPayments    = (): CitizenPayment[]    => readJson(PAYMENTS_KEY, []);

// ── Mutations ──
export const assignPickup = (
  complaintId: string,
  schedule: Omit<PickupSchedule, 'id' | 'createdAt'>
) => {
  const schedules = getSchedules();
  const newSchedule: PickupSchedule = {
    ...schedule,
    id: `S-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  writeJson(SCHEDULES_KEY, [newSchedule, ...schedules]);

  // Update complaint status
  const complaints = getComplaints();
  writeJson(COMPLAINTS_KEY, complaints.map((c) =>
    c.id === complaintId
      ? { ...c, status: 'Scheduled' as const, scheduledPickup: `${schedule.scheduledDate}T${schedule.scheduledTime}:00Z`, assignedDriver: schedule.assignedDriver }
      : c
  ));
};

export const addSchedule = (schedule: Omit<PickupSchedule, 'id' | 'createdAt'>) => {
  const schedules = getSchedules();
  writeJson(SCHEDULES_KEY, [{ ...schedule, id: `S-${Date.now()}`, createdAt: new Date().toISOString() }, ...schedules]);
};

export const updateScheduleStatus = (id: string, status: PickupSchedule['status']) => {
  writeJson(SCHEDULES_KEY, getSchedules().map((s) => s.id === id ? { ...s, status } : s));
};

export const markPaymentPaid = (id: string) => {
  writeJson(PAYMENTS_KEY, getPayments().map((p) =>
    p.id === id ? { ...p, status: 'Paid' as const, paidAt: new Date().toISOString() } : p
  ));
};

// ── Hooks ──
const subscribe = (cb: () => void) => {
  if (!isBrowser()) return () => undefined;
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => { window.removeEventListener(EVENT, cb); window.removeEventListener('storage', cb); };
};

export const useComplaints  = () => useSyncExternalStore(subscribe, getComplaints,  () => []);
export const useSchedules   = () => useSyncExternalStore(subscribe, getSchedules,   () => []);
export const usePayments    = () => useSyncExternalStore(subscribe, getPayments,    () => []);
