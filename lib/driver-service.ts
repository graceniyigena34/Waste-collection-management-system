export interface Driver {
  id: number;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  zoneId: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

const mockDrivers: Driver[] = [
  {
    id: 1,
    name: 'John Doe',
    phone: '+250123456789',
    email: 'john@example.com',
    licenseNumber: 'DL123456',
    zoneId: 1,
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Jane Smith',
    phone: '+250987654321',
    email: 'jane@example.com',
    licenseNumber: 'DL789012',
    zoneId: 2,
    status: 'ACTIVE',
    createdAt: '2024-01-02T00:00:00Z'
  }
];

export const driverService = {
  getAll: async (): Promise<Driver[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockDrivers];
  },
  
  getById: async (id: number): Promise<Driver> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const driver = mockDrivers.find(d => d.id === id);
    if (!driver) throw new Error('Driver not found');
    return driver;
  },
  
  create: async (data: Omit<Driver, 'id' | 'createdAt'>): Promise<Driver> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newDriver: Driver = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    mockDrivers.push(newDriver);
    return newDriver;
  },
  
  update: async (id: number, data: Partial<Driver>): Promise<Driver> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockDrivers.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Driver not found');
    mockDrivers[index] = { ...mockDrivers[index], ...data };
    return mockDrivers[index];
  },
  
  delete: async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockDrivers.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Driver not found');
    mockDrivers.splice(index, 1);
  }
};

export default driverService;