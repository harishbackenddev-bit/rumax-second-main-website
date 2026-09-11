export const servicePostcodes: string[] = [
  "SS4", "SS5", "SS6", "SS7", "SS8", "SS9",
  "SS11", "SS12", "SS13", "SS14", "SS15", "SS16",
  "CM11", "CM12", "CM13", "CM14", "CM15",
];

// Optional: town → postcode mapping for name search
export const townLookup: Record<string, string> = {
  southend: "SS1",
  basildon: "SS14",
  chelmsford: "CM1",
  billericay: "CM11",
  brentwood: "CM13",
  wickford: "SS12",
  // add more as needed
};

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