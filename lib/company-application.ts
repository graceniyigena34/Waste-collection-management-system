import { useSyncExternalStore } from 'react';

const jsonCache = new Map<string, { raw: string | null; parsed: unknown }>();
const EMPTY_COMPANY_APPLICATIONS: CompanyApplicationRecord[] = [];

export type CompanyApplicationStatus = 'draft' | 'pending' | 'approved' | 'denied';

export interface CompanyDriverInput {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  nationalId: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  zone: string;
  truckId: string;
  yearsOfExperience: string;
}

export interface CompanyCarInput {
  plateNumber: string;
  model: string;
  year: string;
  capacity: string;
  assignedZone: string;
  insuranceNumber: string;
}

export interface CompanyApplicationProfile {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  companyAddress: string;
  companyDescription: string;
  companyLogo: string;
  companyImages: string[];
  certificates: string[];
  rdbCertificates: string[];
  taxCertificates: string[];
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  managerPosition: string;
  managerIdNumber: string;
  managerNationalId: string;
  drivers: CompanyDriverInput[];
  cars: CompanyCarInput[];
  serviceAreas: string[];
  notes: string;
}

export interface CompanyApplicationRecord extends CompanyApplicationProfile {
  id: string;
  status: CompanyApplicationStatus;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface UserInfo {
  fullName?: string;
  email?: string;
  role?: string;
  userId?: string;
}

export const COMPANY_APPLICATIONS_STORAGE_KEY = 'company_applications';
export const COMPANY_PROFILE_STORAGE_KEY = 'company_application_profile';
export const COMPANY_STATUS_STORAGE_KEY = 'company_application_status';
export const COMPANY_COMPLETED_STORAGE_KEY = 'company_onboarding_completed';
export const COMPANY_REVIEW_NOTES_STORAGE_KEY = 'company_review_notes';

const COMPANY_APPLICATIONS_EVENT = 'company-application-storage';

export const isBrowser = () => typeof window !== 'undefined';

const readJson = <T,>(key: string, fallback: T): T => {
  if (!isBrowser()) return fallback;

  const raw = window.localStorage.getItem(key);
  const cached = jsonCache.get(key);

  if (!raw || raw === 'undefined' || raw === 'null') {
    if (cached?.raw === null) {
      return cached.parsed as T;
    }

    jsonCache.set(key, { raw: null, parsed: fallback as unknown });
    return fallback;
  }

  if (cached?.raw === raw) {
    return cached.parsed as T;
  }

  try {
    const parsed = JSON.parse(raw) as T;
    jsonCache.set(key, { raw, parsed: parsed as unknown });
    return parsed;
  } catch {
    jsonCache.set(key, { raw, parsed: fallback as unknown });
    return fallback;
  }
};

const writeJson = <T,>(key: string, value: T) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(COMPANY_APPLICATIONS_EVENT));
};

const writeString = (key: string, value: string) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, value);
  window.dispatchEvent(new Event(COMPANY_APPLICATIONS_EVENT));
};

const getDefaultProfile = (): CompanyApplicationProfile => ({
  companyName: '',
  companyEmail: '',
  companyPhone: '',
  ownerName: '',
  ownerEmail: '',
  ownerPhone: '',
  companyAddress: '',
  companyDescription: '',
  companyLogo: '',
  companyImages: [],
  certificates: [],
  rdbCertificates: [],
  taxCertificates: [],
  managerName: '',
  managerEmail: '',
  managerPhone: '',
  managerPosition: '',
  managerIdNumber: '',
  managerNationalId: '',
  drivers: [],
  cars: [],
  serviceAreas: [],
  notes: '',
});

const normalizeProfile = (profile: Partial<CompanyApplicationProfile>): CompanyApplicationProfile => ({
  ...getDefaultProfile(),
  ...profile,
  companyImages: profile.companyImages ?? [],
  certificates: profile.certificates ?? [],
  rdbCertificates: profile.rdbCertificates ?? [],
  taxCertificates: profile.taxCertificates ?? [],
  drivers: profile.drivers ?? [],
  cars: profile.cars ?? [],
  serviceAreas: profile.serviceAreas ?? [],
});

export const getUserInfo = (): UserInfo | null => readJson<UserInfo | null>('user_info', null);

export const getCompanyApplications = (): CompanyApplicationRecord[] =>
  readJson<CompanyApplicationRecord[]>(COMPANY_APPLICATIONS_STORAGE_KEY, []);

export const getCompanyApplicationForEmail = (email?: string | null): CompanyApplicationRecord | null => {
  if (!email) return null;

  return getCompanyApplications().find((application) => application.companyEmail.toLowerCase() === email.toLowerCase()) ?? null;
};

