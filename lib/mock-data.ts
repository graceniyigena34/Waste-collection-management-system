// Mock data for frontend demonstration

export interface Session {
  id: string;
  routeId: string;
  date: string;
  driverUserId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  route?: {
    id: string;
    name: string;
    description: string;
    zone: string;
    estimatedTime: string;
    households: number;
  };
  driver?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface Route {
  id: string;
  name: string;
  description: string;
  zone: string;
  estimatedTime: string;
  households: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Household {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  zone: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Complaint {
  id: string;
  householdId: string;
  title: string;
  description: string;
  level: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'resolved' | 'in_progress';
  createdAt: string;
  resolvedAt?: string;
}

export interface Payment {
  id: string;
  householdId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  type: 'monthly' | 'one_time';
  createdAt: string;
}

export interface Tariff {
  id: string;
  name: string;
  description: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  wasteType: string;
  zone: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Zone {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  households: number;
  drivers: number;
  createdAt: string;
}

// Mock data generators
export const generateMockSessions = (): Session[] => [
  {
    id: '1',
    routeId: '1',
    date: '2024-01-15',
    driverUserId: '1',
    status: 'completed',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    route: {
      id: '1',
      name: 'Kicukiro Route A',
      description: 'Main collection route for Kicukiro sector',
      zone: 'Kicukiro',
      estimatedTime: '3h 30m',
      households: 45
    },
    driver: {
      id: '1',
      name: 'John Mutabazi',
      email: 'john@example.com',
      phone: '+250788123456'
    }
  },
  {
    id: '2',
    routeId: '2',
    date: '2024-01-16',
    driverUserId: '2',
    status: 'scheduled',
    createdAt: '2024-01-11T10:00:00Z',
    updatedAt: '2024-01-11T10:00:00Z',
    route: {
      id: '2',
      name: 'Gasabo Route B',
      description: 'Secondary collection route for Gasabo sector',
      zone: 'Gasabo',
      estimatedTime: '2h 45m',
      households: 38
    },
    driver: {
      id: '2',
      name: 'Eric Niyonzima',
      email: 'eric@example.com',
      phone: '+250788123457'
    }
  }
];

export const generateMockRoutes = (): Route[] => [
  {
    id: '1',
    name: 'Kicukiro Route A',
    description: 'Main collection route for Kicukiro sector',
    zone: 'Kicukiro',
    estimatedTime: '3h 30m',
    households: 45,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Gasabo Route B',
    description: 'Secondary collection route for Gasabo sector',
    zone: 'Gasabo',
    estimatedTime: '2h 45m',
    households: 38,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const generateMockDrivers = (): Driver[] => [
  {
    id: '1',
    name: 'John Mutabazi',
    email: 'john@example.com',
    phone: '+250788123456',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Eric Niyonzima',
    email: 'eric@example.com',
    phone: '+250788123457',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const generateMockHouseholds = (): Household[] => [
  {
    id: '1',
    name: 'John Doe',
    address: '123 Kigali Street, Kicukiro',
    phone: '+250788123458',
    email: 'john.doe@example.com',
    zone: 'Kicukiro',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    address: '456 Remera Avenue, Gasabo',
    phone: '+250788123459',
    email: 'jane.smith@example.com',
    zone: 'Gasabo',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const generateMockComplaints = (): Complaint[] => [
  {
    id: '1',
    householdId: '1',
    title: 'Missed Collection',
    description: 'Waste was not collected on scheduled date',
    level: 'high',
    status: 'open',
    createdAt: '2024-01-14T10:00:00Z'
  },
  {
    id: '2',
    householdId: '2',
    title: 'Damaged Container',
    description: 'Waste container is broken and needs replacement',
    level: 'medium',
    status: 'resolved',
    createdAt: '2024-01-13T15:30:00Z',
    resolvedAt: '2024-01-14T09:00:00Z'
  }
];

export const generateMockPayments = (): Payment[] => [
  {
    id: '1',
    householdId: '1',
    amount: 25.00,
    dueDate: '2024-01-31',
    paidDate: '2024-01-30T14:20:00Z',
    status: 'paid',
    type: 'monthly',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    householdId: '2',
    amount: 25.00,
    dueDate: '2024-02-28',
    status: 'pending',
    type: 'monthly',
    createdAt: '2024-02-01T00:00:00Z'
  }
];

export const generateMockTariffs = (): Tariff[] => [
  {
    id: '1',
    name: 'Standard Residential',
    description: 'Monthly waste collection for residential households',
    amount: 25.00,
    frequency: 'monthly',
    wasteType: 'general',
    zone: 'all',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Premium Residential',
    description: 'Twice weekly waste collection for residential households',
    amount: 45.00,
    frequency: 'monthly',
    wasteType: 'general',
    zone: 'all',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const generateMockZones = (): Zone[] => [
  {
    id: '1',
    name: 'Kicukiro',
    description: 'Kicukiro sector collection zone',
    status: 'active',
    households: 245,
    drivers: 8,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Gasabo',
    description: 'Gasabo sector collection zone',
    status: 'active',
    households: 189,
    drivers: 6,
    createdAt: '2024-01-01T00:00:00Z'
  }
];
