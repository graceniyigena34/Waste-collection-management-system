export interface Household {
  id: number;
  householdName: string;
  address: string;
  phoneNumber: string;
  email?: string;
  zoneId: number;
  zoneName?: string;
  numberOfMembers: number;
  wasteType: string[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface CreateHouseholdData {
  householdName: string;
  address: string;
  phoneNumber: string;
  email?: string;
  zoneId: number;
  numberOfMembers: number;
  wasteType: string[];
}

const mockHouseholds: Household[] = [
  {
    id: 1,
    householdName: 'Smith Family',
    address: 'Kigali, Rwanda',
    phoneNumber: '+250123456789',
    email: 'smith@example.com',
    zoneId: 1,
    zoneName: 'Zone A',
    numberOfMembers: 4,
    wasteType: ['Organic', 'Recyclable'],
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    householdName: 'Johnson Family',
    address: 'Kigali, Rwanda',
    phoneNumber: '+250987654321',
    email: 'johnson@example.com',
    zoneId: 2,
    zoneName: 'Zone B',
    numberOfMembers: 3,
    wasteType: ['Organic'],
    status: 'ACTIVE',
    createdAt: '2024-01-02T00:00:00Z'
  }
];

class HouseholdService {
  async getAll(): Promise<Household[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockHouseholds];
  }

  async getById(id: number): Promise<Household> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const household = mockHouseholds.find(h => h.id === id);
    if (!household) throw new Error('Household not found');
    return household;
  }

  async create(data: CreateHouseholdData): Promise<Household> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newHousehold: Household = {
      ...data,
      id: Date.now(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    mockHouseholds.push(newHousehold);
    return newHousehold;
  }

  async update(id: number, data: Partial<CreateHouseholdData>): Promise<Household> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockHouseholds.findIndex(h => h.id === id);
    if (index === -1) throw new Error('Household not found');
    mockHouseholds[index] = { ...mockHouseholds[index], ...data };
    return mockHouseholds[index];
  }

  async delete(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockHouseholds.findIndex(h => h.id === id);
    if (index === -1) throw new Error('Household not found');
    mockHouseholds.splice(index, 1);
  }
}

export default new HouseholdService();
