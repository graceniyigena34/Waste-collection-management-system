export interface Zone {
  id: string;
  sector: string;
  cell: string;
  village: string;
  code: string;
  description: string;
}

export interface TariffPlan {
  id: string;
  waste_company_id: string;
  name: string;
  billing_frequency: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  active_from: string;
  active_to: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface TariffRule {
  id: string;
  tariff_plan_id: string;
  zone_id: string;
  house_type: 'Apartment' | 'Bungalow' | 'Duplex' | 'Other';
  pickup_frequency_per_week: number;
  amount: number;
}

export const dummyZones: Zone[] = [
  {
    id: "1",
    sector: "Kicukiro",
    cell: "Gahanga",
    village: "Kabuga",
    code: "KIC-GAH-001",
    description: "Residential area with mixed commercial activities"
  },
  {
    id: "2",
    sector: "Gasabo",
    cell: "Remera",
    village: "Kisimenti",
    code: "GAS-REM-002",
    description: "Urban commercial district with high-rise buildings"
  },
  {
    id: "3",
    sector: "Nyarugenge",
    cell: "Nyamirambo",
    village: "Biryogo",
    code: "NYA-NYA-003",
    description: "Dense residential area with local markets"
  },
  {
    id: "4",
    sector: "Kicukiro",
    cell: "Niboye",
    village: "Gatenga",
    code: "KIC-NIB-004",
    description: "Suburban residential zone with schools"
  },
  {
    id: "5",
    sector: "Gasabo",
    cell: "Kinyinya",
    village: "Kagugu",
    code: "GAS-KIN-005",
    description: "Mixed residential and commercial development"
  },
  {
    id: "6",
    sector: "Nyarugenge",
    cell: "Muhima",
    village: "Rwampara",
    code: "NYA-MUH-006",
    description: "Commercial and residential mixed zone"
  }
];

export const dummyTariffPlans: TariffPlan[] = [
  {
    id: "1",
    waste_company_id: "company-1",
    name: "Standard Residential Plan",
    billing_frequency: "MONTHLY",
    active_from: "2024-01-01",
    active_to: "2024-12-31",
    status: "ACTIVE"
  },
  {
    id: "2",
    waste_company_id: "company-1",
    name: "Premium Commercial Plan",
    billing_frequency: "QUARTERLY",
    active_from: "2024-01-01",
    active_to: "2025-12-31",
    status: "ACTIVE"
  },
  {
    id: "3",
    waste_company_id: "company-1",
    name: "Budget Basic Plan",
    billing_frequency: "MONTHLY",
    active_from: "2023-06-01",
    active_to: "2024-06-01",
    status: "INACTIVE"
  }
];

export const dummyTariffRules: TariffRule[] = [
  // Rules for Standard Residential Plan
  {
    id: "1",
    tariff_plan_id: "1",
    zone_id: "1",
    house_type: "Apartment",
    pickup_frequency_per_week: 2,
    amount: 5000
  },
  {
    id: "2",
    tariff_plan_id: "1",
    zone_id: "1",
    house_type: "Bungalow",
    pickup_frequency_per_week: 3,
    amount: 8000
  },
  {
    id: "3",
    tariff_plan_id: "1",
    zone_id: "2",
    house_type: "Apartment",
    pickup_frequency_per_week: 2,
    amount: 6000
  },
  {
    id: "4",
    tariff_plan_id: "1",
    zone_id: "3",
    house_type: "Duplex",
    pickup_frequency_per_week: 3,
    amount: 12000
  },
  
  // Rules for Premium Commercial Plan
  {
    id: "5",
    tariff_plan_id: "2",
    zone_id: "2",
    house_type: "Other",
    pickup_frequency_per_week: 5,
    amount: 25000
  },
  {
    id: "6",
    tariff_plan_id: "2",
    zone_id: "4",
    house_type: "Other",
    pickup_frequency_per_week: 6,
    amount: 30000
  },
  {
    id: "7",
    tariff_plan_id: "2",
    zone_id: "5",
    house_type: "Apartment",
    pickup_frequency_per_week: 4,
    amount: 18000
  },
  
  // Rules for Budget Basic Plan
  {
    id: "8",
    tariff_plan_id: "3",
    zone_id: "1",
    house_type: "Apartment",
    pickup_frequency_per_week: 1,
    amount: 3000
  },
  {
    id: "9",
    tariff_plan_id: "3",
    zone_id: "3",
    house_type: "Bungalow",
    pickup_frequency_per_week: 1,
    amount: 4000
  }
];