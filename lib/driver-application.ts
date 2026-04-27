import { useSyncExternalStore } from 'react';

export type DriverApplicationStatus = 'pending' | 'approved';

export interface DriverApplicationProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  zone: string;
  truckPreference: string;
  yearsOfExperience: string;
  notes: string;
}

export interface DriverApplicationRecord extends DriverApplicationProfile {
  id: string;
  status: DriverApplicationStatus;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface UserInfo {
  fullName?: string;
  email?: string;
  role?: string;
  userId?: string;
}

export const DRIVER_APPLICATIONS_STORAGE_KEY = 'driver_applications';
const DRIVER_APPLICATIONS_EVENT = 'driver-application-storage';

export const isBrowser = () => typeof window !== 'undefined';

const readJson = <T,>(key: string, fallback: T): T => {
  if (!isBrowser()) return fallback;

  const raw = window.localStorage.getItem(key);
  if (!raw || raw === 'undefined' || raw === 'null') return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = <T,>(key: string, value: T) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(DRIVER_APPLICATIONS_EVENT));
};

export const getUserInfo = (): UserInfo | null => readJson<UserInfo | null>('user_info', null);

export const getDriverApplications = (): DriverApplicationRecord[] =>
  readJson<DriverApplicationRecord[]>(DRIVER_APPLICATIONS_STORAGE_KEY, []);

export const getDriverApplicationForEmail = (email?: string | null): DriverApplicationRecord | null => {
  if (!email) return null;

  return getDriverApplications().find((application) => application.email.toLowerCase() === email.toLowerCase()) ?? null;
};

export const saveDriverApplication = (profile: DriverApplicationProfile) => {
  const applications = getDriverApplications();
  const now = new Date().toISOString();
  const existing = applications.find((application) => application.email.toLowerCase() === profile.email.toLowerCase());
  const mergedProfile: DriverApplicationProfile = {
    fullName: profile.fullName || existing?.fullName || '',
    email: profile.email || existing?.email || '',
    phoneNumber: profile.phoneNumber || existing?.phoneNumber || '',
    licenseNumber: profile.licenseNumber || existing?.licenseNumber || '',
    zone: profile.zone || existing?.zone || 'Kicukiro',
    truckPreference: profile.truckPreference || existing?.truckPreference || '',
    yearsOfExperience: profile.yearsOfExperience || existing?.yearsOfExperience || '',
    notes: profile.notes || existing?.notes || '',
  };

  const nextApplication: DriverApplicationRecord = {
    ...(existing ?? {}),
    id: existing?.id ?? `DRV-APP-${Date.now()}`,
    ...mergedProfile,
    status: existing?.status === 'approved' ? 'approved' : 'pending',
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    approvedAt: existing?.approvedAt,
    approvedBy: existing?.approvedBy,
  };

  const nextApplications = existing
    ? applications.map((application) => (application.email.toLowerCase() === mergedProfile.email.toLowerCase() ? nextApplication : application))
    : [nextApplication, ...applications];

  writeJson(DRIVER_APPLICATIONS_STORAGE_KEY, nextApplications);
  return nextApplication;
};

export const approveDriverApplication = (email: string, approvedBy = 'Admin') => {
  const applications = getDriverApplications();
  const now = new Date().toISOString();

  const nextApplications = applications.map((application) =>
    application.email.toLowerCase() === email.toLowerCase()
      ? {
          ...application,
          status: 'approved' as const,
          approvedAt: now,
          approvedBy,
          updatedAt: now,
        }
      : application,
  );

  writeJson(DRIVER_APPLICATIONS_STORAGE_KEY, nextApplications);

  return nextApplications.find((application) => application.email.toLowerCase() === email.toLowerCase()) ?? null;
};

const subscribeToDriverStorage = (callback: () => void) => {
  if (!isBrowser()) return () => undefined;

  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener(DRIVER_APPLICATIONS_EVENT, handler);

  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(DRIVER_APPLICATIONS_EVENT, handler);
  };
};

export const useDriverApplication = (email?: string | null) =>
  useSyncExternalStore(
    subscribeToDriverStorage,
    () => getDriverApplicationForEmail(email),
    () => null,
  );

export const useDriverApplications = () =>
  useSyncExternalStore(
    subscribeToDriverStorage,
    getDriverApplications,
    () => [],
  );

export const useDriverUserInfo = () =>
  useSyncExternalStore(
    subscribeToDriverStorage,
    getUserInfo,
    () => null,
  );