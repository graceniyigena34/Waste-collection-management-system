// Mock implementations for all services
export const mockApiServices = {
  // Dashboard stats
  getDashboardStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      totalHouseholds: 150,
      totalPayments: 89,
      totalZones: 12,
      activeDrivers: 8,
      openComplaints: 3,
      monthlyRevenue: 450000,
      collectionRate: 95
    };
  },

  // Notifications
  getNotifications: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, title: 'New Payment Received', message: 'Payment from Smith Family', type: 'success', date: '2024-01-15' },
      { id: 2, title: 'Collection Scheduled', message: 'Zone A collection tomorrow', type: 'info', date: '2024-01-14' }
    ];
  },

  // Drivers
  getDrivers: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, name: 'John Doe', phone: '+250123456789', zone: 'Zone A', status: 'Active' },
      { id: 2, name: 'Jane Smith', phone: '+250987654321', zone: 'Zone B', status: 'Active' }
    ];
  },

  // Complaints
  getComplaints: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, title: 'Missed Collection', description: 'Waste not collected', status: 'Open', date: '2024-01-15' },
      { id: 2, title: 'Damaged Bin', description: 'Bin was damaged', status: 'Resolved', date: '2024-01-10' }
    ];
  },

  // Generic CRUD operations
  create: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...data, id: Date.now(), createdAt: new Date().toISOString() };
  },

  update: async (id: any, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...data, id, updatedAt: new Date().toISOString() };
  },

  delete: async (id: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

// Export individual services for compatibility
export const dashboardService = { getStats: mockApiServices.getDashboardStats };
export const notificationService = { getAll: mockApiServices.getNotifications };
export const driverService = { getAll: mockApiServices.getDrivers };
export const complaintService = { getAll: mockApiServices.getComplaints };
export const adminService = mockApiServices;
export const companyManagementService = mockApiServices;
export const contactService = mockApiServices;
export const invoiceService = mockApiServices;
export const onboardingService = mockApiServices;
export const routeService = mockApiServices;
export const sessionService = mockApiServices;
export const tariffService = mockApiServices;
export const userDashboardService = mockApiServices;
export const wasteCompanyService = mockApiServices;