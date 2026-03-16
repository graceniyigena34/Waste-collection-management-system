export interface Pageable {
  page: number;
  size: number;
  sort: string[];
}

export interface PendingCompany {
  id: number;
  name: string;
  email?: string;
  sectorCoverage: string;
  status: 'PENDING';
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

const mockPendingCompanies: PendingCompany[] = [
  {
    id: 1,
    name: 'Clean Co Ltd',
    email: 'info@cleanco.rw',
    sectorCoverage: 'Kigali Central',
    status: 'PENDING',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Eco Waste Solutions',
    email: 'contact@ecowaste.rw',
    sectorCoverage: 'Gasabo District',
    status: 'PENDING',
    createdAt: '2024-01-14T14:30:00Z'
  }
];

class CompanyManagementService {
  async getPendingCompanies(
    page: number = 0,
    size: number = 10,
    sort: string[] = ['id']
  ): Promise<PageResponse<PendingCompany>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      content: [...mockPendingCompanies],
      totalElements: mockPendingCompanies.length,
      totalPages: 1,
      size: size,
      number: page,
      first: true,
      last: true
    };
  }

  async approveCompany(companyId: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockPendingCompanies.findIndex(c => c.id === companyId);
    if (index !== -1) {
      mockPendingCompanies.splice(index, 1);
    }
  }

  async rejectCompany(companyId: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockPendingCompanies.findIndex(c => c.id === companyId);
    if (index !== -1) {
      mockPendingCompanies.splice(index, 1);
    }
  }
}

export default new CompanyManagementService();
