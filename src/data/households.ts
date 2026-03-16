export interface Household {
  id: string;
  waste_company_id: string;
  zone_id: string;
  code: string;
  address: string;
  houseType: 'resident' | 'restaurant' | 'vila' | 'hotel' | 'school' | 'company' | 'industry' | 'other';
  otherHouseType?: string;
  status: 'active' | 'inactive';
}



export const dummyHouseholds: Household[] = [
  {
    id: "1",
    waste_company_id: "comp_001",
    zone_id: "1",
    code: "HH-KIC-001",
    address: "Near Kabuga market, blue gate house",
    houseType: "resident",
    status: "active"
  },
  {
    id: "2",
    waste_company_id: "comp_001",
    zone_id: "2",
    code: "HH-GAS-002",
    address: "Kisimenti Heights, Block A, Apt 205",
    houseType: "resident",
    status: "active"
  },
  {
    id: "3",
    waste_company_id: "comp_001",
    zone_id: "3",
    code: "HH-NYA-003",
    address: "Biryogo sector, near mosque",
    houseType: "restaurant",
    status: "active"
  },
  {
    id: "4",
    waste_company_id: "comp_001",
    zone_id: "1",
    code: "HH-KIC-004",
    address: "Gatenga cell, opposite primary school",
    houseType: "school",
    status: "inactive"
  },
  {
    id: "5",
    waste_company_id: "comp_001",
    zone_id: "4",
    code: "HH-KIC-005",
    address: "Traditional house near health center",
    houseType: "other",
    otherHouseType: "Health Center",
    status: "active"
  }
];

export const houseTypes = [
  { value: 'resident', label: 'Resident' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'vila', label: 'Vila' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'school', label: 'School' },
  { value: 'company', label: 'Company' },
  { value: 'industry', label: 'Industry' },
  { value: 'other', label: 'Other' }
];