export const getCurrentCompanyApplication = () => {
  const userInfo = getUserInfo();
  return getCompanyApplicationForEmail(userInfo?.email ?? null);
};

export const saveCompanyApplication = (profile: Partial<CompanyApplicationProfile>) => {
  const applications = getCompanyApplications();
  const normalizedProfile = normalizeProfile(profile);
  const emailKey = normalizedProfile.companyEmail.toLowerCase();
  const now = new Date().toISOString();
  const existing = applications.find((application) => application.companyEmail.toLowerCase() === emailKey);

  const nextApplication: CompanyApplicationRecord = {
    ...(existing ?? {}),
    id: existing?.id ?? `COMP-APP-${Date.now()}`,
    ...normalizedProfile,
    status: existing?.status === 'approved' ? 'approved' : 'pending',
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    reviewedAt: existing?.reviewedAt,
    reviewedBy: existing?.reviewedBy,
    reviewNotes: existing?.reviewNotes,
  };

  const nextApplications = existing
    ? applications.map((application) => (application.companyEmail.toLowerCase() === emailKey ? nextApplication : application))
    : [nextApplication, ...applications];

  writeJson(COMPANY_APPLICATIONS_STORAGE_KEY, nextApplications);
  writeJson(COMPANY_PROFILE_STORAGE_KEY, normalizedProfile);
  writeString(COMPANY_STATUS_STORAGE_KEY, nextApplication.status);
  writeString(COMPANY_COMPLETED_STORAGE_KEY, 'true');
  writeString(COMPANY_REVIEW_NOTES_STORAGE_KEY, nextApplication.reviewNotes ?? '');

  return nextApplication;
};

export const approveCompanyApplication = (email: string, reviewedBy = 'Admin', reviewNotes = '') => {
  const applications = getCompanyApplications();
  const now = new Date().toISOString();

  const nextApplications = applications.map((application) =>
    application.companyEmail.toLowerCase() === email.toLowerCase()
      ? {
          ...application,
          status: 'approved' as const,
          reviewedAt: now,
          reviewedBy,
          reviewNotes,
          updatedAt: now,
        }
      : application,
  );

  writeJson(COMPANY_APPLICATIONS_STORAGE_KEY, nextApplications);
  const approved = nextApplications.find((application) => application.companyEmail.toLowerCase() === email.toLowerCase()) ?? null;

  if (approved) {
    writeJson(COMPANY_PROFILE_STORAGE_KEY, approved);
    writeString(COMPANY_STATUS_STORAGE_KEY, 'approved');
    writeString(COMPANY_COMPLETED_STORAGE_KEY, 'true');
    writeString(COMPANY_REVIEW_NOTES_STORAGE_KEY, reviewNotes);
  }

  return approved;
};

export const denyCompanyApplication = (email: string, reviewedBy = 'Admin', reviewNotes = '') => {
  const applications = getCompanyApplications();
  const now = new Date().toISOString();

  const nextApplications = applications.map((application) =>
    application.companyEmail.toLowerCase() === email.toLowerCase()
      ? {
          ...application,
          status: 'denied' as const,
          reviewedAt: now,
          reviewedBy,
          reviewNotes,
          updatedAt: now,
        }
      : application,
  );

  writeJson(COMPANY_APPLICATIONS_STORAGE_KEY, nextApplications);
  const denied = nextApplications.find((application) => application.companyEmail.toLowerCase() === email.toLowerCase()) ?? null;

  if (denied) {
    writeJson(COMPANY_PROFILE_STORAGE_KEY, denied);
    writeString(COMPANY_STATUS_STORAGE_KEY, 'denied');
    writeString(COMPANY_COMPLETED_STORAGE_KEY, 'true');
    writeString(COMPANY_REVIEW_NOTES_STORAGE_KEY, reviewNotes);
  }

  return denied;
};

const subscribeToCompanyStorage = (callback: () => void) => {
  if (!isBrowser()) return () => undefined;

  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener(COMPANY_APPLICATIONS_EVENT, handler);

  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(COMPANY_APPLICATIONS_EVENT, handler);
  };
};

export const useCompanyApplications = () =>
  useSyncExternalStore(
    subscribeToCompanyStorage,
    getCompanyApplications,
    () => EMPTY_COMPANY_APPLICATIONS,
  );

export const useCompanyApplication = (email?: string | null) =>
  useSyncExternalStore(
    subscribeToCompanyStorage,
    () => getCompanyApplicationForEmail(email),
    () => null,
  );

export const useCurrentCompanyApplication = () =>
  useSyncExternalStore(
    subscribeToCompanyStorage,
    getCurrentCompanyApplication,
    () => null,
  );

export const useCompanyUserInfo = () =>
  useSyncExternalStore(
    subscribeToCompanyStorage,
    getUserInfo,
    () => null,
  );
