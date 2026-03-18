import { apiRequest } from './api-services';

export interface WasteCompany {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationNumber: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
  logo?: string;
  description?: string;
  serviceAreas: string[];
  totalHouseholds?: number;
  totalRevenue?: number;
  rating?: number;
}

export interface CreateWasteCompanyData {
  name: string;
  email: string;
  phone: string;
  address: string;
  registrationNumber: string;
  description?: string;
  serviceAreas: string[];
}

class WasteCompanyService {
  async getWasteCompanies(): Promise<WasteCompany[]> {
    try {
      // In a real app, this would call the API
      // return await apiRequest('/waste-companies');

      // Mock data for now
      return [
        {
          id: '1',
          name: 'Green Rwanda Ltd',
          email: 'contact@greenrwanda.rw',
          phone: '+250 788 123 456',
          address: 'KG 123 St, Kigali, Rwanda',
          registrationNumber: 'REG-2024-001',
          status: 'APPROVED',
          createdAt: '2024-01-15T08:00:00Z',
          updatedAt: '2024-03-15T10:30:00Z',
          logo: '/company-logo.png',
          description: 'Leading waste management company in Rwanda',
          serviceAreas: ['Kigali', 'Northern Province'],
          totalHouseholds: 2847,
          totalRevenue: 85000,
          rating: 4.5
        },
        {
          id: '2',
          name: 'Clean Kigali Services',
          email: 'info@cleankigali.rw',
          phone: '+250 788 654 321',
          address: 'KN 456 Ave, Kigali, Rwanda',
          registrationNumber: 'REG-2024-002',
          status: 'PENDING',
          createdAt: '2024-03-10T09:00:00Z',
          updatedAt: '2024-03-10T09:00:00Z',
          description: 'Comprehensive waste collection and disposal services',
          serviceAreas: ['Kigali'],
          totalHouseholds: 0,
          totalRevenue: 0,
          rating: 0
        }
      ];
    } catch (error) {
      console.error('Error fetching waste companies:', error);
      throw error;
    }
  }

  async getWasteCompanyById(id: string): Promise<WasteCompany | null> {
    try {
      const companies = await this.getWasteCompanies();
      return companies.find(company => company.id === id) || null;
    } catch (error) {
      console.error('Error fetching waste company:', error);
      throw error;
    }
  }

  async createWasteCompany(companyData: CreateWasteCompanyData): Promise<WasteCompany> {
    try {
      // In a real app, this would call the API
      // return await apiRequest('/waste-companies', 'POST', companyData);

      const newCompany: WasteCompany = {
        ...companyData,
        id: Date.now().toString(),
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalHouseholds: 0,
        totalRevenue: 0,
        rating: 0
      };
      return newCompany;
    } catch (error) {
      console.error('Error creating waste company:', error);
      throw error;
    }
  }

  async updateWasteCompany(id: string, updates: Partial<WasteCompany>): Promise<WasteCompany> {
    try {
      // In a real app, this would call the API
      // return await apiRequest(`/waste-companies/${id}`, 'PATCH', updates);

      const company = await this.getWasteCompanyById(id);
      if (!company) throw new Error('Waste company not found');

      const updatedCompany: WasteCompany = {
        ...company,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return updatedCompany;
    } catch (error) {
      console.error('Error updating waste company:', error);
      throw error;
    }
  }

  async updateCompanyStatus(id: string, status: WasteCompany['status']): Promise<void> {
    try {
      await this.updateWasteCompany(id, { status });
    } catch (error) {
      console.error('Error updating company status:', error);
      throw error;
    }
  }

  async deleteWasteCompany(id: string): Promise<void> {
    try {
      // In a real app, this would call the API
      // await apiRequest(`/waste-companies/${id}`, 'DELETE');
      console.log(`Deleted waste company ${id}`);
    } catch (error) {
      console.error('Error deleting waste company:', error);
      throw error;
    }
  }

  async getCompanyStats(id: string): Promise<{
    totalHouseholds: number;
    totalRevenue: number;
    activeRoutes: number;
    pendingComplaints: number;
  }> {
    try {
      // In a real app, this would call the API
      // return await apiRequest(`/waste-companies/${id}/stats`);

      // Mock data
      return {
        totalHouseholds: 2847,
        totalRevenue: 85000,
        activeRoutes: 12,
        pendingComplaints: 5
      };
    } catch (error) {
      console.error('Error fetching company stats:', error);
      throw error;
    }
  }
}

const wasteCompanyService = new WasteCompanyService();
export default wasteCompanyService;