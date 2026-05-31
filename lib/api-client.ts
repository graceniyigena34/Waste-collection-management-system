"use client";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
  "https://backend-waste-collection-management.onrender.com";

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

const readAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("auth_token");
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
  readJson<FrontendUserInfo>("user_info");

export const storeAuth = (payload: BackendAuthResponse) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("auth_token", payload.token);
  window.localStorage.setItem(
    "user_info",
    JSON.stringify({
      fullName: payload.user.full_name,
      email: payload.user.email,
      role: payload.user.role,
      userId: String(payload.user.id),
    } satisfies FrontendUserInfo),
  );
};

export const clearAuth = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("auth_token");
  window.localStorage.removeItem("user_info");
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
};

export const normalizeRole = (role?: string | null): string =>
  typeof role === "string" ? role.trim().toLowerCase() : "";
