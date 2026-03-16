// Mock services for all remaining service files

export const adminNotificationService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, title: 'System Update', message: 'System maintenance scheduled', type: 'info' }
    ];
  }
};

export const companyManagementService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, name: 'Clean Co', status: 'APPROVED' }
    ];
  }
};

export const driverSessionService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, driverId: 1, startTime: '09:00', endTime: '17:00', status: 'ACTIVE' }
    ];
  }
};

export const invoiceService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, amount: 5000, status: 'PAID', dueDate: '2024-01-30' }
    ];
  }
};

export const routeService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, name: 'Route A', zoneId: 1, status: 'ACTIVE' }
    ];
  }
};

export const sessionService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, sessionDate: '2024-01-15', status: 'COMPLETED' }
    ];
  }
};

export const tariffRuleService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, rule: 'Standard Rate', amount: 5000 }
    ];
  }
};

export const userDashboardService = {
  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      totalPayments: 12,
      pendingPayments: 1,
      nextCollection: '2024-01-20'
    };
  }
};

export const wasteCompanyService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, name: 'Clean Rwanda Ltd', status: 'ACTIVE' }
    ];
  }
};