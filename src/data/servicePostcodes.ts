// ✅ Service postcodes (Essex region)
export const servicePostcodes: string[] = [
  // Southend & surrounding
  "SS0", "SS1", "SS2", "SS3", "SS4", "SS5", "SS6", "SS7", "SS8", "SS9",
  "SS11", "SS12", "SS13", "SS14", "SS15", "SS16",

  // Chelmsford & surrounding
  "CM1", "CM2", "CM3", "CM11", "CM12", "CM13", "CM14", "CM15",

  // Maldon & surrounding
  "CM9",

  // Brentwood / Shenfield
  "CM15",
];

// ✅ Town → Postcode mapping (for name search)
export const townLookup: Record<string, string> = {
  // Southend area
  southend: "SS1",
  "southend on sea": "SS1",
  "southend-on-sea": "SS1",
  leigh: "SS9",
  "leigh on sea": "SS9",
  "leigh-on-sea": "SS9",
  eastwood: "SS0",
  rayleigh: "SS6",
  thundersley: "SS7",
  benfleet: "SS7",
  hadleigh: "SS7",
  hullbridge: "SS5",
  hockley: "SS5",
  rochford: "SS4",

  // Basildon area
  basildon: "SS14",
  wickford: "SS12",
  pitsea: "SS13",
  laindon: "SS15",

  // Brentwood / Billericay
  brentwood: "CM13",
  billericay: "CM11",
  shenfield: "CM15",

  // Chelmsford area
  chelmsford: "CM1",
  "great baddow": "CM2",
  "springfield": "CM1",

  // Maldon / Rawreth
  maldon: "CM9",
  rawreth: "SS11",
};

// ✅ Find postcode from query
export function findPostcode(query: string): string | null {
  const cleaned = query.trim().toUpperCase().replace(/\s+/g, "");

  // Exact or prefix match on postcode
  const match = servicePostcodes.find(
    (code) => code === cleaned || code.startsWith(cleaned)
  );
  if (match) return match;

  // Town name lookup
  const town = query.trim().toLowerCase();
  if (townLookup[town]) return townLookup[town];

  return null;
}