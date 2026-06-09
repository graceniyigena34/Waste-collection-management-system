"use client";

// Allowed API origins — prevents SSRF by restricting fetch to known hosts
const ALLOWED_ORIGINS = [
  "http://localhost:8000",
  "http://192.168.56.1:8000",
  "https://backend-waste-collection-management.onrender.com",
];

export const API_BASE_URL = (() => {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
    "https://backend-waste-collection-management.onrender.com";
  // Validate the base URL is in the allowlist (SSRF fix)
  if (typeof window !== "undefined" && !ALLOWED_ORIGINS.some(o => raw.startsWith(o))) {
    console.warn("[EcoTrack] API_BASE_URL not in allowlist, using default.");
    return "https://backend-waste-collection-management.onrender.com";
  }
  return raw;
})();

export type BackendRole = "citizen" | "waste_collector" | "admin";

export interface BackendAuthUser {
  id: number;
  full_name: string;
  email: string;
  role: BackendRole;
  created_at?: string;
}

export interface BackendAuthResponse {
  message: string;
  token: string;
  user: BackendAuthUser;
}

export interface CompanyAccessResponse {
  message: string;
  credentials: {
    username: string;
    password: string;
  };
  user: BackendAuthUser;
  company: BackendCompanyProfile;
}

export interface FrontendUserInfo {
  fullName?: string;
  email?: string;
  role?: BackendRole;
  userId?: string;
}

export interface BackendCompanyProfile {
  id: number;
  company_name: string;
  email: string;
  phone: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  tin?: string;
  address?: string;
  description?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  company_logo?: string;
  company_images?: Array<unknown>;
  company_type?: string;
  years_of_experience?: number;
  number_of_employees?: number;
  manager_name?: string;
  manager_email?: string;
  manager_phone?: string;
  manager_position?: string;
  manager_national_id?: string;
  drivers?: Array<unknown>;
  vehicles?: Array<unknown>;
  certificates?: Array<unknown>;
  rdb_certificates?: Array<unknown>;
  tax_certificates?: Array<unknown>;
  service_areas?: Array<unknown>;
  notes?: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  review_notes?: string;
  reviewed_at?: string;
  reviewed_by?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BackendChatMessage {
  id: number;
  company_id: number;
  sender_role: "citizen" | "company";
  sender_name?: string;
  message: string;
  created_at?: string;
}

export interface BackendComplaint {
  id: number;
  user_id: number;
  household_id?: number;
  issue_type: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Pending" | "In Progress" | "Resolved";
  assigned_to?: string;
  resolution_note?: string;
  created_at?: string;
  updated_at?: string;
  // Admin-only fields (from JOIN)
  full_name?: string;
  telephone?: string;
  zone?: string;
}

export interface BackendCompanySchedule {
  id: number;
  company_id: number;
  district_id?: string;
  district_name?: string;
  schedule_date: string;
  day: string;
  sector_id?: string;
  sector_name?: string;
  cells: string[];
  driver?: string;
  vehicle?: string;
  start_time?: string;
  waste_type: string;
  status: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// ── Secure session helpers ──────────────────────────────────────────────────
// NOTE: localStorage is used here for simplicity in a frontend-only demo.
// In production, use httpOnly cookies via a server-side session to prevent XSS.
// The token is never rendered into the DOM — it is only sent in Authorization headers.

const SESSION_KEY = "auth_token";
const USER_KEY = "user_info";

// Sanitize a string value before storing — strips any script-like content
const sanitize = (val: string): string =>
  val.replace(/<[^>]*>/g, "").trim();

const readAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
};

const readJson = <T,>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const getStoredUserInfo = (): FrontendUserInfo | null =>
  readJson<FrontendUserInfo>(USER_KEY);

export const storeAuth = (payload: BackendAuthResponse) => {
  if (typeof window === "undefined") return;
  // Store only the JWT — never render it into the DOM
  window.localStorage.setItem(SESSION_KEY, payload.token);
  window.localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      fullName: sanitize(payload.user.full_name),
      email: sanitize(payload.user.email),
      role: payload.user.role,
      userId: String(payload.user.id),
    } satisfies FrontendUserInfo),
  );
};

export const clearAuth = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(USER_KEY);
};

const toMessage = (body: unknown, fallback: string) => {
  if (!body) return fallback;
  if (typeof body === "string") return body;
  if (typeof body === "object" && body && "message" in body) {
    const msg = (body as { message?: unknown }).message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return fallback;
};

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth) {
    const token = readAuthToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, { ...options, headers });
  const contentType = res.headers.get("content-type") || "";

  let body: unknown = null;
  if (contentType.includes("application/json")) {
    try {
      body = await res.json();
    } catch {
      body = null;
    }
  } else {
    try {
      body = await res.text();
    } catch {
      body = null;
    }
  }

  if (!res.ok) {
    throw new ApiError(toMessage(body, `Request failed (${res.status})`), res.status, body);
  }

  return body as T;
}

