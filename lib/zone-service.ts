export interface Zone {
  id: string;
  code: string;
  sector: string;
  cell: string;
  village: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface CreateZoneData {
  sector: string;
  cell: string;
  village: string;
  code: string;
  description: string;
}

const mockZones: Zone[] = [
  {
    id: '1',
    code: 'ZA001',
    sector: 'Nyarugenge',
    cell: 'Kigali',
    village: 'Central',
    description: 'Central Kigali Zone',
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    code: 'ZB002',
    sector: 'Gasabo',
    cell: 'Remera',
    village: 'East',
    description: 'East Kigali Zone',
    status: 'ACTIVE',
    createdAt: '2024-01-02T00:00:00Z'
  }
];

class ZoneService {
  async getAll(): Promise<Zone[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockZones];
  }

  async getById(id: string): Promise<Zone> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const zone = mockZones.find(z => z.id === id);
    if (!zone) throw new Error('Zone not found');
    return zone;
  }

  async create(data: CreateZoneData): Promise<Zone> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newZone: Zone = {
      ...data,
      id: Date.now().toString(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    mockZones.push(newZone);
    return newZone;
  }

  async update(id: string, data: Partial<CreateZoneData>): Promise<Zone> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockZones.findIndex(z => z.id === id);
    if (index === -1) throw new Error('Zone not found');
    mockZones[index] = { ...mockZones[index], ...data };
    return mockZones[index];
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockZones.findIndex(z => z.id === id);
    if (index === -1) throw new Error('Zone not found');
    mockZones.splice(index, 1);
  }
}

export default new ZoneService();
