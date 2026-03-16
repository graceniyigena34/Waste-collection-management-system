export interface Zone {
  id: string;
  district: string;
  districtName?: string;
  sector: string;
  sectorName?: string;
  cell: string;
  cellName?: string;
  village: string;
  villageName?: string;
  code: string;
  description: string;
}

export const dummyZones: Zone[] = [
  {
    id: "1",
    district: "kicukiro",
    districtName: "Kicukiro",
    sector: "kicukiro",
    sectorName: "Kicukiro",
    cell: "kicukiro",
    cellName: "Kicukiro",
    village: "gasharu",
    villageName: "Gasharu",
    code: "KIC-KIC-001",
    description: "Residential area with mixed commercial activities"
  },
  {
    id: "2",
    district: "gasabo",
    districtName: "Gasabo",
    sector: "remera",
    sectorName: "Remera",
    cell: "nyabisindu",
    cellName: "Nyabisindu",
    village: "nyabisindu",
    villageName: "Nyabisindu",
    code: "GAS-REM-002",
    description: "Urban commercial district with high-rise buildings"
  },
  {
    id: "3",
    district: "nyarugenge",
    districtName: "Nyarugenge",
    sector: "nyamirambo",
    sectorName: "Nyamirambo",
    cell: "cyivugiza",
    cellName: "Cyivugiza",
    village: "cyivugiza",
    villageName: "Cyivugiza",
    code: "NYA-NYA-003",
    description: "Dense residential area with local markets"
  }
];

// Helper function to get display names
export const getZoneDisplayInfo = (zone: Zone) => {
  return {
    district: zone.districtName || zone.district || '',
    sector: zone.sectorName || zone.sector || '',
    cell: zone.cellName || zone.cell || '',
    village: zone.villageName || zone.village || ''
  };
};