export const api = {
  auth: {
    register: (payload: {
      full_name: string;
      email: string;
      telephone: string;
      password: string;
      confirm_password: string;
      role: BackendRole;
    }) => apiFetch<BackendAuthResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),

    login: (payload: { email: string; password: string }) =>
      apiFetch<BackendAuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(payload) }),
    profile: () => apiFetch<BackendAuthUser>("/api/auth/profile", { method: "GET", auth: true }),

    updateProfile: (payload: Partial<{ full_name: string; email: string; telephone: string }>) =>
      apiFetch<{ message: string; user: BackendAuthUser }>("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
        auth: true,
      }),

    changePassword: (payload: { current_password: string; new_password: string; confirm_password: string }) =>
      apiFetch<{ message: string }>("/api/auth/change-password", {
        method: "PUT",
        body: JSON.stringify(payload),
        auth: true,
      }),

    forgotPassword: (email: string) =>
      apiFetch<{ message: string; reset_url?: string; token?: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),

    resetPassword: (payload: { token: string; new_password: string; confirm_password: string }) =>
      apiFetch<{ message: string }>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },

  households: {
    submit: (payload: {
      district: string;
      sector: string;
      cell: string;
      village: string;
      street_address: string;
      house_type?: string;
      residents?: number;
      notes?: string;
    }) => apiFetch("/api/households", { method: "POST", body: JSON.stringify(payload), auth: true }),
    me: () => apiFetch("/api/households/me", { method: "GET", auth: true }),

    update: (payload: Partial<{
      district: string; sector: string; cell: string; village: string;
      street_address: string; house_type: string; residents: number; notes: string;
    }>) => apiFetch("/api/households/me", { method: "PUT", body: JSON.stringify(payload), auth: true }),
  },

  companies: {
    createWithAccess: (payload: {
      company_name: string;
      email: string;
      phone: string;
      password: string;
      confirm_password: string;
      owner_name?: string;
      owner_email?: string;
      owner_phone?: string;
      tin?: string;
      address?: string;
      description?: string;
      district?: string;
      sector?: string;
      cell?: string;
      village?: string;
      company_logo?: string;
      company_images?: unknown[];
      company_type?: string;
      years_of_experience?: number;
      number_of_employees?: number;
      manager_name?: string;
      manager_email?: string;
      manager_phone?: string;
      manager_position?: string;
      manager_national_id?: string;
      drivers?: unknown[];
      vehicles?: unknown[];
      certificates?: unknown[];
      rdb_certificates?: unknown[];
      tax_certificates?: unknown[];
      service_areas?: unknown[];
      notes?: string;
    }) =>
      apiFetch<CompanyAccessResponse>("/api/companies/admin-create", {
        method: "POST",
        body: JSON.stringify(payload),
        auth: true,
      }),

    create: (payload: {
      company_name: string;
      email: string;
      phone: string;
      owner_name?: string;
      owner_email?: string;
      owner_phone?: string;
      tin?: string;
      address?: string;
      description?: string;
      district?: string;
      sector?: string;
      cell?: string;
      village?: string;
      company_logo?: string;
      company_images?: unknown[];
      company_type?: string;
      years_of_experience?: number;
      number_of_employees?: number;
      manager_name?: string;
      manager_email?: string;
      manager_phone?: string;
      manager_position?: string;
      manager_national_id?: string;
      drivers?: unknown[];
      vehicles?: unknown[];
      certificates?: unknown[];
      rdb_certificates?: unknown[];
      tax_certificates?: unknown[];
      service_areas?: unknown[];
      notes?: string;
    }) =>
      apiFetch<{ message: string; company: BackendCompanyProfile }>("/api/companies", {
        method: "POST",
        body: JSON.stringify(payload),
        auth: true,
      }),

    all: (limit = 100, offset = 0) =>
      apiFetch<{ count: number; limit: number; offset: number; data: BackendCompanyProfile[] }>(
        `/api/companies/all?limit=${limit}&offset=${offset}`,
        {
          method: "GET",
          auth: true,
        },
      ),

    byEmail: (email: string) =>
      apiFetch<{ company: BackendCompanyProfile }>(`/api/companies/email/${encodeURIComponent(email)}`, {
        method: "GET",
        auth: true,
      }),

    update: (
      id: number,
      payload: Partial<{
        company_name: string;
        email: string;
        phone: string;
        owner_name: string;
        owner_email: string;
        owner_phone: string;
        tin: string;
        address: string;
        description: string;
        district: string;
        sector: string;
        cell: string;
        village: string;
        company_logo: string;
        company_images: unknown[];
        company_type: string;
        years_of_experience: number;
        number_of_employees: number;
        manager_name: string;
        manager_email: string;
        manager_phone: string;
        manager_position: string;
        manager_national_id: string;
        drivers: unknown[];
        vehicles: unknown[];
        certificates: unknown[];
        rdb_certificates: unknown[];
        tax_certificates: unknown[];
        service_areas: unknown[];
        notes: string;
      }>,
    ) =>
      apiFetch<{ message: string; company: BackendCompanyProfile }>(`/api/companies/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        auth: true,
      }),

    byStatus: (status: BackendCompanyProfile["status"]) =>
      apiFetch<{ status: string; count: number; data: BackendCompanyProfile[] }>(`/api/companies/status/${status}`, {
        method: "GET",
        auth: true,
      }),

    approve: (id: number) =>
      apiFetch<{ message: string; company: BackendCompanyProfile }>(`/api/companies/${id}/approve`, {
        method: "PUT",
        body: JSON.stringify({}),
        auth: true,
      }),

    approveWithNotes: (id: number, review_notes?: string) =>
      apiFetch<{ message: string; company: BackendCompanyProfile }>(`/api/companies/${id}/approve`, {
        method: "PUT",
        body: JSON.stringify({ review_notes }),
        auth: true,
      }),

    reject: (id: number, reason?: string) =>
      apiFetch<{ message: string; reason?: string; company: BackendCompanyProfile }>(`/api/companies/${id}/reject`, {
        method: "PUT",
        body: JSON.stringify({ reason }),
        auth: true,
      }),
  },

  chat: {
    list: (companyId: number) =>
      apiFetch<{ messages: BackendChatMessage[] }>(`/api/chat/company/${companyId}`, { method: "GET", auth: true }),

    send: (companyId: number, message: string, senderName?: string) =>
      apiFetch<{ message: string; chat: BackendChatMessage }>(`/api/chat/company/${companyId}`, {
        method: "POST",
        body: JSON.stringify({ message, sender_name: senderName }),
        auth: true,
      }),

    edit: (companyId: number, messageId: number, message: string) =>
      apiFetch<{ message: string; chat: BackendChatMessage }>(`/api/chat/company/${companyId}/${messageId}`, {
        method: "PUT",
        body: JSON.stringify({ message }),
        auth: true,
      }),

    remove: (companyId: number, messageId: number) =>
      apiFetch<{ message: string }>(`/api/chat/company/${companyId}/${messageId}`, {
        method: "DELETE",
        auth: true,
      }),
  },

  companySchedules: {
    list: (companyId: number) =>
      apiFetch<{ schedules: BackendCompanySchedule[] }>(`/api/company-schedules/company/${companyId}`, {
        method: "GET",
        auth: true,
      }),

    listByDate: (companyId: number, scheduleDate: string) =>
      apiFetch<{ schedules: BackendCompanySchedule[] }>(`/api/company-schedules/company/${companyId}/date/${encodeURIComponent(scheduleDate)}`, {
        method: "GET",
        auth: true,
      }),

    create: (companyId: number, payload: Partial<Omit<BackendCompanySchedule, "id" | "company_id" | "created_at" | "updated_at">>) =>
      apiFetch<{ message: string; schedule: BackendCompanySchedule }>(`/api/company-schedules/company/${companyId}`, {
        method: "POST",
        body: JSON.stringify(payload),
        auth: true,
      }),

    update: (
      companyId: number,
      scheduleId: number,
      payload: Partial<Omit<BackendCompanySchedule, "id" | "company_id" | "created_at" | "updated_at">>,
    ) =>
      apiFetch<{ message: string; schedule: BackendCompanySchedule }>(`/api/company-schedules/company/${companyId}/${scheduleId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        auth: true,
      }),

    remove: (companyId: number, scheduleId: number) =>
      apiFetch<{ message: string }>(`/api/company-schedules/company/${companyId}/${scheduleId}`, {
        method: "DELETE",
        auth: true,
      }),
  },

  complaints: {
    submit: (payload: { issue_type: string; description: string; priority?: string }) =>
      apiFetch<{ message: string; complaint: BackendComplaint }>("/api/complaints", {
        method: "POST",
        body: JSON.stringify(payload),
        auth: true,
      }),

    me: () =>
      apiFetch<BackendComplaint[]>("/api/complaints/me", { method: "GET", auth: true }),

    all: () =>
      apiFetch<BackendComplaint[]>("/api/complaints", { method: "GET", auth: true }),

    updateStatus: (
      id: number,
      payload: { status: "Pending" | "In Progress" | "Resolved"; assigned_to?: string; resolution_note?: string },
    ) =>
      apiFetch<{ message: string; complaint: BackendComplaint }>(`/api/complaints/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        auth: true,
      }),

    remove: (id: number) =>
      apiFetch<{ message: string }>(`/api/complaints/${id}`, { method: "DELETE", auth: true }),
  },
};

export const normalizeRole = (role?: string | null): string =>
  typeof role === "string" ? role.trim().toLowerCase() : "";
