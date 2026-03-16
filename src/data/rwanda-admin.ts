export interface Village {
  id: string;
  name: string;
}

export interface Cell {
  id: string;
  name: string;
  villages: Village[];
}

export interface Sector {
  id: string;
  name: string;
  cells: Cell[];
}

export interface District {
  id: string;
  name: string;
  sectors: Sector[];
}

export const rwandaAdminData: District[] = [
  {
    id: "gasabo",
    name: "Gasabo",
    sectors: [
      {
        id: "bumbogo",
        name: "Bumbogo",
        cells: [
          {
            id: "mvuzo",
            name: "Mvuzo",
            villages: [
              { id: "mvuzo", name: "Mvuzo" },
              { id: "nyabikenke", name: "Nyabikenke" },
              { id: "nyagasozi", name: "Nyagasozi" },
              { id: "nyarubuye", name: "Nyarubuye" },
            ],
          },
          {
            id: "nyabikenke",
            name: "Nyabikenke",
            villages: [
              { id: "akintambwe", name: "Akintambwe" },
              { id: "gasharu", name: "Gasharu" },
            ],
          },
        ],
      },
      {
        id: "gatsata",
        name: "Gatsata",
        cells: [
          {
            id: "gatsata",
            name: "Gatsata",
            villages: [
              { id: "karuruma", name: "Karuruma" },
              { id: "nyamabuye", name: "Nyamabuye" },
              { id: "nyamugari", name: "Nyamugari" },
              { id: "ruturagara", name: "Ruturagara" },
              { id: "rugando", name: "Rugando" },
            ],
          },
        ],
      },
      {
        id: "jali",
        name: "Jali",
        cells: [
          {
            id: "buhiza",
            name: "Buhiza",
            villages: [
              { id: "buhiza", name: "Buhiza" },
              { id: "kigarama", name: "Kigarama" },
            ],
          },
          {
            id: "muko",
            name: "Muko",
            villages: [{ id: "muko", name: "Muko" }],
          },
          {
            id: "nkusi",
            name: "Nkusi",
            villages: [{ id: "nkusi", name: "Nkusi" }],
          },
          {
            id: "nyabuliba",
            name: "Nyabuliba",
            villages: [{ id: "nyabuliba", name: "Nyabuliba" }],
          },
          {
            id: "nyundo",
            name: "Nyundo",
            villages: [{ id: "nyundo", name: "Nyundo" }],
          },
        ],
      },
      {
        id: "remera",
        name: "Remera",
        cells: [
          {
            id: "gasagara",
            name: "Gasagara",
            villages: [{ id: "gasagara", name: "Gasagara" }],
          },
          {
            id: "rukiri_i",
            name: "Rukiri I",
            villages: [{ id: "rukiri_i", name: "Rukiri I" }],
          },
          {
            id: "rukiri_ii",
            name: "Rukiri II",
            villages: [{ id: "rukiri_ii", name: "Rukiri II" }],
          },
          {
            id: "nyabisindu",
            name: "Nyabisindu",
            villages: [{ id: "nyabisindu", name: "Nyabisindu" }],
          },
        ],
      },
      {
        id: "kinyinya",
        name: "Kinyinya",
        cells: [
          {
            id: "gacuriro",
            name: "Gacuriro",
            villages: [{ id: "gacuriro", name: "Gacuriro" }],
          },
          {
            id: "kagugu",
            name: "Kagugu",
            villages: [{ id: "kagugu", name: "Kagugu" }],
          },
          {
            id: "murama",
            name: "Murama",
            villages: [{ id: "murama", name: "Murama" }],
          },
        ],
      },
    ],
  },
  {
    id: "kicukiro",
    name: "Kicukiro",
    sectors: [
      {
        id: "kicukiro",
        name: "Kicukiro",
        cells: [
          {
            id: "gasharu",
            name: "Gasharu",
            villages: [{ id: "gasharu", name: "Gasharu" }],
          },
          {
            id: "kicukiro",
            name: "Kicukiro",
            villages: [{ id: "kicukiro", name: "Kicukiro" }],
          },
          {
            id: "ngoma",
            name: "Ngoma",
            villages: [{ id: "ngoma", name: "Ngoma" }],
          },
        ],
      },
      {
        id: "kagarama",
        name: "Kagarama",
        cells: [
          {
            id: "kagarama",
            name: "Kagarama",
            villages: [
              { id: "kagarama", name: "Kagarama" },
              { id: "kanserege", name: "Kanserege" },
            ],
          },
        ],
      },
      {
        id: "gatenga",
        name: "Gatenga",
        cells: [
          {
            id: "gatenga",
            name: "Gatenga",
            villages: [
              { id: "gatenga", name: "Gatenga" },
              { id: "nyanza", name: "Nyanza" },
            ],
          },
        ],
      },
      {
        id: "niboye",
        name: "Niboye",
        cells: [
          {
            id: "niboye",
            name: "Niboye",
            villages: [{ id: "niboye", name: "Niboye" }],
          },
          {
            id: "gatare",
            name: "Gatare",
            villages: [{ id: "gatare", name: "Gatare" }],
          },
        ],
      },
    ],
  },
  {
    id: "nyarugenge",
    name: "Nyarugenge",
    sectors: [
      {
        id: "Rwezamenyo",
        name: "Rwezamenyo",
        cells: [
          {
            id: "Kabugulu I",
            name: "Kabugulu I",
            villages: [{ id: "Mumararungu", name: "Mumararungu" }],
          },
          {
            id: "biryogo",
            name: "Biryogo",
            villages: [{ id: "biryogo", name: "Biryogo" }],
          },
          {
            id: "kiyovu",
            name: "Kiyovu",
            villages: [{ id: "kiyovu", name: "Kiyovu" }],
          },
          {
            id: "rwampara",
            name: "Rwampara",
            villages: [{ id: "rwampara", name: "Rwampara" }],
          },
        ],
      },
      {
        id: "nyamirambo",
        name: "Nyamirambo",
        cells: [
          {
            id: "cyivugiza",
            name: "Cyivugiza",
            villages: [{ id: "cyivugiza", name: "Cyivugiza" }],
          },
          {
            id: "mumena",
            name: "Mumena",
            villages: [{ id: "mumena", name: "Mumena" }],
          },
          {
            id: "rugenge",
            name: "Rugenge",
            villages: [{ id: "rugenge", name: "Rugenge" }],
          },
        ],
      },
      {
        id: "kigali",
        name: "Kigali",
        cells: [
          {
            id: "kigali",
            name: "Kigali",
            villages: [{ id: "kigali", name: "Kigali" }],
          },
        ],
      },
    ],
  },
];

export const getDistrictById = (districtId: string): District | undefined => {
  return rwandaAdminData.find((district) => district.id === districtId);
};

export const getSectorsByDistrict = (districtId: string): Sector[] => {
  const district = getDistrictById(districtId);
  return district ? district.sectors : [];
};

export const getCellsBySector = (
  districtId: string,
  sectorId: string
): Cell[] => {
  const district = getDistrictById(districtId);
  if (!district) return [];

  const sector = district.sectors.find((s) => s.id === sectorId);
  return sector ? sector.cells : [];
};

export const getVillagesByCell = (
  districtId: string,
  sectorId: string,
  cellId: string
): Village[] => {
  const district = getDistrictById(districtId);
  if (!district) return [];

  const sector = district.sectors.find((s) => s.id === sectorId);
  if (!sector) return [];

  const cell = sector.cells.find((c) => c.id === cellId);
  return cell ? cell.villages : [];
};
export const getDistrictBySectorId = (
  sectorIdOrName: string
): District | undefined => {
  return rwandaAdminData.find((district) =>
    district.sectors.some(
      (sector) =>
        sector.id === sectorIdOrName ||
        sector.name.toLowerCase() === sectorIdOrName.toLowerCase()
    )
  );
};
