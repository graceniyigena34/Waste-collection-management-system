export interface DashboardStats {
  totalHouseholds: number;
  activeHouseholds: number;
  totalRevenue: number;
  pendingPayments: number;
  completedCollections: number;
  pendingComplaints: number;
}

export interface AdminDashboardStats {
  totalCompanies: number;
  approvedCompanies: number;
  pendingCompanies: number;
  rejectedCompanies: number;
  totalUsers: number;
}

class DashboardService {
  async getWasteCompanyStats(): Promise<DashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      totalHouseholds: 150,
      activeHouseholds: 142,
      totalRevenue: 450000,
      pendingPayments: 8,
      completedCollections: 89,
      pendingComplaints: 3
    };
  }

  async getAdminStats(): Promise<AdminDashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      totalCompanies: 25,
      approvedCompanies: 20,
      pendingCompanies: 3,
      rejectedCompanies: 2,
      totalUsers: 500
    };
  }

  async getUserStats(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      totalPayments: 12,
      pendingPayments: 1,
      nextCollection: '2024-01-20',
      totalAmount: 60000
    };
  }
}

export default new DashboardService();
