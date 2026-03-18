// Central API Services Export - All Mock Services
export { authService } from './auth-service';
export { adminService } from './admin-service';
export { default as householdService } from './household-service';
export { default as zoneService } from './zone-service';
export { default as tariffService } from './tariff-service';
export { default as paymentService } from './payment-service';
export { default as complaintService } from './complaint-service';
export { default as onboardingService } from './onboarding-service';
export { default as dashboardService } from './dashboard-service';
export { default as adminNotificationService } from './admin-notification-service';
export { default as companyManagementService } from './company-management-service';
export { contactService } from './contact-service';
export { notificationService } from './notification-service';
export { driverService } from './driver-service';

// Mock services for deleted files
export const wasteCompanyService = {
  getPendingCompanies: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [{ id: 1, name: 'Mock Company', status: 'PENDING' }];
  }
};

export const invoiceService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [{ id: 1, amount: 5000, status: 'PENDING' }];
  }
};

export const routeService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [{ id: 1, name: 'Route A', status: 'ACTIVE' }];
  }
};

export const userDashboardService = {
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id: 1, name: 'Mock User', email: 'user@example.com' };
  }
};

export const sessionService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [{ id: 1, status: 'ACTIVE' }];
  }
};

export const driverSessionService = {
  getTodaySessions: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [{ id: 1, route: 'Route A', status: 'ACTIVE' }];
  }
};

// Re-export types
export type { RegisterData, RegisterResponse } from './auth-service';
export type { Household, CreateHouseholdData } from './household-service';
export type { Zone, CreateZoneData } from './zone-service';
export type { Tariff } from './tariff-service';
export type { Payment, CreatePaymentData } from './payment-service';
export type { Complaint } from './complaint-service';
export type { OnboardingFormData, OnboardingResponse } from './onboarding-service';
export type { DashboardStats, AdminDashboardStats } from './dashboard-service';
export type { AdminNotification } from './admin-notification-service';
export type { PendingCompany, PageResponse } from './company-management-service';
export type { Contact } from './contact-service';
export type { Notification } from './notification-service';
export type { Driver } from './driver-service';
