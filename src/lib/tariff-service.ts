export interface Tariff {
  id: number;
  name: string;
  amount: number;
  zoneId: number;
  wasteType: string;
  frequency: 'WEEKLY' | 'MONTHLY';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

const mockTariffs: Tariff[] = [
  {
    id: 1,
    name: 'Standard Household',
    amount: 5000,
    zoneId: 1,
    wasteType: 'Mixed',
    frequency: 'MONTHLY',
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Premium Household',
    amount: 7500,
    zoneId: 2,
    wasteType: 'Organic',
    frequency: 'WEEKLY',
    status: 'ACTIVE',
    createdAt: '2024-01-02T00:00:00Z'
  }
];

export const tariffService = {
  getAll: async (): Promise<Tariff[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockTariffs];
  },
  
  getById: async (id: number): Promise<Tariff> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const tariff = mockTariffs.find(t => t.id === id);
    if (!tariff) throw new Error('Tariff not found');
    return tariff;
  },
  
  create: async (data: Omit<Tariff, 'id' | 'createdAt'>): Promise<Tariff> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTariff: Tariff = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    mockTariffs.push(newTariff);
    return newTariff;
  },
  
  update: async (id: number, data: Partial<Tariff>): Promise<Tariff> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockTariffs.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Tariff not found');
    mockTariffs[index] = { ...mockTariffs[index], ...data };
    return mockTariffs[index];
  },
  
  delete: async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockTariffs.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Tariff not found');
    mockTariffs.splice(index, 1);
  }
};

export default tariffService;