// Mock data and services for all remaining backend integrations

// Mock company management service
export const companyManagementService = {
  getPendingCompanies: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      content: [
        { id: 1, name: 'Clean Co Ltd', email: 'info@cleanco.rw', status: 'PENDING', submittedAt: '2024-01-15' },
        { id: 2, name: 'Eco Waste Solutions', email: 'contact@ecowaste.rw', status: 'PENDING', submittedAt: '2024-01-14' }
      ],
      totalElements: 2,
      totalPages: 1
    };
  },
  
  approveCompany: async (companyId: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Company approved successfully' };
  },
  
  rejectCompany: async (companyId: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Company rejected' };
  }
};

// Mock driver session service
export const driverSessionService = {
  getTodaySessions: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, route: 'Route A', startTime: '08:00', endTime: '16:00', status: 'ACTIVE' },
      { id: 2, route: 'Route B', startTime: '09:00', endTime: '17:00', status: 'COMPLETED' }
    ];
  },
  
  getUpcomingSessions: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 3, route: 'Route C', date: '2024-01-20', startTime: '08:00', status: 'SCHEDULED' }
    ];
  },
  
  getSessionStops: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, address: 'Kigali Street 1', status: 'COMPLETED', householdCount: 5 },
      { id: 2, address: 'Kigali Street 2', status: 'PENDING', householdCount: 3 }
    ];
  },
  
  completeSession: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Session completed' };
  },
  
  updateStopStatus: async (stopId: number, status: string, reason?: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

// Mock invoice service
export const invoiceService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, householdName: 'Smith Family', amount: 5000, status: 'PAID', dueDate: '2024-01-30' },
      { id: 2, householdName: 'Johnson Family', amount: 7500, status: 'PENDING', dueDate: '2024-02-15' }
    ];
  },
  
  getById: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id, householdName: 'Mock Family', amount: 5000, status: 'PENDING', dueDate: '2024-01-30' };
  },
  
  create: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...data, id: Date.now(), createdAt: new Date().toISOString() };
  },
  
  updateStatus: async (id: number, status: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

// Mock route service
export const routeService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, name: 'Route A', zoneId: 1, status: 'ACTIVE', householdCount: 25 },
      { id: 2, name: 'Route B', zoneId: 2, status: 'ACTIVE', householdCount: 18 }
    ];
  },
  
  getById: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id, name: `Route ${id}`, zoneId: 1, status: 'ACTIVE', householdCount: 20 };
  },
  
  create: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...data, id: Date.now(), createdAt: new Date().toISOString() };
  },
  
  update: async (id: number, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...data, id, updatedAt: new Date().toISOString() };
  },
  
  delete: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

// Mock session service
export const sessionService = {
  create: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...data, id: Date.now(), createdAt: new Date().toISOString() };
  },
  
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, routeId: 1, driverId: 1, date: '2024-01-15', status: 'COMPLETED' },
      { id: 2, routeId: 2, driverId: 2, date: '2024-01-16', status: 'ACTIVE' }
    ];
  },
  
  getById: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id, routeId: 1, driverId: 1, date: '2024-01-15', status: 'ACTIVE' };
  },
  
  getStops: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, address: 'Stop 1', status: 'COMPLETED' },
      { id: 2, address: 'Stop 2', status: 'PENDING' }
    ];
  },
  
  updateStatus: async (id: number, status: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },
  
  assignDriver: async (id: number, driverId: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

// Mock tariff rule service
export const tariffRuleService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, name: 'Standard Rate', amount: 5000, frequency: 'MONTHLY' },
      { id: 2, name: 'Premium Rate', amount: 7500, frequency: 'MONTHLY' }
    ];
  },
  
  getByPlan: async (planId: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, planId, name: 'Plan Rule', amount: 5000 }
    ];
  },
  
  getById: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id, name: 'Mock Rule', amount: 5000, frequency: 'MONTHLY' };
  },
  
  create: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...data, id: Date.now(), createdAt: new Date().toISOString() };
  },
  
  update: async (id: number, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...data, id, updatedAt: new Date().toISOString() };
  },
  
  delete: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

// Mock user dashboard service
export const userDashboardService = {
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+250123456789',
      address: 'Kigali, Rwanda'
    };
  },
  
  updateProfile: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...data, updatedAt: new Date().toISOString() };
  },
  
  getSchedules: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, date: '2024-01-20', time: '08:00', status: 'SCHEDULED' },
      { id: 2, date: '2024-01-27', time: '08:00', status: 'SCHEDULED' }
    ];
  },
  
  getComplaints: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, title: 'Missed Collection', status: 'OPEN', date: '2024-01-15' },
      { id: 2, title: 'Damaged Bin', status: 'RESOLVED', date: '2024-01-10' }
    ];
  },
  
  createComplaint: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...data, id: Date.now(), status: 'OPEN', createdAt: new Date().toISOString() };
  },
  
  getPayments: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, amount: 5000, date: '2024-01-15', status: 'COMPLETED' },
      { id: 2, amount: 5000, date: '2024-01-01', status: 'COMPLETED' }
    ];
  },
  
  getInvoices: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, amount: 5000, dueDate: '2024-02-15', status: 'PENDING' },
      { id: 2, amount: 5000, dueDate: '2024-01-15', status: 'PAID' }
    ];
  }
};

// Mock waste company service
export const wasteCompanyService = {
  getPendingCompanies: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, name: 'Clean Co Ltd', email: 'info@cleanco.rw', status: 'PENDING' },
      { id: 2, name: 'Eco Solutions', email: 'contact@eco.rw', status: 'PENDING' }
    ];
  },
  
  getById: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id, name: 'Mock Company', email: 'mock@company.rw', status: 'APPROVED' };
  },
  
  approve: async (companyId: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Company approved' };
  },
  
  reject: async (companyId: number, reason: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Company rejected' };
  },
  
  downloadDocument: async (url: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return mock blob for document download
    return new Blob(['Mock document content'], { type: 'application/pdf' });
  }
};

// Export all services
export default {
  companyManagementService,
  driverSessionService,
  invoiceService,
  routeService,
  sessionService,
  tariffRuleService,
  userDashboardService,
  wasteCompanyService
};